/**
 * Static export is opt-in, not the default.
 *
 * The site has no route handlers and no server actions, so it exports cleanly
 * to plain files today — which is what makes it deployable to any static host.
 * But wiring a real checkout later (Shopify Storefront API, a webhook) needs
 * server routes, and baking `output: 'export'` in would quietly forbid that.
 *
 *   npm run build          server-capable build (default)
 *   npm run build:static   -> out/  for Netlify, S3, or any static host
 */
const staticExport = process.env.STATIC_EXPORT === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(staticExport
    ? {
        output: 'export',
        // No image optimiser exists on a static host. The assets are already
        // sized and encoded to their slots, so this costs nothing here.
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        // Swap in your CDN / Shopify image domains when photography moves off-repo.
        images: { remotePatterns: [] },
      }),
}

export default nextConfig
