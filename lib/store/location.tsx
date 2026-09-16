'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { DEFAULT_ZONE_ID, getZone } from '@/data/zones';
import { defaultMethodFor } from '@/lib/fulfillment';
import { createPersistentStore, usePersistent } from './persistent';
import type { DeliveryZone, FulfillmentMethod, SavedLocation } from '@/types';

/* ==========================================================================
   Delivery location
   Location is the first thing the platform needs to know, so it is held at
   the root and persisted. Until it is read back from storage, `hydrated` is
   false and the interface shows the default zone without claiming it is the
   customer's saved one.
   ========================================================================== */

interface Persisted {
  saved: SavedLocation;
  confirmed: boolean;
  method: FulfillmentMethod;
}

const DEFAULTS: Persisted = {
  saved: { zoneId: DEFAULT_ZONE_ID },
  confirmed: false,
  method: 'delivery',
};

const store = createPersistentStore<Persisted>('spicemart.location.v1', DEFAULTS, (raw) => {
  const parsed = raw as Partial<Persisted> | null;
  if (!parsed?.saved?.zoneId || !getZone(parsed.saved.zoneId)) return null;
  return {
    saved: parsed.saved,
    confirmed: Boolean(parsed.confirmed),
    method: parsed.method ?? 'delivery',
  };
});

interface LocationState extends Persisted {
  zone: DeliveryZone;
  hydrated: boolean;
  setZone: (zoneId: string) => void;
  updateDetails: (details: Partial<Omit<SavedLocation, 'zoneId'>>) => void;
  setMethod: (method: FulfillmentMethod) => void;
}

const LocationContext = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { value, hydrated } = usePersistent(store);
  const zone = useMemo(
    () => getZone(value.saved.zoneId) ?? getZone(DEFAULT_ZONE_ID)!,
    [value.saved.zoneId],
  );

  const setZone = useCallback((zoneId: string) => {
    const target = getZone(zoneId);
    if (!target) return;
    store.set((previous) => ({
      saved: { ...previous.saved, zoneId },
      confirmed: true,
      // A zone change can invalidate the chosen method (no route to this area).
      method: defaultMethodFor(target),
    }));
  }, []);

  const updateDetails = useCallback((details: Partial<Omit<SavedLocation, 'zoneId'>>) => {
    store.set((previous) => ({
      ...previous,
      saved: { ...previous.saved, ...details },
      confirmed: true,
    }));
  }, []);

  const setMethod = useCallback((method: FulfillmentMethod) => {
    store.set((previous) => ({ ...previous, method }));
  }, []);

  const state = useMemo(
    () => ({ ...value, zone, hydrated, setZone, updateDetails, setMethod }),
    [value, zone, hydrated, setZone, updateDetails, setMethod],
  );

  return <LocationContext.Provider value={state}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationState {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>');
  return ctx;
}
