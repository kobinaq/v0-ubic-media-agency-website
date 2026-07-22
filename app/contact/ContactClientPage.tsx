"use client"

import type React from "react"
import { useState } from "react"
import { CalendarDays, Check, Mail, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/content"
import { PageIntro } from "@/components/page-intro"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { FadeUp } from "@/components/home/text-reveal"

const contactRoutes = [
  {
    title: "Chat on WhatsApp",
    description: "Best for quick questions, budget checks, and faster back-and-forth.",
    href: siteConfig.contact.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    title: "Book a call",
    description: "Best for projects that need strategy, multiple services, or a rollout plan.",
    href: "https://calendar.app.google/TPjTbTnJ5f9ztbvz5",
    icon: CalendarDays,
    external: true,
  },
  {
    title: "Email us",
    description: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    title: "Based in Accra",
    description: siteConfig.contact.address,
    icon: MapPin,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />

      <main className="bg-background text-foreground">
        <PageIntro
          eyebrow="Contact"
          meta={
            <>
              <span className="studio-label">Start a project</span>
              <span className="studio-label">Reply in one day</span>
              <span className="studio-label">Accra, Ghana</span>
            </>
          }
          title={
            <h1 className="studio-display text-5xl md:text-6xl lg:text-[6rem]">
              Tell us what you need.
            </h1>
          }
          aside={
            <div>
              <p className="text-lg leading-8 text-muted-foreground">
                Strategy, identity, websites, social, photo, video, or print. Send a brief, WhatsApp us, or book a call.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Any of our services, or a mix",
                  "Rough budget and timeline help",
                  "We reply within one working day",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <section className="border-b border-border px-5 py-16 md:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="issue-label">How we work</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                A clear next step for your brand.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Ubic Media Agency helps businesses in Accra and worldwide sharpen brand identity, launch clearer
                websites, and build content systems that support growth. Whether you need a full rebrand, a focused
                website rebuild, or ongoing creative support, tell us what you are trying to achieve and we will
                recommend the right path.
              </p>
            </div>
            <div className="space-y-5 border-t border-border pt-6 text-sm leading-7 text-muted-foreground md:border-t-0 md:border-l md:pl-10 md:pt-0">
              <p>
                Share your goals, timeline, and budget range so we can respond with a practical recommendation instead
                of a generic sales pitch.
              </p>
              <p>
                Based opposite Shooting Stars Community School in Adenta, Accra, we work remotely with clients across
                Ghana and international markets.
              </p>
              <p>
                Prefer messaging? Reach us on WhatsApp, email {siteConfig.contact.email}, or book a strategy call when
                you want a deeper walkthrough.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-20 md:px-8 lg:px-10">
          <StaggerChildren className="mx-auto grid max-w-[1400px] gap-8 sm:grid-cols-2 lg:grid-cols-4" y={28} stagger={0.08}>
            {contactRoutes.map((route, index) => {
              const Icon = route.icon
              const content = (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.18em] text-accent">00-{index + 1}</span>
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="mt-6 font-serif text-2xl font-semibold">{route.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{route.description}</p>
                </>
              )

              if (!route.href) {
                return (
                  <div key={route.title} className="border-t border-border pt-6">
                    {content}
                  </div>
                )
              }

              return (
                <a
                  key={route.title}
                  href={route.href}
                  target={route.external ? "_blank" : undefined}
                  rel={route.external ? "noopener noreferrer" : undefined}
                  className="border-t border-border pt-6 transition-colors hover:text-accent"
                  data-cursor="hover"
                >
                  {content}
                </a>
              )
            })}
          </StaggerChildren>
        </section>

        <section className="px-5 py-24 md:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <FadeUp>
            <form onSubmit={handleSubmit} className="border border-foreground bg-card p-8 md:p-10">
              <div className="mb-8 border-b border-border pb-6">
                <p className="issue-label">Project Enquiry</p>
                <h2 className="mt-4 text-3xl font-serif font-semibold">Send a brief</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Keep it simple. We just need enough context to guide you well.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em]">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em]">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em]">
                    Phone or WhatsApp Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-[0.16em]">
                    Project Details
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need, what stage the business is at, and any timeline or budget context."
                    rows={7}
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="border border-green-500/30 bg-green-500/10 p-4" role="status" aria-live="polite">
                    <p className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <Check className="h-4 w-4" />
                      Thanks. Your message is in and we will get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="border border-red-500/30 bg-red-500/10 p-4" role="alert" aria-live="assertive">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  </div>
                )}

                <Button type="submit" size="lg" className="editorial-button w-full bg-foreground text-background hover:bg-accent" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Project Brief"}
                </Button>
              </div>
            </form>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
