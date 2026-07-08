import { NextResponse } from "next/server"
import { initializePaystackTransaction } from "@/lib/paystack"
import { query } from "@/lib/db"
import { nanoid } from "nanoid"
import { sendAdminOrderStartedNotification } from "@/lib/email"
import { sendAdminSms } from "@/lib/sms"

export async function POST(request: Request) {
  try {
    const { email, name, phone, packageId, packageName, amount, currency } = await request.json()

    // Validate input
    if (!email || !name || !phone || !packageId || !packageName || !amount || !currency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique order reference
    const orderReference = `UBIC-${nanoid(10)}`

    // Create order in database
    await query(
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(80);
       INSERT INTO orders (order_reference, customer_name, customer_email, customer_phone, package_id, package_name, amount, currency, payment_status)
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
        amount: Number(amount),
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

    // Initialize Paystack transaction
    const paystackResponse = await initializePaystackTransaction(email, amount, currency, {
      order_reference: orderReference,
      package_id: packageId,
      package_name: packageName,
      customer_name: name,
    })

    if (paystackResponse.status) {
      // Update order with Paystack reference
      await query("UPDATE orders SET paystack_reference = $1 WHERE order_reference = $2", [
        paystackResponse.data.reference,
        orderReference,
      ])

      return NextResponse.json({
        authorization_url: paystackResponse.data.authorization_url,
        reference: paystackResponse.data.reference,
      })
    } else {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Paystack initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
