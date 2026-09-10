import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { CartProvider } from '@/lib/cart'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { CartDrawer } from '@/components/chrome/CartDrawer'
import { StickyCta } from '@/components/chrome/StickyCta'
import { site } from '@/content/site'
import './globals.css'

/* ============================================================================
   TYPE — self-hosted. Nothing here reaches a third-party CDN at runtime.
   Sources live in fonts-src/ (SIL Open Font License, copies in app/fonts/).
   Rebuild the subsets with: python3 scripts/build-fonts.py fonts-src
   ========================================================================== */

/* VOICE 01 — IDENTITY (stand-in).
   Bevellier, Indian Type Foundry via Fontshare. Condensed, tight-fitting, with
   flared terminals — it shares the mastermark's density and compression in a
   way a neutral grotesk does not, so the wordmark and the headline below it
   finally read as family.

   IT IS NOT CIL. It stands in the identity slot until the CIL alphabet exists
   as a font; --font-display still resolves --font-cil-display FIRST, so the
   real face wins the moment it is declared.

   ONE AXIS ONLY (wght 100–900) and its default instance is 100 — Thin. Every
   rule that uses this family must state a weight or it renders as a hairline.
   There is no width axis. Neither has the language voice, so nothing in this
   system asks for a width any more.

   LICENCE: ITF, not OFL. The embedded notice requires crediting ITF in design
   and production credits. Confirm the current Fontshare terms before launch. */
const bevellier = localFont({
  src: [{ path: './fonts/Bevellier-Variable.woff2', style: 'normal' }],
  weight: '100 900',
  variable: '--font-bevellier',
  display: 'swap',
  preload: true,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

/* VOICE 02 — LANGUAGE.
   Chillax, Indian Type Foundry via Fontshare. A soft geometric: rounded
   terminals, open counters. The mastermark is SOFT OUTSIDE, CUT INSIDE and
   Chillax answers the soft half of that, where Bevellier answers the dense
   half. Between them they triangulate the mark instead of ignoring it.

   TWO LIMITS, both real:
   · wght 200–700, and its DEFAULT INSTANCE IS 700. Every rule must state its
     weight — omitting it here renders BOLD, the opposite trap to Bevellier.
     Nothing may ask for 800: it clamps to 700 and the source then lies.
   · No width axis. The condensed label register cannot be a width any more,
     so labels are cut by size and tracking instead. See .t-label.

   LICENCE: ITF, not OFL. Same obligation as Bevellier — see app/fonts/README. */
const chillax = localFont({
  src: [{ path: './fonts/Chillax-Variable.woff2', style: 'normal' }],
  weight: '200 700',
  variable: '--font-chillax',
  display: 'swap',
  preload: true,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

/* VOICE 03 — INFORMATION. Two cuts, no italics. Prices, weights, counts,
   plate numbers, origin fields. Never a sentence. */
const plexMono = localFont({
  src: [
    { path: './fonts/IBMPlexMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/IBMPlexMono-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
  adjustFontFallback: false,
})

/* THE CIL ALPHABET is still not a font file. It was supplied as a reference
   drawing; its authoritative form on this site remains the Mastermark artwork.
   When a real .woff2 lands, declare it here and every display line in the
   system picks it up ahead of Bevellier through --font-display:

   const cilDisplay = localFont({
     src: [{ path: './fonts/CILDisplay.woff2' }],
     variable: '--font-cil-display', display: 'swap', preload: true,
   })
*/

export const metadata: Metadata = {
  metadataBase: new URL('https://cacaoislove.example'), // PLACEHOLDER — set real domain
  title: {
    default: 'Cacao Is Love — 100% whole cacao from Colombia',
    template: '%s — Cacao Is Love',
  },
  description:
    'One ingredient: whole cacao from Colombia. Learn what cacao is, where it comes from, and how to make a cup.',
  openGraph: {
    title: 'Cacao Is Love',
    description: '100% whole cacao from Colombia. Made simply. Shared freely.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F2E8D3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bevellier.variable} ${chillax.variable} ${plexMono.variable}`}>
      <body>
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <StickyCta />
        </CartProvider>
        <span hidden aria-hidden>
          {site.brand}
        </span>
      </body>
    </html>
  )
}
