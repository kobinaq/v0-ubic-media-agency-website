import type { Metadata } from "next"
import PortfolioClientPage from "../portfolio/PortfolioClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Case Studies | Ubic Media Agency",
  description:
    "Explore Ubic Media Agency case studies across web design, web app development, marketing consultation, and media production.",
  path: "/case-studies",
  ogTitle: "Case Studies | Ubic Media Agency",
  ogDescription: "Fourteen projects across web design, web apps, marketing consultation, and media production.",
})

export default function CaseStudiesPage() {
  return <PortfolioClientPage />
}
