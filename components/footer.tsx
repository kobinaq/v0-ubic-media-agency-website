import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react"
import { siteConfig } from "@/lib/content"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label={siteConfig.siteName}>
              <Image src="/logo.png" alt={siteConfig.siteName} width={80} height={23} className="h-auto w-auto max-h-5" />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">{siteConfig.tagline}</p>
            <div className="mt-8 flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Quick Links</h4>
            <ul className="space-y-3 text-sm">
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
            <h4 className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
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

          <div>
            <h4 className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground transition-colors hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground transition-colors hover:text-accent">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.
          </p>
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Printed digitally in Accra
          </div>
        </div>
      </div>
    </footer>
  )
}
