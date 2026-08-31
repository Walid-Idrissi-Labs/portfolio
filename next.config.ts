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
};

// Opt-in bundle analysis: `ANALYZE=true npm run build` generates the report.
// It is a no-op for normal builds.
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
