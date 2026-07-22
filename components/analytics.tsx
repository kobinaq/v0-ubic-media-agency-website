"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return
    if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) return

    const pagePath = pathname + window.location.search
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      page_path: pagePath,
    })
  }, [pathname])

  return null
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}
