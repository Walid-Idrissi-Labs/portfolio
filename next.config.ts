import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Serve modern formats (AVIF first, WebP fallback) for optimized images.
    formats: ["image/avif", "image/webp"],
    // Optimized images are static assets here; cache them for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
