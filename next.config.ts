import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This project is the tracing root; a lockfile above it must not win.
  outputFileTracingRoot: import.meta.dirname,
  // No page needs a server at request time.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
