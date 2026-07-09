import type { Metadata } from "next"
import { Suspense } from "react"
import PackagesClientPage from "./PackagesClientPage"

export const metadata: Metadata = {
  title: "Packages & Pricing - Ubic Media Agency",
  description:
    "Compare Ubic Media Agency packages and starting prices for brand identity, websites, strategy, social media, and creative support.",
  openGraph: {
    title: "Packages & Pricing - Ubic Media Agency",
    description: "Clear entry-point pricing for businesses planning a sharper brand or website.",
    type: "website",
    url: "/packages",
  },
  alternates: {
    canonical: "/packages",
  },
}

export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-[0.2em]">Loading packages…</p>
        </div>
      }
    >
      <PackagesClientPage />
    </Suspense>
  )
}
