"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Analytics } from "@/components/analytics"

export default function PaymentCallbackPage() {
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

    // Verify payment
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
      <Analytics />
      <Header />
      <main className="pt-24 min-h-screen">
        <section className="py-24 px-6">
          <div className="mx-auto max-w-2xl">
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                {status === "loading" && (
                  <>
                    <Loader2 className="h-16 w-16 animate-spin text-accent mx-auto mb-6" />
                    <h1 className="text-3xl font-serif font-bold mb-4">Verifying Payment...</h1>
                    <p className="text-muted-foreground">Please wait while we confirm your payment</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-serif font-bold mb-4">Payment Successful!</h1>
                    <p className="text-muted-foreground mb-8">{message}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild>
                        <Link href="/">Return Home</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </>
                )}

                {status === "failed" && (
                  <>
                    <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-serif font-bold mb-4">Payment Failed</h1>
                    <p className="text-muted-foreground mb-8">{message}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild>
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                      <Button variant="outline" asChild>
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
