/**
 * Shared outcome → service → package path mapping
 * for Services (outcome map) and Packages (path picker).
 */

export type PackagePathId =
  | "identity"
  | "website"
  | "content"
  | "strategy"
  | "production"
  | "system"

/** Package JSON `service` field values */
export type PackageServiceName =
  | "Brand Identity"
  | "Website Development"
  | "Social Media Management"
  | "Brand Strategy"
  | "Photography & Videography"
  | "Print & Collateral"

export type OutcomeId =
  | "unclear-brand"
  | "weak-website"
  | "invisible-content"
  | "no-strategy"
  | "need-production"
  | "full-system"

export type Outcome = {
  id: OutcomeId
  number: string
  title: string
  problem: string
  outcome: string
  serviceIds: string[]
  pathId: PackagePathId
  packageServices: PackageServiceName[]
}

export type PackagePath = {
  id: PackagePathId
  label: string
  short: string
  description: string
  packageServices: PackageServiceName[]
  recommended?: boolean
}

export const OUTCOMES: Outcome[] = [
  {
    id: "unclear-brand",
    number: "01",
    title: "My brand looks unclear",
    problem: "People don’t get what you do, or you look smaller than you are.",
    outcome: "A sharper first impression: logo, system, and rules that hold together.",
    serviceIds: ["brand-identity", "brand-strategy"],
    pathId: "identity",
    packageServices: ["Brand Identity", "Brand Strategy"],
  },
  {
    id: "weak-website",
    number: "02",
    title: "My website isn’t working",
    problem: "The site is dated, unclear, or cannot take the next step from a visitor.",
    outcome: "A Web Design engagement: marketing site, landing page, or redesign that converts.",
    serviceIds: ["web-design"],
    pathId: "website",
    packageServices: ["Website Development"],
  },
  {
    id: "invisible-content",
    number: "03",
    title: "We need content that shows up",
    problem: "Social is inconsistent, or visuals don’t match the brand you want to be.",
    outcome: "A content rhythm and assets that feel intentional across channels.",
    serviceIds: ["social-media", "photography-videography"],
    pathId: "content",
    packageServices: ["Social Media Management", "Photography & Videography"],
  },
  {
    id: "no-strategy",
    number: "04",
    title: "We need direction before we spend",
    problem: "Channels are busy, but growth is unclear. Too many options, no priorities.",
    outcome: "Marketing Consultation: audience, message, and a plan you can act on.",
    serviceIds: ["brand-strategy"],
    pathId: "strategy",
    packageServices: ["Brand Strategy"],
  },
  {
    id: "need-production",
    number: "05",
    title: "We need production & campaign assets",
    problem: "Photography, video, or campaign design feels ad-hoc or off-brand.",
    outcome: "Media Production: stills, video, or campaign design that matches the rest of the work.",
    serviceIds: ["photography-videography", "print-production"],
    pathId: "production",
    packageServices: ["Photography & Videography", "Print & Collateral"],
  },
  {
    id: "full-system",
    number: "06",
    title: "We need the full system",
    problem: "Website, product, marketing, and media are disconnected. You want one studio.",
    outcome: "A coherent stack across our four pillars — without juggling vendors.",
    serviceIds: ["brand-strategy", "brand-identity", "web-design", "social-media"],
    pathId: "system",
    packageServices: [
      "Brand Strategy",
      "Brand Identity",
      "Website Development",
      "Social Media Management",
    ],
  },
]

export const PACKAGE_PATHS: PackagePath[] = [
  {
    id: "identity",
    label: "Brand identity",
    short: "Identity",
    description: "Look and feel: logo, system, and guidelines.",
    packageServices: ["Brand Identity"],
  },
  {
    id: "website",
    label: "Website",
    short: "Website",
    description: "A clearer digital presence that converts.",
    packageServices: ["Website Development"],
    recommended: true,
  },
  {
    id: "content",
    label: "Content & social",
    short: "Content",
    description: "Ongoing presence and scroll-stopping assets.",
    packageServices: ["Social Media Management"],
  },
  {
    id: "strategy",
    label: "Strategy",
    short: "Strategy",
    description: "Positioning and direction before execution.",
    packageServices: ["Brand Strategy"],
  },
  {
    id: "production",
    label: "Photo, video & print",
    short: "Production",
    description: "Campaign visuals and physical collateral.",
    packageServices: ["Photography & Videography", "Print & Collateral"],
  },
  {
    id: "system",
    label: "Full brand system",
    short: "Full system",
    description: "Strategy, identity, web, and content together.",
    packageServices: [
      "Brand Strategy",
      "Brand Identity",
      "Website Development",
      "Social Media Management",
    ],
  },
]

export function getPathById(id: string | null | undefined): PackagePath | undefined {
  if (!id) return undefined
  return PACKAGE_PATHS.find((p) => p.id === id)
}

export function getOutcomeById(id: string | null | undefined): Outcome | undefined {
  if (!id) return undefined
  return OUTCOMES.find((o) => o.id === id)
}
