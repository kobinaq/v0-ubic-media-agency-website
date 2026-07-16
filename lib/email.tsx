import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

const adminRecipients = () =>
  Array.from(
    new Set(
      [process.env.ADMIN_NOTIFICATION_EMAIL || "weareubic@gmail.com", process.env.SMTP_USER].filter(
        (recipient): recipient is string => Boolean(recipient),
      ),
    ),
  )

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderDetails: {
    orderReference: string
    packageName: string
    amount: number
    currency: string
  },
) {
  const safeName = escapeHtml(customerName)
  const safeReference = escapeHtml(orderDetails.orderReference)
  const safePackage = escapeHtml(orderDetails.packageName)
  const safeCurrency = escapeHtml(orderDetails.currency)
  const safeAmount = escapeHtml(orderDetails.amount.toLocaleString())
  const siteUrl = escapeHtml(process.env.NEXT_PUBLIC_SITE_URL || "https://weareubic.com")

  const mailOptions = {
    from: `"Ubic Media Agency" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: "Order Confirmation - Ubic Media Agency",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background-color: #2d5f3f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <p>Hi ${safeName},</p>
              <p>We're excited to start working with you! Your payment has been successfully processed.</p>
              
              <div class="details">
                <h2>Order Details</h2>
                <p><strong>Order Reference:</strong> ${safeReference}</p>
                <p><strong>Package:</strong> ${safePackage}</p>
                <p><strong>Amount:</strong> ${safeCurrency} ${safeAmount}</p>
              </div>
              
              <p>Our team will reach out to you within 24 hours to discuss the next steps and begin your project.</p>
              
              <p>If you have any questions, feel free to contact us at info@weareubic.com or call +233 533 904 720.</p>
              
              <a href="${siteUrl}" class="button">Visit Our Website</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Ubic Media Agency. All rights reserved.</p>
              <p>Building Brands That Resonate, Inspire, and Lead</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendAdminOrderNotification(orderDetails: {
  orderReference: string
  customerName: string
  customerEmail: string
  packageName: string
  amount: number
  currency: string
}) {
  const safeReference = escapeHtml(orderDetails.orderReference)
  const safeName = escapeHtml(orderDetails.customerName)
  const safeEmail = escapeHtml(orderDetails.customerEmail)
  const safePackage = escapeHtml(orderDetails.packageName)
  const safeCurrency = escapeHtml(orderDetails.currency)
  const safeAmount = escapeHtml(orderDetails.amount.toLocaleString())

  const mailOptions = {
    from: `"Ubic Media Agency" <${process.env.SMTP_USER}>`,
    to: adminRecipients(),
    subject: `New Order: ${orderDetails.packageName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2d5f3f; color: white; padding: 20px; }
            .content { padding: 20px; }
            .details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #2d5f3f; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Order Received</h2>
            </div>
            <div class="content">
              <div class="details">
                <p><strong>Order Reference:</strong> ${safeReference}</p>
                <p><strong>Customer Name:</strong> ${safeName}</p>
                <p><strong>Customer Email:</strong> ${safeEmail}</p>
                <p><strong>Package:</strong> ${safePackage}</p>
                <p><strong>Amount:</strong> ${safeCurrency} ${safeAmount}</p>
              </div>
              <p>Please follow up with the customer within 24 hours.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendLeadConfirmationEmail(customerEmail: string, customerName: string) {
  const safeName = escapeHtml(customerName)
  const siteUrl = escapeHtml(process.env.NEXT_PUBLIC_SITE_URL || "https://weareubic.com")

  const mailOptions = {
    from: `"Ubic Media Agency" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: "We received your brief - Ubic Media Agency",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background-color: #2d5f3f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
              <p>Hi ${safeName},</p>
              <p>Thanks for reaching out. We've received your brief and our team will review it shortly.</p>
              <p>We'll get back to you soon with a clear next step, whether that's a quick answer, a scope recommendation, or a call to talk through the project properly.</p>
              
              <p>In the meantime, feel free to explore more about our services on our website or reach out directly:</p>
              <p>
                <strong>Phone:</strong> +233 533 904 720<br>
                <strong>Email:</strong> info@weareubic.com
              </p>
              
              <a href="${siteUrl}" class="button">Visit Our Website</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Ubic Media Agency. All rights reserved.</p>
              <p>Building Brands That Resonate, Inspire, and Lead</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendAdminLeadNotification(leadDetails: {
  customerName: string
  customerEmail: string
  message: string
}) {
  const safeName = escapeHtml(leadDetails.customerName)
  const safeEmail = escapeHtml(leadDetails.customerEmail)
  const safeMessage = escapeHtml(leadDetails.message).replace(/\n/g, "<br>")

  const mailOptions = {
    from: `"Ubic Media Agency" <${process.env.SMTP_USER}>`,
    to: adminRecipients(),
    subject: `New Lead: ${leadDetails.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2d5f3f; color: white; padding: 20px; }
            .content { padding: 20px; }
            .details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #2d5f3f; }
            .message { background-color: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Lead Received</h2>
            </div>
            <div class="content">
              <div class="details">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
              </div>
              
              <h3>Message:</h3>
              <div class="message">
                ${safeMessage}
              </div>
              
              <p>Please follow up with this lead as soon as possible.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendAdminOrderStartedNotification(orderDetails: {
  orderReference: string
  customerName: string
  customerEmail: string
  packageName: string
  amount: number
  currency: string
}) {
  const safeReference = escapeHtml(orderDetails.orderReference)
  const safeName = escapeHtml(orderDetails.customerName)
  const safeEmail = escapeHtml(orderDetails.customerEmail)
  const safePackage = escapeHtml(orderDetails.packageName)
  const safeCurrency = escapeHtml(orderDetails.currency)
  const safeAmount = escapeHtml(orderDetails.amount.toLocaleString())

  const mailOptions = {
    from: `"Ubic Media Agency" <${process.env.SMTP_USER}>`,
    to: adminRecipients(),
    subject: `Checkout Started: ${orderDetails.packageName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #c1442d; color: white; padding: 20px;">
              <h2>Checkout Started</h2>
            </div>
            <div style="padding: 20px;">
              <p>A customer started checkout. Payment is still pending until Paystack confirms completion.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #c1442d;">
                <p><strong>Order Reference:</strong> ${safeReference}</p>
                <p><strong>Customer Name:</strong> ${safeName}</p>
                <p><strong>Customer Email:</strong> ${safeEmail}</p>
                <p><strong>Package:</strong> ${safePackage}</p>
                <p><strong>Amount:</strong> ${safeCurrency} ${safeAmount}</p>
                <p><strong>Status:</strong> Pending</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}
