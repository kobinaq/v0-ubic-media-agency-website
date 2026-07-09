"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { siteConfig } from "@/lib/content"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Work", href: "/case-studies" },
  { name: "Services", href: "/services" },
  { name: "Packages", href: "/packages" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 pt-[env(safe-area-inset-top)]",
        scrolled || mobileMenuOpen ? "border-b border-border bg-background/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8 md:py-5 lg:px-10"
        aria-label="Global"
      >
        <Link href="/" className="relative z-10 flex items-center gap-3" data-cursor="hover">
          <Image
            src="/logo.png"
            alt={siteConfig.siteName}
            width={80}
            height={22}
            priority
            className="h-auto w-auto max-h-5"
          />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="studio-label studio-link text-foreground/80 hover:text-foreground"
              data-cursor="hover"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-label-accent studio-link"
            data-cursor="hover"
          >
            Let&apos;s talk
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="relative z-10 -m-2 p-2 text-foreground"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            data-cursor="hover"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background md:hidden"
          role="dialog"
          aria-modal="true"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex h-full flex-col px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24">
            <div className="flex flex-1 flex-col justify-center gap-1">
              {navigation.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-14 border-b border-border py-4 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                >
                  <span className="mr-4 font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  {item.name}
                </Link>
              ))}
            </div>
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Let&apos;s talk
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
