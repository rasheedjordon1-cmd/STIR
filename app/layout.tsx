import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Instrument_Sans } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers/Providers';
import { BRAND } from '@/data/config';
import { getCollectableEvent, getNextEvent } from '@/data/events';
import '@/styles/globals.css';

/* Display: Instrument Sans, loaded as a variable font so weights between 600
   and 700 are available. Its softer, slightly humanist forms sit far closer to
   the logo's rounded, organic "S" than Archivo's rectangular extra-bold did.
   This is the prototype stand-in for FK Grotesk Neue — see --font-display in
   styles/tokens.css, which is ordered so the licensed files supersede it with
   no component changes.

   Interface: Hanken Grotesk, unchanged. It holds up at 13–15px on inexpensive
   phone screens, which is where most of this catalogue will be read. */
const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://spicemart.example'),
  title: {
    default: `${BRAND.wordmark} — ${BRAND.proposition}`,
    template: `%s · ${BRAND.wordmark}`,
  },
  description:
    'Groceries, fresh produce, household essentials and personal care, delivered across Grenada. Built in Grenada. For Grenada.',
  icons: { icon: '/brand/spicemart-symbol-green.png' },
  openGraph: {
    title: `${BRAND.wordmark} — ${BRAND.proposition}`,
    description: 'Everyday essentials, delivered across Grenada.',
    type: 'website',
  },
};

/**
 * The fair schedule, order history and "next window" copy are all relative to
 * today, so nothing may be frozen at build time. Hourly regeneration keeps a
 * static build honest without making every page dynamic.
 */
export const revalidate = 3600;

export const viewport: Viewport = {
  themeColor: '#F7F2E6',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The fair schedule is generated on the server so the client never derives
  // a different "next event" than the one that was rendered.
  const now = new Date();
  const fair = { next: getNextEvent(now), collectable: getCollectableEvent(now) };

  return (
    <html lang="en-GD" className={`${instrument.variable} ${hanken.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only-focusable bg-forest text-breadfruit fixed top-2 left-2 z-[100] rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-semibold"
        >
          Skip to content
        </a>
        <Providers fair={fair}>
          <AppShell>{children}</AppShell>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
