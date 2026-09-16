'use client';

import { CartDrawer } from '@/components/commerce/CartDrawer';
import { LocationSheet } from '@/components/fulfillment/LocationSheet';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

/** Client chrome: sticky header, overlays and the mobile tab bar. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-[60vh] pb-[calc(var(--bottom-nav-h)+8px)] lg:pb-0">
        {children}
      </main>
      <BottomNav />
      <CartDrawer />
      <LocationSheet />
    </>
  );
}
