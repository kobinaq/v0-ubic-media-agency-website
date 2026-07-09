"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

type PageIntroProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  aside?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * Shared full-bleed page hero with clip/fade intro.
 * Used across marketing pages so they feel alive like the home experience.
 */
export function PageIntro({
  eyebrow,
  title,
  description,
  meta,
  aside,
  className,
  children,
}: PageIntroProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      registerGsap()
      const root = rootRef.current
      if (!root) return

      const items = root.querySelectorAll("[data-page-intro]")
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0, clearProps: "transform" })
        root.classList.add("is-ready")
        return
      }

      gsap.set(items, { opacity: 0, y: 36 })
      root.classList.add("is-ready")

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.08,
      })
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      className={cn(
        "page-intro relative overflow-hidden border-b border-border px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-36 lg:px-10",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 editorial-grid opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-[1400px]">
        {meta && (
          <div data-page-intro className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            {meta}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            {eyebrow && (
              <p data-page-intro className="studio-label-accent">
                {eyebrow}
              </p>
            )}
            <div data-page-intro className="mt-4">
              {typeof title === "string" ? (
                <h1 className="studio-display text-5xl md:text-6xl lg:text-[5.5rem]">{title}</h1>
              ) : (
                title
              )}
            </div>
            {description && (
              <div data-page-intro className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg md:leading-8">
                {description}
              </div>
            )}
            {children && (
              <div data-page-intro className="mt-10">
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div data-page-intro className="border-t border-border pt-6 lg:border-t-0 lg:pt-0">
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
