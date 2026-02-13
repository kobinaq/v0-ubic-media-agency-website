import type { Metadata } from "next"
import ContactClientPage from "./ContactClientPage"

export const metadata: Metadata = {
  title: "Contact Ubic Media Agency - Start Your Next Brand Project",
  description:
    "Contact Ubic Media Agency for brand strategy, social media management, web design, and creative production services.",
  openGraph: {
    title: "Contact Ubic Media Agency",
    description: "Let’s discuss your goals and build a brand that performs.",
    type: "website",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return <ContactClientPage />
}
