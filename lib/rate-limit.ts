type Bucket = {
  timestamps: number[]
}

const buckets = new Map<string, Bucket>()

type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): {
  ok: boolean
  remaining: number
  retryAfterSec: number
} {
  const now = Date.now()
  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000))
    buckets.set(key, bucket)
    return { ok: false, remaining: 0, retryAfterSec }
  }

  bucket.timestamps.push(now)
  buckets.set(key, bucket)
  return {
    ok: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSec: 0,
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return request.headers.get("x-real-ip") || "unknown"
}
