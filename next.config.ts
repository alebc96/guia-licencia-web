import type { NextConfig } from "next";

/**
 * The site is a fully static export. `NEXT_PUBLIC_BASE_PATH` allows deploying it
 * under a sub-path (GitHub Pages project sites use `/<repository>/`).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  agentRules: false,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
