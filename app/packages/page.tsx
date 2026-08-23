import type { Metadata } from "next"
import PackagesClientPage from "./PackagesClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Packages & Pricing | Ubic Media Agency",
  description:
    "Compare Ubic Media Agency packages and starting prices for web design, web app development, marketing consultation, and media production.",
  path: "/packages",
  ogTitle: "Packages & Pricing | Ubic Media Agency",
  ogDescription: "Clear entry-point pricing for businesses planning a website, web app, or marketing push.",
})

type PackagesPageProps = {
  searchParams: Promise<{ path?: string | string[] }>
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const params = await searchParams
  const pathParam = params.path
  const initialPath = Array.isArray(pathParam) ? pathParam[0] : pathParam

  return <PackagesClientPage initialPath={initialPath ?? null} />
}
