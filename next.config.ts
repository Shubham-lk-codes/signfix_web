import type { NextConfig } from "next";

// CloudLinux/cPanel accounts enforce a low per-user process/thread limit.
// SWC uses Rayon's native thread pool, so constrain it before compilation.
process.env.RAYON_NUM_THREADS ??= "1";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // No remote/dynamic image loader is available for a static export, and
    // every photo on the site is currently a placeholder anyway.
    unoptimized: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
