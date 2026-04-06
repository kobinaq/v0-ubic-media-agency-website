import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { ArrowRight, CalendarDays, Check, ChevronRight, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { about, packages, services, siteConfig } from "@/lib/content"
import portfolioData from "@/content/portfolio.json"
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema"

const formatGHS = (amount: number) => `GHS ${amount.toLocaleString("en-GH")}`

const primaryServices = services.services.filter((service) =>
  ["brand-identity", "web-design", "social-media"].includes(service.id),
)

const pricingHighlights = [
  packages.packages.find((pkg) => pkg.id === "brand-starter"),
  packages.packages.find((pkg) => pkg.id === "website-starter"),
  packages.packages.find((pkg) => pkg.id === "social-starter"),
].filter(Boolean)

const featuredProjects = portfolioData.projects.filter((project) =>
  ["nexus-it", "website", "starbites-food"].includes(project.id),
)

const proofStats = [
  { value: "120+", label: "Projects delivered" },
  { value: "90+", label: "Client collaborations" },
  { value: "5+", label: "Years building brands" },
]

const processSteps = [
  {
    title: "Clarify the strategy",
    description: "We align on your audience, offer, goals, and what the website or brand needs to do commercially.",
  },
  {
    title: "Shape the message",
    description: "We build the positioning, structure, and visual direction so your brand feels clear and credible.",
  },
  {
    title: "Design the experience",
    description: "We create the website, identity, and content system with conversion, trust, and mobile usability in mind.",
  },
  {
    title: "Launch and support",
    description: "We help you go live with confidence and stay available for refinement, updates, and rollout support.",
  },
]

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

      <main className="bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border pt-28">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(196,167,110,0.12),transparent_35%),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <div className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-accent">
                Brand identity, websites, and content systems
              </div>

              <h1 className="max-w-4xl text-5xl font-serif font-bold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
                Build a brand people trust and a website that helps them act.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Ubic helps ambitious businesses look sharper, sound clearer, and convert better through brand strategy,
                website design, and content-led creative support.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group" asChild>
                  <Link href="/contact">
                    Book a Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-accent/30 bg-background/60" asChild>
                  <Link href="/portfolio">See Selected Work</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {["Clear positioning", "Conversion-focused websites", "Transparent starting prices"].map((item) => (
                  <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2">
                    <Check className="h-4 w-4 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 self-start">
              <div className="rounded-[2rem] border border-accent/20 bg-card/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Best fit</p>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">High-intent brands</span>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Businesses ready to upgrade how they present themselves online.</p>
                  <p>Founders who need a more premium identity before launch or expansion.</p>
                  <p>Teams who want one creative partner across strategy, design, and rollout.</p>
                </div>
                <div className="mt-6 rounded-2xl border border-border bg-background/75 p-4">
                  <p className="text-sm font-semibold">Most requested outcomes</p>
                  <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-accent" />
                      <span>A website that feels more credible and easier to navigate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-accent" />
                      <span>A sharper brand identity that looks consistent across touchpoints</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-accent" />
                      <span>Content and visuals that make the brand easier to remember</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-card/70 p-4">
                    <div className="text-3xl font-serif font-bold text-accent">{stat.value}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Trusted by teams including</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-foreground/80">
                {about.clients.map((client) => (
                  <span key={client}>{client}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">What we help you fix</p>
              <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight md:text-5xl">
                When the brand feels unclear, the website usually underperforms too.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                We focus on the parts that affect trust and action most: positioning, visual identity, website clarity,
                content structure, and rollout consistency.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {primaryServices.map((service) => (
                <div
                  key={service.id}
                  className="group rounded-[1.75rem] border border-border bg-card p-7 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">From {formatGHS(service.startingPrice)}</p>
                    <div className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent">
                      Core offer
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-serif font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.description}</p>
                  <Link
                    href="/services"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    Explore service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Selected work</p>
                <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight md:text-5xl">
                  Work that helps brands look more serious, polished, and usable.
                </h2>
              </div>
              <Button variant="outline" className="border-accent/30 bg-transparent" asChild>
                <Link href="/portfolio">View Full Portfolio</Link>
              </Button>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <article key={project.id} className="overflow-hidden rounded-[1.75rem] border border-border bg-card">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {project.category}
                    </div>
                    <h3 className="text-2xl font-serif font-semibold">{project.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">How we work</p>
              <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight md:text-5xl">
                A process built for clarity, not endless revisions.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Buyers convert better when the message is sharp and the experience feels easy. Our process is designed
                to get there faster.
              </p>
            </div>

            <div className="space-y-5">
              {processSteps.map((step, index) => (
                <div key={step.title} className="rounded-[1.5rem] border border-border bg-card p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Starting prices</p>
              <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight md:text-5xl">
                Transparent entry points for the services clients ask about most.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                You should not need a discovery call just to understand whether we are in your budget range.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {pricingHighlights.map((pkg) => (
                <div key={pkg.id} className="rounded-[1.75rem] border border-border bg-card p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">{pkg.service}</p>
                  <h3 className="mt-4 text-2xl font-serif font-semibold">{pkg.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{pkg.description}</p>
                  <div className="mt-6 text-4xl font-serif font-bold">{formatGHS(pkg.priceGHS)}</div>
                  <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                    {pkg.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button size="lg" variant="outline" className="border-accent/30 bg-transparent" asChild>
                <Link href="/packages">
                  Explore All Packages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-accent/20 bg-accent px-7 py-8 text-accent-foreground">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent-foreground/80">Why clients choose Ubic</p>
                <div className="mt-6 space-y-5">
                  {about.differentiators.slice(0, 3).map((item) => (
                    <div key={item.title} className="border-t border-accent-foreground/15 pt-5 first:border-t-0 first:pt-0">
                      <h3 className="text-xl font-serif font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-accent-foreground/85">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card p-7">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Ready to move?</p>
                <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight">Pick the next step that fits your buying style.</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <a
                    href="https://calendar.app.google/TPjTbTnJ5f9ztbvz5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                  >
                    <CalendarDays className="h-5 w-5 text-accent" />
                    <h3 className="mt-4 text-lg font-semibold">Book a call</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Best if you want to talk through goals, scope, and timing live.
                    </p>
                  </a>
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[1.5rem] border border-border bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                  >
                    <MessageCircle className="h-5 w-5 text-accent" />
                    <h3 className="mt-4 text-lg font-semibold">Message on WhatsApp</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Best if you want a quick answer, budget check, or a faster start.
                    </p>
                  </a>
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-border bg-background p-5">
                  <p className="text-sm font-medium">Prefer email?</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Reach us at{" "}
                    <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-accent hover:text-accent/80">
                      {siteConfig.contact.email}
                    </a>
                    {" "}or use the contact form for a project brief.
                  </p>
                  <Button className="mt-5 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href="/contact">Go to Contact Form</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
