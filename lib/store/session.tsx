'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { createPersistentStore, usePersistent } from './persistent';

/* ==========================================================================
   Session
   The prototype has no authentication. This holds one boolean and a saved
   list so the interface can demonstrate the signed-out and signed-in states
   of Buy It Again, Orders and Rewards honestly, without fabricating history
   for someone who has never ordered.
   ========================================================================== */

interface Persisted {
  signedIn: boolean;
  favorites: string[];
}

const DEFAULTS: Persisted = { signedIn: false, favorites: [] };

const store = createPersistentStore<Persisted>('spicemart.session.v1', DEFAULTS, (raw) => {
  const parsed = raw as Partial<Persisted> | null;
  if (!parsed) return null;
  return {
    signedIn: Boolean(parsed.signedIn),
    favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
  };
});

interface SessionState extends Persisted {
  hydrated: boolean;
  name: string;
  signIn: () => void;
  signOut: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { value, hydrated } = usePersistent(store);

  const signIn = useCallback(() => store.set((p) => ({ ...p, signedIn: true })), []);
  const signOut = useCallback(() => store.set((p) => ({ ...p, signedIn: false })), []);

  const toggleFavorite = useCallback((productId: string) => {
    store.set((previous) => ({
      ...previous,
      favorites: previous.favorites.includes(productId)
        ? previous.favorites.filter((id) => id !== productId)
        : [...previous.favorites, productId],
    }));
  }, []);

  const isFavorite = useCallback(
    (productId: string) => value.favorites.includes(productId),
    [value.favorites],
  );

  const state = useMemo(
    () => ({ ...value, hydrated, name: 'Kemi', signIn, signOut, toggleFavorite, isFavorite }),
    [value, hydrated, signIn, signOut, toggleFavorite, isFavorite],
  );

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
