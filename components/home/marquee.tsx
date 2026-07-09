"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"

type MarqueeProps = {
  items: string[]
  speed?: number
}

export function Marquee({ items, speed = 40 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      registerGsap()
      const track = trackRef.current
      if (!track || prefersReducedMotion()) return

      const total = track.scrollWidth / 2
      gsap.to(track, {
        x: -total,
        duration: speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % -total),
        },
      })
    },
    { dependencies: [items, speed] },
  )

  const loop = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border py-5">
      <div ref={trackRef} className="marquee-track gap-10 px-4 md:gap-16">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 md:gap-16">
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground/75 md:text-2xl">
              {item}
            </span>
            <span className="text-accent" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
