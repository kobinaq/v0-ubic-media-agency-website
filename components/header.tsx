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
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
          <div className="min-w-0 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              <Image src="/logo.png" alt={siteConfig.siteName} width={70} height={20} priority className="h-auto w-auto max-h-5" />
            </Link>
            <span className="hidden border-l border-border pl-4 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground xl:inline-flex">
              Accra - Vol. 01
            </span>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-mono text-xs uppercase leading-6 tracking-[0.14em] text-foreground transition-colors hover:text-accent"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button className="editorial-button border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background" asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center border border-border bg-card/80 p-2.5 text-foreground"
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
                  <Image src="/logo.png" alt={siteConfig.siteName} width={70} height={20} className="h-auto w-auto max-h-5" />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 border border-border bg-card/80 p-2.5 text-foreground"
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
                    className="border-b border-border/70 py-4 font-serif text-2xl font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <ThemeToggle />
                <Button className="editorial-button w-full border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background" asChild>
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
