import type { Metadata } from "next"
import HomePageClient from "./home-page-client"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Ubic Media Agency | Web Design, Web Apps, Marketing & Media Production",
  description:
    "Ubic Media Agency builds websites and web applications, guides marketing strategy, and produces media for ambitious businesses in Ghana and beyond.",
  path: "/",
  ogTitle: "Ubic Media Agency | Build What Your Business Runs On",
  ogDescription:
    "Web design, web app development, marketing consultation, and media production for businesses that need more than a brochure site.",
  keywords: [
    "web design agency Ghana",
    "web app development Ghana",
    "marketing consultation",
    "media production",
    "web application development",
    "website design",
    "photography",
    "videography",
    "Ghana",
    "Africa",
  ],
})

export default function HomePage() {
  return <HomePageClient />
}
