import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="py-24 px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you fill out a contact form, purchase a
                package, or communicate with us.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services, process transactions,
                and communicate with you.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and
                unauthorized access.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at info@weareubic.com
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
