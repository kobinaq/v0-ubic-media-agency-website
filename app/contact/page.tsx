import type { Metadata } from "next"
import ContactClientPage from "./ContactClientPage"

export const metadata: Metadata = {
  title: "Contact Ubic Media Agency - Start Your Next Brand Project",
  description:
    "Contact Ubic Media Agency to discuss brand identity, websites, strategy, social media support, and creative production.",
  openGraph: {
    title: "Contact Ubic Media Agency",
    description: "Send a project brief, message us on WhatsApp, or book a strategy call.",
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
