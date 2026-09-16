'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { commerce } from '@/lib/commerce';
import { computeTotals } from '@/lib/fulfillment';
import { createPersistentStore, usePersistent } from './persistent';
import { useLocation } from './location';
import type { Cart, CartTotals, Product } from '@/types';

/* ==========================================================================
   Cart
   Line state is persisted so a basket survives a reload. Every mutation also
   goes through the commerce adapter, so the same call sites will work against
   Shopify's cart mutations later — only the adapter changes.

   Lines are stored as ids and resolved to products through the adapter, which
   is async by design: that is what a network-backed catalogue will be.
   ========================================================================== */

const EMPTY_CART: Cart = { id: 'cart-local', lines: [], checkoutUrl: null };
const NO_LINES: ResolvedLine[] = [];

const store = createPersistentStore<Cart>('spicemart.cart.v1', EMPTY_CART, (raw) => {
  const parsed = raw as Partial<Cart> | null;
  if (!parsed || !Array.isArray(parsed.lines)) return null;
  return { ...EMPTY_CART, ...parsed, lines: parsed.lines };
});

export interface ResolvedLine {
  lineId: string;
  product: Product;
  quantity: number;
}

interface CartState {
  cart: Cart;
  lines: ResolvedLine[];
  itemCount: number;
  hydrated: boolean;
  /** Set briefly after an add, so the UI can acknowledge it. */
  lastAdded: string | null;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  quantityOf: (productId: string) => number;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { value: cart, hydrated } = usePersistent(store);
  const [resolved, setResolved] = useState<ResolvedLine[]>(NO_LINES);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Resolve line ids to products through the adapter. */
  useEffect(() => {
    if (cart.lines.length === 0) return;
    let cancelled = false;
    (async () => {
      const products = await commerce.getProducts({ ids: cart.lines.map((l) => l.productId) });
      if (cancelled) return;
      const byId = new Map(products.map((p) => [p.id, p]));
      setResolved(
        cart.lines
          .map((line) => {
            const product = byId.get(line.productId);
            return product ? { lineId: line.id, product, quantity: line.quantity } : null;
          })
          .filter((l): l is ResolvedLine => l !== null),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [cart.lines]);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  // An empty basket needs no resolution pass, so it is derived rather than
  // pushed through state — which also keeps the empty state instant.
  const lines = cart.lines.length === 0 ? NO_LINES : resolved;

  const add = useCallback(
    (productId: string, quantity = 1) => {
      const current = store.get().value;
      store.set({
        ...current,
        lines: current.lines.some((l) => l.productId === productId)
          ? current.lines.map((l) =>
              l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
            )
          : [...current.lines, { id: `line-${productId}`, productId, quantity }],
      });
      // Mirrored through the adapter so the Shopify swap is a one-file change.
      void commerce.addCartLines(current, [{ productId, quantity }]);
      setLastAdded(productId);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setLastAdded(null), 2000);
    },
    [],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const current = store.get().value;
    store.set({
      ...current,
      lines:
        quantity <= 0
          ? current.lines.filter((l) => l.productId !== productId)
          : current.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    });
    const line = current.lines.find((l) => l.productId === productId);
    if (line) {
      if (quantity <= 0) void commerce.removeCartLines(current, [line.id]);
      else void commerce.updateCartLines(current, [{ id: line.id, quantity }]);
    }
  }, []);

  const remove = useCallback((productId: string) => setQuantity(productId, 0), [setQuantity]);

  const clear = useCallback(() => store.set((previous) => ({ ...previous, lines: [] })), []);

  const quantityOf = useCallback(
    (productId: string) => cart.lines.find((l) => l.productId === productId)?.quantity ?? 0,
    [cart.lines],
  );

  const itemCount = useMemo(
    () => cart.lines.reduce((total, line) => total + line.quantity, 0),
    [cart.lines],
  );

  const state = useMemo(
    () => ({
      cart,
      lines,
      itemCount,
      hydrated,
      lastAdded,
      add,
      setQuantity,
      remove,
      clear,
      quantityOf,
    }),
    [cart, lines, itemCount, hydrated, lastAdded, add, setQuantity, remove, clear, quantityOf],
  );

  return <CartContext.Provider value={state}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

/** Totals depend on the chosen zone and fulfilment method, so they live here. */
export function useCartTotals(): CartTotals {
  const { lines } = useCart();
  const { zone, method } = useLocation();
  return useMemo(() => computeTotals(lines, zone, method), [lines, zone, method]);
}
