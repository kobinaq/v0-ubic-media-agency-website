import { NextResponse } from "next/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { query } from "@/lib/db"
import { sendAdminOrderNotification, sendOrderConfirmationEmail } from "@/lib/email"
import { sendAdminSms, sendClientSms } from "@/lib/sms"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ success: false, message: "Reference is required" }, { status: 400 })
    }

    // Verify transaction with Paystack
    const verification = await verifyPaystackTransaction(reference)

    if (verification.status && verification.data.status === "success") {
      // Update order status in database
      const updateResult = await query(
        `UPDATE orders 
         SET payment_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE paystack_reference = $2
         RETURNING *`,
        ["paid", reference],
      )

      const order = updateResult.rows[0]
      if (order) {
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

      return NextResponse.json({ success: true, message: "Payment verified successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ success: false, message: "Verification error" }, { status: 500 })
  }
}
