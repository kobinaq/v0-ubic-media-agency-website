type SmsPayload = {
  message: string
  recipients?: string[]
}

type ArkeselResponse = {
  status?: string
  code?: string | number
  message?: string
}

const splitRecipients = (value?: string) =>
  (value || "")
    .split(",")
    .map((recipient) => normalizeRecipient(recipient))
    .filter(Boolean)

const normalizeRecipient = (recipient: string) => {
  const digits = recipient.replace(/[^\d]/g, "")
  if (digits.length === 10 && digits.startsWith("0")) return `233${digits.slice(1)}`
  return digits
}

const isFailedProviderResponse = (body: ArkeselResponse | null) => {
  if (!body) return false
  const status = String(body.status || "").toLowerCase()
  const message = String(body.message || "").toLowerCase()
  return status === "error" || status === "failed" || message.includes("failed") || message.includes("inactive")
}

const sendViaV1 = async ({
  apiKey,
  sender,
  message,
  recipients,
}: {
  apiKey: string
  sender: string
  message: string
  recipients: string[]
}) => {
  const endpoint = process.env.ARKESEL_SMS_V1_ENDPOINT || "https://sms.arkesel.com/sms/api"
  const url = new URL(endpoint)
  url.searchParams.set("action", "send-sms")
  url.searchParams.set("api_key", apiKey)
  url.searchParams.set("to", recipients.join(","))
  url.searchParams.set("from", sender)
  url.searchParams.set("sms", message)
  url.searchParams.set("response", "json")

  const response = await fetch(url.toString(), { method: "GET" })
  const responseText = await response.text().catch(() => "")

  if (!response.ok) {
    throw new Error(`Arkesel SMS v1 failed with ${response.status}: ${responseText}`)
  }

  console.log("[sms] Arkesel v1 response:", responseText)
}

export async function sendAdminSms({ message, recipients = splitRecipients(process.env.ADMIN_SMS_RECIPIENTS) }: SmsPayload) {
  return sendSms({ message, recipients })
}

export async function sendClientSms({ message, recipients }: SmsPayload) {
  return sendSms({ message, recipients })
}

async function sendSms({ message, recipients = [] }: SmsPayload) {
  const apiKey = process.env.ARKESEL_API_KEY
  const sender = (process.env.ARKESEL_SENDER_ID || "UBIC").slice(0, 11)
  const endpoint = process.env.ARKESEL_SMS_ENDPOINT || "https://sms.arkesel.com/api/v2/sms/send"
  const fallbackToV1 = process.env.ARKESEL_SMS_FALLBACK_V1 !== "false"

  if (!apiKey || recipients.length === 0) {
    console.warn("[sms] Missing ARKESEL_API_KEY or ADMIN_SMS_RECIPIENTS; skipping SMS notification.")
    return
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender,
        message,
        recipients,
      }),
    })

    const responseText = await response.text().catch(() => "")
    let responseBody: ArkeselResponse | null = null

    try {
      responseBody = responseText ? JSON.parse(responseText) : null
    } catch {
      responseBody = null
    }

    console.log("[sms] Arkesel v2 response:", responseText || response.status)

    if (!response.ok || isFailedProviderResponse(responseBody)) {
      throw new Error(`Arkesel SMS v2 failed with ${response.status}: ${responseText}`)
    }
  } catch (error) {
    if (!fallbackToV1) throw error
    console.error("[sms] Arkesel v2 failed; retrying v1:", error)
    await sendViaV1({ apiKey, sender, message, recipients })
  }
}
