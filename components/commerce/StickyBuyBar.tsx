'use client';

import { useEffect, useRef, useState } from 'react';
import { AddToCart } from './AddToCart';
import { formatMoney } from '@/lib/format';
import type { Product } from '@/types';

/* ==========================================================================
   StickyBuyBar
   Mobile only. It appears once the main buy box has scrolled away, so it
   never covers the information it is summarising, and it sits above the tab
   bar rather than on top of it.
   ========================================================================== */

export function StickyBuyBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: '-120px 0px 0px 0px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <div
        className={`border-border-subtle bg-surface-raised fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-40 border-t px-4 py-2.5 shadow-[var(--shadow-sticky)] transition-transform duration-[var(--duration-ui)] lg:hidden ${
          visible ? 'translate-y-0' : 'translate-y-[130%]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{product.title}</p>
            <p className="num text-text-secondary text-xs">
              {formatMoney(product.price)} · {product.unit}
            </p>
          </div>
          <div className="w-[150px] shrink-0">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
