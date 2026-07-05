"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { about } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { ArrowRight, Target, Lightbulb, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema"

// Intersection Observer hook
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, ...options },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isInView] as const
}

// Counter animation
function useCounter(end: number, duration = 2000, isInView: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isInView])

  return count
}

export function AboutClientPage() {
  const [missionRef, missionInView] = useInView()
  const [approachRef, approachInView] = useInView()
  const [diffRef, diffInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const [promiseRef, promiseInView] = useInView()

  const projectsCount = useCounter(123, 2000, statsInView)
  const clientsCount = useCounter(96, 2000, statsInView)
  const yearsCount = useCounter(5, 2000, statsInView)

  const approach = [
    {
      icon: Target,
      title: "Strategy First",
      description:
        "We begin by understanding your goals, audience, and market positioning to create a solid foundation.",
    },
    {
      icon: Lightbulb,
      title: "Creative Excellence",
      description:
        "Our team brings your vision to life with innovative design and compelling storytelling that resonates.",
    },
    {
      icon: Users,
      title: "Collaborative Process",
      description: "We work closely with you at every step, ensuring your voice is heard and your vision is realized.",
    },
    {
      icon: TrendingUp,
      title: "Results Driven",
      description:
        "Every decision is made with measurable impact in mind, delivering solutions that drive real growth.",
    },
  ]

  const promises = [
    "Transparent communication at every stage",
    "Deadlines we actually keep",
    "Quality that exceeds expectations",
    "Strategic thinking, not just execution",
    "Partnership, not just a transaction",
  ]

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
        {/* Hero - Founder's Vision */}
        <section className="relative overflow-hidden border-b border-border px-6 py-20">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(227,167,46,0.08),transparent_35%),linear-gradient(90deg,rgba(32,28,26,0.04)_1px,transparent_1px),linear-gradient(rgba(32,28,26,0.04)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <div className="absolute left-1/2 top-0 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.24em] text-accent">
              About
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-[-0.04em] leading-[0.95] md:text-6xl lg:text-7xl">
              We build brands that <span className="font-serif italic text-accent">matter.</span>
            </h1>
            <p className="mt-7 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Ubic Media Agency was founded on a simple belief: great brands are crafted through strategy, creativity,
              and an unwavering commitment to consistency.
            </p>
          </div>
        </section>

        {/* Mission & Vision - Enhanced */}
        <section ref={missionRef} className="border-b border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
              <div
                className={`transition-all duration-700 ${missionInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
              >
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Our Mission</p>
                <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">What we are here to do</h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{about.mission}</p>
              </div>
              <div
                className={`transition-all duration-700 delay-200 ${missionInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
              >
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Our Vision</p>
                <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">What success should look like</h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{about.vision}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section ref={approachRef} className="border-b border-border bg-secondary/15 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div
              className={`mb-16 text-center transition-all duration-700 ${approachInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">How We Work</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">A process built for clarity</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
                Our proven process ensures every project delivers exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {approach.map((item, index) => (
                <div
                  key={item.title}
                  className={`group border border-border bg-card p-8 transition-all duration-700 hover:border-accent/50 hover:bg-accent/5 ${
                    approachInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center border border-border bg-background transition-all duration-300 group-hover:scale-110 group-hover:border-accent/40">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="mb-4 text-2xl font-serif font-semibold tracking-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section ref={diffRef} className="px-6 py-24 bg-background">
          <div className="mx-auto max-w-5xl">
            <div
              className={`mb-16 text-center transition-all duration-700 ${diffInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Why Choose Ubic</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">What makes us different</h2>
            </div>

            <div className="space-y-0 border-t border-border">
              {about.differentiators.map((item, index) => (
                <div
                  key={index}
                  className={`group border-b border-border transition-all duration-700 ${
                    diffInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="px-0 py-8 hover:bg-accent/5 transition-colors duration-300">
                    <div className="flex items-start gap-8">
                      <div className="w-16 flex-shrink-0">
                        <span className="text-5xl font-serif font-semibold text-accent/30 group-hover:text-accent transition-colors duration-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="mb-3 text-2xl font-serif font-semibold tracking-tight group-hover:text-accent transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section ref={statsRef} className="border-y border-border bg-secondary/15 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
              {[
                { label: "Projects Completed", value: projectsCount, suffix: "+" },
                { label: "Happy Clients", value: clientsCount, suffix: "+" },
                { label: "Years Experience", value: yearsCount, suffix: "" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`border border-border bg-card p-8 text-center transition-all duration-700 ${statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="mb-4">
                    <span className="text-6xl md:text-7xl font-serif font-semibold tracking-tight text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-6xl md:text-7xl font-serif font-semibold text-accent">{stat.suffix}</span>
                  </div>
                  <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section ref={promiseRef} className="px-6 py-24 bg-background">
          <div className="mx-auto max-w-4xl">
            <div
              className={`mb-14 text-center transition-all duration-700 ${promiseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Our Promise to You</p>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">What you can expect</h2>
              <p className="mt-4 text-lg text-muted-foreground">When you work with Ubic, you can expect:</p>
            </div>

            <div className="mx-auto max-w-2xl space-y-6">
              {promises.map((promise, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-700 ${
                    promiseInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                  <p className="text-lg leading-relaxed text-foreground">{promise}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-accent px-6 py-24 text-accent-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-balance">
              Let's Build Something Great Together
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-accent-foreground/90">
              Whether you're launching a new brand or transforming an existing one, we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 group"
                asChild
              >
                <Link href="/contact">
                  Start Your Project{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent-foreground bg-transparent text-accent-foreground hover:bg-accent-foreground/10"
                asChild
              >
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInUp.delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  )
}
