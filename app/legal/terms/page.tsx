import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service | Ubic Media Agency",
  description:
    "Review the terms that apply when you use the Ubic Media Agency website, request services, or purchase a creative package.",
  path: "/legal/terms",
  ogTitle: "Terms of Service | Ubic Media Agency",
  ogDescription: "Terms that apply when you use weareubic.com or engage Ubic Media Agency for creative services.",
})

const sections = [
  {
    title: "Agreement to Terms",
    body:
      "By accessing weareubic.com or engaging Ubic Media Agency for brand, website, content, or production services, you agree to these Terms of Service and all applicable laws. If you do not agree, do not use the site or purchase services. These terms apply to website visitors, leads, and clients unless a signed project agreement states otherwise for a specific engagement.",
  },
  {
    title: "Services",
    body:
      "Ubic Media Agency provides brand development, creative, and digital services including brand strategy, brand identity, website design and development, social media support, photography, videography, and related creative production. Package pages show starting scopes and prices. Exact deliverables, timelines, revision rounds, and fees for a project are confirmed in a proposal, invoice, or project agreement before work begins. We may decline or pause work that falls outside our capacity, expertise, or professional standards.",
  },
  {
    title: "Accounts, Inquiries, and Accuracy",
    body:
      "When you submit a contact form, book a call, or check out for a package, you agree to provide accurate contact and project information. You are responsible for the information you share and for ensuring you have authority to engage us on behalf of your business. We may rely on the brief, assets, and approvals you provide when producing work.",
  },
  {
    title: "Payment Terms",
    body:
      "Payment is required as specified in your package checkout, invoice, or project agreement. Online payments are processed securely through Paystack. Unless otherwise agreed in writing, work may not start or continue until the required deposit or full payment is received. Prices shown on the website may change, and custom projects may be quoted separately. Taxes, bank fees, or currency conversion charges from your payment method are your responsibility unless we expressly agree otherwise.",
  },
  {
    title: "Refunds and Changes",
    body:
      "Because creative services involve reserved time and custom work, fees are generally non-refundable once work has started, except where required by law or expressly stated in a written agreement. If scope changes after kickoff, we may issue a revised quote or timeline. Cancellations should be requested in writing; any refund or credit is handled case by case based on work already completed and costs incurred.",
  },
  {
    title: "Client Responsibilities",
    body:
      "You agree to provide timely feedback, brand assets, copy, access credentials, and approvals needed for delivery. Delays in client input can extend timelines. You represent that materials you supply do not infringe third-party rights and that you have permission to use them in the project. If third-party licenses are required for fonts, stock, music, or software, those costs and clearances are your responsibility unless included in the agreed scope.",
  },
  {
    title: "Intellectual Property",
    body:
      "Upon full payment, clients receive ownership of final deliverables as specified in the project agreement or package description. Until full payment is received, Ubic retains ownership of all work product. Ubic Media Agency retains the right to showcase completed work in case studies, portfolios, social channels, and marketing materials unless a written confidentiality agreement says otherwise. Preliminary concepts, unused options, internal files, and working files may remain Ubic property.",
  },
  {
    title: "Website Use",
    body:
      "You may use this website for lawful purposes only. You may not attempt to disrupt the site, scrape content at a scale that harms performance, misuse forms, or reverse engineer payment or admin systems. Website content, branding, and design are protected by intellectual property laws. You may not copy or reuse site materials for commercial purposes without permission.",
  },
  {
    title: "Disclaimer and Limitation of Liability",
    body:
      "Services and website content are provided on an “as is” and “as available” basis to the fullest extent permitted by law. We do not guarantee specific business results such as rankings, revenue, or lead volume. To the maximum extent permitted by law, Ubic Media Agency is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the site or services. Our total liability for any claim related to a project is limited to the fees you paid us for that specific project.",
  },
  {
    title: "Third-Party Tools and Links",
    body:
      "The site may link to third-party platforms such as WhatsApp, calendars, social networks, or payment providers. Those services have their own terms and privacy practices. We are not responsible for third-party content, availability, or policies. Using those services is at your own risk.",
  },
  {
    title: "Governing Law",
    body:
      "These Terms are governed by the laws of Ghana, without regard to conflict-of-law principles. Disputes should first be addressed in good faith between the parties. If unresolved, disputes may be brought before the competent courts in Accra, Ghana, unless a project agreement specifies another process.",
  },
  {
    title: "Changes to These Terms",
    body:
      "We may update these Terms of Service periodically. The “Last updated” date shows the effective date of the current version. Continued use of the website or services after changes means you accept the updated terms for future use. Existing signed project agreements continue to control those engagements unless both parties agree to amend them.",
  },
  {
    title: "Contact",
    body:
      "For questions about these Terms, contact Ubic Media Agency at info@weareubic.com or Opposite Shooting Stars Community School, Adenta, Accra, Ghana.",
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
              <span>Last updated: July 16, 2026</span>
            </div>
            <p className="issue-label mt-12">Terms</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">Terms of Service</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              These terms cover use of the Ubic Media Agency website and engagement for brand, web, and creative
              services.
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
