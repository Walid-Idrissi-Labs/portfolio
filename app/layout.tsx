import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { dmSerifFont, ibmFont, unboundedFont } from "./fonts";
import SmoothScroll from "./components/utilities/SmoothScroll";
import { ConsoleSignature } from "./components/utilities/console-signature";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Software Engineering Student`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: `${SITE_NAME} Portfolio`,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  keywords: [
    "Walid Idrissi",
    "Walid Idrissi Labkhati",
    "software engineering student",
    "software engineer Marrakech",
    "full-stack developer",
    "AWS cloud engineering",
    "Terraform",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: `${SITE_NAME} Portfolio`,
    title: `${SITE_NAME} | Software Engineering Student`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Software Engineering Student`,
    description: SITE_DESCRIPTION,
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  // The site is dark by design: tells Dark Reader to leave it alone. Dark
  // Reader only checks the tag exists; the value just needs to be non-empty
  // because Next omits meta tags with empty content.
  other: { "darkreader-lock": "true" },
};

// Declares the page as already dark, so browser auto-dark modes skip it and
// native UI (scrollbars, form controls) renders dark.
export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${unboundedFont.variable} ${ibmFont.variable} ${dmSerifFont.variable}`}>
      <body className="bg-black text-white no-scrollbar">
        <SmoothScroll />
        <ConsoleSignature />
        {children}
        {/* Vercel Web Analytics (cookieless page views) and Speed Insights
            (real-user Core Web Vitals); both no-ops outside Vercel. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
