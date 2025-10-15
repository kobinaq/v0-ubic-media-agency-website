export type Currency = "GHS" | "USD"

export function detectCurrency(locale?: string): Currency {
  // Check if user is from Ghana based on locale or other indicators
  if (locale?.includes("GH") || locale?.includes("gh")) {
    return "GHS"
  }
  // Default to USD for international users
  return "USD"
}

export function formatPrice(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}
