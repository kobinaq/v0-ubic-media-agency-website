"use client"

import { useCallback, useEffect, useState } from "react"
import {
  amountFromGhs,
  DEFAULT_GHS_PER_USD,
  DEFAULT_USD_MARKUP,
  type PricingQuote,
} from "@/lib/pricing"

export type Currency = "GHS" | "USD"

const DEFAULT_QUOTE: PricingQuote = {
  ghsPerUsd: DEFAULT_GHS_PER_USD,
  markup: DEFAULT_USD_MARKUP,
}

export async function detectCurrency(locale?: string): Promise<Currency> {
  try {
    if (locale?.includes("GH") || locale?.includes("gh")) {
      return "GHS"
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone?.includes("Africa/Accra")) {
      return "GHS"
    }

    return "USD"
  } catch {
    return "USD"
  }
}

export function formatPriceWithCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

export const formatPrice = formatPriceWithCurrency

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>("USD")
  const [isLoading, setIsLoading] = useState(true)
  const [quote, setQuote] = useState<PricingQuote>(DEFAULT_QUOTE)

  useEffect(() => {
    let cancelled = false

    const boot = async () => {
      try {
        const [detected, fxResponse] = await Promise.all([
          detectCurrency(),
          fetch("/api/fx").then((res) => (res.ok ? res.json() : null)),
        ])

        if (cancelled) return

        setCurrencyState(detected)
        if (fxResponse && Number.isFinite(Number(fxResponse.ghsPerUsd)) && Number(fxResponse.ghsPerUsd) > 0) {
          setQuote({
            ghsPerUsd: Number(fxResponse.ghsPerUsd),
            markup: Number(fxResponse.markup) > 0 ? Number(fxResponse.markup) : DEFAULT_USD_MARKUP,
          })
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
  }, [])

  const formatPriceFunc = useCallback(
    (priceGhs: number): string => {
      const amount = amountFromGhs(priceGhs, currency, quote)
      return formatPriceWithCurrency(amount, currency)
    },
    [currency, quote],
  )

  const toAmount = useCallback(
    (priceGhs: number): number => amountFromGhs(priceGhs, currency, quote),
    [currency, quote],
  )

  return {
    currency,
    setCurrency,
    formatPrice: formatPriceFunc,
    toAmount,
    quote,
    isLoading,
  }
}
