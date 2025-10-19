"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { services } from "@/lib/content"
import { Analytics } from "@/components/analytics"
import portfolioData from "@/content/portfolio.json"

// Typed text animation hook
function useTypedText(words: string[], typingSpeed = 150, deletingSpeed = 100, delayBetweenWords = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), delayBetweenWords)
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1))
        } else {
          setIsDeleting(false)
          setWordIndex((wordIndex + 1) % words.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords])

  return text
}

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

// Counter animation hook
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

// Helper: pick featured projects
function pickFeatured(projects: any[], n = 3) {
  const byCategory = projects.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || []
    acc[p.category].push(p)
    return acc
  }, {})

  const categories = Object.keys(byCategory)
  const chosen: any[] = []

  for (let i = categories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[categories[i], categories[j]] = [categories[j], categories[i]]
  }

  for (const cat of categories) {
    if (chosen.length >= n) break
    const list = byCategory[cat]
    if (list && list.length) {
      const project = list[Math.floor(Math.random() * list.length)]
      chosen.push(project)
    }
  }

  if (chosen.length < n) {
    const remaining = projects.filter((p) => !chosen.find((c) => c.id === p.id))
    while (chosen.length < n && remaining.length) {
      chosen.push(remaining.shift())
    }
  }

  return chosen
}

