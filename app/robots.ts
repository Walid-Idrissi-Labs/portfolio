import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/site";

// Served at /robots.txt. Everything is crawlable except the form API routes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
