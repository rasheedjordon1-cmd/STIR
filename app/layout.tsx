import type { Metadata, Viewport } from 'next';
import { Archivo, Hanken_Grotesk } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/providers/Providers';
import { BRAND } from '@/data/config';
import { getCollectableEvent, getNextEvent } from '@/data/events';
import '@/styles/globals.css';

/* Display: a tight grotesk for brand moments and headings.
   Interface: a warm humanist grotesk that holds up at 13–15px on cheap
   phone screens. Both expose tabular figures, used on every price. */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-archivo',
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
    <html lang="en-GD" className={`${archivo.variable} ${hanken.variable}`}>
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
