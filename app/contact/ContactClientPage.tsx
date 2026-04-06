"use client"

import type React from "react"
import { useState } from "react"
import { CalendarDays, Check, Mail, MapPin, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/lib/content"
import { Analytics } from "@/components/analytics"

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
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Contact</p>
                <h1 className="mt-4 text-5xl font-serif font-bold tracking-tight md:text-6xl">
                  Tell us what you are building and we will help you choose the right next step.
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  If you already know what you need, send a quick brief. If you are still figuring out scope, use
                  WhatsApp or book a short call and we will help you narrow it down.
                </p>

                <div className="mt-10 space-y-4">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[1.75rem] border border-border bg-card p-6 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                >
                  <MessageCircle className="h-5 w-5 text-accent" />
                  <h2 className="mt-4 text-xl font-serif font-semibold">Chat on WhatsApp</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">Best for quick questions, budget checks, and faster back-and-forth.</p>
                </a>
                <a
                  href="https://calendar.app.google/TPjTbTnJ5f9ztbvz5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[1.75rem] border border-border bg-card p-6 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                >
                  <CalendarDays className="h-5 w-5 text-accent" />
                  <h2 className="mt-4 text-xl font-serif font-semibold">Book a call</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">Best for projects that need strategy, multiple services, or a rollout plan.</p>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="rounded-[1.75rem] border border-border bg-card p-6 transition-colors hover:border-accent/50 hover:bg-accent/[0.04]"
                >
                  <Mail className="h-5 w-5 text-accent" />
                  <h2 className="mt-4 text-xl font-serif font-semibold">Email us</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{siteConfig.contact.email}</p>
                </a>
                <div className="rounded-[1.75rem] border border-border bg-card p-6">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h2 className="mt-4 text-xl font-serif font-semibold">Based in Accra</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
            <div className="rounded-[2rem] border border-accent/20 bg-accent px-7 py-8 text-accent-foreground">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent-foreground/80">Helpful brief guide</p>
              <div className="mt-6 space-y-5">
                {[
                  "What are you trying to launch, improve, or fix?",
                  "Which service do you think you need most right now?",
                  "Do you have a timeline, budget range, or launch date in mind?",
                  "What is not working well with your current brand or website?",
                ].map((item, index) => (
                  <div key={item} className="border-t border-accent-foreground/15 pt-5 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-accent-foreground/75">Prompt {index + 1}</p>
                    <p className="mt-2 text-sm leading-7 text-accent-foreground/92">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="rounded-[2rem] border border-border bg-card shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
              <CardContent className="p-8 md:p-10">
                <div className="mb-8">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Project enquiry</p>
                  <h2 className="mt-4 text-3xl font-serif font-bold">Send a brief</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Keep it simple. We just need enough context to guide you well.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
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
                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
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
                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
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
                    <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                      <p className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                        <Check className="h-4 w-4" />
                        Thanks. Your message is in and we will get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                      <p className="text-sm text-red-700 dark:text-red-300">Something went wrong. Please try again or contact us directly.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Project Brief"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
