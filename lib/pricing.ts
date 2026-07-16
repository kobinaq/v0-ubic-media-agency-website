export const DEFAULT_GHS_PER_USD = 15.5
export const DEFAULT_USD_MARKUP = 1.5

export type PricingQuote = {
  ghsPerUsd: number
  markup: number
}

/**
 * Convert a GHS catalog price to a USD checkout/display price.
 * Formula: round((GHS / rate) * markup) where markup defaults to 1.5 (50%).
 */
export function convertGhsToUsd(
  priceGhs: number,
  ghsPerUsd: number,
  markup: number = DEFAULT_USD_MARKUP,
): number {
  if (!Number.isFinite(priceGhs) || priceGhs <= 0) return 0
  if (!Number.isFinite(ghsPerUsd) || ghsPerUsd <= 0) return 0
  if (!Number.isFinite(markup) || markup <= 0) return 0
  return Math.round((priceGhs / ghsPerUsd) * markup)
}

export function amountFromGhs(
  priceGhs: number,
  currency: "GHS" | "USD",
  quote: PricingQuote = { ghsPerUsd: DEFAULT_GHS_PER_USD, markup: DEFAULT_USD_MARKUP },
): number {
  if (currency === "GHS") return priceGhs
  return convertGhsToUsd(priceGhs, quote.ghsPerUsd, quote.markup)
}
