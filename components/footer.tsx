import Link from "next/link"
import { Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react"
import { siteConfig } from "@/lib/content"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/60 text-foreground backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-3xl font-serif font-bold text-foreground">{siteConfig.siteName}</h3>
            <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">{siteConfig.tagline}</p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors hover:bg-accent/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors hover:bg-accent/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors hover:bg-accent/20"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground transition-colors hover:text-accent">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground transition-colors hover:text-accent">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/legal/privacy" className="text-muted-foreground transition-colors hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-muted-foreground transition-colors hover:text-accent">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
