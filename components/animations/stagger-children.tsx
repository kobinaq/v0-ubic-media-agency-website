"use client"

import { useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

type StaggerChildrenProps<T extends ElementType = "div"> = {
  as?: T
  children: ReactNode
  className?: string
  /** CSS selector for children to stagger (default: direct children) */
  childSelector?: string
  y?: number
  x?: number
  stagger?: number
  delay?: number
  duration?: number
  once?: boolean
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">

export function StaggerChildren<T extends ElementType = "div">({
  as,
  children,
  className,
  childSelector,
  y = 24,
  x = 0,
  stagger = 0.08,
  delay = 0,
  duration = 0.65,
  once = true,
  ...rest
}: StaggerChildrenProps<T>) {
  const Component = (as || "div") as ElementType
  const ref = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      registerGsap()
      const container = ref.current
      if (!container) return

      const targets = childSelector
        ? container.querySelectorAll(childSelector)
        : Array.from(container.children)

      if (!targets.length) return

      if (prefersReducedMotion()) {
        gsap.set(targets, { clearProps: "all", opacity: 1, y: 0, x: 0 })
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y, x },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        },
      )
    },
    { dependencies: [childSelector, y, x, stagger, delay, duration, once] },
  )

  return (
    <Component ref={ref} className={cn(className)} {...rest}>
      {children}
    </Component>
  )
}
