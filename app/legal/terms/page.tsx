import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="py-24 px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing our website and services, you agree to be bound by these Terms of Service and all
                applicable laws and regulations.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ubic Media Agency provides brand development, creative, and digital services. Specific deliverables and
                timelines will be outlined in individual project agreements.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Payment is required as specified in your package or project agreement. All payments are processed
                securely through Paystack.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Upon full payment, clients receive ownership of deliverables as specified in the project agreement. Ubic
                Media Agency retains the right to showcase work in our portfolio.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, contact us at info@weareubic.com
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
