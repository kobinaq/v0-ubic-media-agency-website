import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

const sections = [
  {
    title: "Information We Collect",
    body:
      "We collect information you provide directly to us, such as when you fill out a contact form, purchase a package, or communicate with us.",
  },
  {
    title: "How We Use Your Information",
    body:
      "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.",
  },
  {
    title: "Data Security",
    body:
      "We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.",
  },
  {
    title: "Contact Us",
    body: "If you have any questions about this Privacy Policy, please contact us at info@weareubic.com.",
  },
]

export default function PrivacyPage() {
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
            <p className="issue-label mt-12">Policy</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">Privacy Policy</h1>
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
