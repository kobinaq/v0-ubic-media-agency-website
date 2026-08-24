/**
 * Simple, shared hero language.
 * Service line covers the full offer on every major page.
 */

/** Short labels for the four service pillars */
export const SERVICE_LABELS = [
  "Web Design",
  "Web Apps",
  "Marketing",
  "Media",
] as const

/** One-line list used in heroes and meta strips */
export const SERVICE_LINE = SERVICE_LABELS.join(" · ")

/** Compact meta strip */
export const SERVICE_META = "Web Design · Web Apps · Marketing · Media"

export const heroCopy = {
  home: {
    metaLeft: SERVICE_LINE,
    metaRightLabel: "Based in",
    metaRightValue: "Accra, Ghana",
    eyebrow: "Creative agency",
    line1: "We build what",
    line2: "your business runs on.",
    body: "Web design, web app development, marketing consultation, and media production. Built for businesses that need to run, not just look the part.",
    ctaPrimary: "Book a call",
    ctaSecondary: "See work",
    scroll: "Scroll",
    scrollLink: "Selected work ↓",
  },
  services: {
    eyebrow: "Services",
    meta: ["All services", SERVICE_LINE, "Accra, Ghana"],
    title: "Four pillars. One studio.",
    titleAccent: "",
    description:
      "Web design, web app development, marketing consultation, and media production. Pick what is stuck and we will show the right work.",
  },
  packages: {
    eyebrow: "Packages",
    meta: (step: number, currency: string) => ["Pricing", `Step ${step} of 2`, currency],
    titleStep1: "Simple pricing.",
    titleStep1Accent: "Pick a path.",
    titleStep2: (label: string) => label,
    titleStep2Accent: "Choose a package.",
    descriptionStep1:
      "Packages across web design, web apps, marketing consultation, and media production. Start with a path to see only what matches.",
  },
  about: {
    eyebrow: "About",
    meta: ["The studio", "Accra, Ghana", SERVICE_LINE],
    title: "A creative studio",
    titleAccent: "for the work your business runs on.",
    aside:
      "We handle web design, web apps, marketing consultation, and media production so the work stays consistent from site to campaign.",
  },
  work: {
    eyebrow: "Work",
    meta: (count: number) => ["Case studies", `${count} projects`, SERVICE_LINE],
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
      "Web design, web apps, marketing consultation, or media production. Send a brief, WhatsApp us, or book a call.",
    bullets: [
      "Any of our services, or a mix",
      "Rough budget and timeline help",
      "We reply within one working day",
    ],
  },
} as const
