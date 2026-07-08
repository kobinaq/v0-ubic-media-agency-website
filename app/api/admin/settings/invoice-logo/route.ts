import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { ensureInvoiceTables } from "@/lib/invoice-db"

const SETTING_KEY = "invoice_logo"
const MAX_LOGO_LENGTH = 750_000

export async function GET() {
  try {
    await ensureInvoiceTables()
    const result = await query("SELECT value FROM admin_settings WHERE key = $1", [SETTING_KEY])
    return NextResponse.json({ logo: result.rows[0]?.value ?? "" })
  } catch (error) {
    console.error("[invoice-logo] Error fetching logo:", error)
    return NextResponse.json({ error: "Failed to fetch invoice logo" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await ensureInvoiceTables()
    const body = await request.json()
    const logo = String(body.logo ?? "")

    if (logo && !logo.startsWith("data:image/")) {
      return NextResponse.json({ error: "Logo must be an image data URL" }, { status: 400 })
    }

    if (logo.length > MAX_LOGO_LENGTH) {
      return NextResponse.json({ error: "Logo file is too large" }, { status: 413 })
    }

    await query(
      `INSERT INTO admin_settings (key, value, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [SETTING_KEY, logo],
    )

    return NextResponse.json({ logo })
  } catch (error) {
    console.error("[invoice-logo] Error saving logo:", error)
    return NextResponse.json({ error: "Failed to save invoice logo" }, { status: 500 })
  }
}
