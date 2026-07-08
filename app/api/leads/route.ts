import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendLeadConfirmationEmail, sendAdminLeadNotification } from "@/lib/email"
import { sendAdminSms } from "@/lib/sms"

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Insert lead into database
    await query("INSERT INTO leads (name, email, phone, message) VALUES ($1, $2, $3, $4)", [
      name,
      email,
      phone || null,
      message,
    ])

    const notificationResults = await Promise.allSettled([
      sendLeadConfirmationEmail(email, name),
      sendAdminLeadNotification({ customerName: name, customerEmail: email, message }),
      sendAdminSms({
        message: `UBIC contact form: ${name} (${email}${phone ? `, ${phone}` : ""}) sent: ${String(message).slice(0, 120)}`,
      }),
    ])

    notificationResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("[v0] Error sending lead notification:", result.reason)
      }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error saving lead:", error)
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
  }
}
