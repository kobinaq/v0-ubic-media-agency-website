import type { Metadata } from "next"
import ContactClientPage from "./ContactClientPage"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Contact Ubic Media Agency | Start a Project",
  description:
    "Contact Ubic Media Agency in Accra to discuss brand identity, websites, strategy, social media support, and creative production. We reply within one working day.",
  path: "/contact",
  ogTitle: "Contact Ubic Media Agency",
  ogDescription: "Send a project brief, message us on WhatsApp, or book a strategy call.",
})

export default function ContactPage() {
  return <ContactClientPage />
}
