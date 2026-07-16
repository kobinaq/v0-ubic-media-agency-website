export const DEFAULT_GHS_PER_USD = 15.5
export const DEFAULT_USD_MARKUP = 1.5
export const USD_ROUND_TO = 50

export type PricingQuote = {
  ghsPerUsd: number
  markup: number
}

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step
}

/**
 * Convert a GHS catalog price to a USD checkout/display price.
 * Formula: ((GHS / rate) * markup), then round to the nearest $50.
 * Markup defaults to 1.5 (50%).
 */
export function convertGhsToUsd(
  priceGhs: number,
  ghsPerUsd: number,
  markup: number = DEFAULT_USD_MARKUP,
): number {
  if (!Number.isFinite(priceGhs) || priceGhs <= 0) return 0
  if (!Number.isFinite(ghsPerUsd) || ghsPerUsd <= 0) return 0
  if (!Number.isFinite(markup) || markup <= 0) return 0

  const raw = (priceGhs / ghsPerUsd) * markup
  const rounded = roundToNearest(raw, USD_ROUND_TO)
  // Keep paid packages from collapsing to $0 after rounding.
  return rounded > 0 ? rounded : USD_ROUND_TO
}

export function amountFromGhs(
  priceGhs: number,
  currency: "GHS" | "USD",
  quote: PricingQuote = { ghsPerUsd: DEFAULT_GHS_PER_USD, markup: DEFAULT_USD_MARKUP },
): number {
  if (currency === "GHS") return priceGhs
  return convertGhsToUsd(priceGhs, quote.ghsPerUsd, quote.markup)
}
