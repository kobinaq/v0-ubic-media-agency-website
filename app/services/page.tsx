import type { Metadata } from "next"
import { ServicesClientPage } from "./ServicesClientPage"

export const metadata: Metadata = {
  title: "Services - Ubic Media Agency | Brand Identity, Websites & Creative Support",
  description:
    "Explore Ubic Media Agency services across brand identity, website design and development, social media support, strategy, and creative production.",
  keywords: [
    "creative services",
    "brand identity agency",
    "social media management",
    "web design services",
    "photography services",
    "videography services",
    "brand strategy",
    "content creation",
  ],
  openGraph: {
    title: "Services - Ubic Media Agency",
    description: "Brand identity, websites, and creative support structured around clarity, credibility, and growth.",
    type: "website",
  },
}

export default function ServicesPage() {
  return <ServicesClientPage />
}
