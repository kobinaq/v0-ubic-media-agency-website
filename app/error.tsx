"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Something went wrong</p>
        <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          We hit a snag loading this page.
        </h1>
        <p className="mt-5 text-base leading-8 text-muted-foreground">
          Try again, or head back home while we sort it out.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            className="editorial-button min-h-11 bg-foreground text-background hover:bg-accent"
            onClick={reset}
          >
            Try again
          </Button>
          <Button asChild variant="outline" className="editorial-button min-h-11">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
