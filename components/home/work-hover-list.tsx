"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { canUsePointerEffects, prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

export type WorkItem = {
  id: string
  title: string
  category: string
  year: string
  image: string
  description: string
}

type WorkHoverListProps = {
  projects: WorkItem[]
}

/**
 * Desktop: cursor-following image preview.
 * Mobile: thumb + title cards (no hover required).
 */
export function WorkHoverList({ projects }: WorkHoverListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const activeIdRef = useRef<string | null>(null)
  const hoveringRef = useRef(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const xTo = useRef<((v: number) => void) | null>(null)
  const yTo = useRef<((v: number) => void) | null>(null)

  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === activeId) ?? null

  useGSAP(
    () => {
      registerGsap()
      const rows = listRef.current?.querySelectorAll("[data-work-row]")
      if (!rows?.length || prefersReducedMotion()) return

      gsap.fromTo(
        rows,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
            once: true,
          },
        },
      )
    },
    { scope: listRef, dependencies: [projects] },
  )

  useEffect(() => {
    if (!canUsePointerEffects()) return
    registerGsap()
    const preview = previewRef.current
    if (!preview) return

    gsap.set(preview, { opacity: 0, scale: 0.94, x: 0, y: 0 })

    xTo.current = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" })
    yTo.current = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" })

    const onMove = (e: globalThis.MouseEvent) => {
      if (!hoveringRef.current) return
      xTo.current?.(e.clientX + 32)
      yTo.current?.(e.clientY - 48)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  const showPreview = (project: WorkItem, e: MouseEvent) => {
    if (!canUsePointerEffects()) return
    clearHideTimer()
    hoveringRef.current = true
    activeIdRef.current = project.id
    setActiveId(project.id)

    const preview = previewRef.current
    if (!preview) return

    registerGsap()
    gsap.set(preview, {
      x: e.clientX + 32,
      y: e.clientY - 48,
    })
    gsap.killTweensOf(preview)
    gsap.to(preview, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    })
  }

  const scheduleHide = () => {
    hoveringRef.current = false
    activeIdRef.current = null
    clearHideTimer()

    hideTimerRef.current = setTimeout(() => {
      if (hoveringRef.current) return

      const preview = previewRef.current
      if (!preview || !canUsePointerEffects()) {
        setActiveId(null)
        return
      }

      registerGsap()
      gsap.killTweensOf(preview)
      gsap.to(preview, {
        opacity: 0,
        scale: 0.94,
        duration: 0.28,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          if (!hoveringRef.current) setActiveId(null)
        },
      })
    }, 40)
  }

  return (
    <>
      {/* Mobile / tablet: image + text cards */}
      <div ref={listRef} className="space-y-3 md:hidden">
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href="/case-studies"
            data-work-row
            className="flex min-h-[72px] gap-4 border border-border bg-card p-3 transition-colors active:bg-foreground/[0.03]"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-border bg-muted">
              <Image
                src={project.image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} · {project.category}
              </span>
              <h3 className="mt-1 font-serif text-lg font-semibold leading-snug tracking-tight">
                {project.title}
              </h3>
              <span className="mt-1 font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground">
                {project.year}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: hover list + floating preview */}
      <div className="hidden border-t border-border md:block">
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href="/case-studies"
            data-work-row
            data-cursor="view"
            className={cn(
              "group grid grid-cols-[80px_1fr_auto_auto] items-baseline gap-8 border-b border-border py-9 transition-colors",
              "hover:bg-foreground/[0.03]",
              activeId === project.id && "bg-foreground/[0.03]",
            )}
            onMouseEnter={(e) => showPreview(project, e)}
            onMouseLeave={scheduleHide}
          >
            <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-4xl lg:text-5xl">
              {project.title}
            </h3>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {project.category}
            </span>
            <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">{project.year}</span>
          </Link>
        ))}
      </div>

      <div
        ref={previewRef}
        className="work-preview pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        aria-hidden="true"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              active?.id === project.id ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="340px"
              className="object-cover"
              priority={project.id === projects[0]?.id}
            />
          </div>
        ))}
      </div>
    </>
  )
}
