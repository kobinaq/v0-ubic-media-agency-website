"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"

// Mock data - replace with your actual services
const services = [
  {
    id: 1,
    title: "Brand Strategy & Identity",
    description: "We craft distinctive brand identities that resonate with your target audience and stand the test of time. From naming to visual systems, we build brands that matter.",
    features: ["Brand Architecture", "Visual Identity Systems", "Brand Guidelines", "Market Positioning"]
  },
  {
    id: 2,
    title: "Digital Design & Web",
    description: "Creating stunning digital experiences that engage users and drive conversions. Beautiful interfaces that work flawlessly across all devices.",
    features: ["Website Design", "UI/UX Design", "Mobile Apps", "E-commerce Solutions"]
  },
  {
    id: 3,
    title: "Content & Photography",
    description: "Compelling visual storytelling that captures attention and communicates your brand message with clarity and impact.",
    features: ["Commercial Photography", "Product Photography", "Brand Photography", "Content Creation"]
  },
  {
    id: 4,
    title: "Video & Motion",
    description: "Dynamic video content that brings your brand to life. From concept to final edit, we create videos that move audiences.",
    features: ["Brand Films", "Social Media Videos", "Motion Graphics", "Animation"]
  },
  {
    id: 5,
    title: "Social Media Management",
    description: "Strategic social media presence that builds community and drives engagement. We create content that sparks conversations.",
    features: ["Content Strategy", "Community Management", "Paid Social Campaigns", "Analytics & Reporting"]
  },
  {
    id: 6,
    title: "Print & Packaging",
    description: "Tangible brand experiences that leave lasting impressions. Beautiful print materials that reflect your brand's quality.",
    features: ["Packaging Design", "Marketing Collateral", "Publication Design", "Environmental Graphics"]
  }
]

export default function ServicesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isScrollingRef.current) return

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const totalHeight = windowHeight * services.length
      
      const progress = Math.min(Math.max(scrollTop / totalHeight, 0), 0.99)
      const index = Math.floor(progress * services.length)
      
      setCurrentIndex(index)
      setScrollProgress((progress * services.length) % 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNext = () => {
    if (currentIndex < services.length - 1) {
      isScrollingRef.current = true
      const nextScroll = (currentIndex + 1) * window.innerHeight
      window.scrollTo({ top: nextScroll, behavior: 'smooth' })
      
      setTimeout(() => {
        isScrollingRef.current = false
      }, 1000)
    }
  }

  return (
    <div ref={containerRef} className="bg-black text-white">
      {/* Spacer to enable scrolling */}
      <div style={{ height: `${services.length * 100}vh` }} />
      
      {/* Fixed viewport container */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-serif font-bold">
              Ubic
            </Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <Link href="/portfolio" className="hover:text-orange-500 transition-colors">Portfolio</Link>
              <Link href="/about" className="hover:text-orange-500 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link>
            </nav>
          </div>
        </header>

        {/* Progress indicator */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
              }}
              className="group relative"
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-orange-500 scale-150' : 'bg-white/30 hover:bg-white/50'
              }`} />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {services[index].title}
              </span>
            </button>
          ))}
        </div>

        {/* Service counter */}
        <div className="fixed right-6 bottom-6 z-40 text-sm font-mono">
          <span className="text-orange-500 text-2xl font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/50"> / {String(services.length).padStart(2, '0')}</span>
        </div>

        {/* 3D Cards Container */}
        <div className="h-full flex items-center justify-center px-6 py-24">
          <div className="relative w-full max-w-6xl" style={{ perspective: '2000px' }}>
            {services.map((service, index) => {
              const isActive = index === currentIndex
              const isPast = index < currentIndex
              const isFuture = index > currentIndex
              
              let transform = ''
              let opacity = 0
              let zIndex = 0
              let filter = 'blur(0px)'
              
              if (isActive) {
                const progress = scrollProgress
                transform = `
                  translateX(${progress * -100}%) 
                  translateZ(${-progress * 200}px) 
                  rotateY(${progress * -15}deg)
                  scale(${1 - progress * 0.1})
                `
                opacity = 1 - progress * 0.5
                zIndex = 20
              } else if (isPast) {
                transform = 'translateX(-120%) translateZ(-300px) rotateY(-20deg) scale(0.8)'
                opacity = 0
                zIndex = 10 - (currentIndex - index)
                filter = 'blur(4px)'
              } else if (isFuture) {
                const distance = index - currentIndex
                transform = `translateX(${20 * distance}%) translateZ(-${100 * distance}px) scale(${1 - 0.1 * distance})`
                opacity = Math.max(0, 1 - (distance - 1) * 0.5)
                zIndex = 30 - distance
                filter = `blur(${distance * 2}px)`
              }
              
              return (
                <div
                  key={service.id}
                  className="absolute inset-0 transition-all duration-700 ease-out"
                  style={{
                    transform,
                    opacity,
                    zIndex,
                    filter,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="relative h-full bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-orange-500/20 overflow-hidden shadow-2xl">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10" />
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center p-12 md:p-16 lg:p-20">
                      <div className="max-w-3xl">
                        {/* Number */}
                        <div className="text-8xl md:text-9xl font-serif font-bold text-orange-500/20 mb-6">
                          {String(service.id).padStart(2, '0')}
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-white">
                          {service.title}
                        </h2>
                        
                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
                          {service.description}
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              <span className="text-sm text-white/60">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <Link 
                          href="/contact"
                          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-all hover:gap-3"
                        >
                          Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll hint */}
        {currentIndex < services.length - 1 && (
          <button
            onClick={handleNext}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        )}

        {/* Final CTA */}
        {currentIndex === services.length - 1 && scrollProgress > 0.5 && (
          <div className="fixed inset-0 bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center z-50 animate-fadeIn">
            <div className="text-center px-6">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                Ready to Transform Your Brand?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Let's collaborate to create something extraordinary that resonates with your audience
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-white/90 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:gap-3"
              >
                Get in Touch <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
