"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const reference = searchParams.get("reference")

    if (!reference) {
      setStatus("failed")
      setMessage("No payment reference found")
      return
    }

    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success")
          setMessage("Your payment was successful! We'll send you a confirmation email shortly.")
        } else {
          setStatus("failed")
          setMessage(data.message || "Payment verification failed")
        }
      })
      .catch(() => {
        setStatus("failed")
        setMessage("An error occurred while verifying your payment")
      })
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 text-foreground">
        <section className="editorial-grid px-6 py-24">
          <div className="mx-auto max-w-2xl">
            <Card className="border border-border bg-card">
              <CardContent className="p-12 text-center">
                <p className="issue-label justify-center">Payment Desk</p>
                {status === "loading" && (
                  <>
                    <Loader2 className="mx-auto mb-6 mt-8 h-16 w-16 animate-spin text-accent" />
                    <h1 className="mb-4 text-3xl font-serif font-semibold">Verifying Payment...</h1>
                    <p className="text-muted-foreground">Please wait while we confirm your payment</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <CheckCircle2 className="mx-auto mb-6 mt-8 h-16 w-16 text-green-600" />
                    <h1 className="mb-4 text-3xl font-serif font-semibold">Payment Successful!</h1>
                    <p className="mb-8 text-muted-foreground">{message}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="editorial-button bg-foreground text-background hover:bg-accent" asChild>
                        <Link href="/">Return Home</Link>
                      </Button>
                      <Button className="editorial-button" variant="outline" asChild>
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </>
                )}

                {status === "failed" && (
                  <>
                    <XCircle className="mx-auto mb-6 mt-8 h-16 w-16 text-red-600" />
                    <h1 className="mb-4 text-3xl font-serif font-semibold">Payment Failed</h1>
                    <p className="mb-8 text-muted-foreground">{message}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="editorial-button bg-foreground text-background hover:bg-accent" asChild>
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                      <Button className="editorial-button" variant="outline" asChild>
                        <Link href="/">Return Home</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
