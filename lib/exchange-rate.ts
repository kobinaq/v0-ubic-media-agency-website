import {
  convertGhsToUsd,
  DEFAULT_GHS_PER_USD,
  DEFAULT_USD_MARKUP,
  type PricingQuote,
} from "@/lib/pricing"

const CACHE_TTL_MS = 60 * 60 * 1000
const FX_URL = "https://open.er-api.com/v6/latest/USD"

type RateCache = {
  ghsPerUsd: number
  fetchedAt: number
  source: string
}

export type FxQuote = PricingQuote & {
  source: string
  fetchedAt: string
}

let cache: RateCache | null = null

export function getUsdMarkup(): number {
  const fromEnv = Number(process.env.USD_PRICE_MARKUP)
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv
  return DEFAULT_USD_MARKUP
}

function envGhsPerUsd(): number | null {
  const fromEnv = Number(process.env.GHS_PER_USD)
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv
  return null
}

export { convertGhsToUsd }

export async function getFxQuote(): Promise<FxQuote> {
  const markup = getUsdMarkup()
  const envRate = envGhsPerUsd()

  if (envRate) {
    return {
      ghsPerUsd: envRate,
      markup,
      source: "env",
      fetchedAt: new Date().toISOString(),
    }
  }

  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return {
      ghsPerUsd: cache.ghsPerUsd,
      markup,
      source: cache.source,
      fetchedAt: new Date(cache.fetchedAt).toISOString(),
    }
  }

  try {
    const response = await fetch(FX_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`FX provider status ${response.status}`)
    }

    const data = (await response.json()) as {
      result?: string
      rates?: { GHS?: number }
    }

    const ghsPerUsd = Number(data.rates?.GHS)
    if (data.result !== "success" || !Number.isFinite(ghsPerUsd) || ghsPerUsd <= 0) {
      throw new Error("FX provider returned an invalid GHS rate")
    }

    cache = {
      ghsPerUsd,
      fetchedAt: Date.now(),
      source: "open.er-api.com",
    }

    return {
      ghsPerUsd,
      markup,
      source: cache.source,
      fetchedAt: new Date(cache.fetchedAt).toISOString(),
    }
  } catch (error) {
    console.error("[fx] Failed to fetch live GHS/USD rate:", error)

    if (cache) {
      return {
        ghsPerUsd: cache.ghsPerUsd,
        markup,
        source: `${cache.source}-stale`,
        fetchedAt: new Date(cache.fetchedAt).toISOString(),
      }
    }

    return {
      ghsPerUsd: DEFAULT_GHS_PER_USD,
      markup,
      source: "fallback",
      fetchedAt: new Date().toISOString(),
    }
  }
}
