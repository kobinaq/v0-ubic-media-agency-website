import { NextResponse } from "next/server"
import { query } from "@/lib/db"

type InvoiceLineItem = {
  description: string
  quantity: number
  unitPrice: number
}

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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const invoiceNumber = String(body.invoiceNumber ?? "").trim()
    const customerName = String(body.customerName ?? "").trim()
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

    const result = await query(
      `UPDATE invoices
       SET invoice_number = $1,
           customer_name = $2,
           customer_email = $3,
           customer_phone = $4,
           customer_company = $5,
           issue_date = $6,
           due_date = NULLIF($7, '')::date,
           currency = $8,
           status = $9,
           line_items = $10::jsonb,
           subtotal = $11,
           tax = $12,
           discount = $13,
           total = $14,
           notes = $15,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $16
       RETURNING *`,
      [
        invoiceNumber,
        customerName,
        String(body.customerEmail ?? "").trim(),
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
        id,
      ],
    )

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ invoice: result.rows[0] })
  } catch (error: any) {
    console.error("[invoice] Error updating invoice:", error)
    if (error?.code === "23505") {
      return NextResponse.json({ error: "Invoice number already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}
