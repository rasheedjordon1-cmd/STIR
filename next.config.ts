import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  // The prototype keeps its own README; no generated agent rule files.
  agentRules: false,
};

export default nextConfig;
