"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

type TextRevealProps = {
  children: string
  className?: string
  as?: "h2" | "h3" | "p" | "div"
  delay?: number
}

/** Line-mask reveal on scroll (clip each line upward). */
export function TextReveal({ children, className, as: Tag = "h2", delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      registerGsap()
      const el = ref.current
      if (!el) return

      // Split into words wrapped for line-friendly animation
      const words = children.split(" ")
      el.innerHTML = words
        .map(
          (w) =>
            `<span class="line-mask" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.28em"><span data-tw class="inline-block will-change-transform">${w}</span></span>`,
        )
        .join("")

      const targets = el.querySelectorAll("[data-tw]")
      if (prefersReducedMotion()) {
        gsap.set(targets, { yPercent: 0, opacity: 1 })
        return
      }

      gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.035,
          delay,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      )
    },
    { dependencies: [children, delay] },
  )

  return <Tag ref={ref as never} className={cn(className)} />
}

type FadeUpProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function FadeUp({ children, className, delay = 0, y = 36 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      registerGsap()
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) return

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      )
    },
    { dependencies: [delay, y] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
