# Ubic Media Agency Website

A modern, full-stack Next.js website for Ubic Media Agency with integrated payments, database, and content management.

## Features

- 🎨 Modern, minimal design inspired by Matchstic.com
- 💳 Paystack payment integration (GHS/USD)
- 🗄️ PostgreSQL database for leads and orders
- 📧 Email notifications via SMTP
- 📊 Google Analytics integration
- 🔐 Password-protected admin dashboard
- 📝 JSON-based content management
- 🌍 Multi-currency support (auto-detection)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Paystack account
- SMTP email service

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Copy `.env.example` to `.env` and fill in your credentials:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Run database migrations:
   - The SQL scripts in `/scripts` will create the necessary tables
   - You can run them directly in your PostgreSQL client or use the v0 script runner

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js app router pages
├── components/             # React components
├── content/               # JSON content files (editable)
│   ├── site-config.json
│   ├── about.json
│   ├── services.json
│   ├── packages.json
│   └── portfolio.json
├── lib/                   # Utility functions
│   ├── db.ts             # Database connection
│   ├── content.ts        # Content loader
│   └── currency.ts       # Currency utilities
├── scripts/              # Database migrations
└── public/               # Static assets
\`\`\`

## Content Management

All site content is managed through JSON files in the `/content` directory. Simply edit these files to update:

- Site information and contact details
- About page content
- Services offered
- Package pricing and features
- Portfolio projects

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables

Make sure to add all variables from `.env.example` to your Vercel project settings.

Notification variables:

- `ADMIN_NOTIFICATION_EMAIL` - admin inbox for order and lead emails. Defaults to `weareubic@gmail.com`.
- `ADMIN_SMS_RECIPIENTS` - comma-separated phone numbers for admin SMS prompts, for example `233XXXXXXXXX,233YYYYYYYYY`.
- `ARKESEL_API_KEY` - Arkesel SMS API key.
- `ARKESEL_SENDER_ID` - SMS sender ID, 11 characters maximum. Defaults to `UBIC`.
- `ARKESEL_SMS_ENDPOINT` - optional override for the Arkesel SMS endpoint. Defaults to `https://sms.arkesel.com/api/v2/sms/send`.
- `ARKESEL_SMS_FALLBACK_V1` - optional. Leave unset to retry Arkesel's v1 GET endpoint if v2 fails; set to `false` to disable fallback.

## Payment Flow

1. User selects a package
2. Currency detected (GHS for Ghana, USD for others)
3. Paystack checkout initialized
4. User completes payment
5. Webhook verifies payment
6. Order status updated in database
7. Confirmation email sent

## Admin Dashboard

Access the admin dashboard at `/admin/orders` with credentials set in environment variables.

Features:
- View all orders
- Filter by status
- Export to CSV
- View customer details

## Support

For issues or questions, contact: info@weareubic.com

## License

© 2025 Ubic Media Agency. All rights reserved.
