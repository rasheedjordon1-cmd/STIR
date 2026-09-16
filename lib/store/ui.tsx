'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* ==========================================================================
   Overlay state
   One place decides which overlay is open, so the cart drawer and the
   location sheet can never both trap focus at once, and so page scroll is
   locked exactly once.
   ========================================================================== */

type Overlay = 'none' | 'cart' | 'location' | 'menu';

interface UIState {
  overlay: Overlay;
  openCart: () => void;
  openLocation: () => void;
  openMenu: () => void;
  close: () => void;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>('none');

  const close = useCallback(() => setOverlay('none'), []);
  const openCart = useCallback(() => setOverlay('cart'), []);
  const openLocation = useCallback(() => setOverlay('location'), []);
  const openMenu = useCallback(() => setOverlay('menu'), []);

  /* Lock the page behind an overlay without the layout shifting. */
  useEffect(() => {
    if (overlay === 'none') return;
    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [overlay]);

  const value = useMemo(
    () => ({ overlay, openCart, openLocation, openMenu, close }),
    [overlay, openCart, openLocation, openMenu, close],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIState {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
