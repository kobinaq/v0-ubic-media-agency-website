"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { services } from "@/lib/content"
import { Analytics } from "@/components/analytics"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showFinalCTA, setShowFinalCTA] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isScrollingRef.current) return

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const totalHeight = windowHeight * services.services.length
      
      const progress = Math.min(Math.max(scrollTop / totalHeight, 0), 0.99)
      const index = Math.floor(progress * services.services.length)
      
      setCurrentIndex(index)
      const localProgress = (progress * services.services.length) % 1
      setScrollProgress(localProgress)
      
      // Show final CTA when on last service and scrolled past 60%
      setShowFinalCTA(index === services.services.length - 1 && localProgress > 0.6)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNext = () => {
    if (currentIndex < services.services.length - 1) {
      isScrollingRef.current = true
      const nextScroll = (currentIndex + 1) * window.innerHeight
      window.scrollTo({ top: nextScroll, behavior: 'smooth' })
      
      setTimeout(() => {
        isScrollingRef.current = false
      }, 1000)
    }
  }

  return (
    <>
      <Analytics />
      <Header />
      
      <div ref={containerRef} className="bg-background text-foreground">
        {/* Spacer to enable scrolling */}
        <div style={{ height: `${services.services.length * 100}vh` }} />
        
        {/* Fixed viewport container */}
        <div className="fixed inset-0 overflow-hidden pt-[72px]">
          {/* Progress indicator */}
          <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
            {services.services.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
                }}
                className="group relative"
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-accent scale-150' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`} />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded border border-border">
                  {services.services[index].title}
                </span>
              </button>
            ))}
          </div>

          {/* Service counter */}
          <div className="fixed right-6 bottom-6 z-40 text-sm font-mono">
            <span className="text-accent text-2xl font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-muted-foreground"> / {String(services.services.length).padStart(2, '0')}</span>
          </div>

          {/* 3D Cards Container */}
          <div className="h-full flex items-center justify-center px-6 py-12">
            <div className="relative w-full max-w-6xl h-[80vh]" style={{ perspective: '2000px' }}>
              {services.services.map((service, index) => {
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
                  zIndex = 50
                } else if (isPast) {
                  transform = 'translateX(-120%) translateZ(-300px) rotateY(-20deg) scale(0.8)'
                  opacity = 0
                  zIndex = 10 - (currentIndex - index)
                  filter = 'blur(4px)'
                } else if (isFuture) {
                  const distance = index - currentIndex
                  transform = `translateX(${20 * distance}%) translateZ(-${100 * distance}px) scale(${1 - 0.1 * distance})`
                  opacity = Math.max(0, 1 - (distance - 1) * 0.5)
                  zIndex = 40 - distance
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
                      transformStyle: 'preserve-3d',
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <div className="relative h-full bg-card rounded-3xl border-2 border-accent/20 overflow-hidden shadow-2xl">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-center p-8 md:p-12 lg:p-16 z-10">
                        <div className="max-w-3xl">
                          {/* Number */}
                          <div className="text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-accent/10 mb-4">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          
                          {/* Title */}
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 text-foreground">
                            {service.title}
                          </h2>
                          
                          {/* Description */}
                          <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                            {service.description}
                          </p>
                          
                          {/* CTA */}
                          <div className="flex gap-4">
                            <Button 
                              size="lg"
                              className="bg-accent hover:bg-accent/90 text-accent-foreground relative z-20"
                              asChild
                            >
                              <Link href="/contact">
                                Get Started <ArrowRight className="ml-2 w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scroll hint */}
          {currentIndex < services.services.length - 1 && !showFinalCTA && (
            <button
              onClick={handleNext}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="text-xs uppercase tracking-wider">Scroll</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
          )}

          {/* Final CTA Overlay */}
          {showFinalCTA && (
            <div className="fixed inset-0 bg-accent flex items-center justify-center z-50 animate-fadeIn pt-[72px]">
              <div className="text-center px-6 max-w-4xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-accent-foreground">
                  Ready to Transform Your Brand?
                </h2>
                <p className="text-lg md:text-xl text-accent-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Let's collaborate to create something extraordinary that resonates with your audience and drives real business impact.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg"
                  asChild
                >
                  <Link href="/contact">
                    Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
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
      
      {/* Footer - always rendered below the scrolling section */}
      <div className="relative bg-background" style={{ marginTop: `${services.services.length * 100}vh` }}>
        <Footer />
      </div>
    </>
  )
}
