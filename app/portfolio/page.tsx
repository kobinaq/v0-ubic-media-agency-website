import type { Metadata } from "next"
import PortfolioClientPage from "./PortfolioClientPage"

export const metadata: Metadata = {
  title: "Portfolio - Ubic Media Agency | Case Studies & Creative Work",
  description:
    "See Ubic Media Agency's portfolio across branding, social media, web design, photography, and videography projects.",
  openGraph: {
    title: "Portfolio - Ubic Media Agency",
    description: "Explore our recent brand, content, and digital project outcomes.",
    type: "website",
    url: "/portfolio",
  },
  alternates: {
    canonical: "/portfolio",
  },
}

export default function PortfolioPage() {
  return <PortfolioClientPage />
}
