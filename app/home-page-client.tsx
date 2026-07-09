"use client"

import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Analytics } from "@/components/analytics"
import { InteractiveHero } from "@/components/hero/interactive-hero"
import { WorkHoverList } from "@/components/home/work-hover-list"
import { ServicesPanel } from "@/components/home/services-panel"
import { Marquee } from "@/components/home/marquee"
import { TextReveal, FadeUp } from "@/components/home/text-reveal"
import { about, packages, services, siteConfig } from "@/lib/content"
import portfolioData from "@/content/portfolio.json"
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema"
import { Magnetic } from "@/components/animations/magnetic"
import { MobileCtaBar } from "@/components/mobile-cta-bar"

const formatGHS = (amount: number) => `GHS ${amount.toLocaleString("en-GH")}`

const primaryServices = [
  services.services.find((s) => s.id === "brand-identity"),
  services.services.find((s) => s.id === "web-design"),
  services.services.find((s) => s.id === "social-media"),
  services.services.find((s) => s.id === "photography-videography"),
  services.services.find((s) => s.id === "brand-strategy"),
].filter(Boolean) as (typeof services.services)[number][]

const featuredProjects = portfolioData.projects
  .filter((project) =>
    ["nexus-it", "starbites-food", "victory-foods-social", "richkev-social", "gordon-university", "starbites-event-coverage"].includes(
      project.id,
    ),
  )
  .map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    year: p.year,
    image: p.image,
    description: p.description,
  }))

const pricingHighlights = [
  packages.packages.find((pkg) => pkg.id === "brand-starter"),
  packages.packages.find((pkg) => pkg.id === "website-starter"),
  packages.packages.find((pkg) => pkg.id === "social-starter"),
].filter(Boolean) as NonNullable<(typeof packages.packages)[number]>[]

const faqSchema = generateFAQSchema([
  {
    question: "What does Ubic Media Agency help clients with?",
    answer:
      "We help businesses improve how they look, communicate, and convert through brand identity, websites, content systems, and creative production.",
  },
  {
    question: "Do you only work on websites?",
    answer:
      "No. We combine brand strategy, identity design, website design and development, social content, photography, and videography so the final experience feels consistent across channels.",
  },
  {
    question: "Can I see pricing before reaching out?",
    answer:
      "Yes. We show starting package prices so you can understand budget ranges early, then tailor scope based on your goals and timeline.",
  },
  {
    question: "Do you work with businesses outside Ghana?",
    answer:
      "Yes. Ubic works with brands in Ghana and across other markets, especially businesses that need a polished digital presence and stronger brand clarity.",
  },
  {
    question: "What is the best way to get started?",
    answer:
      "The fastest path is to book a strategy call or message us on WhatsApp. We will review your goals, current brand presence, and recommend the best next step.",
  },
])

const breadcrumbSchema = generateBreadcrumbSchema([{ name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "" }])

