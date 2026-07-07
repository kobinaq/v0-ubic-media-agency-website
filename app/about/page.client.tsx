"use client"

import Link from "next/link"
import Script from "next/script"
import { ArrowRight } from "lucide-react"
import { Analytics } from "@/components/analytics"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { about } from "@/lib/content"
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema"

const stats = [
  { value: "123+", label: "Projects completed" },
  { value: "96+", label: "Happy clients" },
  { value: "5", label: "Years experience" },
]

const promises = [
  "Transparent communication at every stage",
  "Deadlines we actually keep",
  "Quality that exceeds expectations",
  "Strategic thinking, not just execution",
  "Partnership, not just a transaction",
]

export function AboutClientPage() {
  const faqSchema = generateFAQSchema([
    {
      question: "What is Ubic Media Agency?",
      answer:
        "Ubic Media Agency is a full-service brand development agency that helps businesses transform ideas into meaningful, market-ready experiences through strategic design, creative storytelling, and digital innovation.",
    },
    {
      question: "What services does Ubic offer?",
      answer:
        "We offer social media content creation and management, website design and development, brand identity development, brand strategy consulting, and professional photography and videography services.",
    },
    {
      question: "How long has Ubic been in business?",
      answer:
        "Ubic Media Agency has been delivering exceptional creative solutions for 5+ years, working with brands across multiple industries.",
    },
    {
      question: "Where is Ubic located?",
      answer: "We are based in Accra, Ghana, and serve clients across Africa and globally.",
    },
    {
      question: "How can I work with Ubic?",
      answer:
        "You can reach out through our contact form, call us at +233 533 904 720, or email info@weareubic.com to discuss your project.",
    },
  ])

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "" },
    { name: "About", url: `${process.env.NEXT_PUBLIC_SITE_URL}/about` },
  ])

  return (
    <>
      <Analytics />
      <Script
        id="about-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="about-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main className="bg-background pt-24 text-foreground">
        <section className="editorial-grid border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span>Vol. 01 - About</span>
              <span>Accra, Ghana</span>
              <span>Strategy - Story - Systems</span>
            </div>

            <div className="grid gap-12 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="issue-label">The Studio</p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] md:text-6xl lg:text-[6.5rem]">
                  We build brands that
                  <span className="block font-serif italic text-accent">hold together.</span>
                </h1>
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-lg leading-8 text-muted-foreground">
                  Ubic Media Agency was founded on a simple belief: great brands are crafted through strategy,
                  creativity, and an unwavering commitment to consistency.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-24">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="issue-label">The Brief</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Present everywhere, consistent everywhere.
              </h2>
            </div>
            <div className="grid gap-8 text-lg leading-8 text-muted-foreground md:grid-cols-2">
              {about.story.slice(0, 2).map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-accent" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/15 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-8">
            <article className="border-t border-border pt-8">
              <p className="issue-label">Our Mission</p>
              <h2 className="mt-4 text-3xl font-serif font-semibold tracking-tight md:text-4xl">What we are here to do</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{about.mission}</p>
            </article>
            <article className="border-t border-border pt-8">
              <p className="issue-label">Our Vision</p>
              <h2 className="mt-4 text-3xl font-serif font-semibold tracking-tight md:text-4xl">What success should look like</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{about.vision}</p>
            </article>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="issue-label">Why Choose Ubic</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">What makes us different</h2>
            </div>

            <div className="mt-14 border-t border-border">
              {about.differentiators.map((item, index) => (
                <article key={item.title} className="grid gap-6 border-b border-border py-8 lg:grid-cols-[80px_1fr]">
                  <div className="font-mono text-sm tracking-[0.18em] text-accent">0{index + 1}</div>
                  <div className="max-w-3xl">
                    <h3 className="text-3xl font-serif font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/15 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-border pt-6">
                <div className="font-serif text-6xl font-semibold tracking-tight text-foreground">{stat.value}</div>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="issue-label">Our Promise</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">What you can expect</h2>
            </div>
            <div className="border-t border-border">
              {promises.map((promise, index) => (
                <div key={promise} className="grid grid-cols-[56px_1fr] gap-4 border-b border-border py-5">
                  <span className="font-mono text-xs tracking-[0.18em] text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-lg leading-8">{promise}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-accent py-24 text-accent-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
            <div>
              <p className="issue-label text-accent-foreground/75">Start a Brief</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Tell us what is not working yet.
              </h2>
            </div>
            <Button size="lg" className="editorial-button bg-accent-foreground text-accent hover:bg-accent-foreground/90" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
