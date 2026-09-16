'use client';

import { CartProvider } from '@/lib/store/cart';
import { FairProvider } from '@/lib/store/fair';
import { LocationProvider } from '@/lib/store/location';
import { SessionProvider } from '@/lib/store/session';
import { UIProvider } from '@/lib/store/ui';
import type { SpiceFairEvent } from '@/types';

/**
 * Provider order matters: cart totals read the chosen zone, and fulfilment
 * options read the fair schedule, so location and fair sit outside cart.
 */
export function Providers({
  fair,
  children,
}: {
  fair: { next: SpiceFairEvent | null; collectable: SpiceFairEvent | null };
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <FairProvider value={fair}>
        <LocationProvider>
          <CartProvider>
            <UIProvider>{children}</UIProvider>
          </CartProvider>
        </LocationProvider>
      </FairProvider>
    </SessionProvider>
  );
}
