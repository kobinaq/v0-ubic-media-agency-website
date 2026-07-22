import type { Metadata } from "next"
import PortfolioClientPage from "../portfolio/PortfolioClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Case Studies | Ubic Media Agency",
  description:
    "Explore Ubic Media Agency case studies across branding, social media, web design, photography, and videography projects.",
  path: "/case-studies",
  ogTitle: "Case Studies | Ubic Media Agency",
  ogDescription: "Explore recent brand, content, and digital project outcomes from Ubic Media Agency.",
})

export default function CaseStudiesPage() {
  return <PortfolioClientPage />
}
