"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/lib/content"

/**
 * Sticky bottom bar on small screens after scrolling past the hero.
 * Marketing pages only (render where needed).
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.55)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[1400px] gap-2 px-4 py-3">
        <a
          href={siteConfig.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-border px-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-foreground"
        >
          WhatsApp
        </a>
        <Link
          href="/contact"
          className="inline-flex min-h-11 flex-1 items-center justify-center bg-accent px-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent-foreground"
        >
          Start a project
        </Link>
      </div>
    </div>
  )
}
