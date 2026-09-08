import type { Metadata, Viewport } from 'next'
import { Archivo, Fraunces, IBM_Plex_Mono } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { CartDrawer } from '@/components/chrome/CartDrawer'
import { StickyCta } from '@/components/chrome/StickyCta'
import { site } from '@/content/site'
import './globals.css'

/* The discipline. Archivo keeps nav, labels and product data institutional. */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-archivo',
  display: 'swap',
})

/* The voice. Fraunces carries the headlines and the long-form: a variable
   serif with SOFT and WONK axes, so it can be warm and a little particular
   without tipping into retro pastiche. */
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
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
  themeColor: '#F5EFE1',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${fraunces.variable} ${plexMono.variable}`}>
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
