import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ddi-cdn.deepsearch.com'],
    qualities: [75, 100],
  },
};

export default nextConfig;
