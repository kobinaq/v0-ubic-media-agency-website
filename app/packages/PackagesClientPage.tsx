"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { packages } from "@/lib/content"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Loader2 } from "lucide-react"
import { formatPrice, detectCurrency, type Currency } from "@/lib/currency"
import type { Package } from "@/lib/content"
import { Analytics } from "@/components/analytics"

export default function PackagesPage() {
  const [currency, setCurrency] = useState<Currency>("USD")
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const detectAndSetCurrency = async () => {
      const detected = await detectCurrency(navigator.language)
      setCurrency(detected)
    }
    detectAndSetCurrency()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePurchase = async (pkg: Package) => {
    setSelectedPackage(pkg)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPackage) return

    setIsProcessing(true)

    try {
      const amount = currency === "GHS" ? selectedPackage.priceGHS : selectedPackage.priceUSD

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerInfo.email,
          name: customerInfo.name,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          amount,
          currency,
        }),
      })

      const data = await response.json()

      if (data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        alert("Failed to initialize payment. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Payment initialization error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const serviceGroups = packages.packages.reduce(
    (acc, pkg) => {
      const service = (pkg as any).service || "Other"
      if (!acc[service]) acc[service] = []
      acc[service].push(pkg)
      return acc
    },
    {} as Record<string, Package[]>,
  )

  return (
    <>
      <Analytics />
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">Our Packages</h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-muted-foreground">Select Currency:</span>
              {mounted && (
                <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setCurrency("GHS")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      currency === "GHS"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    GHS
                  </button>
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      currency === "USD"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    USD
                  </button>
                </div>
              )}
            </div>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Choose the perfect package to elevate your brand.
            </p>
          </div>
        </section>

        {/* Packages by Service */}
        {Object.entries(serviceGroups).map(([service, servicePackages]) => (
          <section key={service} className="py-24 px-6 border-t border-border">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-balance">{service}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {servicePackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`border-2 ${pkg.popular ? "border-accent shadow-lg scale-105" : ""} relative`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className="text-center pb-8 pt-8">
                      <h3 className="text-2xl font-serif font-bold mb-2">{pkg.name}</h3>
                      <p className="text-muted-foreground mb-4">{pkg.description}</p>
                      <div className="text-4xl font-bold">
                        {(pkg as any).service === "Photography & Videography" ? (
                          <div>
                            <div className="text-lg text-muted-foreground mb-2">Contact Sales</div>
                            <div className="text-lg text-accent">
                              Starting from {formatPrice(currency === "GHS" ? pkg.priceGHS : pkg.priceUSD, currency)}
                            </div>
                          </div>
                        ) : (
                          <>
                            {formatPrice(currency === "GHS" ? pkg.priceGHS : pkg.priceUSD, currency)}
                            {(pkg as any).service === "Social Media Management" && (
                              <span className="text-lg text-muted-foreground">/month</span>
                            )}
                            {(pkg as any).isHourly && (pkg as any).service !== "Photography & Videography" && (
                              <span className="text-lg text-muted-foreground">/hr</span>
                            )}
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" size="lg" onClick={() => handlePurchase(pkg)}>
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Checkout Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <Card className="max-w-md w-full">
              <CardHeader>
                <h3 className="text-2xl font-semibold">Complete Your Purchase</h3>
                <p className="text-muted-foreground">
                  {selectedPackage.name} -{" "}
                  {formatPrice(currency === "GHS" ? selectedPackage.priceGHS : selectedPackage.priceUSD, currency)}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedPackage(null)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
