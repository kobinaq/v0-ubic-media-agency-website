"use client"

import { useEffect, useRef, useState } from "react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true)
      return
    }

    // Only run full preloader on first paint of a session home-feel load
    const seen = sessionStorage.getItem("ubic-preloader")
    if (seen) {
      setDone(true)
      return
    }

    registerGsap()
    const root = rootRef.current
    const countEl = countRef.current
    if (!root || !countEl) return

    document.body.style.overflow = "hidden"

    const counter = { value: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("ubic-preloader", "1")
        document.body.style.overflow = ""
        setDone(true)
        window.dispatchEvent(new CustomEvent("ubic:preloader-done"))
      },
    })

    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        countEl.textContent = String(Math.round(counter.value)).padStart(3, "0")
      },
    })
      .to(
        root.querySelectorAll("[data-preloader-line]"),
        { scaleX: 1, duration: 1.2, ease: "power3.inOut", stagger: 0.08 },
        0,
      )
      .to(root, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
      }, "+=0.1")

    return () => {
      tl.kill()
      document.body.style.overflow = ""
    }
  }, [])

  if (done) return null

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="absolute inset-x-8 top-8 h-px origin-left scale-x-0 bg-foreground/80" data-preloader-line />
      <p className="studio-label text-foreground">Ubic Media Agency</p>
      <span
        ref={countRef}
        className="font-serif text-[clamp(4rem,18vw,12rem)] font-semibold leading-none tracking-tight tabular-nums"
      >
        000
      </span>
    </div>
  )
}
