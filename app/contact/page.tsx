"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Check } from "lucide-react"
import { siteConfig } from "@/lib/content"
import { Analytics } from "@/components/analytics"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
      <main className="pt-24 min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-slow" />
        </div>

        {/* Split Screen Hero with Form */}
        <section className="min-h-[calc(100vh-6rem)] px-6 py-12 lg:py-0">
          <div className="mx-auto max-w-7xl h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-12rem)]">
              
              {/* Left Side - Hero Content */}
              <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                <div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance leading-tight">
                    Let's Create Something <span className="text-accent">Extraordinary</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Ready to transform your brand? Get in touch and let's start building your success story together.
                  </p>
                </div>
              </div>

              {/* Right Side - Floating Glass Form */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                <Card className="border-2 border-accent/20 bg-card/50 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-8 md:p-10">
                    <div className="space-y-6 mb-8">
                      <div>
                        <h2 className="text-2xl font-serif font-bold mb-2">Get in Touch</h2>
                        <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@company.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Contact Number *
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your project, goals, timeline, budget..."
                          rows={6}
                        />
                      </div>

                      {submitStatus === "success" && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Thank you! We'll get back to you soon.
                          </p>
                        </div>
                      )}
                      {submitStatus === "error" && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Something went wrong. Please try again.
                          </p>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>

                    {/* Contact Information Below Form */}
                    <div className="mt-10 pt-8 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-6">Or reach out directly:</p>
                      <div className="space-y-4">
                        {[
                          { icon: Phone, label: "Phone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}` },
                          { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
                          { icon: MapPin, label: "Location", value: siteConfig.contact.address, href: null }
                        ].map((item) => (
                          <div key={item.label} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">{item.label}</p>
                              {item.href ? (
                                <a href={item.href} className="text-sm font-medium hover:text-accent transition-colors">
                                  {item.value}
                                </a>
                              ) : (
                                <p className="text-sm font-medium">{item.value}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  )
}
