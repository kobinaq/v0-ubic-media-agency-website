import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weareubic.com"

const routeDates: Record<string, string> = {
  "/": "2026-07-16T00:00:00.000Z",
  "/about": "2026-07-16T00:00:00.000Z",
  "/services": "2026-07-16T00:00:00.000Z",
  "/case-studies": "2026-07-16T00:00:00.000Z",
  "/packages": "2026-07-16T00:00:00.000Z",
  "/contact": "2026-07-16T00:00:00.000Z",
  "/legal/privacy": "2026-07-16T00:00:00.000Z",
  "/legal/terms": "2026-07-16T00:00:00.000Z",
}

export default function sitemap(): MetadataRoute.Sitemap {
  const fallback = new Date()

  return [
    {
      url: baseUrl,
      lastModified: new Date(routeDates["/"] || fallback),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(routeDates["/about"] || fallback),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(routeDates["/services"] || fallback),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(routeDates["/case-studies"] || fallback),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(routeDates["/packages"] || fallback),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(routeDates["/contact"] || fallback),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(routeDates["/legal/privacy"] || fallback),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(routeDates["/legal/terms"] || fallback),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
