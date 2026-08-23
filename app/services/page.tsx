import type { Metadata } from "next"
import { ServicesClientPage } from "./ServicesClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Services | Ubic Media Agency",
  description:
    "Explore Ubic Media Agency's four pillars: web design, web app development, marketing consultation, and media production.",
  path: "/services",
  ogTitle: "Services | Ubic Media Agency",
  ogDescription: "Web design, web apps, marketing consultation, and media production — structured around clarity and growth.",
  keywords: [
    "web design services",
    "web app development",
    "marketing consultation",
    "media production",
    "photography services",
    "videography services",
    "product development Ghana",
  ],
})

export default function ServicesPage() {
  return <ServicesClientPage />
}
