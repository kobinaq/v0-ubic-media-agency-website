"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"

function shouldUseSmoothScroll() {
  if (typeof window === "undefined") return false
  if (prefersReducedMotion()) return false
  // Native scroll feels better on phones/tablets
  if (window.matchMedia("(pointer: coarse)").matches) return false
  if (window.matchMedia("(max-width: 768px)").matches) return false
  return true
}

export function SmoothScroll() {
  useEffect(() => {
    if (!shouldUseSmoothScroll()) return

    registerGsap()

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  return null
}
