import type { Metadata } from "next"
import { AboutClientPage } from "./page.client"

export const metadata: Metadata = {
  title: "About Ubic Media Agency - Our Story, Mission & Values",
  description:
    "Learn about Ubic Media Agency's mission to empower businesses through strategic brand development, creative storytelling, and digital innovation across Africa and globally.",
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
  openGraph: {
    title: "About Ubic Media Agency",
    description: "We build brands that matter through strategy, creativity, and excellence.",
    type: "website",
  },
}

export default function AboutPage() {
  return <AboutClientPage />
}
