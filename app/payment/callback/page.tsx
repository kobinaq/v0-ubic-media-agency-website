import type { Metadata } from "next"
import { Suspense } from "react"
import PaymentCallbackClient from "./PaymentCallbackClient"

export const metadata: Metadata = {
  title: "Payment Status | Ubic Media Agency",
  description: "Payment verification status for Ubic Media Agency package purchases.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background pt-24 text-foreground">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Verifying payment…</p>
        </main>
      }
    >
      <PaymentCallbackClient />
    </Suspense>
  )
}