export default function HomePageClient() {
  return (
    <>
      <Analytics />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main className="bg-background pb-20 text-foreground md:pb-0">
        <InteractiveHero />

        <Marquee items={about.clients} speed={35} />

        {/* Selected work */}
        <section id="work" className="px-5 py-24 md:px-8 md:py-32 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="studio-label-accent">s e l e c t e d&nbsp;&nbsp;w o r k</p>
                <TextReveal className="studio-display mt-4 max-w-2xl text-3xl sm:text-4xl md:text-6xl">
                  Projects that earned the trust.
                </TextReveal>
              </div>
              <FadeUp>
                <Link href="/case-studies" className="studio-label text-foreground studio-link" data-cursor="hover">
                  view all work →
                </Link>
              </FadeUp>
            </div>

            <WorkHoverList projects={featuredProjects} />
          </div>
        </section>

        {/* Services */}
        <ServicesPanel services={primaryServices} formatPrice={formatGHS} />

        {/* About */}
        <section className="border-t border-border px-5 py-24 md:px-8 md:py-32 lg:px-10">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="studio-label-accent">About</p>
              <TextReveal className="studio-display mt-4 text-3xl sm:text-4xl md:text-6xl">
                Built to launch. Built to last.
              </TextReveal>
              <FadeUp className="mt-8 space-y-5 text-base leading-8 text-muted-foreground md:text-lg md:leading-9">
                <p>
                  Ubic is the studio behind brands that need lift. We turn strategy, identity, websites, social, photo,
                  video, and print into work that can leave the desk and hold up in the world.
                </p>
                <p>
                  A lean team in Accra. Clear thinking, sharp craft, and enough firepower to get ambitious brands off
                  the ground without the agency fog.
                </p>
              </FadeUp>
              <FadeUp className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8" delay={0.1}>
                {[
                  { n: "123+", l: "Projects" },
                  { n: "96+", l: "Clients" },
                  { n: "5+", l: "Years" },
                ].map((stat) => (
                  <div key={stat.l}>
                    <p className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">{stat.n}</p>
                    <p className="mt-1 studio-label">{stat.l}</p>
                  </div>
                ))}
              </FadeUp>
              <FadeUp className="mt-10" delay={0.15}>
                <Link href="/about" className="studio-label text-foreground studio-link" data-cursor="hover">
                  more about ubic →
                </Link>
              </FadeUp>
            </div>

            <FadeUp className="relative" delay={0.08}>
              <div className="studio-media relative aspect-[4/5] w-full border border-border">
                <Image
                  src="/hero-creative-workspace.jpg"
                  alt="Rocket launch from a creative desk, a metaphor for Ubic brand work taking off"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 border border-border bg-card p-5 shadow-sm md:-left-8 md:p-6">
                <p className="studio-label">The studio</p>
                <p className="mt-2 max-w-[12rem] font-serif text-xl font-semibold tracking-tight">
                  Accra-based. Ready for lift-off.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-border px-5 py-24 md:px-8 md:py-32 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-14 max-w-2xl">
              <p className="studio-label-accent">p r i c i n g</p>
              <TextReveal className="studio-display mt-4 text-4xl md:text-6xl">Clear starting points.</TextReveal>
              <FadeUp className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
                No discovery call required just to understand the budget range.
              </FadeUp>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {pricingHighlights.map((pkg, i) => (
                <FadeUp key={pkg.id} delay={i * 0.08}>
                  <div className="flex h-full flex-col border border-border bg-card p-7 transition-colors hover:border-accent/40">
                    <p className="studio-label">{pkg.service}</p>
                    <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight">{pkg.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{pkg.description}</p>
                    <p className="mt-8 font-serif text-4xl font-semibold tracking-tight">{formatGHS(pkg.priceGHS)}</p>
                    <Link
                      href="/packages"
                      className="mt-8 inline-flex border border-border px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent"
                      data-cursor="hover"
                    >
                      View package
                    </Link>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border px-5 py-24 md:px-8 md:py-32 lg:px-10">
          <div className="mx-auto max-w-[1400px] text-center">
            <p className="studio-label-accent">n e x t&nbsp;&nbsp;s t e p</p>
            <TextReveal className="studio-display mx-auto mt-6 max-w-4xl text-3xl sm:text-4xl md:text-6xl">
              Your brand deserves a sharper first impression.
            </TextReveal>
            <FadeUp className="mx-auto mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
              Book a strategy call or message us on WhatsApp. We&apos;ll map the right path for where you are now.
            </FadeUp>
            <FadeUp className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" delay={0.1}>
              <Magnetic strength={0.28}>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center bg-accent px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-foreground sm:w-auto"
                  data-cursor="hover"
                >
                  Start a project
                </Link>
              </Magnetic>
              <Magnetic strength={0.22}>
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center border border-border px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] sm:w-auto"
                  data-cursor="hover"
                >
                  WhatsApp
                </a>
              </Magnetic>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
      <MobileCtaBar />
    </>
  )
}
