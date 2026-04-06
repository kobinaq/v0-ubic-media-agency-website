"use client"

import Link from "next/link"
import Script from "next/script"
import { ArrowRight, CalendarDays, Check, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { services, siteConfig } from "@/lib/content"
import { Analytics } from "@/components/analytics"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/lib/currency"
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema"

const serviceDetails: Record<string, string[]> = {
  "social-media": [
    "Content planning and creative direction",
    "Platform-ready design and captions",
    "Publishing rhythm built around your audience",
  ],
  "web-design": [
    "Clear page structure and conversion-focused UX",
    "Responsive build with contact or payment flows",
    "Launch support and quality checks",
  ],
  "brand-identity": [
    "Logo and visual identity direction",
    "Typography, color system, and brand rules",
    "Templates that keep the brand consistent",
  ],
  "brand-strategy": [
    "Positioning, messaging, and audience clarity",
    "Brand audit and direction-setting sessions",
    "Recommendations you can act on quickly",
  ],
  "photography-videography": [
    "Production planning and shot direction",
    "Polished stills or video assets for campaigns",
    "Content tailored for digital and brand use",
  ],
  "print-production": [
    "Collateral design for physical touchpoints",
    "Production-ready files and specifications",
    "Brand consistency across print materials",
  ],
}

const serviceSchemas = services.services.map((service) => generateServiceSchema(service))

const faqSchema = generateFAQSchema([
  {
    question: "What service should I start with if my brand feels unclear?",
    answer:
      "Brand identity or brand strategy is usually the best starting point when the core message, look, and positioning are not yet working together.",
  },
  {
    question: "Can Ubic handle both the brand and the website?",
    answer:
      "Yes. Ubic is structured to handle strategy, identity, website design and development, and supporting content so the final experience feels coherent.",
  },
  {
    question: "Do you offer one-off projects and retainers?",
    answer:
      "Yes. Some clients work with us for a one-time launch project while others stay on for content, social media, or ongoing creative support.",
  },
  {
    question: "How quickly can a project start?",
    answer:
      "That depends on scope and queue, but the fastest way to get clarity is to book a strategy call or message us on WhatsApp with your timeline.",
  },
])

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "" },
  { name: "Services", url: `${process.env.NEXT_PUBLIC_SITE_URL}/services` },
])

export function ServicesClientPage() {
  const { formatPrice } = useCurrency()

  return (
    <>
      <Analytics />
      {serviceSchemas.map((schema, index) => (
        <Script
          key={`service-schema-${index}`}
          id={`service-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Script
        id="services-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="services-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main className="bg-background pt-24 text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Services</p>
              <h1 className="mt-4 text-5xl font-serif font-bold tracking-tight md:text-6xl">
                The services we use to make brands clearer, more credible, and easier to choose.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                We do not treat brand, website, and content as separate problems. We shape them together so the business
                feels more trustworthy wherever people find you.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact">Start a Project</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-accent/30 bg-transparent" asChild>
                  <Link href="/packages">See Packages & Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {services.services.map((service) => (
                <article key={service.id} className="rounded-[1.75rem] border border-border bg-card p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-xl">
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">
                        Starting from {formatPrice(service.startingPrice)}
                      </p>
                      <h2 className="mt-4 text-3xl font-serif font-semibold tracking-tight">{service.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-medium text-accent">
                      Service area
                    </div>
                  </div>

                  <ul className="mt-8 grid gap-3 text-sm text-muted-foreground">
                    {(serviceDetails[service.id] ?? []).map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="max-w-xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">How engagements usually work</p>
                <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight md:text-5xl">
                  We help clients buy with more confidence by making scope visible early.
                </h2>
              </div>

              <div className="grid gap-5">
                {[
                  "We start with the outcome you need, not a generic package.",
                  "We recommend the smallest scope that solves the real problem.",
                  "If the brand needs strategy first, we say that before design starts.",
                  "If the website is the blocker, we show what has to change to improve conversion.",
                ].map((point, index) => (
                  <div key={point} className="rounded-[1.5rem] border border-border bg-card p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-accent/20 bg-accent px-7 py-8 text-accent-foreground">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent-foreground/80">When to reach out</p>
                <div className="mt-6 space-y-4 text-sm leading-7 text-accent-foreground/90">
                  <p>Your website looks dated or unclear and visitors are not taking action.</p>
                  <p>Your business has grown but the brand presentation still feels small or inconsistent.</p>
                  <p>You need one partner to connect strategy, visuals, and execution instead of managing multiple vendors.</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-7">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Next step</p>
                <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight">Choose a quick route to clarity.</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <a
                    href="https://calendar.app.google/TPjTbTnJ5f9ztbvz5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                  >
                    <CalendarDays className="h-5 w-5 text-accent" />
                    <h3 className="mt-4 text-lg font-semibold">Book a meeting</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Best for planning a project with multiple deliverables.</p>
                  </a>
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                  >
                    <MessageCircle className="h-5 w-5 text-accent" />
                    <h3 className="mt-4 text-lg font-semibold">Chat on WhatsApp</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Best for a quick budget check or scope question.</p>
                  </a>
                </div>
                <Button className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/packages">
                    Compare Packages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
