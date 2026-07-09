"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

type ImageRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

/** Clip-path wipe reveal for media blocks. */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      registerGsap()
      const el = ref.current
      if (!el) return

      if (prefersReducedMotion()) {
        gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath" })
        return
      }

      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          delay,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      )

      const img = el.querySelector("img")
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.18 },
          {
            scale: 1,
            duration: 1.35,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        )
      }
    },
    { dependencies: [delay] },
  )

  return (
    <div ref={ref} className={cn("overflow-hidden will-change-[clip-path]", className)}>
      {children}
    </div>
  )
}
