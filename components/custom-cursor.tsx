"use client"

import { useEffect, useRef } from "react"
import { gsap, registerGsap } from "@/lib/gsap"
import { canUsePointerEffects } from "@/lib/gsap/prefers-reduced-motion"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canUsePointerEffects()) return
    registerGsap()
    const cursor = cursorRef.current
    if (!cursor) return

    document.body.classList.add("has-custom-cursor")

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" })
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" })

    const onMove = (e: MouseEvent) => {
      cursor.classList.add("is-visible")
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const view = target.closest("[data-cursor='view']")
      const hover = target.closest("a, button, [data-cursor='hover'], input, textarea, select")
      cursor.classList.toggle("is-view", Boolean(view))
      cursor.classList.toggle("is-hover", Boolean(hover) && !view)
    }

    const onLeave = () => cursor.classList.remove("is-visible")

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseover", onOver)
    document.documentElement.addEventListener("mouseleave", onLeave)

    return () => {
      document.body.classList.remove("has-custom-cursor")
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return <div ref={cursorRef} className="studio-cursor hidden md:block" aria-hidden="true" />
}
