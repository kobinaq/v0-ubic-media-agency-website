import { NextResponse } from "next/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { query } from "@/lib/db"
import { sendAdminOrderNotification, sendOrderConfirmationEmail } from "@/lib/email"
import { sendAdminSms, sendClientSms } from "@/lib/sms"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { ensureInvoiceTables } from "@/lib/invoice-db"
import { markInvoicePaidByPaystackReference } from "@/lib/invoice-payment"

async function notifyPaidOrder(order: {
  order_reference: string
  customer_email: string
  customer_name: string
  customer_phone?: string | null
  package_name: string
  amount: number | string
  currency: string
}) {
  const notificationTasks = [
    sendOrderConfirmationEmail(order.customer_email, order.customer_name, {
      orderReference: order.order_reference,
      packageName: order.package_name,
      amount: Number(order.amount),
      currency: order.currency,
    }),
    sendAdminOrderNotification({
      orderReference: order.order_reference,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      packageName: order.package_name,
      amount: Number(order.amount),
      currency: order.currency,
    }),
    order.customer_phone
      ? sendClientSms({
          recipients: [order.customer_phone],
          message: `Payment received. Thanks ${order.customer_name}, your ${order.package_name} order with Ubic Media Agency is confirmed. Ref: ${order.order_reference}.`,
        })
      : Promise.resolve(),
    sendAdminSms({
      message: "UBIC alert: an order payment has been completed.",
    }),
  ]

  const notificationResults = await Promise.allSettled(notificationTasks)
  notificationResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[notification] Payment notification failed:", result.reason)
    }
  })
}

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = checkRateLimit({
      key: `paystack-verify:${ip}`,
      limit: 20,
      windowMs: 60_000,
    })

    if (!limit.ok) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSec) },
        },
      )
    }

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ success: false, message: "Reference is required" }, { status: 400 })
    }

    const verification = await verifyPaystackTransaction(reference)

    if (!(verification.status && verification.data.status === "success")) {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }

    const orderLookup = await query("SELECT * FROM orders WHERE paystack_reference = $1 LIMIT 1", [reference])
    const existing = orderLookup.rows[0]

    if (existing) {
      if (existing.payment_status === "paid") {
        return NextResponse.json({ success: true, message: "Payment already verified" })
      }

      const paidAmountMajor = Number(verification.data.amount) / 100
      const expectedAmount = Number(existing.amount)
      const paidCurrency = String(verification.data.currency || "").toUpperCase()

      if (
        !Number.isFinite(paidAmountMajor) ||
        paidAmountMajor !== expectedAmount ||
        paidCurrency !== String(existing.currency).toUpperCase()
      ) {
        console.error("[v0] Payment amount/currency mismatch", {
          reference,
          paidAmountMajor,
          expectedAmount,
          paidCurrency,
          expectedCurrency: existing.currency,
        })
        return NextResponse.json({ success: false, message: "Payment amount mismatch" }, { status: 400 })
      }

      const updateResult = await query(
        `UPDATE orders
         SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE paystack_reference = $2 AND payment_status = 'pending'
         RETURNING *`,
        ["paid", reference],
      )

      const order = updateResult.rows[0]
      if (order) {
        await notifyPaidOrder(order)
      }

      return NextResponse.json({ success: true, message: "Payment verified successfully" })
    }

    await ensureInvoiceTables()
    try {
      const invoice = await markInvoicePaidByPaystackReference(
        reference,
        verification.data.amount,
        verification.data.currency,
      )

      if (!invoice) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
      }

      await Promise.allSettled([
        sendAdminSms({
          message: `UBIC alert: invoice ${invoice.invoice_number} has been paid.`,
        }),
        invoice.customer_phone
          ? sendClientSms({
              recipients: [invoice.customer_phone],
              message: `Payment received. Thanks ${invoice.customer_name}, invoice ${invoice.invoice_number} with Ubic Media Agency is marked paid.`,
            })
          : Promise.resolve(),
      ])

      return NextResponse.json({
        success: true,
        message: "Invoice payment verified successfully",
        type: "invoice",
        invoiceNumber: invoice.invoice_number,
      })
    } catch (invoiceError) {
      console.error("[invoice] Payment verification failed:", invoiceError)
      return NextResponse.json({ success: false, message: "Invoice payment amount mismatch" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ success: false, message: "Verification error" }, { status: 500 })
  }
}
