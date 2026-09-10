import type { Metadata, Viewport } from 'next'
import { Archivo, Newsreader, IBM_Plex_Mono } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { CartDrawer } from '@/components/chrome/CartDrawer'
import { StickyCta } from '@/components/chrome/StickyCta'
import { site } from '@/content/site'
import './globals.css'

/* TYPE B + C — one blunt grotesk carries both the heavy headings and the
   compact utility type, using its weight and width axes. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

/* TYPE D — the rare human serif. Quotes and Nicolas's note only; it no longer
   carries the brand. */
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

/* Record-keeping mono — plate numbers, weights, origin fields. Used sparingly. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono-plex',
  display: 'swap',
})

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
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}>
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
