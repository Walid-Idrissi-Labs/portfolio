import type { Metadata, Viewport } from "next";

import "./globals.css";
import { dmSerifFont, ibmFont, unboundedFont } from "./fonts";
import SmoothScroll from "./components/utilities/SmoothScroll";

export const metadata: Metadata = {
  title: "Walid Idrissi",
  description: "Portfolio of Walid Idrissi — software engineering student building for the web and the cloud.",
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
        {children}
      </body>
    </html>
  );
}
