import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Archivo, Fraunces, Space_Mono } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/lib/content"
import Script from "next/script"
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/schema"
import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { Preloader } from "@/components/preloader"
import { createPageMetadata } from "@/lib/seo"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: "400",
  display: "swap",
})

const rootPageMetadata = createPageMetadata({
  title: `${siteConfig.siteName} | Brand Identity, Websites & Creative Systems`,
  description: siteConfig.description,
  path: "/",
  ogTitle: `${siteConfig.siteName} | Build a Brand People Trust`,
  ogDescription:
    "Brand identity, websites, and content systems for ambitious businesses that need to look sharper and convert better.",
  keywords: [
    "brand development",
    "brand agency Ghana",
    "social media management",
    "web design Ghana",
    "photography services",
    "videography services",
    "creative agency Africa",
    "brand strategy",
    "digital marketing",
    "Accra",
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://weareubic.com"),
  ...rootPageMetadata,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  authors: [{ name: siteConfig.siteName }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${fraunces.variable} ${spaceMono.variable}`}
    >
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17783739010"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17783739010');
          `}
        </Script>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="HIr3392pU3/31kWjyzx8jg"
          async
        ></script>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <Preloader />
          <SmoothScroll />
          <CustomCursor />
          {children}
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <VercelAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
