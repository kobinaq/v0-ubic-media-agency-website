import type { Metadata } from "next"
import { AboutClientPage } from "./page.client"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "About Ubic Media Agency | Web Design, Web Apps & Marketing Studio",
  description:
    "Learn about Ubic Media Agency's mission to help businesses ship real digital products through web design, web app development, marketing consultation, and media production.",
  path: "/about",
  ogTitle: "About Ubic Media Agency",
  ogDescription: "We build the products businesses run on — and help them talk about it.",
  keywords: [
    "about us",
    "web design agency",
    "web app development agency",
    "our story",
    "our mission",
    "our values",
    "team",
    "Ghana",
    "Africa",
  ],
})

export default function AboutPage() {
  return <AboutClientPage />
}
