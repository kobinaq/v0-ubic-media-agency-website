import type { Metadata } from "next"
import { ServicesClientPage } from "./ServicesClientPage"

export const metadata: Metadata = {
  title: "Our Services - Ubic Media Agency | Brand Development & Creative Solutions",
  description:
    "Explore our full range of creative services: social media management, web design, brand identity, photography, videography, and brand strategy consulting.",
  keywords: [
    "creative services",
    "brand development",
    "social media management",
    "web design services",
    "photography services",
    "videography services",
    "brand strategy",
    "content creation",
  ],
  openGraph: {
    title: "Our Services - Ubic Media Agency",
    description: "Comprehensive creative solutions crafted with precision and care",
    type: "website",
  },
}

export default function ServicesPage() {
  return <ServicesClientPage />
}
