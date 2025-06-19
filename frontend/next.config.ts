import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint errors during build
  eslint: {
    // Warning: Ignoring ESLint errors is not recommended for production
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during build
  typescript: {
    // Warning: Ignoring TypeScript errors is not recommended for production
    ignoreBuildErrors: true,
  },

  /* other existing config options here */
};

export default nextConfig;
