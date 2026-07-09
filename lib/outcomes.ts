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
    problem: "Visitors land, skim, and leave. The site feels dated or hard to use.",
    outcome: "A clearer site structure that builds trust and makes the next step obvious.",
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
    title: "We need direction before design",
    problem: "Too many options, no clear positioning, rebrand or launch feels messy.",
    outcome: "A strategy you can act on: audience, message, and priorities.",
    serviceIds: ["brand-strategy"],
    pathId: "strategy",
    packageServices: ["Brand Strategy"],
  },
  {
    id: "need-production",
    number: "05",
    title: "We need production & collateral",
    problem: "Campaigns, print, or physical touchpoints feel ad-hoc or off-brand.",
    outcome: "Polished stills, video, or print that match the digital brand.",
    serviceIds: ["photography-videography", "print-production"],
    pathId: "production",
    packageServices: ["Photography & Videography", "Print & Collateral"],
  },
  {
    id: "full-system",
    number: "06",
    title: "We need the full system",
    problem: "Brand, site, and content are disconnected. You want one partner.",
    outcome: "A coherent stack from strategy through rollout, without juggling vendors.",
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
