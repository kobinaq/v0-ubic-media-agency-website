import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

const sections = [
  {
    title: "Agreement to Terms",
    body:
      "By accessing our website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
  },
  {
    title: "Services",
    body:
      "Ubic Media Agency provides brand development, creative, and digital services. Specific deliverables and timelines will be outlined in individual project agreements.",
  },
  {
    title: "Payment Terms",
    body: "Payment is required as specified in your package or project agreement. All payments are processed securely through Paystack.",
  },
  {
    title: "Intellectual Property",
    body:
      "Upon full payment, clients receive ownership of deliverables as specified in the project agreement. Ubic Media Agency retains the right to showcase work in our case studies.",
  },
  {
    title: "Contact",
    body: "For questions about these Terms, contact us at info@weareubic.com.",
  },
]

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-background pt-24 text-foreground">
        <section className="editorial-grid border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span>Legal Notice</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <p className="issue-label mt-12">Terms</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">Terms of Service</h1>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="border-t border-border">
              {sections.map((section, index) => (
                <article key={section.title} className="grid gap-6 border-b border-border py-8 md:grid-cols-[92px_1fr]">
                  <span className="font-mono text-sm tracking-[0.18em] text-accent">0{index + 1}</span>
                  <div>
                    <h2 className="text-3xl font-serif font-semibold tracking-tight">{section.title}</h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">{section.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
