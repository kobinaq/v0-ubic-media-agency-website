/**
 * Simple, shared hero language.
 * Service line covers the full offer on every major page.
 */

/** Short labels for the full service set */
export const SERVICE_LABELS = [
  "Strategy",
  "Identity",
  "Websites",
  "Social",
  "Photo",
  "Video",
  "Print",
] as const

/** One-line list used in heroes and meta strips */
export const SERVICE_LINE = SERVICE_LABELS.join(" · ")

/** Compact meta strip (two lines) */
export const SERVICE_META = "Strategy · Identity · Web · Social\nPhoto · Video · Print"

export const heroCopy = {
  home: {
    metaLeft: SERVICE_LINE,
    metaRightLabel: "Based in",
    metaRightValue: "Accra, Ghana",
    eyebrow: "Creative agency",
    line1: "We build brands.",
    line2: "And everything around them.",
    body: "Strategy, identity, websites, social, photo, video, and print. Built for businesses that need to look sharper.",
    ctaPrimary: "Book a call",
    ctaSecondary: "See work",
    scroll: "Scroll",
    scrollLink: "Selected work ↓",
  },
  services: {
    eyebrow: "Services",
    meta: ["All services", SERVICE_LINE, "Accra, Ghana"],
    title: "What we do.",
    titleAccent: "",
    description:
      "Strategy, identity, websites, social, photo, video, and print. Pick what is stuck and we will show the right work.",
  },
  packages: {
    eyebrow: "Packages",
    meta: (step: number, currency: string) => ["Pricing", `Step ${step} of 2`, currency],
    titleStep1: "Simple pricing.",
    titleStep1Accent: "Pick a path.",
    titleStep2: (label: string) => label,
    titleStep2Accent: "Choose a package.",
    descriptionStep1:
      "Packages for strategy, identity, websites, social, photo, video, and print. Start with a path to see only what matches.",
  },
  about: {
    eyebrow: "About",
    meta: ["The studio", "Accra, Ghana", SERVICE_LINE],
    title: "A creative studio",
    titleAccent: "for full brand work.",
    aside:
      "We handle strategy, identity, websites, social, photo, video, and print so your brand stays consistent everywhere.",
  },
  work: {
    eyebrow: "Work",
    meta: (count: number) => ["Case studies", `${count} projects`, SERVICE_LINE],
    title: "Selected work.",
    description:
      "Projects across strategy, identity, websites, social, photo, video, and print.",
  },
  contact: {
    eyebrow: "Contact",
    meta: ["Start a project", "Reply in one day", "Accra, Ghana"],
    title: "Tell us what you need.",
    titleAccent: "",
    aside:
      "Strategy, identity, websites, social, photo, video, or print. Send a brief, WhatsApp us, or book a call.",
    bullets: [
      "Any of our services, or a mix",
      "Rough budget and timeline help",
      "We reply within one working day",
    ],
  },
} as const
