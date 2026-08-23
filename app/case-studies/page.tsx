import type { Metadata } from "next"
import PortfolioClientPage from "../portfolio/PortfolioClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Case Studies | Ubic Media Agency",
  description:
    "Explore Ubic Media Agency case studies across web design, web app development, marketing consultation, and media production.",
  path: "/case-studies",
  ogTitle: "Case Studies | Ubic Media Agency",
  ogDescription: "Recent web, product, marketing, and media outcomes from Ubic Media Agency.",
})

export default function CaseStudiesPage() {
  return <PortfolioClientPage />
}
