import Link from "next/link"
import { Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react"
import { siteConfig } from "@/lib/content"

export function Footer() {
  return (
    <footer className="bg-secondary text-foreground border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              {siteConfig.siteName}
            </h3>
            <p className="text-muted-foreground max-w-md leading-relaxed mb-8">{siteConfig.tagline}</p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors text-accent"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors text-accent"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-accent transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/legal/privacy" className="text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-muted-foreground hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
