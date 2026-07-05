"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/content"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Packages", href: "/packages" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
          <div className="min-w-0 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
                <Image src="/logo.png" alt={siteConfig.siteName} width={32} height={32} priority className="h-full w-full object-contain p-1" />
              </span>
              <span className="hidden sm:inline-flex">{siteConfig.siteName}</span>
            </Link>
            <span className="hidden border-l border-border pl-4 text-xs uppercase tracking-[0.28em] text-muted-foreground xl:inline-flex">
              Editorial studio
            </span>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium leading-6 text-foreground transition-colors hover:text-accent"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md border border-border bg-card/80 p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
            role="presentation"
          />
          <div
            className="fixed inset-x-0 top-0 z-50 min-h-screen w-full overflow-y-auto bg-background"
            role="dialog"
            aria-modal="true"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-6 lg:px-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
                    <Image src="/logo.png" alt={siteConfig.siteName} width={32} height={32} className="h-full w-full object-contain p-1" />
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md border border-border bg-card/80 p-2.5 text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="grid gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="border-b border-border/70 py-4 text-2xl font-serif font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <ThemeToggle />
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
