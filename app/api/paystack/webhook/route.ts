import { NextResponse } from "next/server"
import { verifyPaystackWebhookSignature } from "@/lib/paystack"
import { query } from "@/lib/db"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-paystack-signature")
    const body = await request.text()

    if (!signature || !verifyPaystackWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle successful payment
    if (event.event === "charge.success") {
      const { reference, amount, currency, customer, metadata } = event.data

      // Update order status
      await query(
        `UPDATE orders 
         SET payment_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE paystack_reference = $2`,
        ["paid", reference],
      )

      // Get order details
      const orderResult = await query("SELECT * FROM orders WHERE paystack_reference = $1", [reference])

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0]

        try {
          await sendOrderConfirmationEmail(order.customer_email, order.customer_name, {
            orderReference: order.order_reference,
            packageName: order.package_name,
            amount: order.amount,
            currency: order.currency,
          })

          await sendAdminOrderNotification({
            orderReference: order.order_reference,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            packageName: order.package_name,
            amount: order.amount,
            currency: order.currency,
          })

          console.log("[v0] Confirmation emails sent for order:", order.order_reference)
        } catch (emailError) {
          console.error("[v0] Error sending emails:", emailError)
        }
      }

      console.log("[v0] Payment successful for reference:", reference)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
