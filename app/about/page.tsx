import type { Metadata } from "next"
import { AboutClientPage } from "./page.client"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "About Ubic Media Agency | Our Story & Mission",
  description:
    "Learn about Ubic Media Agency's mission to empower businesses through strategic brand development, creative storytelling, and digital innovation across Africa and globally.",
  path: "/about",
  ogTitle: "About Ubic Media Agency",
  ogDescription: "We build brands that matter through strategy, creativity, and excellence.",
  keywords: [
    "about us",
    "creative agency",
    "brand development agency",
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
