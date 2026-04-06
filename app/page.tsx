import type { Metadata } from "next"
import HomePageClient from "./home-page-client"

export const metadata: Metadata = {
  title: "Ubic Media Agency - Brand Identity, Websites & Creative Systems",
  description:
    "Ubic Media Agency helps ambitious businesses build sharper brands and clearer websites through strategy, design, and content-led creative execution.",
  keywords: [
    "brand development",
    "brand identity agency",
    "creative agency",
    "web design agency Ghana",
    "social media management",
    "web design",
    "photography",
    "videography",
    "brand strategy",
    "Ghana",
    "Africa",
  ],
  openGraph: {
    title: "Ubic Media Agency - Build a Brand People Trust",
    description:
      "Brand identity, websites, and content systems for ambitious businesses that need to look sharper and convert better.",
    type: "website",
  },
}

export default function HomePage() {
  return <HomePageClient />
}
