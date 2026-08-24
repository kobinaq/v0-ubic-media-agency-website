import type { Metadata } from "next"
import HomePageClient from "./home-page-client"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Ubic Media Agency | Web Design, Web Apps, Marketing & Media — Accra, Ghana",
  description:
    "Ubic builds websites, web apps, and brand systems for ambitious businesses in Ghana and beyond. Web design, web app development, marketing consultation, and media production.",
  path: "/",
  ogTitle: "Ubic Media Agency | We build what your business runs on",
  ogDescription:
    "Web design, web app development, marketing consultation, and media production for ambitious businesses in Ghana and beyond.",
  keywords: [
    "web design Ghana",
    "web app development",
    "marketing consultation Accra",
    "media production Ghana",
    "creative agency",
    "website design agency Ghana",
    "web application development",
    "photography",
    "videography",
    "Ghana",
    "Africa",
  ],
})

export default function HomePage() {
  return <HomePageClient />
}
