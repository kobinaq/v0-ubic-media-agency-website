"use client"

import { useCallback, useRef, type PointerEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { canUsePointerEffects, prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { Magnetic } from "@/components/animations/magnetic"
import { cn } from "@/lib/utils"

/** Web + social work only. B&W floaters on the right, shifted toward the headline. */
const FLOATERS = [
  {
    src: "/portfolio-9.jpg",
    alt: "Website design work",
    label: "Web",
    // Right half, closer to text. Width only; height follows natural image ratio.
    className: "left-[54%] top-[14%] w-[min(200px,22vw)] xl:left-[56%] xl:w-[220px]",
    depth: 36,
    rot: -7,
  },
  {
    src: "/victory-foods.jpg",
    alt: "Social media design work",
    label: "Social",
    className: "left-[68%] top-[32%] w-[min(180px,20vw)] xl:left-[70%] xl:w-[200px]",
    depth: 48,
    rot: 6,
  },
  {
    src: "/richkev.jpg",
    alt: "Social media campaign work",
    label: "Social",
    className: "left-[58%] top-[56%] w-[min(190px,21vw)] xl:left-[60%] xl:w-[210px]",
    depth: 28,
    rot: -4,
  },
] as const

/**
 * Single interactive hero. Clean type + B&W floating work cards.
 */
export function InteractiveHero() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const floatersRef = useRef<HTMLDivElement>(null)
  const introDone = useRef(false)
  const floatTween = useRef<gsap.core.Tween[]>([])

  const runIntro = useCallback(() => {
    registerGsap()
    const root = rootRef.current
    const stage = stageRef.current
    const floatLayer = floatersRef.current
    if (!root || !stage || introDone.current) return

    const reduced = prefersReducedMotion()
    const lines = stage.querySelectorAll("[data-hero-line]")
    const meta = stage.querySelectorAll("[data-hero-meta]")
    const floaters = floatLayer?.querySelectorAll("[data-floater]") ?? []
    const cta = stage.querySelectorAll("[data-hero-cta]")
    const rule = stage.querySelector("[data-hero-rule]")

    if (reduced) {
      stage.classList.add("is-ready")
      floatLayer?.classList.add("is-ready")
      gsap.set([lines, meta, floaters, cta, rule], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
        clearProps: "transform",
      })
      introDone.current = true
      return
    }

    gsap.set(lines, { yPercent: 110, opacity: 0 })
    gsap.set(meta, { opacity: 0, y: 16 })
    gsap.set(floaters, { opacity: 0, y: 40, scale: 0.94 })
    gsap.set(cta, { opacity: 0, y: 24 })
    gsap.set(rule, { scaleX: 0, opacity: 1 })
    stage.classList.add("is-ready")
    floatLayer?.classList.add("is-ready")

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        introDone.current = true
        // Hard guarantee cards stay visible after intro
        gsap.set(floaters, { opacity: 1 })
      },
    })

    tl.to(rule, { scaleX: 1, duration: 0.85, ease: "power3.inOut" }, 0)
      .to(meta, { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 }, 0.12)
      .to(
        lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: "power4.out",
        },
        0.2,
      )
      .to(
        floaters,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
        },
        0.3,
      )
      .to(cta, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0.55)

    floatTween.current.forEach((t) => t.kill())
    floatTween.current = []
    floaters.forEach((el, i) => {
      const inner = el.querySelector("[data-floater-inner]")
      if (!inner) return
      // Float the inner card so outer GSAP x/rotate from pointer does not conflict
      const tween = gsap.to(inner, {
        y: i % 2 === 0 ? -8 : 10,
        duration: 2.8 + i * 0.35,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      })
      floatTween.current.push(tween)
    })

    // Fade only the text column on scroll. Keep floaters readable.
    const textCol = stage.querySelector("[data-hero-copy]")
    if (textCol) {
      gsap.to(textCol, {
        y: -48,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }
  }, [])

  useGSAP(
    () => {
      const already = typeof window !== "undefined" && sessionStorage.getItem("ubic-preloader")
      if (already || prefersReducedMotion()) {
        runIntro()
        return
      }

      const onDone = () => runIntro()
      window.addEventListener("ubic:preloader-done", onDone, { once: true })
      const safety = window.setTimeout(runIntro, 2800)

      return () => {
        window.removeEventListener("ubic:preloader-done", onDone)
        window.clearTimeout(safety)
        floatTween.current.forEach((t) => t.kill())
      }
    },
    { scope: rootRef, dependencies: [runIntro] },
  )

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!introDone.current || !canUsePointerEffects()) return
    const layer = floatersRef.current
    if (!layer) return
    registerGsap()

    const rect = (rootRef.current ?? layer).getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5

    layer.querySelectorAll<HTMLElement>("[data-floater]").forEach((card) => {
      const depth = Number(card.dataset.depth || 30)
      gsap.to(card, {
        x: nx * depth,
        y: ny * depth * 0.35,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      })
    })

    const title = stageRef.current?.querySelector<HTMLElement>("[data-hero-title]")
    if (title) {
      gsap.to(title, {
        x: nx * 8,
        y: ny * 5,
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      })
    }
  }

  const onPointerLeave = () => {
    if (!canUsePointerEffects()) return
    const layer = floatersRef.current
    if (!layer) return
    registerGsap()
    layer.querySelectorAll<HTMLElement>("[data-floater]").forEach((card) => {
      gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        overwrite: "auto",
      })
    })
    const title = stageRef.current?.querySelector<HTMLElement>("[data-hero-title]")
    if (title) gsap.to(title, { x: 0, y: 0, duration: 0.85, ease: "power3.out", overwrite: "auto" })
  }

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden"
      aria-label="Hero"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        ref={stageRef}
        className="hero-stage relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-28 md:px-8 md:pb-10 md:pt-32 lg:px-10"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 editorial-grid opacity-50" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-[20%] top-0 -z-10 h-[50vh] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(31,71,65,0.09),transparent_65%)]"
          aria-hidden="true"
        />

        {/* Floating work cards: full-hero absolute positions so they cannot fall off a nested panel */}
        <div
          ref={floatersRef}
          className="hero-floaters pointer-events-none absolute inset-0 z-[2] hidden lg:block"
          aria-hidden="true"
        >
          {FLOATERS.map((f) => (
            <div
              key={f.src}
              data-floater
              data-depth={f.depth}
              className={cn("absolute will-change-transform", f.className)}
            >
              <div
                data-floater-inner
                className="relative border border-border bg-card shadow-[0_20px_50px_rgba(32,28,26,0.14)]"
                style={{ transform: `rotate(${f.rot}deg)` }}
              >
                {/* Natural image ratio, no forced crop box */}
                <Image
                  src={f.src}
                  alt={f.alt}
                  width={800}
                  height={1000}
                  sizes="220px"
                  className="block h-auto w-full grayscale contrast-[1.06]"
                  priority
                />
                <div className="absolute left-2 top-2 bg-background/90 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-foreground">
                  {f.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          data-hero-copy
          className="relative z-10 flex min-h-[min(100svh,820px)] flex-col justify-between lg:min-h-[calc(100svh-7rem)]"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
            <p data-hero-meta className="studio-label max-w-[20rem] leading-relaxed text-foreground/70">
              Strategy · Identity · Web · Social · Photo · Video · Print
            </p>
            <p data-hero-meta className="studio-label sm:text-right">
              Based in <span className="text-foreground">Accra, Ghana</span>
            </p>
          </div>

          <div className="my-auto max-w-3xl py-8 lg:max-w-[50%] lg:py-14">
            <div data-hero-rule className="mb-6 h-px w-full origin-left bg-border md:mb-8" aria-hidden="true" />

            <p data-hero-meta className="studio-label-accent mb-4 md:mb-5">
              Creative agency
            </p>

            <h1
              data-hero-title
              className="studio-display text-[clamp(1.65rem,4.75vw,3.6rem)] text-foreground will-change-transform"
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-hero-line className="block will-change-transform">
                  We build brands.
                </span>
              </span>
              <span className="mt-1 block overflow-hidden pb-[0.08em]">
                <span data-hero-line className="block font-serif italic text-accent will-change-transform">
                  And everything around them.
                </span>
              </span>
            </h1>

            <div className="mt-6 flex max-w-md flex-col gap-5 md:mt-8">
              <p data-hero-cta className="text-sm leading-7 text-muted-foreground md:text-base md:leading-7">
                Strategy, identity, websites, social, photo, video, and print. Built for businesses that need to look
                sharper.
              </p>
              <div data-hero-cta className="flex flex-row flex-wrap items-center gap-3">
                <Magnetic strength={0.3} className="min-h-11">
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center justify-center bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-accent-foreground sm:px-7"
                    data-cursor="hover"
                  >
                    Book a call
                  </Link>
                </Magnetic>
                <Magnetic strength={0.22} className="min-h-11">
                  <Link
                    href="#work"
                    className="inline-flex min-h-11 items-center justify-center border border-foreground/25 px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground sm:px-7"
                    data-cursor="hover"
                  >
                    See work
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Mobile/tablet work strip: same images as desktop floaters */}
            <div
              data-hero-cta
              className="no-scrollbar mt-8 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 lg:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {FLOATERS.map((f) => (
                <div
                  key={`strip-${f.src}`}
                  className="relative w-[42vw] max-w-[160px] shrink-0 snap-start border border-border bg-card"
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={400}
                    height={500}
                    sizes="160px"
                    className="block h-auto w-full grayscale contrast-[1.06]"
                    priority
                  />
                  <span className="absolute left-1.5 top-1.5 bg-background/90 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.12em]">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <p data-hero-meta className="studio-label">Scroll</p>
            <a href="#work" className="studio-label text-foreground studio-link" data-cursor="hover" data-hero-meta>
              Selected work ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
