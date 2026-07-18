import type { Metadata } from "next";

import "./globals.css";
import { dmSerifFont, ibmFont, unboundedFont } from "./fonts";
import SmoothScroll from "./components/utilities/SmoothScroll";

export const metadata: Metadata = {
  title: "Walid Idrissi",
  description: "Portfolio of Walid Idrissi — software engineering student building for the web and the cloud.",
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
