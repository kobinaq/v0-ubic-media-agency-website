"use client"

import Link from "next/link"
import Script from "next/script"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PageIntro } from "@/components/page-intro"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { FadeUp, TextReveal } from "@/components/home/text-reveal"
import { about } from "@/lib/content"
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema"

const stats = [
  { value: "123+", label: "Projects completed" },
  { value: "96+", label: "Happy clients" },
  { value: "5+", label: "Years experience" },
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

      <main className="bg-background text-foreground">
        <PageIntro
          eyebrow="About"
          meta={
            <>
              <span className="studio-label">The studio</span>
              <span className="studio-label">Accra, Ghana</span>
              <span className="studio-label">Strategy · Identity · Web · Social · Photo · Video · Print</span>
            </>
          }
          title={
            <h1 className="studio-display text-[clamp(1.65rem,4.75vw,3.6rem)]">
              A creative studio
              <span className="mt-1 block font-serif italic text-accent">for full brand work.</span>
            </h1>
          }
          aside={
            <p className="max-w-md text-sm leading-7 text-muted-foreground md:text-base md:leading-7">
              We handle strategy, identity, websites, social, photo, video, and print so your brand stays consistent
              everywhere.
            </p>
          }
        />

        <section className="border-b border-border px-5 py-24 md:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <FadeUp>
              <p className="studio-label-accent">the brief</p>
              <TextReveal className="studio-display mt-4 text-4xl md:text-5xl">
                Present everywhere, consistent everywhere.
              </TextReveal>
            </FadeUp>
            <StaggerChildren
              className="grid gap-8 text-lg leading-8 text-muted-foreground md:grid-cols-2"
              y={24}
              stagger={0.1}
            >
              {about.story.slice(0, 2).map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-accent"
                      : ""
                  }
                >
                  {paragraph}
                </p>
              ))}
            </StaggerChildren>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/20 px-5 py-24 md:px-8 lg:px-10">
          <StaggerChildren className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2" y={32} stagger={0.12}>
            <article className="border-t border-border pt-8">
              <p className="studio-label-accent">Our Mission</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">What we are here to do</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{about.mission}</p>
            </article>
            <article className="border-t border-border pt-8">
              <p className="studio-label-accent">Our Vision</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                What success should look like
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{about.vision}</p>
            </article>
          </StaggerChildren>
        </section>

        <section className="px-5 py-24 md:px-8 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <FadeUp className="max-w-2xl">
              <p className="studio-label-accent">why ubic</p>
              <TextReveal className="studio-display mt-4 text-4xl md:text-5xl">What makes us different</TextReveal>
            </FadeUp>

            <StaggerChildren className="mt-14 border-t border-border" y={26} stagger={0.1}>
              {about.differentiators.map((item, index) => (
                <article
                  key={item.title}
                  className="grid gap-6 border-b border-border py-9 lg:grid-cols-[80px_1fr]"
                >
                  <div className="font-mono text-sm tracking-[0.18em] text-accent">00-{index + 1}</div>
                  <div className="max-w-3xl">
                    <h3 className="font-serif text-3xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              ))}
            </StaggerChildren>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20 px-5 py-20 md:px-8 lg:px-10">
          <StaggerChildren className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-3" y={24} stagger={0.1}>
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-border pt-6">
                <div className="font-serif text-6xl font-semibold tracking-tight text-foreground">{stat.value}</div>
                <div className="mt-3 studio-label">{stat.label}</div>
              </div>
            ))}
          </StaggerChildren>
        </section>

        <section className="px-5 py-24 md:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <FadeUp>
              <p className="studio-label-accent">Our Promise</p>
              <TextReveal className="studio-display mt-4 text-4xl md:text-5xl">What you can expect</TextReveal>
            </FadeUp>
            <StaggerChildren className="border-t border-border" y={18} stagger={0.07}>
              {promises.map((promise, index) => (
                <div key={promise} className="grid grid-cols-[56px_1fr] gap-4 border-b border-border py-5">
                  <span className="font-mono text-xs tracking-[0.18em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-8">{promise}</p>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </section>

        <section className="border-t border-border bg-accent py-24 text-accent-foreground">
          <FadeUp className="mx-auto grid max-w-[1400px] gap-10 px-5 md:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
            <div>
              <p className="studio-label text-accent-foreground/75">Start a Brief</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight md:text-5xl">
                Tell us what is not working yet.
              </h2>
            </div>
            <Button
              size="lg"
              className="editorial-button bg-accent-foreground text-accent hover:bg-accent-foreground/90"
              asChild
            >
              <Link href="/contact" data-cursor="hover">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  )
}
