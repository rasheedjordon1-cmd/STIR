'use client';

import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { ProductArt } from './ProductArt';
import { formatMoney } from '@/lib/format';
import { useCart } from '@/lib/store/cart';
import type { Product } from '@/types';

/* ==========================================================================
   FrequentlyBought
   A real basket-building move: the anchor product plus two things that are
   cooked with it. In the prototype the pairs come from shared tags; in
   production this should be driven by actual co-purchase data.
   ========================================================================== */

export function FrequentlyBought({ anchor, partners }: { anchor: Product; partners: Product[] }) {
  const { add } = useCart();
  const all = [anchor, ...partners];
  const total = all.reduce((sum, product) => sum + product.price.amount, 0);

  if (partners.length === 0) return null;

  return (
    <section
      aria-labelledby="fbt-heading"
      className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border p-3.5"
    >
      <h2 id="fbt-heading" className="text-md mb-3">
        Frequently bought together
      </h2>

      <ul className="mb-3 flex list-none flex-wrap items-center gap-2">
        {all.map((product, index) => (
          <li key={product.id} className="flex items-center gap-2">
            {index > 0 ? <Icon name="Add" size={15} className="text-text-secondary" /> : null}
            <span className="border-border-subtle bg-surface-sunk block overflow-hidden rounded-[6px] border">
              <ProductArt image={product.images[0]} seed={product.handle} className="h-16 w-16" />
            </span>
          </li>
        ))}
      </ul>

      <ul className="mb-3 list-none space-y-1 text-sm">
        {all.map((product) => (
          <li key={product.id} className="flex justify-between gap-3">
            <span className="min-w-0 truncate">{product.title}</span>
            <span className="num shrink-0 font-semibold">{formatMoney(product.price)}</span>
          </li>
        ))}
      </ul>

      <div className="border-border-subtle flex items-center justify-between gap-3 border-t pt-3">
        <p className="num font-display text-md font-bold">
          {formatMoney({ amount: total, currency: 'XCD' })}
        </p>
        <Button
          size="sm"
          icon="Add"
          onClick={() => all.forEach((product) => add(product.id))}
        >
          Add all {all.length}
        </Button>
      </div>
    </section>
  );
}
