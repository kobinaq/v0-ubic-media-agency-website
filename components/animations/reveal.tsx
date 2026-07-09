"use client"

import { useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, registerGsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/gsap/prefers-reduced-motion"
import { cn } from "@/lib/utils"

type RevealProps<T extends ElementType = "div"> = {
  as?: T
  children: ReactNode
  className?: string
  y?: number
  delay?: number
  duration?: number
  once?: boolean
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">

export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className,
  y = 28,
  delay = 0,
  duration = 0.75,
  once = true,
  ...rest
}: RevealProps<T>) {
  const Component = (as || "div") as ElementType
  const ref = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      registerGsap()
      const el = ref.current
      if (!el) return

      if (prefersReducedMotion()) {
        gsap.set(el, { clearProps: "all", opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        },
      )
    },
    { dependencies: [y, delay, duration, once] },
  )

  return (
    <Component ref={ref} className={cn("will-change-transform", className)} {...rest}>
      {children}
    </Component>
  )
}
