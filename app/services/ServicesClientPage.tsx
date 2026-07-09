"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { ArrowRight, Check, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Analytics } from "@/components/analytics"
import { Button } from "@/components/ui/button"
import { PageIntro } from "@/components/page-intro"
import { FadeUp } from "@/components/home/text-reveal"
import { services, siteConfig } from "@/lib/content"
import { useCurrency } from "@/lib/currency"
import { OUTCOMES, type OutcomeId } from "@/lib/outcomes"
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema"
import { cn } from "@/lib/utils"

const serviceById = Object.fromEntries(services.services.map((s) => [s.id, s]))

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
    question: "How do services relate to packages?",
    answer:
      "Services describe what we do. Packages are priced entry points for that work. Pick the outcome that matches your situation, then open packages filtered to that path.",
  },
  {
    question: "How quickly can a project start?",
    answer:
      "That depends on scope and queue. Book a strategy call or message us on WhatsApp with your timeline for the fastest clarity.",
  },
])

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "" },
  { name: "Services", url: `${process.env.NEXT_PUBLIC_SITE_URL}/services` },
])

const serviceSchemas = services.services.map((service) => generateServiceSchema(service))

export function ServicesClientPage() {
  const { formatPrice } = useCurrency()
  const [activeId, setActiveId] = useState<OutcomeId>("unclear-brand")

  const active = useMemo(() => OUTCOMES.find((o) => o.id === activeId) ?? OUTCOMES[0], [activeId])

  const activeServices = useMemo(
    () => active.serviceIds.map((id) => serviceById[id]).filter(Boolean),
    [active],
  )

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

      <main className="bg-background text-foreground">
        <PageIntro
          eyebrow="Services"
          meta={
            <>
              <span className="studio-label">All services</span>
              <span className="studio-label">Strategy · Identity · Web · Social</span>
              <span className="studio-label">Photo · Video · Print</span>
            </>
          }
          title={
            <h1 className="studio-display text-3xl sm:text-4xl md:text-6xl lg:text-[5.25rem]">
              What we do.
            </h1>
          }
          description="Strategy, identity, websites, social, photo, video, and print. Pick what is stuck and we will show the right work."
        />

        {/* Outcome map: accordion on mobile, list + sticky panel on desktop */}
        <section className="border-b border-border px-5 py-16 md:px-8 md:py-24 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <p className="studio-label-accent mb-6">What is not working yet?</p>

            {/* Mobile accordion */}
            <div className="border-t border-border lg:hidden">
              {OUTCOMES.map((outcome) => {
                const isActive = outcome.id === activeId
                const outcomeServices = outcome.serviceIds.map((id) => serviceById[id]).filter(Boolean)
                return (
                  <div key={outcome.id} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setActiveId(outcome.id)}
                      className={cn(
                        "flex min-h-14 w-full items-start gap-4 py-5 text-left",
                        isActive && "bg-foreground/[0.03]",
                      )}
                      aria-expanded={isActive}
                    >
                      <span
                        className={cn(
                          "mt-1 shrink-0 font-mono text-xs tracking-[0.18em]",
                          isActive ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {outcome.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-xl font-semibold tracking-tight">{outcome.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{outcome.problem}</span>
                      </span>
                      <span className="mt-1 font-mono text-xs text-muted-foreground">{isActive ? "−" : "+"}</span>
                    </button>
                    {isActive && (
                      <div className="border-t border-border bg-card px-4 py-6 sm:px-5">
                        <p className="studio-label-accent">Where this lands</p>
                        <p className="mt-3 text-sm leading-7 text-foreground">{outcome.outcome}</p>
                        <p className="studio-label mt-6 mb-3">Services that solve this</p>
                        <ul className="space-y-3">
                          {outcomeServices.map((service) => (
                            <li key={service.id} className="border-b border-border/70 pb-3 last:border-0">
                              <p className="font-serif text-base font-semibold">{service.title}</p>
                              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                                from {formatPrice(service.startingPrice)}
                              </p>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-col gap-3">
                          <Button className="editorial-button min-h-11 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                            <Link href={`/packages?path=${outcome.pathId}`}>
                              See packages for this
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" className="editorial-button min-h-11 border-border bg-transparent" asChild>
                            <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Talk it through
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Desktop list + panel */}
            <div className="hidden gap-14 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-t border-border">
                {OUTCOMES.map((outcome) => {
                  const isActive = outcome.id === activeId
                  return (
                    <button
                      key={outcome.id}
                      type="button"
                      onClick={() => setActiveId(outcome.id)}
                      data-cursor="hover"
                      className={cn(
                        "group flex w-full items-baseline gap-6 border-b border-border py-6 text-left transition-colors",
                        isActive ? "bg-foreground/[0.03]" : "hover:bg-foreground/[0.02]",
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 font-mono text-xs tracking-[0.18em]",
                          isActive ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {outcome.number}
                      </span>
                      <span
                        className={cn(
                          "block flex-1 font-serif text-2xl font-semibold tracking-tight transition-transform duration-300",
                          isActive ? "text-foreground translate-x-1" : "text-foreground/80 group-hover:translate-x-1",
                        )}
                      >
                        {outcome.title}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.16em] transition-opacity",
                          isActive ? "text-accent opacity-100" : "opacity-0 group-hover:opacity-60",
                        )}
                      >
                        View →
                      </span>
                    </button>
                  )
                })}
              </div>

              <FadeUp key={active.id} className="sticky top-28 self-start">
                <div className="border border-border bg-card p-9">
                  <p className="studio-label">Path {active.number}</p>
                  <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight">{active.title}</h2>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">{active.problem}</p>

                  <div className="mt-8 border-t border-border pt-6">
                    <p className="studio-label-accent">Where this lands</p>
                    <p className="mt-3 text-lg leading-8 text-foreground">{active.outcome}</p>
                  </div>

                  <div className="mt-8 border-t border-border pt-6">
                    <p className="studio-label mb-4">Services that solve this</p>
                    <ul className="space-y-4">
                      {activeServices.map((service) => (
                        <li
                          key={service.id}
                          className="flex items-start justify-between gap-4 border-b border-border/70 pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-serif text-lg font-semibold tracking-tight">{service.title}</p>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                          <p className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                            from {formatPrice(service.startingPrice)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button className="editorial-button bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href={`/packages?path=${active.pathId}`} data-cursor="hover">
                        See packages for this
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="editorial-button border-border bg-transparent" asChild>
                      <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Talk it through
                      </a>
                    </Button>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* All services compact index */}
        <section className="px-5 py-20 md:px-8 md:py-24 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <FadeUp className="mb-12 max-w-xl">
              <p className="studio-label-accent">Full index</p>
              <h2 className="studio-display mt-3 text-3xl md:text-5xl">Everything we offer</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Prefer browsing by service name? Same work, different door.
              </p>
            </FadeUp>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.services.map((service, index) => (
                <FadeUp key={service.id} delay={index * 0.05}>
                  <div className="flex h-full flex-col border border-border bg-card p-6 transition-colors hover:border-accent/35">
                    <span className="font-mono text-xs tracking-[0.16em] text-accent">
                      00-{index + 1}
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight">{service.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p>
                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      From {formatPrice(service.startingPrice)}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Decision footer */}
        <section className="border-t border-border bg-secondary/25 px-5 py-20 md:px-8 lg:px-10">
          <FadeUp className="mx-auto max-w-[1400px]">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="studio-label-accent">Still unsure?</p>
                <h2 className="studio-display mt-4 text-4xl md:text-5xl">
                  You don’t need the perfect name for it.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
                  Tell us what is stuck: budget, timeline, or a rough brief. We will point you at the smallest scope that
                  actually helps.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {[
                    "Best path if you have a deadline",
                    "Best path if the brand and site both need work",
                    "Honest “start smaller” recommendations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button size="lg" className="editorial-button bg-foreground text-background hover:bg-accent" asChild>
                  <Link href="/packages" data-cursor="hover">
                    Browse all packages
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="editorial-button border-border bg-transparent" asChild>
                  <Link href="/contact" data-cursor="hover">
                    Send a brief
                  </Link>
                </Button>
              </div>
            </div>
          </FadeUp>
        </section>
      </main>

      <Footer />
    </>
  )
}
