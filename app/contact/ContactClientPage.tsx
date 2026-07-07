"use client"

import type React from "react"
import { useState } from "react"
import { CalendarDays, Check, Mail, MapPin, MessageCircle } from "lucide-react"
import { Analytics } from "@/components/analytics"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/content"

const briefPrompts = [
  "What are you trying to launch, improve, or fix?",
  "Which service do you think you need most right now?",
  "Do you have a timeline, budget range, or launch date in mind?",
  "What is not working well with your current brand or website?",
]

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
  const web3FormsAccessKey = "726b78c9-6173-49f7-8c34-5e7cacf58af1"
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
      const payload = new FormData()
      payload.append("access_key", web3FormsAccessKey)
      payload.append("name", formData.name)
      payload.append("email", formData.email)
      payload.append("phone", formData.phone)
      payload.append("message", formData.message)
      payload.append("subject", "New contact form submission from UBIC website")

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Analytics />
      <Header />

      <main className="bg-background pt-24 text-foreground">
        <section className="editorial-grid border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span>Vol. 01 - Start a Brief</span>
              <span>Reply within one working day</span>
              <span>Accra, Ghana</span>
            </div>
            <div className="grid gap-12 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div>
                <p className="issue-label">Contact</p>
                <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.04em] md:text-6xl lg:text-[6rem]">
                  Tell us what is not
                  <span className="block font-serif italic text-accent">working yet.</span>
                </h1>
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-lg leading-8 text-muted-foreground">
                  If you already know what you need, send a quick brief. If scope is still fuzzy, use WhatsApp or book a
                  short call and we will help you narrow it down.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    "Best for launch projects, rebrands, and website upgrades",
                    "Useful if you need help choosing between strategy, identity, and web design",
                    "We usually reply within one working day",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {contactRoutes.map((route, index) => {
              const Icon = route.icon
              const content = (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.18em] text-accent">0{index + 1}</span>
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="mt-6 text-2xl font-serif font-semibold">{route.title}</h2>
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
                >
                  {content}
                </a>
              )
            })}
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
            <aside className="bg-accent px-7 py-8 text-accent-foreground">
              <p className="issue-label text-accent-foreground/80">Helpful Brief Guide</p>
              <div className="mt-8 space-y-0 border-t border-accent-foreground/20">
                {briefPrompts.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-accent-foreground/20 py-5 sm:grid-cols-[84px_1fr]">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground/65">Prompt {index + 1}</p>
                    <p className="text-sm leading-7 text-accent-foreground/90">{item}</p>
                  </div>
                ))}
              </div>
            </aside>

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
                  <div className="border border-green-500/30 bg-green-500/10 p-4">
                    <p className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <Check className="h-4 w-4" />
                      Thanks. Your message is in and we will get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="border border-red-500/30 bg-red-500/10 p-4">
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
