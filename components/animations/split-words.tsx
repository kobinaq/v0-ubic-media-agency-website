"use client"

import { cn } from "@/lib/utils"

type SplitWordsProps = {
  text: string
  className?: string
  wordClassName?: string
  /** data attribute target for GSAP selection */
  wordAttr?: string
}

/** Renders words as inline spans for free-tier GSAP stagger (no SplitText plugin). */
export function SplitWords({
  text,
  className,
  wordClassName,
  wordAttr = "data-word",
}: SplitWordsProps) {
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            {...{ [wordAttr]: "" }}
            className={cn("inline-block will-change-transform", wordClassName)}
            aria-hidden="true"
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : null}
          </span>
        </span>
      ))}
    </span>
  )
}
