"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, FileText, Plus, ReceiptText, Save, Search, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/content"

type Currency = "GHS" | "USD"
type InvoiceStatus = "draft" | "sent" | "paid"
type AdminView = "orders" | "invoices"

interface Order {
  id: number
  order_reference: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  package_name: string
  amount: number
  currency: string
  payment_status: string
  created_at: string
}

interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
}

interface Invoice {
  id: number
  invoice_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_company: string
  issue_date: string
  due_date: string | null
  currency: Currency
  status: InvoiceStatus
  line_items: InvoiceLineItem[] | string
  subtotal: number
  tax: number
  discount: number
  total: number
  notes: string
  created_at: string
}

interface InvoiceFormState {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCompany: string
  issueDate: string
  dueDate: string
  currency: Currency
  status: InvoiceStatus
  tax: string
  discount: string
  notes: string
  lineItems: InvoiceLineItem[]
}

const today = () => new Date().toISOString().slice(0, 10)

const makeInvoiceNumber = () => {
  const date = new Date()
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
  return `UBIC-${stamp}-${String(Date.now()).slice(-4)}`
}

const emptyInvoiceForm = (): InvoiceFormState => ({
  invoiceNumber: makeInvoiceNumber(),
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerCompany: "",
  issueDate: today(),
  dueDate: "",
  currency: "GHS",
  status: "draft",
  tax: "0",
  discount: "0",
  notes: "Thank you for choosing Ubic Media Agency.",
  lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
})

const parseAmount = (value: unknown) => {
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : 0
}

