import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { ensureInvoiceTables } from "@/lib/invoice-db"
import { canCreateInvoicePaymentLink, createInvoicePaystackLink } from "@/lib/invoice-payment"

type InvoiceLineItem = {
  description: string
  quantity: number
  unitPrice: number
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const parseAmount = (value: unknown) => {
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : 0
}

const normalizeLineItems = (lineItems: unknown): InvoiceLineItem[] => {
  if (!Array.isArray(lineItems)) return []

  return lineItems
    .map((item) => ({
      description: String(item?.description ?? "").trim(),
      quantity: parseAmount(item?.quantity),
      unitPrice: parseAmount(item?.unitPrice),
    }))
    .filter((item) => item.description && item.quantity > 0)
}

const calculateTotals = (lineItems: InvoiceLineItem[], tax: unknown, discount: unknown) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = parseAmount(tax)
  const discountAmount = parseAmount(discount)
  const total = Math.max(0, subtotal + taxAmount - discountAmount)

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(taxAmount.toFixed(2)),
    discount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}

export async function GET() {
  try {
    await ensureInvoiceTables()
    const result = await query("SELECT * FROM invoices ORDER BY created_at DESC")
    return NextResponse.json({ invoices: result.rows })
  } catch (error) {
    console.error("[invoice] Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureInvoiceTables()
    const body = await request.json()
    const invoiceNumber = String(body.invoiceNumber ?? "").trim()
    const customerName = String(body.customerName ?? "").trim()
    const customerEmail = String(body.customerEmail ?? "").trim()
    const currency = String(body.currency ?? "GHS").trim()
    const status = String(body.status ?? "draft").trim()
    const issueDate = String(body.issueDate ?? "").trim()
    const lineItems = normalizeLineItems(body.lineItems)
    const totals = calculateTotals(lineItems, body.tax, body.discount)

    if (!invoiceNumber || !customerName || !issueDate || lineItems.length === 0) {
      return NextResponse.json({ error: "Missing required invoice fields" }, { status: 400 })
    }

    if (!["GHS", "USD"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    if (!["draft", "sent", "paid"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const needsPaymentLink = canCreateInvoicePaymentLink({
      customer_email: customerEmail,
      total: totals.total,
      status,
    })

    if (totals.total > 0 && status !== "paid") {
      if (!customerEmail || !EMAIL_RE.test(customerEmail)) {
        return NextResponse.json(
          { error: "Customer email is required so we can create a Paystack payment link" },
          { status: 400 },
        )
      }
    }

    const result = await query(
      `INSERT INTO invoices (
        invoice_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_company,
        issue_date,
        due_date,
        currency,
        status,
        line_items,
        subtotal,
        tax,
        discount,
        total,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, '')::date, $8, $9, $10::jsonb, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        invoiceNumber,
        customerName,
        customerEmail,
        String(body.customerPhone ?? "").trim(),
        String(body.customerCompany ?? "").trim(),
        issueDate,
        String(body.dueDate ?? "").trim(),
        currency,
        status,
        JSON.stringify(lineItems),
        totals.subtotal,
        totals.tax,
        totals.discount,
        totals.total,
        String(body.notes ?? "").trim(),
      ],
    )

    let invoice = result.rows[0]

    if (needsPaymentLink) {
      try {
        invoice = await createInvoicePaystackLink({
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          total: Number(invoice.total),
          currency: invoice.currency,
        })
      } catch (paystackError) {
        console.error("[invoice] Paystack link creation failed:", paystackError)
        await query("DELETE FROM invoices WHERE id = $1", [invoice.id])
        return NextResponse.json(
          { error: "Failed to create Paystack payment link. Check your Paystack keys and try again." },
          { status: 502 },
        )
      }
    }

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error: unknown) {
    console.error("[invoice] Error creating invoice:", error)
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "Invoice number already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
