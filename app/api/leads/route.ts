import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendLeadConfirmationEmail, sendAdminLeadNotification } from "@/lib/email"
import { sendAdminSms, sendClientSms } from "@/lib/sms"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE_LENGTH = 5000

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = checkRateLimit({
      key: `leads:${ip}`,
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
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    if (!EMAIL_RE.test(email) || name.length > 120 || (phone && phone.length > 40)) {
      return NextResponse.json({ error: "Invalid contact details" }, { status: 400 })
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 })
    }

    await query("INSERT INTO leads (name, email, phone, message) VALUES ($1, $2, $3, $4)", [
      name,
      email,
      phone || null,
      message,
    ])

    const notificationResults = await Promise.allSettled([
      sendLeadConfirmationEmail(email, name),
      sendAdminLeadNotification({ customerName: name, customerEmail: email, message }),
      phone
        ? sendClientSms({
            recipients: [phone],
            message:
              "Thanks for contacting Ubic Media Agency. We've received your brief and will get back to you shortly.",
          })
        : Promise.resolve(),
      sendAdminSms({
        message: "UBIC alert: a new lead filled the contact form.",
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
