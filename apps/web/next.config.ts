import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  transpilePackages: [
    "@education/ui",
    "@education/config",
    "@education/types",
    "@education/validation",
    "@education/calculators",
    "@education/exam-data",
  ],

  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;