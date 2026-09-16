import type { NextConfig } from 'next';

/**
 * Two build modes:
 *
 *   npm run build          Node/serverless build with ISR. Use this when the host
 *                          runs Next (Netlify's Next runtime, Vercel, a container).
 *                          The fair schedule and order dates stay fresh hourly.
 *
 *   npm run build:static   Fully static export to ./out — no server at all.
 *                          Use this for drag-and-drop hosting. Everything works
 *                          except that date-relative content ("next Spice Fair",
 *                          order history) is frozen at build time, so rebuild to
 *                          refresh it.
 */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        // No image optimisation server exists in a static export.
        images: { unoptimized: true },
      }
    : {}),
  reactStrictMode: true,
  typedRoutes: false,
  // The prototype keeps its own README; no generated agent rule files.
  agentRules: false,
};

export default nextConfig;
