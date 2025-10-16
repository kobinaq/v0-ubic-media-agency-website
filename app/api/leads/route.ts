import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendLeadConfirmationEmail, sendAdminLeadNotification } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Insert lead into database
    await query("INSERT INTO leads (name, email, message) VALUES ($1, $2, $3)", [name, email, message])

    try {
      await sendLeadConfirmationEmail(email, name)
      await sendAdminLeadNotification({ customerName: name, customerEmail: email, message })
    } catch (emailError) {
      console.error("[v0] Error sending emails:", emailError)
      // Don't fail the request if emails fail - lead is already saved
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error saving lead:", error)
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
  }
}
