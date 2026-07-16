import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lint roda no CI/local via ESLint CLI (`npm run lint`). O `next lint`
  // embutido é deprecado no Next 15 e incompatível com o ESLint instalado.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
