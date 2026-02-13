import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weareubic.com"
const updatedAt = new Date("2026-02-13T00:00:00.000Z")

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: updatedAt,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
