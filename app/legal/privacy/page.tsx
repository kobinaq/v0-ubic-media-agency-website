import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy | Ubic Media Agency",
  description:
    "Read how Ubic Media Agency collects, uses, stores, and protects personal information when you visit our website, contact us, or purchase a package.",
  path: "/legal/privacy",
  ogTitle: "Privacy Policy | Ubic Media Agency",
  ogDescription: "How Ubic Media Agency handles personal information for website visitors, leads, and clients.",
})

const sections = [
  {
    title: "Who We Are",
    body:
      "Ubic Media Agency (“Ubic”, “we”, “us”, or “our”) is a brand development and creative agency based in Accra, Ghana. This Privacy Policy explains how we collect, use, share, and protect personal information when you visit weareubic.com, contact us, request a proposal, or purchase a package. If you have questions about this policy, email info@weareubic.com.",
  },
  {
    title: "Information We Collect",
    body:
      "We collect information you provide directly to us, including your name, email address, phone number, company details, project brief, budget notes, and any files or messages you send through our contact form, WhatsApp, email, or checkout flow. When you purchase a package, our payment partner Paystack processes payment details; we receive confirmation data such as payment reference, amount, currency, and customer contact details needed to fulfill the order. We may also collect basic technical information such as browser type, device information, pages viewed, and approximate location derived from IP address through analytics tools.",
  },
  {
    title: "How We Use Your Information",
    body:
      "We use personal information to respond to inquiries, prepare proposals, deliver creative services, process transactions, send order confirmations, and provide project updates. We also use this information to improve our website, understand which services are most useful, prevent fraud or abuse, and comply with legal obligations. We do not sell personal information. Marketing messages are limited to communications related to our services or follow-ups you would reasonably expect after contacting us, and you can ask us to stop those messages at any time.",
  },
  {
    title: "Cookies and Analytics",
    body:
      "Our site may use cookies and similar technologies to understand traffic patterns and improve performance. This can include analytics from providers such as Google Analytics, Vercel Analytics, and Ahrefs. These tools help us measure page views, referral sources, and technical errors. You can control cookies through your browser settings. Disabling cookies may limit some site features, but core pages remain accessible.",
  },
  {
    title: "Sharing and Processors",
    body:
      "We share personal information only with trusted service providers who help us operate the business, such as payment processing (Paystack), hosting and infrastructure (for example Vercel), email or messaging delivery, and analytics. These providers are expected to process data only for the services they provide to us. We may also disclose information if required by law, to protect our rights, or in connection with a business transfer.",
  },
  {
    title: "Data Retention and Security",
    body:
      "We retain personal information for as long as needed to fulfill the purpose it was collected for, including project delivery, accounting, dispute resolution, and legal compliance. When information is no longer required, we delete or anonymize it where practical. We take reasonable administrative and technical measures to protect personal information from loss, theft, misuse, and unauthorized access. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
  },
  {
    title: "Your Choices and Rights",
    body:
      "Depending on where you live, you may have rights to request access to, correction of, or deletion of personal information we hold about you. You may also ask us to limit certain processing or to stop non-essential communications. To make a request, email info@weareubic.com with enough detail for us to verify and respond. We will handle requests in line with applicable law and our operational needs for completed contracts and legal records.",
  },
  {
    title: "International Visitors",
    body:
      "Ubic is based in Ghana and works with clients in other countries. If you contact us from outside Ghana, your information may be processed in Ghana or in the countries where our service providers operate. By using the site or submitting information, you understand that your data may be transferred to and processed in those locations subject to this policy.",
  },
  {
    title: "Children’s Privacy",
    body:
      "Our website and services are intended for business clients and adults. We do not knowingly collect personal information from children. If you believe a child has provided personal information to us, contact info@weareubic.com and we will take appropriate steps to remove it.",
  },
  {
    title: "Updates to This Policy",
    body:
      "We may update this Privacy Policy from time to time to reflect changes in our services, tools, or legal requirements. The “Last updated” date at the top of this page shows when the latest version took effect. Continued use of the site after an update means you acknowledge the revised policy.",
  },
  {
    title: "Contact Us",
    body:
      "If you have any questions about this Privacy Policy or how Ubic Media Agency handles personal information, contact us at info@weareubic.com or write to us at Opposite Shooting Stars Community School, Adenta, Accra, Ghana.",
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
              <span>Last updated: July 16, 2026</span>
            </div>
            <p className="issue-label mt-12">Policy</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">Privacy Policy</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              This policy describes how Ubic Media Agency collects and uses information when you browse our website,
              request creative services, or purchase a package.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="border-t border-border">
              {sections.map((section, index) => (
                <article key={section.title} className="grid gap-6 border-b border-border py-8 md:grid-cols-[92px_1fr]">
                  <span className="font-mono text-sm tracking-[0.18em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
