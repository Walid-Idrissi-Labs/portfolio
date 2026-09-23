import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Serve modern formats (AVIF first, WebP fallback) for optimized images.
    formats: ["image/avif", "image/webp"],
    // Optimized images are static assets here; cache them for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Baseline security headers on every route. No full Content-Security-Policy
  // yet: the animation/WebGL libraries need a hand-tuned script/style policy,
  // so only the framing directive is set for now.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

// Opt-in bundle analysis: `ANALYZE=true npm run build` generates the report.
// It is a no-op for normal builds.
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
