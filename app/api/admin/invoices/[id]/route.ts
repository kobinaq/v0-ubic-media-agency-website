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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureInvoiceTables()
    const { id } = await params
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

    if (totals.total > 0 && status !== "paid") {
      if (!customerEmail || !EMAIL_RE.test(customerEmail)) {
        return NextResponse.json(
          { error: "Customer email is required so we can create a Paystack payment link" },
          { status: 400 },
        )
      }
    }

    const existingResult = await query("SELECT * FROM invoices WHERE id = $1 LIMIT 1", [id])
    const existing = existingResult.rows[0]
    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
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
        id,
      ],
    )

    let invoice = result.rows[0]

    const paymentDetailsChanged =
      Number(existing.total) !== totals.total ||
      String(existing.customer_email || "").trim() !== customerEmail ||
      String(existing.currency) !== currency

    const needsPaymentLink =
      canCreateInvoicePaymentLink({
        customer_email: customerEmail,
        total: totals.total,
        status,
      }) &&
      (!invoice.payment_url || paymentDetailsChanged)

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
        console.error("[invoice] Paystack link refresh failed:", paystackError)
        return NextResponse.json(
          {
            error: "Invoice saved, but Paystack payment link could not be created. Try saving again.",
            invoice,
          },
          { status: 502 },
        )
      }
    }

    if (status === "paid" || totals.total <= 0) {
      // Keep historical payment_url for reference; no new link needed.
    }

    return NextResponse.json({ invoice })
  } catch (error: unknown) {
    console.error("[invoice] Error updating invoice:", error)
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "Invoice number already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureInvoiceTables()
    const { id } = await params
    const result = await query("DELETE FROM invoices WHERE id = $1 RETURNING id", [id])

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("[invoice] Error deleting invoice:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
