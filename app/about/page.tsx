"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { about } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { ArrowRight, Target, Lightbulb, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

// Intersection Observer hook
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
      }
    }, { threshold: 0.1, ...options })

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

export default function AboutPage() {
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
      description: "We begin by understanding your goals, audience, and market positioning to create a solid foundation."
    },
    {
      icon: Lightbulb,
      title: "Creative Excellence",
      description: "Our team brings your vision to life with innovative design and compelling storytelling that resonates."
    },
    {
      icon: Users,
      title: "Collaborative Process",
      description: "We work closely with you at every step, ensuring your voice is heard and your vision is realized."
    },
    {
      icon: TrendingUp,
      title: "Results Driven",
      description: "Every decision is made with measurable impact in mind, delivering solutions that drive real growth."
    }
  ]

  const promises = [
    "Transparent communication at every stage",
    "Deadlines we actually keep",
    "Quality that exceeds expectations",
    "Strategic thinking, not just execution",
    "Partnership, not just a transaction"
  ]

  return (
    <>
      <Analytics />
      <Header />
      <main className="pt-24">
        {/* Hero - Founder's Vision */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/50 via-background to-accent/10">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-block mb-8">
              <div className="h-px w-16 bg-accent mx-auto mb-6" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-8 text-balance leading-tight animate-fadeInUp">
              We Build Brands That <span className="text-accent font-normal">Matter</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-fadeInUp delay-200">
              Ubic Media Agency was founded on a simple belief: great brands aren't born from templates, they're crafted 
              through strategy, creativity, and an unwavering commitment to excellence.
            </p>
          </div>
        </section>

        {/* Mission & Vision - Enhanced */}
        <section ref={missionRef} className="py-24 px-6 bg-background border-y border-border">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <div className={`transition-all duration-700 ${missionInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                <div className="h-px w-12 bg-accent mb-6" />
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 tracking-tight">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  {about.mission}
                </p>
              </div>
              <div className={`transition-all duration-700 delay-200 ${missionInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                <div className="h-px w-12 bg-accent mb-6" />
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 tracking-tight">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                  {about.vision}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section ref={approachRef} className="py-32 px-6 bg-secondary/20">
          <div className="mx-auto max-w-6xl">
            <div className={`text-center mb-20 transition-all duration-700 ${approachInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <div className="h-px w-16 bg-accent mx-auto mb-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-tight">How We Work</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                Our proven process ensures every project delivers exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {approach.map((item, index) => (
                <div
                  key={item.title}
                  className={`group p-8 border border-border hover:border-accent/50 rounded-lg transition-all duration-700 hover:shadow-lg hover:shadow-accent/10 ${
                    approachInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-serif font-light mb-4 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section ref={diffRef} className="py-32 px-6 bg-background">
          <div className="mx-auto max-w-5xl">
            <div className={`text-center mb-20 transition-all duration-700 ${diffInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <div className="h-px w-16 bg-accent mx-auto mb-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-tight">
                Why Choose Ubic
              </h2>
            </div>

            <div className="space-y-0">
              {about.differentiators.map((item, index) => (
                <div
                  key={index}
                  className={`group border-t border-border last:border-b transition-all duration-700 ${
                    diffInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="py-10 px-6 hover:bg-accent/5 transition-colors duration-300">
                    <div className="flex items-start gap-8">
                      <div className="flex-shrink-0 w-16">
                        <span className="text-5xl font-serif font-light text-accent/30 group-hover:text-accent transition-colors duration-300">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-serif font-light mb-3 group-hover:text-accent transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed font-light">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section ref={statsRef} className="py-24 px-6 bg-secondary/20 border-y border-border">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { label: 'Projects Completed', value: projectsCount, suffix: '+' },
                { label: 'Happy Clients', value: clientsCount, suffix: '+' },
                { label: 'Years Experience', value: yearsCount, suffix: '' }
              ].map((stat, i) => (
                <div 
                  key={stat.label} 
                  className={`text-center transition-all duration-700 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="mb-4">
                    <span className="text-6xl md:text-7xl font-serif font-bold text-foreground tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-6xl md:text-7xl font-serif font-bold text-accent">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section ref={promiseRef} className="py-32 px-6 bg-background">
          <div className="mx-auto max-w-4xl">
            <div className={`text-center mb-16 transition-all duration-700 ${promiseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <div className="h-px w-16 bg-accent mx-auto mb-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-tight">
                Our Promise to You
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                When you work with Ubic, you can expect:
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {promises.map((promise, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-700 ${
                    promiseInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-3 flex-shrink-0" />
                  <p className="text-lg text-foreground font-light leading-relaxed">
                    {promise}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 bg-accent text-accent-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-balance">
              Let's Build Something Great Together
            </h2>
            <p className="text-lg mb-12 text-accent-foreground/90 leading-relaxed max-w-2xl mx-auto font-light">
              Whether you're launching a new brand or transforming an existing one, we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent-foreground hover:bg-accent-foreground/90 text-accent group"
                asChild
              >
                <Link href="/contact">
                  Start Your Project <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10 bg-transparent"
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
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
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
