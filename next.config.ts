import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // No remote/dynamic image loader is available for a static export, and
    // every photo on the site is currently a placeholder anyway.
    unoptimized: true,
  },
};

export default nextConfig;
