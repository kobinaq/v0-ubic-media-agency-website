"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"
import { gsap, registerGsap } from "@/lib/gsap"
import { canUsePointerEffects } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!canUsePointerEffects()) return
    registerGsap()
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const relX = event.clientX - rect.left - rect.width / 2
    const relY = event.clientY - rect.top - rect.height / 2

    gsap.to(el, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.45,
      ease: "power3.out",
    })
  }

  const handleLeave = () => {
    if (!canUsePointerEffects()) return
    registerGsap()
    const el = ref.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" })
  }

  const handleTouchEnd = () => {
    // Never leave a translated button stuck after a tap
    const el = ref.current
    if (!el) return
    registerGsap()
    gsap.set(el, { x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      className={cn("inline-flex will-change-transform", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}
