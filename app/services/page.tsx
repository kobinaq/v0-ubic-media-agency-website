import type { Metadata } from "next"
import { ServicesClientPage } from "./ServicesClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Services | Ubic Media Agency",
  description:
    "Ubic Media Agency services across four pillars: web design, web app development, marketing consultation, and media production.",
  path: "/services",
  ogTitle: "Services | Ubic Media Agency",
  ogDescription: "Four pillars. One studio. Web design, web apps, marketing consultation, and media production.",
  keywords: [
    "web design services Ghana",
    "web app development",
    "marketing consultation Accra",
    "media production Ghana",
    "creative agency",
    "website design",
    "photography services",
    "videography services",
  ],
})

export default function ServicesPage() {
  return <ServicesClientPage />
}
