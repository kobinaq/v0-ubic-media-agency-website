"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"

export type ServiceItem = {
  id: string
  title: string
  description: string
  startingPrice: number
}

type ServicesPanelProps = {
  services: ServiceItem[]
  formatPrice: (n: number) => string
}

/**
 * Horizontal scroll-pinned services gallery driven by ScrollTrigger.
 */
export function ServicesPanel({ services, formatPrice }: ServicesPanelProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      registerGsap()
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track || prefersReducedMotion()) return
      if (window.matchMedia("(max-width: 768px)").matches) return

      const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScroll() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Cards fade/scale slightly as they pass
      const cards = track.querySelectorAll("[data-service-card]")
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 80%",
              end: "left 30%",
              scrub: true,
            },
          },
        )
      })
    },
    { scope: sectionRef, dependencies: [services] },
  )

  return (
    <section ref={sectionRef} id="services" className="relative overflow-hidden border-t border-border">
      <div className="px-5 pt-20 md:px-8 md:pt-28 lg:px-10">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="studio-label-accent">s e r v i c e s</p>
            <h2 className="studio-display mt-4 text-4xl md:text-6xl">What we do.</h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-muted-foreground md:text-right">
            <span className="md:hidden">Browse services below.</span>
            <span className="hidden md:inline">Scroll sideways, or keep scrolling.</span>
            <br />
            dsgn / {String(services.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-4 px-5 pb-24 md:h-scroll-panel md:flex-row md:gap-6 md:px-8 md:pb-28 lg:px-10"
      >
        {services.map((service, index) => (
          <Link
            key={service.id}
            href="/services"
            data-service-card
            data-cursor="hover"
            className="group flex min-h-[44px] w-full flex-col justify-between border border-border bg-card p-5 transition-colors hover:border-accent/40 hover:bg-accent/[0.04] sm:p-7 md:w-[400px] md:shrink-0 md:p-9"
          >
            <div>
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground group-hover:text-accent">
                00-{index + 1}
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold tracking-tight sm:mt-8 sm:text-3xl md:text-4xl">
                {service.title
                  .replace(" Content Creation & Management", "")
                  .replace(" Design & Development", "")
                  .replace(" Development", "")}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:mt-5">{service.description}</p>
            </div>
            <div className="mt-8 flex items-end justify-between border-t border-border pt-5 sm:mt-12 sm:pt-6">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                from {formatPrice(service.startingPrice)}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                explore →
              </span>
            </div>
          </Link>
        ))}
        <div className="flex w-full items-center py-4 md:w-[320px] md:shrink-0 md:justify-center md:py-0">
          <Link
            href="/services"
            className="studio-label text-foreground studio-link"
            data-cursor="hover"
          >
            all services →
          </Link>
        </div>
      </div>
    </section>
  )
}
