import { query } from "@/lib/db"

let ensured = false

export async function ensureInvoiceTables() {
  if (ensured) return

  await query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(100) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255),
      customer_phone VARCHAR(80),
      customer_company VARCHAR(255),
      issue_date DATE NOT NULL,
      due_date DATE,
      currency VARCHAR(3) NOT NULL CHECK (currency IN ('GHS', 'USD')),
      status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
      line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
      subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
      tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
      discount DECIMAL(12, 2) NOT NULL DEFAULT 0,
      total DECIMAL(12, 2) NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
    CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
  `)

  ensured = true
}
