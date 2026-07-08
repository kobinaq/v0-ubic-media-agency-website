type SmsPayload = {
  message: string
  recipients?: string[]
}

const splitRecipients = (value?: string) =>
  (value || "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean)

export async function sendAdminSms({ message, recipients = splitRecipients(process.env.ADMIN_SMS_RECIPIENTS) }: SmsPayload) {
  const apiKey = process.env.ARKESEL_API_KEY
  const sender = process.env.ARKESEL_SENDER_ID || "UBIC"
  const endpoint = process.env.ARKESEL_SMS_ENDPOINT || "https://sms.arkesel.com/api/v2/sms/send"

  if (!apiKey || recipients.length === 0) {
    console.warn("[sms] Missing ARKESEL_API_KEY or ADMIN_SMS_RECIPIENTS; skipping SMS notification.")
    return
  }

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

  if (!response.ok) {
    const responseText = await response.text().catch(() => "")
    throw new Error(`Arkesel SMS failed with ${response.status}: ${responseText}`)
  }
}
