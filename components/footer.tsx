import Link from "next/link"
import { siteConfig } from "@/lib/content"

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground pb-[env(safe-area-inset-bottom)] text-background">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <div className="flex flex-col gap-10 border-b border-background/15 pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-background/50">
              Ready when you are
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-[0.94] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
              Let&apos;s make
              <br />
              it unforgettable.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center bg-accent px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-foreground transition-opacity hover:opacity-90"
              data-cursor="hover"
            >
              Start a project
            </Link>
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center border border-background/25 px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] text-background transition-colors hover:border-background"
              data-cursor="hover"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-10 pt-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-serif text-2xl font-semibold tracking-tight">UBIC</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-background/60">{siteConfig.tagline}</p>
            <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-background/45">
              Accra · Ghana · Worldwide
            </p>
          </div>

          <div>
            <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-background/45">Navigate</p>
            <ul className="space-y-3 text-sm text-background/65">
              {[
                { href: "/case-studies", label: "Work" },
                { href: "/services", label: "Services" },
                { href: "/packages", label: "Packages" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-background">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-background/45">Connect</p>
            <ul className="space-y-3 text-sm text-background/65">
              <li>
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-background">
                  Instagram
                </a>
              </li>
              <li>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-background">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-background">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-background">
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-background/15 pt-6 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.siteName}
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="hover:text-background">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-background">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
