"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { packages, siteConfig } from "@/lib/content"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice, detectCurrency, type Currency } from "@/lib/currency"
import type { Package } from "@/lib/content"
import { Analytics } from "@/components/analytics"

const serviceOrder = [
  "Brand Identity",
  "Website Development",
  "Social Media Management",
  "Brand Strategy",
  "Photography & Videography",
  "Print & Collateral",
]

const serviceIntroductions: Record<string, string> = {
  "Brand Identity": "For businesses that need a stronger first impression and more visual consistency.",
  "Website Development": "For teams that need a clearer online experience and a more credible digital presence.",
  "Social Media Management": "For businesses that want consistent output, sharper content, and stronger visibility.",
  "Brand Strategy": "For companies that need direction before execution, rebranding, or growth campaigns.",
  "Photography & Videography": "For brands that need polished visuals for campaigns, launches, and day-to-day content.",
  "Print & Collateral": "For businesses that still need their physical touchpoints to feel as strong as their digital ones.",
}

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
      setMounted(true)
    }

    detectAndSetCurrency()
  }, [])

  const serviceGroups = useMemo(() => {
    const grouped = packages.packages.reduce(
      (acc, pkg) => {
        const service = (pkg as any).service || "Other"
        if (!acc[service]) acc[service] = []
        acc[service].push(pkg)
        return acc
      },
      {} as Record<string, Package[]>,
    )

    return serviceOrder
      .filter((service) => grouped[service])
      .map((service) => [service, grouped[service]] as const)
  }, [])

  const handlePurchase = async (pkg: Package) => {
    const amount = currency === "GHS" ? pkg.priceGHS : pkg.priceUSD
    if (amount <= 0 || pkg.isHourly) {
      window.open(siteConfig.contact.whatsapp, "_blank", "noopener,noreferrer")
      return
    }

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

  return (
    <>
      <Analytics />
      <Header />

      <main className="bg-background pt-24 text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Packages & pricing</p>
                <h1 className="mt-4 text-5xl font-serif font-bold tracking-tight md:text-6xl">
                  Clear entry points for businesses that want to move without guessing.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  We show starting packages so you can understand the budget range before a call. If your project needs
                  something custom, we will tell you early rather than pushing you into the wrong scope.
                </p>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-7">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Choose currency</p>
                <div className="mt-6 inline-flex items-center rounded-full border border-border bg-background p-1">
                  <button
                    type="button"
                    onClick={() => setCurrency("GHS")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      currency === "GHS" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    GHS
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      currency === "USD" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    USD
                  </button>
                </div>
                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p>{mounted ? `Showing ${currency} pricing based on your likely region.` : "Detecting the most useful currency for you."}</p>
                  <p>Photography and some production work often need a custom quote, so those paths send you to WhatsApp instead of direct checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl space-y-18 px-6 lg:px-8">
            {serviceGroups.map(([service, servicePackages]) => (
              <section key={service}>
                <div className="max-w-2xl">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">{service}</p>
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    {serviceIntroductions[service] ?? "Flexible packages shaped around scope, goals, and rollout needs."}
                  </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                  {servicePackages.map((pkg) => {
                    const amount = currency === "GHS" ? pkg.priceGHS : pkg.priceUSD
                    const needsQuote = amount <= 0 || pkg.isHourly

                    return (
                      <Card
                        key={pkg.id}
                        className={`relative overflow-hidden rounded-[1.75rem] border bg-card ${
                          pkg.popular ? "border-accent shadow-[0_20px_80px_rgba(0,0,0,0.08)]" : "border-border"
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute right-5 top-5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                            Popular
                          </div>
                        )}
                        <CardHeader className="space-y-4 pb-6 pt-8">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">{service}</p>
                            <h2 className="mt-4 text-3xl font-serif font-bold">{pkg.name}</h2>
                          </div>
                          <p className="text-sm leading-7 text-muted-foreground">{pkg.description}</p>
                          <div>
                            {needsQuote ? (
                              <>
                                <div className="text-3xl font-serif font-bold">Custom quote</div>
                                <div className="mt-1 text-sm text-muted-foreground">Best handled after a quick scope chat</div>
                              </>
                            ) : (
                              <>
                                <div className="text-4xl font-serif font-bold">{formatPrice(amount, currency)}</div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {service === "Social Media Management" ? "Monthly starting point" : "Starting package"}
                                </div>
                              </>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {pkg.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            className="mt-8 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                            size="lg"
                            onClick={() => handlePurchase(pkg)}
                          >
                            {needsQuote ? "Request Quote" : "Continue"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20 py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
            <div className="rounded-[2rem] border border-accent/20 bg-accent px-7 py-8 text-accent-foreground">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent-foreground/80">Need something tailored?</p>
              <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight">Custom scope is normal for serious brand work.</h2>
              <p className="mt-4 text-sm leading-7 text-accent-foreground/90">
                If your project spans multiple services, launch phases, or internal stakeholders, we can shape a proposal around that rather than forcing a package fit.
              </p>
              <Button className="mt-8 bg-accent-foreground text-accent hover:bg-accent-foreground/90" asChild>
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Discuss a Custom Quote
                </a>
              </Button>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-7">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Before you buy</p>
              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>We recommend the smallest package that can still achieve the result you need.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>If your project needs strategy first, we will say so before taking payment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>You can always start with a quick consultation and convert that into a wider scope later.</span>
                </li>
              </ul>
              <Button variant="outline" className="mt-8 border-accent/30 bg-transparent" asChild>
                <Link href="/services">Review Services Again</Link>
              </Button>
            </div>
          </div>
        </section>

        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6 backdrop-blur-sm">
            <Card className="w-full max-w-md rounded-[1.75rem] border border-border bg-card">
              <CardHeader>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Secure checkout</p>
                <h3 className="mt-3 text-3xl font-serif font-semibold">{selectedPackage.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(currency === "GHS" ? selectedPackage.priceGHS : selectedPackage.priceUSD, currency)}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
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
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
                    <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed"
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
