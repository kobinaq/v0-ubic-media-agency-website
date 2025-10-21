"use client"

import { useEffect, useState, useCallback } from "react"

export type Currency = "GHS" | "USD"

export async function detectCurrency(locale?: string): Promise<Currency> {
  try {
    // First check locale
    if (locale?.includes("GH") || locale?.includes("gh")) {
      return "GHS"
    }

    // Try to detect from timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone?.includes("Africa/Accra")) {
      return "GHS"
    }

    // Default to USD for international users
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

  useEffect(() => {
    const detectAndSetCurrency = async () => {
      const detected = await detectCurrency()
      setCurrencyState(detected)
      setIsLoading(false)
    }

    detectAndSetCurrency()
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
  }, [])

  const formatPriceFunc = (amount: number): string => {
    return formatPriceWithCurrency(amount, currency)
  }

  return { currency, setCurrency, formatPrice: formatPriceFunc, isLoading }
}
