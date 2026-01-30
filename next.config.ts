import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/elif',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;