import { NextResponse } from "next/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { query } from "@/lib/db"

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
      await query(
        `UPDATE orders 
         SET payment_status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE paystack_reference = $2`,
        ["paid", reference],
      )

      return NextResponse.json({ success: true, message: "Payment verified successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ success: false, message: "Verification error" }, { status: 500 })
  }
}
