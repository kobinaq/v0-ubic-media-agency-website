import type { Metadata } from "next"
import PackagesClientPage from "./PackagesClientPage"

export const metadata: Metadata = {
  title: "Packages & Pricing - Ubic Media Agency",
  description:
    "Compare Ubic Media Agency packages for social media management, web design, and creative services to find the best fit for your brand.",
  openGraph: {
    title: "Packages & Pricing - Ubic Media Agency",
    description: "Choose a package tailored to your growth goals.",
    type: "website",
    url: "/packages",
  },
  alternates: {
    canonical: "/packages",
  },
}

export default function PackagesPage() {
  return <PackagesClientPage />
}
