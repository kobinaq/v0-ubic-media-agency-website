import { nanoid } from "nanoid"
import { initializePaystackTransaction } from "@/lib/paystack"
import { query } from "@/lib/db"

type InvoicePaymentInput = {
  id: number
  invoice_number: string
  customer_name: string
  customer_email: string
  total: number
  currency: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function canCreateInvoicePaymentLink(input: {
  customer_email?: string | null
  total: number
  status: string
}) {
  const email = String(input.customer_email || "").trim()
  return EMAIL_RE.test(email) && input.total > 0 && input.status !== "paid"
}

export async function createInvoicePaystackLink(invoice: InvoicePaymentInput) {
  const email = invoice.customer_email.trim()
  if (!EMAIL_RE.test(email)) {
    throw new Error("A valid customer email is required for Paystack payment links")
  }

  if (invoice.total <= 0) {
    throw new Error("Invoice total must be greater than zero to create a payment link")
  }

  const safeInvoiceNumber = invoice.invoice_number.replace(/[^a-zA-Z0-9\-.=]/g, "")
  const reference = `INV-${safeInvoiceNumber}-${nanoid(8)}`

  const paystackResponse = await initializePaystackTransaction(
    email,
    Number(invoice.total),
    invoice.currency,
    {
      type: "invoice",
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      customer_name: invoice.customer_name,
    },
    { reference },
  )

  if (!paystackResponse.status || !paystackResponse.data?.authorization_url) {
    throw new Error(paystackResponse.message || "Failed to create Paystack payment link")
  }

  const result = await query(
    `UPDATE invoices
     SET payment_url = $1,
         paystack_reference = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [paystackResponse.data.authorization_url, paystackResponse.data.reference, invoice.id],
  )

  return result.rows[0]
}

export async function markInvoicePaidByPaystackReference(reference: string, paidAmountMinor: number, currency: string) {
  const lookup = await query("SELECT * FROM invoices WHERE paystack_reference = $1 LIMIT 1", [reference])
  const invoice = lookup.rows[0]
  if (!invoice) return null

  if (invoice.status === "paid") return invoice

  const paidAmountMajor = Number(paidAmountMinor) / 100
  const expectedAmount = Number(invoice.total)
  const paidCurrency = String(currency || "").toUpperCase()

  if (
    !Number.isFinite(paidAmountMajor) ||
    paidAmountMajor !== expectedAmount ||
    paidCurrency !== String(invoice.currency).toUpperCase()
  ) {
    console.error("[invoice] Paystack amount/currency mismatch", {
      reference,
      paidAmountMajor,
      expectedAmount,
      paidCurrency,
      expectedCurrency: invoice.currency,
    })
    throw new Error("Invoice payment amount mismatch")
  }

  const updateResult = await query(
    `UPDATE invoices
     SET status = 'paid',
         updated_at = CURRENT_TIMESTAMP
     WHERE paystack_reference = $1 AND status <> 'paid'
     RETURNING *`,
    [reference],
  )

  return updateResult.rows[0] || invoice
}
