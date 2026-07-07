"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search } from "lucide-react"

interface Order {
  id: number
  order_reference: string
  customer_name: string
  customer_email: string
  package_name: string
  amount: number
  currency: string
  payment_status: string
  created_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

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

    fetchOrders()
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

  const exportToCSV = () => {
    const headers = ["Order Reference", "Customer Name", "Email", "Package", "Amount", "Currency", "Status", "Date"]
    const rows = filteredOrders.map((order) => [
      order.order_reference,
      order.customer_name,
      order.customer_email,
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
  }

  const totalRevenue = orders
    .filter((order) => order.payment_status === "paid" && order.currency === "GHS")
    .reduce((sum, order) => sum + order.amount, 0)

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="border-b border-border pb-6">
          <p className="issue-label">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Order Management</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">View and manage all customer orders from one clean dashboard.</p>
        </div>

        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-semibold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Paid Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-semibold">{orders.filter((order) => order.payment_status === "paid").length}</div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Total Revenue</CardTitle>
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
                          </div>
                        </td>
                        <td className="p-4 text-sm">{order.package_name}</td>
                        <td className="p-4 font-medium">
                          {order.currency} {order.amount.toLocaleString()}
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
                        <td className="p-4 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
