import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-9xl font-serif font-bold text-muted-foreground mb-4">404</h1>
          <h2 className="text-3xl font-serif font-bold mb-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
