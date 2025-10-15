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

export async function initializePaystackTransaction(
  email: string,
  amount: number,
  currency: string,
  metadata: Record<string, any>,
) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects amount in kobo/cents
      currency,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
    }),
  })

  if (!response.ok) {
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
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET!).update(payload).digest("hex")
  return hash === signature
}
