/**
 * Shared outcome → pillar → package path mapping
 * for Services (outcome map) and Packages (path picker).
 */

export type PackagePathId = "web-design" | "web-app" | "marketing" | "media"

/** Package JSON `service` field values shown on a path */
export type PackageServiceName =
  | "Web Design"
  | "Web App Development"
  | "Marketing Consultation"
  | "Brand Development"
  | "Photography & Videography"
  | "Print & Collateral"

export type OutcomeId = "weak-website" | "need-product" | "need-marketing" | "need-media"

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

const PATH_ALIASES: Record<string, PackagePathId> = {
  website: "web-design",
  identity: "media",
  strategy: "marketing",
  content: "marketing",
  production: "media",
  system: "web-design",
}

export const OUTCOMES: Outcome[] = [
  {
    id: "weak-website",
    number: "01",
    title: "My website isn’t working",
    problem: "The site is dated, unclear, or cannot take the next step from a visitor.",
    outcome: "Web Design: a landing page, marketing site, or redesign that converts.",
    serviceIds: ["web-design"],
    pathId: "web-design",
    packageServices: ["Web Design"],
  },
  {
    id: "need-product",
    number: "02",
    title: "I need a real web app",
    problem: "A marketing page is not enough. People need accounts, dashboards, or a custom tool.",
    outcome: "Web App Development: a working product with real user flows.",
    serviceIds: ["web-app-development"],
    pathId: "web-app",
    packageServices: ["Web App Development"],
  },
  {
    id: "need-marketing",
    number: "03",
    title: "We need direction before we spend",
    problem: "Channels are busy, but growth is unclear. Too many options, no priorities.",
    outcome: "Marketing Consultation: audience, message, and a plan you can act on.",
    serviceIds: ["marketing-consultation"],
    pathId: "marketing",
    packageServices: ["Marketing Consultation"],
  },
  {
    id: "need-media",
    number: "04",
    title: "We need brand and campaign assets",
    problem: "The look is unfinished, or photography, video, and print are ad-hoc.",
    outcome: "Media Production: brand development to start, then photo, video, and print on a scoped brief.",
    serviceIds: ["media-production"],
    pathId: "media",
    packageServices: ["Brand Development", "Photography & Videography", "Print & Collateral"],
  },
]

export const PACKAGE_PATHS: PackagePath[] = [
  {
    id: "web-design",
    label: "Web Design",
    short: "Web",
    description: "Landing pages, marketing sites, and redesigns. From GHS 2,000.",
    packageServices: ["Web Design"],
    recommended: true,
  },
  {
    id: "web-app",
    label: "Web App Development",
    short: "Apps",
    description: "Accounts, dashboards, and custom tools. From GHS 8,000.",
    packageServices: ["Web App Development"],
  },
  {
    id: "marketing",
    label: "Marketing Consultation",
    short: "Marketing",
    description: "Strategy, channel clarity, and growth direction. From GHS 2,000.",
    packageServices: ["Marketing Consultation"],
  },
  {
    id: "media",
    label: "Media Production",
    short: "Media",
    description: "Brand development from GHS 1,500. Photo, video, and print on request.",
    packageServices: ["Brand Development", "Photography & Videography", "Print & Collateral"],
  },
]

export function getPathById(id: string | null | undefined): PackagePath | undefined {
  if (!id) return undefined
  const resolved = PATH_ALIASES[id] ?? (id as PackagePathId)
  return PACKAGE_PATHS.find((p) => p.id === resolved)
}

export function getOutcomeById(id: string | null | undefined): Outcome | undefined {
  if (!id) return undefined
  return OUTCOMES.find((o) => o.id === id)
}
