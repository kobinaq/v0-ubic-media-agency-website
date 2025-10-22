import { siteConfig } from "./content"

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.siteName,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "GH",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin, siteConfig.social.twitter],
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.siteName,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "GH",
      addressLocality: "Accra",
    },
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    priceRange: "$$",
    areaServed: ["GH", "Africa", "Global"],
    serviceType: ["Brand Development", "Social Media Management", "Web Design", "Photography", "Videography"],
  }
}

export function generateServiceSchema(service: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    areaServed: ["GH", "Africa", "Global"],
    priceRange: service.startingPrice ? `${service.startingPrice}+` : "Contact for pricing",
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
