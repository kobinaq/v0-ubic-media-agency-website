"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { packages, siteConfig } from "@/lib/content"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice, detectCurrency, type Currency } from "@/lib/currency"
import type { Package } from "@/lib/content"
import { Analytics } from "@/components/analytics"
import { PageIntro } from "@/components/page-intro"
import { FadeUp } from "@/components/home/text-reveal"
import {
  PACKAGE_PATHS,
  getPathById,
  type PackagePathId,
} from "@/lib/outcomes"
import { cn } from "@/lib/utils"

export default function PackagesPage() {
  const searchParams = useSearchParams()
  const pathFromUrl = searchParams.get("path")

  const [currency, setCurrency] = useState<Currency>("USD")
  const [selectedPath, setSelectedPath] = useState<PackagePathId | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", phone: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const run = async () => {
      const detected = await detectCurrency(navigator.language)
      setCurrency(detected)
      setMounted(true)
    }
    run()
  }, [])

  // Deep-link from Services outcome map: /packages?path=website
  useEffect(() => {
    const path = getPathById(pathFromUrl)
    if (path) setSelectedPath(path.id)
  }, [pathFromUrl])

  const activePath = useMemo(
    () => (selectedPath ? getPathById(selectedPath) : undefined),
    [selectedPath],
  )

  const filteredPackages = useMemo(() => {
    if (!activePath) return []
    return packages.packages.filter((pkg) =>
      activePath.packageServices.includes(pkg.service as never),
    )
  }, [activePath])

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, Package[]> = {}
    for (const pkg of filteredPackages) {
      const key = pkg.service || "Other"
      if (!groups[key]) groups[key] = []
      groups[key].push(pkg)
    }
    return Object.entries(groups)
  }, [filteredPackages])

  const handlePurchase = (pkg: Package) => {
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
          phone: customerInfo.phone,
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
    } catch {
      alert("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const step = selectedPath ? 2 : 1

  return (
    <>
      <Analytics />
      <Header />

      <main className="bg-background text-foreground">
        <PageIntro
          eyebrow="Packages"
          meta={
            <>
              <span className="studio-label">Pricing</span>
              <span className="studio-label">Step {step} of 2</span>
              <span className="studio-label">{mounted ? currency : "…"}</span>
            </>
          }
          title={
            <h1 className="studio-display text-5xl md:text-6xl lg:text-[5.25rem]">
              {step === 1 ? (
                <>
                  Simple pricing.
                  <span className="mt-2 block font-serif italic text-accent">Pick a path.</span>
                </>
              ) : (
                <>
                  {activePath?.label ?? "Packages"}
                  <span className="mt-2 block font-serif italic text-accent">Choose a package.</span>
                </>
              )}
            </h1>
          }
          description={
            step === 1
              ? "Packages for strategy, identity, websites, social, photo, video, and print. Start with a path to see only what matches."
              : activePath?.description
          }
          aside={
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <p className="studio-label">Currency</p>
                <div className="inline-flex items-center border border-border bg-background p-1">
                  {(["GHS", "USD"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      data-cursor="hover"
                      className={cn(
                        "px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors",
                        currency === c ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setSelectedPath(null)}
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change path
                </button>
              )}
              <p className="text-sm leading-7 text-muted-foreground">
                Not sure which path?{" "}
                <Link href="/services" className="text-accent underline-offset-4 hover:underline" data-cursor="hover">
                  Use the outcome map
                </Link>{" "}
                on Services, or message us on WhatsApp.
              </p>
            </div>
          }
        />

        {/* Step 1: Path picker */}
        {step === 1 && (
          <section className="px-5 pb-24 md:px-8 lg:px-10">
            <div className="mx-auto max-w-[1400px]">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PACKAGE_PATHS.map((path, index) => (
                  <FadeUp key={path.id} delay={index * 0.05}>
                    <button
                      type="button"
                      onClick={() => setSelectedPath(path.id)}
                      data-cursor="hover"
                      className={cn(
                        "group flex h-full w-full flex-col border border-border bg-card p-7 text-left transition-colors",
                        "hover:border-accent/40 hover:bg-accent/[0.03]",
                        path.recommended && "border-accent/30",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-xs tracking-[0.18em] text-accent">
                          0{index + 1}
                        </span>
                        {path.recommended && (
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent">
                            Often chosen
                          </span>
                        )}
                      </div>
                      <h2 className="mt-6 font-serif text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                        {path.label}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{path.description}</p>
                      <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-foreground">
                        View packages
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                  </FadeUp>
                ))}
              </div>

              <FadeUp className="mt-16 border border-border bg-secondary/30 p-7 md:p-9" delay={0.15}>
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="studio-label-accent">Need a custom mix?</p>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                      Multi-service launches and rebrands often need a tailored scope. We’ll shape a proposal instead of
                      forcing a single package.
                    </p>
                  </div>
                  <Button className="editorial-button shrink-0 bg-foreground text-background hover:bg-accent" asChild>
                    <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Request custom quote
                    </a>
                  </Button>
                </div>
              </FadeUp>
            </div>
          </section>
        )}

        {/* Step 2: Packages for path */}
        {step === 2 && activePath && (
          <section className="px-5 pb-28 md:px-8 md:pb-24 lg:px-10">
            <div className="mx-auto max-w-[1400px] space-y-16">
              {groupedFiltered.map(([serviceName, servicePackages], groupIndex) => (
                <FadeUp key={serviceName} delay={groupIndex * 0.06}>
                  <div>
                    <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="studio-label-accent">{serviceName}</p>
                        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                          Choose a starting tier
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {servicePackages.length} package{servicePackages.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {servicePackages.map((pkg) => {
                        const amount = currency === "GHS" ? pkg.priceGHS : pkg.priceUSD
                        const needsQuote = amount <= 0 || Boolean(pkg.isHourly)

                        return (
                          <div
                            key={pkg.id}
                            className={cn(
                              "relative flex flex-col border bg-card p-7 transition-colors",
                              pkg.popular ? "border-accent" : "border-border hover:border-foreground/25",
                            )}
                          >
                            {pkg.popular && (
                              <span className="absolute right-5 top-5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent">
                                Most chosen
                              </span>
                            )}
                            <p className="studio-label">Package</p>
                            <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight">{pkg.name}</h3>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{pkg.description}</p>

                            <div className="mt-6">
                              {needsQuote ? (
                                <>
                                  <p className="font-serif text-3xl font-semibold tracking-tight">Custom quote</p>
                                  <p className="mt-1 text-xs text-muted-foreground">Scoped after a short chat</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-serif text-4xl font-semibold tracking-tight">
                                    {formatPrice(amount, currency)}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {serviceName === "Social Media Management"
                                      ? "Monthly starting point"
                                      : "Starting package"}
                                  </p>
                                </>
                              )}
                            </div>

                            <ul className="mt-6 flex-1 space-y-3">
                              {pkg.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <Button
                              className="editorial-button mt-8 w-full bg-foreground text-background hover:bg-accent"
                              size="lg"
                              onClick={() => handlePurchase(pkg)}
                              data-cursor="hover"
                            >
                              {needsQuote ? "Request quote" : "Continue"}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </FadeUp>
              ))}

              {filteredPackages.length === 0 && (
                <div className="border border-border p-10 text-center">
                  <p className="studio-label">No packages in this path</p>
                  <p className="mt-4 text-muted-foreground">Try another path or request a custom quote.</p>
                  <Button className="mt-6" variant="outline" onClick={() => setSelectedPath(null)}>
                    Back to paths
                  </Button>
                </div>
              )}

              <FadeUp className="border border-border bg-accent p-8 text-accent-foreground md:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="studio-label text-accent-foreground/75">Still deciding?</p>
                    <h3 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
                      Map the problem first, then price it.
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="editorial-button bg-accent-foreground text-accent hover:bg-accent-foreground/90"
                      asChild
                    >
                      <Link href="/services" data-cursor="hover">
                        Outcome map
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="editorial-button border-accent-foreground/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10"
                      asChild
                    >
                      <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </FadeUp>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {step === 2 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex gap-2 px-4 py-3">
            <Button
              type="button"
              variant="outline"
              className="editorial-button min-h-11 flex-1 border-border"
              onClick={() => setSelectedPath(null)}
            >
              Change path
            </Button>
            <Button className="editorial-button min-h-11 flex-1 bg-accent text-accent-foreground" asChild>
              <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <Card className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-none border border-border bg-card sm:rounded-none">
            <CardHeader className="p-5 sm:p-6">
              <p className="studio-label-accent">Secure checkout</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">{selectedPackage.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatPrice(
                  currency === "GHS" ? selectedPackage.priceGHS : selectedPackage.priceUSD,
                  currency,
                )}
              </p>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
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
                    className="min-h-11"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="you@company.com"
                    className="min-h-11"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                    Phone / WhatsApp
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="+233 …"
                    className="min-h-11"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11 flex-1 border-border"
                    onClick={() => setSelectedPackage(null)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="editorial-button min-h-11 flex-1 bg-foreground text-background hover:bg-accent"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Pay with Paystack"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
