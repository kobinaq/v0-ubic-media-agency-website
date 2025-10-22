import type { Metadata } from "next"
import HomePageClient from "./home-page-client"

export const metadata: Metadata = {
  title: "Ubic Media Agency - Brand Development & Creative Services",
  description:
    "Transform your brand with Ubic Media Agency. We offer social media management, web design, brand identity, photography, and videography services across Africa.",
  keywords: [
    "brand development",
    "creative agency",
    "social media management",
    "web design",
    "photography",
    "videography",
    "brand strategy",
    "Ghana",
    "Africa",
    "graphic design",
    "logo",
  ],
  openGraph: {
    title: "Ubic Media Agency - Bold Ideas. Real Impact.",
    description:
      "Transform your brand with strategic design, storytelling, and digital innovation. We help ambitious brands stand out.",
    type: "website",
  },
}

export default function HomePage() {
  return <HomePageClient />
}
