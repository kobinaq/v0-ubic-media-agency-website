import { NextResponse } from "next/server"
import { verifyPaystackWebhookSignature } from "@/lib/paystack"
import { query } from "@/lib/db"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email"
import { sendAdminSms, sendClientSms } from "@/lib/sms"
import { ensureInvoiceTables } from "@/lib/invoice-db"
import { markInvoicePaidByPaystackReference } from "@/lib/invoice-payment"

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-paystack-signature")
    const body = await request.text()

    if (!signature || !verifyPaystackWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      const { reference, amount, currency } = event.data

      const orderLookup = await query("SELECT * FROM orders WHERE paystack_reference = $1 LIMIT 1", [reference])
      const existing = orderLookup.rows[0]

      if (existing) {
        if (existing.payment_status === "paid") {
          return NextResponse.json({ received: true })
        }

        const paidAmountMajor = Number(amount) / 100
        const expectedAmount = Number(existing.amount)
        const paidCurrency = String(currency || "").toUpperCase()

        if (
          !Number.isFinite(paidAmountMajor) ||
          paidAmountMajor !== expectedAmount ||
          paidCurrency !== String(existing.currency).toUpperCase()
        ) {
          console.error("[v0] Webhook amount/currency mismatch", {
            reference,
            paidAmountMajor,
            expectedAmount,
            paidCurrency,
            expectedCurrency: existing.currency,
          })
          return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
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
          try {
            await sendOrderConfirmationEmail(order.customer_email, order.customer_name, {
              orderReference: order.order_reference,
              packageName: order.package_name,
              amount: Number(order.amount),
              currency: order.currency,
            })

            await sendAdminOrderNotification({
              orderReference: order.order_reference,
              customerName: order.customer_name,
              customerEmail: order.customer_email,
              packageName: order.package_name,
              amount: Number(order.amount),
              currency: order.currency,
            })

            await Promise.allSettled([
              order.customer_phone
                ? sendClientSms({
                    recipients: [order.customer_phone],
                    message: `Payment received. Thanks ${order.customer_name}, your ${order.package_name} order with Ubic Media Agency is confirmed. Ref: ${order.order_reference}.`,
                  })
                : Promise.resolve(),
              sendAdminSms({
                message: "UBIC alert: an order payment has been completed.",
              }),
            ])

            console.log("[v0] Confirmation emails sent for order:", order.order_reference)
          } catch (emailError) {
            console.error("[v0] Error sending emails:", emailError)
          }
        }

        console.log("[v0] Payment successful for reference:", reference)
        return NextResponse.json({ received: true })
      }

      // Invoice payments share the same Paystack webhook.
      try {
        await ensureInvoiceTables()
        const invoice = await markInvoicePaidByPaystackReference(reference, amount, currency)
        if (invoice) {
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
          console.log("[invoice] Payment successful for invoice:", invoice.invoice_number)
        } else {
          console.error("[v0] Webhook order/invoice not found for reference:", reference)
        }
      } catch (invoiceError) {
        console.error("[invoice] Webhook invoice payment failed:", invoiceError)
        return NextResponse.json({ error: "Invoice payment processing failed" }, { status: 400 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
