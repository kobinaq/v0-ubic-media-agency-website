import { NextResponse } from "next/server"
import { getFxQuote } from "@/lib/exchange-rate"

export const revalidate = 3600

export async function GET() {
  const quote = await getFxQuote()
  return NextResponse.json(quote, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
