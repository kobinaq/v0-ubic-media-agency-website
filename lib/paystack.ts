import crypto from "crypto"

export interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    reference: string
    amount: number
    currency: string
    status: string
    customer: {
      email: string
    }
  }
}

type InitializeOptions = {
  reference?: string
  callbackUrl?: string
}

export async function initializePaystackTransaction(
  email: string,
  amount: number,
  currency: string,
  metadata: Record<string, unknown>,
  options: InitializeOptions = {},
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || ""
  const payload: Record<string, unknown> = {
    email,
    amount: Math.round(amount * 100), // Paystack expects amount in kobo/cents
    currency,
    metadata,
    callback_url: options.callbackUrl || `${siteUrl}/payment/callback`,
  }

  if (options.reference) {
    payload.reference = options.reference
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "")
    console.error("[paystack] initialize failed:", response.status, errorBody)
    throw new Error("Failed to initialize Paystack transaction")
  }

  return (await response.json()) as PaystackInitializeResponse
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to verify Paystack transaction")
  }

  return (await response.json()) as PaystackVerifyResponse
}

export function verifyPaystackWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY
  if (!secret || !signature) return false

  const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex")
  const hashBuf = Buffer.from(hash)
  const signatureBuf = Buffer.from(signature)

  if (hashBuf.length !== signatureBuf.length) return false
  return crypto.timingSafeEqual(hashBuf, signatureBuf)
}
