import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react"
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
].filter(Boolean) as NonNullable<(typeof packages.packages)[number]>[]

const featuredProjects = portfolioData.projects.filter((project) =>
  ["nexus-it", "website", "starbites-food"].includes(project.id),
)

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
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(227,167,46,0.08),transparent_28%),linear-gradient(90deg,rgba(32,28,26,0.04)_1px,transparent_1px),linear-gradient(rgba(32,28,26,0.04)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <div className="absolute left-1/2 top-0 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8 lg:pb-20 lg:pt-12">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span>Vol. 01 - No. 04</span>
              <span>Accra, Ghana</span>
              <span>Brand - Web - Content</span>
            </div>

            <div className="mt-12 max-w-4xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center">
                  <Image src="/logo.png" alt={siteConfig.siteName} width={240} height={68} priority className="h-auto w-auto max-h-14" />
                </div>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] md:text-6xl lg:text-[6.5rem]">
                  Build a brand
                  <span className="block font-serif italic text-accent">people trust.</span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  Strategy, identity, websites, and content systems for ambitious businesses that need to look sharper and convert better.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="group bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href="/contact">
                      Book a Strategy Call
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-border bg-background/80" asChild>
                    <Link href="/portfolio">See Selected Work</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Trusted by teams including</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-foreground/80">
                {about.clients.map((client) => (
                  <span key={client}>{client}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">In This Issue</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                When the brand feels unclear, the website usually underperforms too.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                We focus on the parts that affect trust and action most: positioning, visual identity, website clarity, content structure, and rollout consistency.
              </p>
            </div>

            <div className="mt-14 border-t border-border">
              {primaryServices.map((service, index) => (
                <Link
                  key={service.id}
                  href="/services"
                  className="group grid gap-6 border-b border-border py-7 transition-colors hover:bg-card/60 lg:grid-cols-[72px_1fr_auto] lg:items-baseline lg:py-8"
                >
                  <span className="font-mono text-sm tracking-[0.16em] text-accent">0{index + 1}</span>
                  <span>
                    <span className="block text-2xl font-serif font-medium tracking-tight md:text-[2rem]">{service.title}</span>
                    <span className="mt-2 block max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{service.description}</span>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">From {formatGHS(service.startingPrice)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="border-y border-border bg-secondary/15 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Selected spreads</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                  Work that reads more serious, more polished, and easier to use.
                </h2>
              </div>
              <Button variant="outline" className="border-border bg-transparent" asChild>
                <Link href="/portfolio">View Full Portfolio</Link>
              </Button>
            </div>

            <div className="mt-14 space-y-16">
              {featuredProjects.map((project, index) => (
                <article
                  key={project.id}
                  className={`grid gap-8 border-b border-border pb-16 last:border-b-0 last:pb-0 lg:grid-cols-2 lg:items-center ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[5/4] overflow-hidden border border-border bg-card">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="retro-image object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-background px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground">
                      {project.category}
                    </div>
                  </div>
                  <div className="max-w-xl">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Fig. 0{index + 1}</p>
                    <h3 className="mt-4 text-3xl font-serif font-semibold tracking-tight md:text-[2.5rem]">{project.title}</h3>
                    <p className="mt-5 text-base leading-8 text-muted-foreground">{project.description}</p>
                    <Link href="/portfolio" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80">
                      Explore the case study
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="py-24">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">How we work</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                A process built for clarity, not endless revisions.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Buyers convert better when the message is sharp and the experience feels easy. Our process is designed to get there faster.
              </p>
            </div>

            <div className="space-y-5">
              {processSteps.map((step, index) => (
                <div key={step.title} className="grid gap-4 border border-border bg-card p-6 md:grid-cols-[84px_1fr] md:gap-6 md:p-7">
                  <div className="font-serif text-4xl italic text-accent">0{index + 1}</div>
                  <div>
                    <h3 className="text-2xl font-serif font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-accent text-accent-foreground">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent-foreground/75">On Record</p>
            <blockquote className="mt-6 max-w-4xl font-serif text-3xl leading-[1.25] md:text-5xl">
              "They asked harder questions about our business than our board does - the brand work was just where it landed first."
            </blockquote>
            <div className="mt-6 flex items-center gap-4 text-sm uppercase tracking-[0.22em] text-accent-foreground/75">
              <span className="h-10 w-10 rounded-full bg-paper/90" />
              <span>Managing Director, Retail Group - Accra</span>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Starting prices</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Transparent entry points for the services clients ask about most.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                You should not need a discovery call just to understand whether we are in your budget range.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {pricingHighlights.map((pkg) => (
                <div key={pkg.id} className="border border-border bg-card p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">{pkg.service}</p>
                  <h3 className="mt-4 text-2xl font-serif font-semibold">{pkg.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{pkg.description}</p>
                  <div className="mt-6 text-4xl font-serif font-semibold tracking-tight">{formatGHS(pkg.priceGHS)}</div>
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
              <Button size="lg" variant="outline" className="border-border bg-transparent" asChild>
                <Link href="/packages">
                  Explore All Packages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/20 py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div className="border border-border bg-accent p-7 text-accent-foreground">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent-foreground/75">Why clients choose Ubic</p>
              <div className="mt-6 space-y-5">
                {about.differentiators.slice(0, 3).map((item) => (
                  <div key={item.title} className="border-t border-accent-foreground/15 pt-5 first:border-t-0 first:pt-0">
                    <h3 className="text-xl font-serif font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-accent-foreground/85">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-card p-7">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Ready to move?</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Pick the next step that fits your buying style.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <a
                  href="https://calendar.app.google/TPjTbTnJ5f9ztbvz5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/5"
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
                  className="border border-border bg-background p-5 transition-colors hover:border-accent/50 hover:bg-accent/5"
                >
                  <MessageCircle className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 text-lg font-semibold">Message on WhatsApp</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Best if you want a quick answer, budget check, or a faster start.
                  </p>
                </a>
              </div>

              <div className="mt-8 border border-border bg-background p-5">
                <p className="text-sm font-medium">Prefer email?</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Reach us at{" "}
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-accent hover:text-accent/80">
                    {siteConfig.contact.email}
                  </a>
                  {" "}or use the contact form for a project brief.
                </p>
                <Button className="mt-5 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="/contact">Go to Contact Form</Link>
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
