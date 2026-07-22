import type { Metadata } from "next"
import { siteConfig } from "@/lib/content"

const FALLBACK_SITE_URL = "https://weareubic.com"

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "")
}

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") return getSiteUrl()
  return `${getSiteUrl()}${normalized}`
}

type PageMetadataInput = {
  title: string
  description: string
  path: string
  ogTitle?: string
  ogDescription?: string
  keywords?: string[]
  robots?: Metadata["robots"]
}

export function createPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  keywords,
  robots,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const socialTitle = ogTitle ?? title
  const socialDescription = ogDescription ?? description

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: path === "/" ? "/" : path,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      type: "website",
      locale: "en_US",
      siteName: siteConfig.siteName,
      url,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteConfig.siteName} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      creator: "@ubicmediaagency",
      images: ["/opengraph-image"],
    },
  }
}