const normalizeLineItems = (lineItems: Invoice["line_items"]): InvoiceLineItem[] => {
  if (Array.isArray(lineItems)) return lineItems
  try {
    const parsed = JSON.parse(lineItems || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const calculateTotals = (lineItems: InvoiceLineItem[], tax: string | number, discount: string | number) => {
  const subtotal = lineItems.reduce((sum, item) => sum + parseAmount(item.quantity) * parseAmount(item.unitPrice), 0)
  const taxAmount = parseAmount(tax)
  const discountAmount = parseAmount(discount)
  const total = Math.max(0, subtotal + taxAmount - discountAmount)

  return {
    subtotal,
    tax: taxAmount,
    discount: discountAmount,
    total,
  }
}

const formatMoney = (amount: number, currency: string) =>
  `${currency} ${Number(amount || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatInvoiceNumber = (amount: number) =>
  Number(amount || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const normalizeInvoiceFromApi = (invoice: Invoice): Invoice => ({
  ...invoice,
  line_items: normalizeLineItems(invoice.line_items),
  subtotal: Number(invoice.subtotal),
  tax: Number(invoice.tax),
  discount: Number(invoice.discount),
  total: Number(invoice.total),
})

const getImageSize = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height })
    image.onerror = reject
    image.src = src
  })

const fitIntoBox = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  if (!width || !height) return { width: maxWidth, height: maxHeight }
  const ratio = Math.min(maxWidth / width, maxHeight / height)
  return {
    width: width * ratio,
    height: height * ratio,
  }
}

export default function AdminOrdersPage() {
  const [activeView, setActiveView] = useState<AdminView>("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoiceLogo, setInvoiceLogo] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState("")
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(true)
  const [isSavingInvoice, setIsSavingInvoice] = useState(false)
  const [isSavingLogo, setIsSavingLogo] = useState(false)
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null)
  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormState>(() => emptyInvoiceForm())

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders")
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("[v0] Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/admin/invoices")
        const data = await response.json()
        setInvoices((data.invoices || []).map(normalizeInvoiceFromApi))
      } catch (error) {
        console.error("[invoice] Error fetching invoices:", error)
      } finally {
        setIsInvoiceLoading(false)
      }
    }

    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/admin/settings/invoice-logo")
        const data = await response.json()
        setInvoiceLogo(data.logo || "")
      } catch (error) {
        console.error("[invoice-logo] Error fetching invoice logo:", error)
      }
    }

    fetchOrders()
    fetchInvoices()
    fetchLogo()
  }, [])

  const filteredOrders = useMemo(() => {
    let currentOrders = orders

    if (statusFilter !== "all") {
      currentOrders = currentOrders.filter((order) => order.payment_status === statusFilter)
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      currentOrders = currentOrders.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(query) ||
          order.customer_email.toLowerCase().includes(query) ||
          order.order_reference.toLowerCase().includes(query),
      )
    }

    return currentOrders
  }, [orders, searchTerm, statusFilter])

  const filteredInvoices = useMemo(() => {
    let currentInvoices = invoices

    if (invoiceStatusFilter !== "all") {
      currentInvoices = currentInvoices.filter((invoice) => invoice.status === invoiceStatusFilter)
    }

    if (invoiceSearchTerm) {
      const query = invoiceSearchTerm.toLowerCase()
      currentInvoices = currentInvoices.filter(
        (invoice) =>
          invoice.invoice_number.toLowerCase().includes(query) ||
          invoice.customer_name.toLowerCase().includes(query) ||
          (invoice.customer_email || "").toLowerCase().includes(query) ||
          (invoice.customer_company || "").toLowerCase().includes(query),
      )
    }

    return currentInvoices
  }, [invoices, invoiceSearchTerm, invoiceStatusFilter])

  const invoiceTotals = useMemo(
    () => calculateTotals(invoiceForm.lineItems, invoiceForm.tax, invoiceForm.discount),
    [invoiceForm.discount, invoiceForm.lineItems, invoiceForm.tax],
  )

  const totalRevenue = orders
    .filter((order) => order.payment_status === "paid" && order.currency === "GHS")
    .reduce((sum, order) => sum + Number(order.amount), 0)

  const totalInvoiceValue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0)

  const exportToCSV = () => {
    const headers = ["Order Reference", "Customer Name", "Email", "Phone", "Package", "Amount", "Currency", "Status", "Date"]
    const rows = filteredOrders.map((order) => [
      order.order_reference,
      order.customer_name,
      order.customer_email,
      order.customer_phone || "",
      order.package_name,
      order.amount,
      order.currency,
      order.payment_status,
      new Date(order.created_at).toLocaleDateString(),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    anchor.click()
    window.URL.revokeObjectURL(url)
  }

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: string) => {
    setInvoiceForm((current) => ({
      ...current,
      lineItems: current.lineItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "description" ? value : parseAmount(value),
            }
          : item,
      ),
    }))
  }

  const addLineItem = () => {
    setInvoiceForm((current) => ({
      ...current,
      lineItems: [...current.lineItems, { description: "", quantity: 1, unitPrice: 0 }],
    }))
  }

  const removeLineItem = (index: number) => {
    setInvoiceForm((current) => ({
      ...current,
      lineItems:
        current.lineItems.length === 1 ? current.lineItems : current.lineItems.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const resetInvoiceForm = () => {
    setEditingInvoiceId(null)
    setInvoiceForm(emptyInvoiceForm())
  }

  const editInvoice = (invoice: Invoice) => {
    setActiveView("invoices")
    setEditingInvoiceId(invoice.id)
    setInvoiceForm({
      invoiceNumber: invoice.invoice_number,
      customerName: invoice.customer_name,
      customerEmail: invoice.customer_email || "",
      customerPhone: invoice.customer_phone || "",
      customerCompany: invoice.customer_company || "",
      issueDate: new Date(invoice.issue_date).toISOString().slice(0, 10),
      dueDate: invoice.due_date ? new Date(invoice.due_date).toISOString().slice(0, 10) : "",
      currency: invoice.currency,
      status: invoice.status,
      tax: String(invoice.tax || 0),
      discount: String(invoice.discount || 0),
      notes: invoice.notes || "",
      lineItems: normalizeLineItems(invoice.line_items),
    })
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.")
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const logo = String(reader.result || "")
      setIsSavingLogo(true)
      try {
        const response = await fetch("/api/admin/settings/invoice-logo", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logo }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to save logo")
        }

        setInvoiceLogo(logo)
      } catch (error: any) {
        alert(error.message || "Failed to save logo")
      } finally {
        setIsSavingLogo(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const saveInvoice = async (event: React.FormEvent) => {
    event.preventDefault()

    const usableLineItems = invoiceForm.lineItems.filter((item) => item.description.trim() && parseAmount(item.quantity) > 0)
    if (!invoiceForm.customerName.trim() || usableLineItems.length === 0) {
      alert("Add a customer name and at least one line item.")
      return
    }

    setIsSavingInvoice(true)
    try {
      const endpoint = editingInvoiceId ? `/api/admin/invoices/${editingInvoiceId}` : "/api/admin/invoices"
      const response = await fetch(endpoint, {
        method: editingInvoiceId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...invoiceForm,
          lineItems: usableLineItems,
          tax: parseAmount(invoiceForm.tax),
          discount: parseAmount(invoiceForm.discount),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to save invoice")
      }

      const savedInvoice = normalizeInvoiceFromApi(data.invoice)
      setInvoices((current) =>
        editingInvoiceId
          ? current.map((invoice) => (invoice.id === savedInvoice.id ? savedInvoice : invoice))
          : [savedInvoice, ...current],
      )
      resetInvoiceForm()
    } catch (error: any) {
      alert(error.message || "Failed to save invoice")
    } finally {
      setIsSavingInvoice(false)
    }
  }

  const deleteInvoice = async (invoice: Invoice) => {
    const confirmed = window.confirm(`Delete invoice ${invoice.invoice_number}? This cannot be undone.`)
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete invoice")
      }

      setInvoices((current) => current.filter((item) => item.id !== invoice.id))
      if (editingInvoiceId === invoice.id) {
        resetInvoiceForm()
      }
    } catch (error: any) {
      alert(error.message || "Failed to delete invoice")
    }
  }

  const downloadInvoicePdf = async (invoice: Invoice) => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({ unit: "pt", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 48
    const documentTitle = invoice.status === "paid" ? "Receipt" : "Invoice"
    const lineItems = normalizeLineItems(invoice.line_items)
    const colors = {
      paper: [244, 237, 220] as const,
      card: [251, 247, 236] as const,
      ink: [32, 28, 26] as const,
      muted: [101, 92, 82] as const,
      rule: [216, 202, 180] as const,
      teal: [31, 71, 65] as const,
      rust: [193, 68, 45] as const,
      gold: [226, 166, 46] as const,
    }
    const contentWidth = pageWidth - margin * 2
    const descriptionX = margin + 16
    const qtyX = pageWidth - 224
    const unitX = pageWidth - 164
    const totalX = pageWidth - margin - 14
    const descriptionWidth = qtyX - descriptionX - 22

    const setFill = (color: readonly number[]) => doc.setFillColor(color[0], color[1], color[2])
    const setDraw = (color: readonly number[]) => doc.setDrawColor(color[0], color[1], color[2])
    const setText = (color: readonly number[]) => doc.setTextColor(color[0], color[1], color[2])

    const drawPageShell = () => {
      setFill(colors.paper)
      doc.rect(0, 0, pageWidth, pageHeight, "F")
      setDraw(colors.rule)
      doc.setLineWidth(0.8)
      doc.line(margin, 28, pageWidth - margin, 28)
      doc.line(margin, pageHeight - 42, pageWidth - margin, pageHeight - 42)
      setText(colors.muted)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(7)
      doc.text("UBIC MEDIA AGENCY", margin, pageHeight - 24)
      doc.text(siteConfig.contact.email, pageWidth - margin, pageHeight - 24, { align: "right" })
    }

    const drawTableHeader = (headerY: number) => {
      setFill(colors.teal)
      doc.rect(margin, headerY - 21, contentWidth, 30, "F")
      setFill(colors.rust)
      doc.rect(margin, headerY - 21, 5, 30, "F")
      setText(colors.paper)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text("DESCRIPTION", descriptionX, headerY)
      doc.text("QTY", qtyX, headerY)
      doc.text(`UNIT (${invoice.currency})`, unitX, headerY)
      doc.text(`TOTAL (${invoice.currency})`, totalX, headerY, { align: "right" })
      setText(colors.ink)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
    }

    const addContentPage = () => {
      doc.addPage()
      drawPageShell()
      drawTableHeader(82)
      return 118
    }

    drawPageShell()

    setText(colors.ink)
    doc.setFont("times", "bold")
    doc.setFontSize(45)
    doc.text(documentTitle, margin, 105)
    setDraw(colors.ink)
    doc.setLineWidth(1.2)
    doc.line(margin, 120, pageWidth - margin, 120)
    setFill(colors.gold)
    doc.rect(margin, 124, 86, 6, "F")

    if (invoiceLogo) {
      const logoBoxWidth = 128
      const logoBoxHeight = 66
      const logoBoxX = pageWidth - margin - logoBoxWidth
      const logoBoxY = 49
      setFill(colors.card)
      setDraw(colors.rule)
      doc.rect(logoBoxX, logoBoxY, logoBoxWidth, logoBoxHeight, "FD")
      try {
        const imageSize = await getImageSize(invoiceLogo)
        const fitted = fitIntoBox(imageSize.width, imageSize.height, logoBoxWidth - 24, logoBoxHeight - 20)
        doc.addImage(
          invoiceLogo,
          invoiceLogo.includes("image/png") ? "PNG" : "JPEG",
          logoBoxX + (logoBoxWidth - fitted.width) / 2,
          logoBoxY + (logoBoxHeight - fitted.height) / 2,
          fitted.width,
          fitted.height,
          undefined,
          "FAST",
        )
      } catch {
        try {
          doc.addImage(invoiceLogo, "PNG", logoBoxX + 18, logoBoxY + 18, 92, 30, undefined, "FAST")
        } catch {
          // Keep generating the document even if the uploaded logo format is not supported by jsPDF.
        }
      }
    }

    setText(colors.ink)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(siteConfig.siteName, margin, 154)
    setText(colors.muted)
    doc.text(siteConfig.contact.email, margin, 170)
    doc.text(siteConfig.contact.phone, margin, 186)
    if (siteConfig.contact.website) doc.text(siteConfig.contact.website, margin, 202)

    const metaX = pageWidth - margin - 204
    setFill(colors.card)
    setDraw(colors.rule)
    doc.rect(metaX, 146, 204, 86, "FD")
    setText(colors.muted)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(`${documentTitle.toUpperCase()} NO.`, metaX + 14, 164)
    doc.text("ISSUE DATE", metaX + 14, 190)
    if (invoice.due_date) doc.text("DUE DATE", metaX + 112, 190)

    setText(colors.ink)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(invoice.invoice_number, metaX + 14, 177)
    doc.text(new Date(invoice.issue_date).toLocaleDateString(), metaX + 14, 204)
    if (invoice.due_date) doc.text(new Date(invoice.due_date).toLocaleDateString(), metaX + 112, 204)

    setFill(colors.card)
    setDraw(colors.rule)
    doc.rect(margin, 252, contentWidth, 86, "FD")
    setFill(colors.rust)
    doc.rect(margin, 252, 6, 86, "F")
    setText(colors.muted)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text("BILL TO", margin + 18, 274)
    setText(colors.ink)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    let billY = 292
    doc.text(invoice.customer_name, margin + 18, billY)
    if (invoice.customer_company) {
      billY += 14
      doc.text(invoice.customer_company, margin + 18, billY)
    }
    if (invoice.customer_email) {
      billY += 14
      doc.text(invoice.customer_email, margin + 18, billY)
    }
    if (invoice.customer_phone) {
      billY += 14
      doc.text(invoice.customer_phone, margin + 18, billY)
    }

    let y = 378
    drawTableHeader(y)
    y += 35
    lineItems.forEach((item, index) => {
      const itemTotal = parseAmount(item.quantity) * parseAmount(item.unitPrice)
      const descriptionLines = doc.splitTextToSize(item.description, descriptionWidth)
      const rowHeight = Math.max(34, descriptionLines.length * 13 + 14)

      if (y + rowHeight > pageHeight - 126) {
        y = addContentPage()
      }

      if (index % 2 === 0) {
        setFill(colors.card)
        doc.rect(margin, y - 16, contentWidth, rowHeight, "F")
      }
      setDraw(colors.rule)
      doc.setLineWidth(0.5)
      doc.line(margin, y - 16, pageWidth - margin, y - 16)
      setText(colors.ink)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(descriptionLines, descriptionX, y)
      doc.text(String(item.quantity), qtyX, y)
      doc.text(formatInvoiceNumber(item.unitPrice), unitX, y)
      doc.setFont("helvetica", "bold")
      doc.text(formatInvoiceNumber(itemTotal), totalX, y, { align: "right" })
      y += rowHeight
    })

    y += 28
    if (y + 132 > pageHeight - 58) {
      doc.addPage()
      drawPageShell()
      y = 76
    }
    const totalsWidth = 236
    const totalsX = pageWidth - margin - totalsWidth
    setFill(colors.card)
    setDraw(colors.rule)
    doc.rect(totalsX, y - 18, totalsWidth, 116, "FD")
    setText(colors.muted)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text(`SUMMARY (${invoice.currency})`, totalsX + 14, y)
    y += 22
    setText(colors.ink)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text("Subtotal", totalsX + 14, y)
    doc.text(formatInvoiceNumber(invoice.subtotal), totalsX + totalsWidth - 14, y, { align: "right" })
    y += 20
    doc.text("Tax", totalsX + 14, y)
    doc.text(formatInvoiceNumber(invoice.tax), totalsX + totalsWidth - 14, y, { align: "right" })
    y += 20
    doc.text("Discount", totalsX + 14, y)
    doc.text(formatInvoiceNumber(invoice.discount), totalsX + totalsWidth - 14, y, { align: "right" })
    y += 16
    setDraw(colors.ink)
    doc.line(totalsX + 14, y, totalsX + totalsWidth - 14, y)
    y += 21
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("Total", totalsX + 14, y)
    doc.text(formatInvoiceNumber(invoice.total), totalsX + totalsWidth - 14, y, { align: "right" })

    if (invoice.notes) {
      y += 54
      if (y + 86 > pageHeight - 58) {
        doc.addPage()
        drawPageShell()
        y = 76
      }
      const noteLines = doc.splitTextToSize(invoice.notes, contentWidth - 32)
      const noteHeight = Math.max(72, noteLines.length * 13 + 42)
      setFill(colors.card)
      setDraw(colors.rule)
      doc.rect(margin, y - 18, contentWidth, noteHeight, "FD")
      setText(colors.muted)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text("NOTES", margin + 16, y)
      setText(colors.ink)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text(noteLines, margin + 16, y + 22)
    }

    setText(colors.rust)
    doc.setFont("times", "bold")
    doc.setFontSize(14)
    doc.text("Thank you for choosing Ubic.", margin, pageHeight - 66)

    doc.save(`${invoice.status === "paid" ? "receipt" : "invoice"}-${invoice.invoice_number}.pdf`)
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="border-b border-border pb-6">
          <p className="issue-label">Admin</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em]">Order Management</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                View orders, create invoices, download receipts, and keep transaction records.
              </p>
            </div>
            <div className="inline-flex border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setActiveView("orders")}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] ${
                  activeView === "orders" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => setActiveView("invoices")}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] ${
                  activeView === "invoices" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                Invoices
              </button>
            </div>
          </div>
        </div>

        {activeView === "orders" ? (
          <>
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or reference..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={exportToCSV} variant="outline" className="editorial-button border-border bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-serif font-semibold">{orders.length}</div>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Paid Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-serif font-semibold">
                    {orders.filter((order) => order.payment_status === "paid").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-serif font-semibold">GHS {totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border bg-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-12 text-center text-muted-foreground">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">No orders found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border/70 bg-secondary/20">
                        <tr className="text-left">
                          <th className="p-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Reference</th>
                          <th className="p-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Customer</th>
                          <th className="p-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Package</th>
                          <th className="p-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Amount</th>
                          <th className="p-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Status</th>
                          <th className="p-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border/60 transition-colors hover:bg-secondary/20">
                            <td className="p-4 font-mono text-sm">{order.order_reference}</td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{order.customer_name}</div>
                                <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                                {order.customer_phone && <div className="text-sm text-muted-foreground">{order.customer_phone}</div>}
                              </div>
                            </td>
                            <td className="p-4 text-sm">{order.package_name}</td>
                            <td className="p-4 font-medium">
                              {order.currency} {Number(order.amount).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center border px-2.5 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
                                  order.payment_status === "paid"
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                                    : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                                }`}
                              >
                                {order.payment_status}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Invoice Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-serif font-semibold">{invoices.length}</div>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Paid Receipts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-serif font-semibold">
                    {invoices.filter((invoice) => invoice.status === "paid").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Recorded Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-serif font-semibold">{totalInvoiceValue.toLocaleString("en-GH")}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl font-semibold">
                    {editingInvoiceId ? "Edit Invoice" : "Invoice Maker"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveInvoice} className="space-y-8">
                    <div className="border-b border-border pb-6">
                      <label className="mb-3 block font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Invoice Logo
                      </label>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-32 items-center justify-center border border-border bg-background p-3">
                          {invoiceLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={invoiceLogo} alt="Invoice logo" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-center font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                              No Logo
                            </span>
                          )}
                        </div>
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-border bg-background px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:bg-secondary">
                          <Upload className="h-4 w-4" />
                          {isSavingLogo ? "Saving..." : "Upload Logo"}
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="invoiceNumber">
                          Invoice Number
                        </label>
                        <Input
                          id="invoiceNumber"
                          value={invoiceForm.invoiceNumber}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, invoiceNumber: event.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Status</label>
                        <Select
                          value={invoiceForm.status}
                          onValueChange={(value: InvoiceStatus) => setInvoiceForm({ ...invoiceForm, status: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="issueDate">
                          Issue Date
                        </label>
                        <Input
                          id="issueDate"
                          type="date"
                          value={invoiceForm.issueDate}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, issueDate: event.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="dueDate">
                          Due Date
                        </label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={invoiceForm.dueDate}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, dueDate: event.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Currency</label>
                        <Select
                          value={invoiceForm.currency}
                          onValueChange={(value: Currency) => setInvoiceForm({ ...invoiceForm, currency: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GHS">GHS</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="customerName">
                          Client Name
                        </label>
                        <Input
                          id="customerName"
                          value={invoiceForm.customerName}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, customerName: event.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="customerEmail">
                          Client Email
                        </label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={invoiceForm.customerEmail}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, customerEmail: event.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="customerPhone">
                          Client Phone
                        </label>
                        <Input
                          id="customerPhone"
                          value={invoiceForm.customerPhone}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, customerPhone: event.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium" htmlFor="customerCompany">
                          Client Company
                        </label>
                        <Input
                          id="customerCompany"
                          value={invoiceForm.customerCompany}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, customerCompany: event.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Line Items</h3>
                        <Button type="button" variant="outline" className="editorial-button border-border bg-transparent" onClick={addLineItem}>
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {invoiceForm.lineItems.map((item, index) => (
                          <div key={index} className="grid gap-3 border border-border bg-background p-4 md:grid-cols-[1fr_100px_140px_auto]">
                            <Input
                              placeholder="Description"
                              value={item.description}
                              onChange={(event) => updateLineItem(index, "description", event.target.value)}
                            />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(event) => updateLineItem(index, "quantity", event.target.value)}
                            />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Unit price"
                              value={item.unitPrice}
                              onChange={(event) => updateLineItem(index, "unitPrice", event.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="border-border bg-transparent"
                              onClick={() => removeLineItem(index)}
                              disabled={invoiceForm.lineItems.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="tax">
                          Tax
                        </label>
                        <Input
                          id="tax"
                          type="number"
                          min="0"
                          step="0.01"
                          value={invoiceForm.tax}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, tax: event.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="discount">
                          Discount
                        </label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={invoiceForm.discount}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, discount: event.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium" htmlFor="notes">
                          Notes
                        </label>
                        <Textarea
                          id="notes"
                          value={invoiceForm.notes}
                          onChange={(event) => setInvoiceForm({ ...invoiceForm, notes: event.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 border-t border-border pt-6 text-sm md:grid-cols-2">
                      <div className="text-muted-foreground">Subtotal</div>
                      <div className="text-right font-medium">{formatMoney(invoiceTotals.subtotal, invoiceForm.currency)}</div>
                      <div className="text-muted-foreground">Tax</div>
                      <div className="text-right font-medium">{formatMoney(invoiceTotals.tax, invoiceForm.currency)}</div>
                      <div className="text-muted-foreground">Discount</div>
                      <div className="text-right font-medium">{formatMoney(invoiceTotals.discount, invoiceForm.currency)}</div>
                      <div className="font-serif text-2xl font-semibold">Total</div>
                      <div className="text-right font-serif text-2xl font-semibold">
                        {formatMoney(invoiceTotals.total, invoiceForm.currency)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button type="submit" className="editorial-button bg-foreground text-background hover:bg-accent" disabled={isSavingInvoice}>
                        <Save className="h-4 w-4" />
                        {isSavingInvoice ? "Saving..." : editingInvoiceId ? "Update Invoice" : "Save Invoice"}
                      </Button>
                      {editingInvoiceId && (
                        <Button type="button" variant="outline" className="editorial-button border-border bg-transparent" onClick={resetInvoiceForm}>
                          New Invoice
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl font-semibold">Invoice Records</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        value={invoiceSearchTerm}
                        onChange={(event) => setInvoiceSearchTerm(event.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
                      <SelectTrigger className="w-full md:w-44">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isInvoiceLoading ? (
                    <div className="border border-border p-10 text-center text-muted-foreground">Loading invoices...</div>
                  ) : filteredInvoices.length === 0 ? (
                    <div className="border border-border p-10 text-center text-muted-foreground">No invoices found</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="border border-border bg-background p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="font-serif text-2xl font-semibold">{invoice.invoice_number}</h3>
                                <span
                                  className={`border px-2.5 py-1 font-mono text-xs uppercase tracking-[0.16em] ${
                                    invoice.status === "paid"
                                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                                      : invoice.status === "sent"
                                        ? "border-blue-500/30 bg-blue-500/10 text-blue-700"
                                        : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                                  }`}
                                >
                                  {invoice.status}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                {invoice.customer_name}
                                {invoice.customer_company ? ` - ${invoice.customer_company}` : ""}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {new Date(invoice.issue_date).toLocaleDateString()} - {formatMoney(invoice.total, invoice.currency)}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="editorial-button border-border bg-transparent"
                                onClick={() => editInvoice(invoice)}
                              >
                                <FileText className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                className="editorial-button bg-foreground text-background hover:bg-accent"
                                onClick={() => downloadInvoicePdf(invoice)}
                              >
                                {invoice.status === "paid" ? <ReceiptText className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                                PDF
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="editorial-button border-red-500/30 bg-transparent text-red-700 hover:bg-red-500/10"
                                onClick={() => deleteInvoice(invoice)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
