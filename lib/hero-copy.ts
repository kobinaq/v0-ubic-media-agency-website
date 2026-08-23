/**
 * Simple, shared hero language.
 * Pillar line covers the full 4-pillar offer on every major page.
 */

/** Short labels for the four pillars */
export const PILLAR_LABELS = [
  "Web Design",
  "Web App Development",
  "Marketing Consultation",
  "Media Production",
] as const

/** One-line list used in heroes and meta strips */
export const PILLAR_LINE = PILLAR_LABELS.join(" · ")

/** Compact meta strip (two lines) */
export const PILLAR_META = "Web Design · Web App Development\nMarketing Consultation · Media Production"

// Back-compat aliases (some components may still import the old names)
export const SERVICE_LABELS = PILLAR_LABELS
export const SERVICE_LINE = PILLAR_LINE
export const SERVICE_META = PILLAR_META

export const heroCopy = {
  home: {
    metaLeft: PILLAR_LINE,
    metaRightLabel: "Based in",
    metaRightValue: "Accra, Ghana",
    eyebrow: "Digital studio",
    line1: "We build what businesses run on.",
    line2: "Websites, apps, growth, and story.",
    body: "Web design, web app development, marketing consultation, and media production — for businesses that need more than a brochure site.",
    ctaPrimary: "Book a call",
    ctaSecondary: "See work",
    scroll: "Scroll",
    scrollLink: "Selected work ↓",
  },
  services: {
    eyebrow: "Services",
    meta: ["Four pillars", PILLAR_LINE, "Accra, Ghana"],
    title: "What we do.",
    titleAccent: "",
    description:
      "Four pillars: web design, web app development, marketing consultation, and media production. Pick what is stuck and we will show the right work.",
  },
  packages: {
    eyebrow: "Packages",
    meta: (step: number, currency: string) => ["Pricing", `Step ${step} of 2`, currency],
    titleStep1: "Simple pricing.",
    titleStep1Accent: "Pick a path.",
    titleStep2: (label: string) => label,
    titleStep2Accent: "Choose a package.",
    descriptionStep1:
      "Packages for web design, web app development, marketing consultation, and media production. Start with a path to see only what matches.",
  },
  about: {
    eyebrow: "About",
    meta: ["The studio", "Accra, Ghana", PILLAR_LINE],
    title: "A digital studio",
    titleAccent: "built for real products, not just pretty pages.",
    aside:
      "We design and build websites and web apps, guide marketing strategy, and produce the media that carries it — so what you ship actually works.",
  },
  work: {
    eyebrow: "Work",
    meta: (count: number) => ["Case studies", `${count} projects`, PILLAR_LINE],
    title: "Selected work.",
    description:
      "Projects across web design, web app development, marketing consultation, and media production.",
  },
  contact: {
    eyebrow: "Contact",
    meta: ["Start a project", "Reply in one day", "Accra, Ghana"],
    title: "Tell us what you need.",
    titleAccent: "",
    aside:
      "Web design, web app development, marketing consultation, or media production. Send a brief, WhatsApp us, or book a call.",
    bullets: [
      "Any of our four pillars, or a mix",
      "Rough budget and timeline help",
      "We reply within one working day",
    ],
  },
} as const
