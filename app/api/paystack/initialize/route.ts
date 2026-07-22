import { NextResponse } from "next/server"
import { initializePaystackTransaction } from "@/lib/paystack"
import { query } from "@/lib/db"
import { nanoid } from "nanoid"
import { sendAdminOrderStartedNotification } from "@/lib/email"
import { sendAdminSms } from "@/lib/sms"
import { packages, type Package } from "@/lib/content"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { convertGhsToUsd, getFxQuote } from "@/lib/exchange-rate"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function resolveCatalogPackage(packageId: string): Package | undefined {
  return packages.packages.find((pkg) => pkg.id === packageId)
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = checkRateLimit({
      key: `paystack-initialize:${ip}`,
      limit: 5,
      windowMs: 60_000,
    })

    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSec) },
        },
      )
    }

    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const packageId = typeof body.packageId === "string" ? body.packageId.trim() : ""
    const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : ""

    if (!email || !name || !phone || !packageId || !currency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!EMAIL_RE.test(email) || name.length > 120 || phone.length > 40) {
      return NextResponse.json({ error: "Invalid customer details" }, { status: 400 })
    }

    if (currency !== "GHS" && currency !== "USD") {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 })
    }

    const catalogPackage = resolveCatalogPackage(packageId)
    if (!catalogPackage) {
      return NextResponse.json({ error: "Unknown package" }, { status: 400 })
    }

    if (catalogPackage.isHourly || catalogPackage.priceGHS <= 0) {
      return NextResponse.json(
        { error: "This package requires a custom quote. Contact us on WhatsApp." },
        { status: 400 },
      )
    }

    let amount = catalogPackage.priceGHS
    let fxMeta: { ghsPerUsd?: number; markup?: number; source?: string } = {}

    if (currency === "USD") {
      const quote = await getFxQuote()
      amount = convertGhsToUsd(catalogPackage.priceGHS, quote.ghsPerUsd, quote.markup)
      fxMeta = {
        ghsPerUsd: quote.ghsPerUsd,
        markup: quote.markup,
        source: quote.source,
      }
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid package pricing" }, { status: 400 })
    }

    const packageName = `${catalogPackage.service ? `${catalogPackage.service} — ` : ""}${catalogPackage.name}`
    const orderReference = `UBIC-${nanoid(10)}`

    await query(
      `INSERT INTO orders (order_reference, customer_name, customer_email, customer_phone, package_id, package_name, amount, currency, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [orderReference, name, email, phone, packageId, packageName, amount, currency, "pending"],
    )

    const pendingMessage = `UBIC alert: a customer started checkout. Status: pending. Ref: ${orderReference}.`

    const notificationTasks = [
      sendAdminOrderStartedNotification({
        orderReference,
        customerName: name,
        customerEmail: email,
        packageName,
        amount,
        currency,
      }),
      sendAdminSms({ message: pendingMessage }),
    ]
    const notificationResults = await Promise.allSettled(notificationTasks)

    notificationResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("[notification] Checkout-start notification failed:", result.reason)
      }
    })

    const paystackResponse = await initializePaystackTransaction(email, amount, currency, {
      order_reference: orderReference,
      package_id: packageId,
      package_name: packageName,
      customer_name: name,
      ...fxMeta,
    })

    if (paystackResponse.status) {
      await query("UPDATE orders SET paystack_reference = $1 WHERE order_reference = $2", [
        paystackResponse.data.reference,
        orderReference,
      ])

      return NextResponse.json({
        authorization_url: paystackResponse.data.authorization_url,
        reference: paystackResponse.data.reference,
        amount,
        currency,
        fx: currency === "USD" ? fxMeta : undefined,
      })
    }

    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  } catch (error) {
    console.error("[v0] Paystack initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