export default function HomePage() {
  const [featured] = useState(() => pickFeatured(portfolioData.projects, 6))
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const typedService = useTypedText(['Photography', 'Websites', 'Brands', 'Stories', 'Campaigns'])
  
  const [servicesRef, servicesInView] = useInView()
  const [workRef, workInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const [whyRef, whyInView] = useInView()

  const projectsCount = useCounter(123, 2000, statsInView)
  const clientsCount = useCounter(96, 2000, statsInView)
  const yearsCount = useCounter(5, 2000, statsInView)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <Analytics />
      <Header />
      <main>
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
          {/* Animated Background - placeholder for video */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float opacity-40" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed opacity-30" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow opacity-20" />
            
            {/* Parallax overlay */}
            <div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"
              style={{
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
              }}
            />
          </div>

          <div className="mx-auto max-w-5xl text-center relative z-10">
            {/* Animated headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 text-balance leading-tight">
              <span className="inline-block animate-fadeInUp">Bold Ideas.</span>{' '}
              <span className="inline-block animate-fadeInUp delay-200 text-accent">Real Impact.</span>
            </h1>

            {/* Typed text effect */}
            <div className="h-16 mb-8">
              <p className="text-2xl md:text-3xl font-medium">
                We create <span className="text-accent font-bold">{typedService}</span>
                <span className="animate-blink">|</span>
              </p>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed animate-fadeInUp delay-400">
              We help ambitious brands stand out through design, strategy, and storytelling that spark emotion. 
              From websites to social media, photography, video, and print, we turn bold ideas into visuals that move people.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-600">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group" asChild>
                <Link href="/contact">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 hover:bg-accent/10 bg-transparent"
                asChild
              >
                <Link href="/portfolio">Explore Our Work</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 px-6 border-y border-border bg-secondary/20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { label: 'Projects Completed', value: projectsCount, suffix: '+' },
                { label: 'Happy Clients', value: clientsCount, suffix: '+' },
                { label: 'Years Experience', value: yearsCount, suffix: '' }
              ].map((stat, i) => (
                <div 
                  key={stat.label} 
                  className={`text-center transition-all duration-700 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-5xl md:text-6xl font-serif font-bold text-accent mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Services Section - 3D Floating Cards */}
        <section ref={servicesRef} className="py-32 px-6 bg-secondary/30 border-b border-border overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className={`mb-20 transition-all duration-700 ${servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">What We Create</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Full-spectrum brand solutions designed to elevate your presence and drive measurable results.
              </p>
            </div>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              style={{ perspective: '1500px' }}
            >
              {services.services.slice(0, 6).map((service, index) => (
                <div
                  key={service.id}
                  className={`service-card group relative transition-all duration-700 ${
                    servicesInView ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transformStyle: 'preserve-3d',
                    transform: servicesInView ? 'translateZ(0)' : 'translateZ(-100px)'
                  }}
                  onMouseMove={(e) => {
                    const card = e.currentTarget
                    const rect = card.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const centerX = rect.width / 2
                    const centerY = rect.height / 2
                    const rotateX = (y - centerY) / 10
                    const rotateY = (centerX - x) / 10
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
                  }}
                >
                  <div className="relative h-full bg-card rounded-2xl border-2 border-accent/20 overflow-hidden shadow-2xl group-hover:shadow-accent/20 transition-shadow duration-500">
                    {/* Floating gradient orb */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" 
                         style={{ transform: 'translateZ(30px)' }} />
                    
                    {/* Content */}
                    <div className="relative p-8 h-full flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Number Badge */}
                      <div 
                        className="absolute top-6 right-6 w-16 h-16 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <span className="text-2xl font-serif font-bold text-accent">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Icon */}
                      <div 
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 group-hover:from-accent/30 group-hover:to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        <div className="w-6 h-6 rounded-full bg-accent" />
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-2xl font-serif font-bold mb-4 group-hover:text-accent transition-colors duration-300"
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p 
                        className="text-muted-foreground leading-relaxed flex-grow"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        {service.description}
                      </p>

                      {/* Hover indicator */}
                      <div 
                        className="mt-6 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        <span className="text-sm">Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/5 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Bottom glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button
                variant="outline"
                size="lg"
                className="border-accent/30 hover:bg-accent/10 bg-transparent group"
                asChild
              >
                <Link href="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Work - Masonry Style */}
        <section ref={workRef} className="py-32 px-6 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className={`mb-20 transition-all duration-700 ${workInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">Featured Work</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore our latest campaigns and brand transformations that have made an impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {featured.map((p, index) => {
                const isLarge = index % 4 === 0
                return (
                  <div
                    key={p.id}
                    className={`group relative rounded-2xl overflow-hidden border border-accent/20 hover:border-accent/50 transition-all duration-700 cursor-pointer ${
                      isLarge ? 'md:col-span-2 md:row-span-2' : ''
                    } ${workInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ 
                      transitionDelay: `${index * 100}ms`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full mb-2">
                          {p.category}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">{p.title}</h3>
                        <p className="text-sm text-white/80">{p.description}</p>
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full blur-3xl" />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="text-center mt-16">
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 hover:bg-accent/10 bg-transparent group"
                asChild
              >
                <Link href="/portfolio">
                  View Full Portfolio <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
         
        {/* Why Choose Ubic */}
        <section ref={whyRef} className="py-32 px-6 bg-secondary/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={`transition-all duration-700 ${whyInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-balance leading-tight">
                  Why Brands Choose <span className="text-accent">Ubic</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  We don't just deliver creative services—we become strategic partners in your brand's evolution,
                  helping you navigate complexity and seize opportunity.
                </p>

                <div className="space-y-6">
                  {[
                    { title: "Strategic Depth", desc: "Deep market insights inform every creative decision" },
                    { title: "Cultural Fluency", desc: "We understand African markets and global audiences" },
                    { title: "Proven Excellence", desc: "Trusted by leading brands across multiple industries" },
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-4 transition-all duration-700 ${whyInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                      style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                    >
                      <div className="w-1 bg-accent rounded-full flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group" asChild>
                    <Link href="/about">
                      Learn Our Story <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-accent/20 transition-all duration-700 ${whyInView ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'}`}>
                <img
                  src="/creative-team-collaboration-modern-office.jpg"
                  alt="Ubic Media Agency team"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-accent/80 -z-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent-foreground/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-foreground/10 rounded-full blur-3xl animate-float-delayed" />
          </div>

          <div className="mx-auto max-w-4xl text-center text-accent-foreground">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-balance">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-lg md:text-xl mb-12 text-accent-foreground/90 leading-relaxed max-w-2xl mx-auto">
              Let's collaborate to create something extraordinary that resonates with your audience and drives real
              business impact.
            </p>
            <Button size="lg" className="bg-accent-foreground hover:bg-accent-foreground/90 text-accent group" asChild>
              <Link href="/contact">
                Get in Touch <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shimmer-reverse {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
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
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInUp.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fadeInUp.delay-400 {
          animation-delay: 0.4s;
        }
        .animate-fadeInUp.delay-600 {
          animation-delay: 0.6s;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-shimmer-reverse {
          animation: shimmer-reverse 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
