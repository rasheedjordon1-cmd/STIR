'use client';

import { createContext, useContext } from 'react';
import type { SpiceFairEvent } from '@/types';

/* ==========================================================================
   Spice Fair context
   The schedule is generated on the server (see data/events.ts) and handed to
   the client here, so the cart can gate Spice Fair pickup on a real, open
   edition rather than assuming one always exists.
   ========================================================================== */

interface FairState {
  /** The next published edition, whether or not it takes collections. */
  next: SpiceFairEvent | null;
  /** The edition a basket can actually be routed to, or null. */
  collectable: SpiceFairEvent | null;
}

const FairContext = createContext<FairState>({ next: null, collectable: null });

export function FairProvider({ value, children }: { value: FairState; children: React.ReactNode }) {
  return <FairContext.Provider value={value}>{children}</FairContext.Provider>;
}

export function useFair(): FairState {
  return useContext(FairContext);
}
