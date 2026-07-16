import type { Metadata } from "next"
import { ServicesClientPage } from "./ServicesClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Services | Ubic Media Agency",
  description:
    "Explore Ubic Media Agency services across brand identity, website design and development, social media support, strategy, and creative production.",
  path: "/services",
  ogTitle: "Services | Ubic Media Agency",
  ogDescription: "Brand identity, websites, and creative support structured around clarity, credibility, and growth.",
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
})

export default function ServicesPage() {
  return <ServicesClientPage />
}
