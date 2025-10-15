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
              <p>Hi ${customerName},</p>
              <p>We're excited to start working with you! Your payment has been successfully processed.</p>
              
              <div class="details">
                <h2>Order Details</h2>
                <p><strong>Order Reference:</strong> ${orderDetails.orderReference}</p>
                <p><strong>Package:</strong> ${orderDetails.packageName}</p>
                <p><strong>Amount:</strong> ${orderDetails.currency} ${orderDetails.amount.toLocaleString()}</p>
              </div>
              
              <p>Our team will reach out to you within 24 hours to discuss the next steps and begin your project.</p>
              
              <p>If you have any questions, feel free to contact us at info@weareubic.com or call +233 533 904 720.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">Visit Our Website</a>
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
  const mailOptions = {
    from: `"Ubic Media Agency" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
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
                <p><strong>Order Reference:</strong> ${orderDetails.orderReference}</p>
                <p><strong>Customer Name:</strong> ${orderDetails.customerName}</p>
                <p><strong>Customer Email:</strong> ${orderDetails.customerEmail}</p>
                <p><strong>Package:</strong> ${orderDetails.packageName}</p>
                <p><strong>Amount:</strong> ${orderDetails.currency} ${orderDetails.amount.toLocaleString()}</p>
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
