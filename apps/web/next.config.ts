import path from "node:path";

import {
  config as loadEnvironment,
} from "dotenv";

import type {
  NextConfig,
} from "next";

const monorepoRoot = path.resolve(
  __dirname,
  "../..",
);

loadEnvironment({
  path: path.join(
    monorepoRoot,
    ".env.local",
  ),
});

const nextConfig: NextConfig = {
  transpilePackages: [
    "@education/config",
    "@education/types",
    "@education/validation",
    "@education/ui",
    "@education/calculators",
    "@education/exam-data",
    "@education/database",
    "@education/auth",
  ],

  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;