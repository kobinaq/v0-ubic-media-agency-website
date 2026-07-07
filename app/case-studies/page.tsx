import type { Metadata } from "next"
import PortfolioClientPage from "../portfolio/PortfolioClientPage"

export const metadata: Metadata = {
  title: "Case Studies - Ubic Media Agency | Creative Work & Project Outcomes",
  description:
    "Explore Ubic Media Agency case studies across branding, social media, web design, photography, and videography projects.",
  openGraph: {
    title: "Case Studies - Ubic Media Agency",
    description: "Explore recent brand, content, and digital project outcomes from Ubic Media Agency.",
    type: "website",
    url: "/case-studies",
  },
  alternates: {
    canonical: "/case-studies",
  },
}

export default function CaseStudiesPage() {
  return <PortfolioClientPage />
}
