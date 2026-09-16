'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from './QuantityStepper';
import { formatMoney } from '@/lib/format';
import { effectiveLinePrice } from '@/lib/fulfillment';
import { useCart } from '@/lib/store/cart';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   ProductBuyBox
   Quantity is chosen before adding, which is how people shop a pack size.
   Once the line is in the basket the control switches to the basket quantity
   so the two can never disagree.
   ========================================================================== */

export function ProductBuyBox({ product }: { product: Product }) {
  const { add, setQuantity, quantityOf, hydrated } = useCart();
  const { openCart } = useUI();
  const [draft, setDraft] = useState(1);
  const inCart = quantityOf(product.id);
  const soldOut = product.inventoryStatus === 'out-of-stock';

  if (soldOut) {
    return (
      <div className="border-nutmeg/40 bg-nutmeg-wash rounded-[var(--radius-card)] border p-3">
        <p className="flex items-center gap-2 text-base font-bold">
          <Icon name="OutOfStock" size={19} />
          Out of stock
        </p>
        <p className="text-forest-muted mt-1 text-sm">
          This line is not available right now. Nothing is backordered in the prototype, and we do
          not take payment for stock we do not hold.
        </p>
      </div>
    );
  }

  if (hydrated && inCart > 0) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-[160px]">
            <QuantityStepper
              quantity={inCart}
              onChange={(next) => setQuantity(product.id, next)}
              label={product.title}
            />
          </div>
          <p className="num text-sm font-semibold">
            {formatMoney({ amount: effectiveLinePrice(product, inCart), currency: 'XCD' })}
            <span className="text-forest-muted block text-xs font-medium">in your basket</span>
          </p>
        </div>
        <Button intent="secondary" block size="lg" icon="Cart" onClick={openCart}>
          View basket
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <div className="sm:w-[160px]">
        <label className="label text-forest-muted mb-1 block">Quantity</label>
        <div className="border-forest flex h-12 items-stretch overflow-hidden rounded-[var(--radius-control)] border-2">
          <button
            type="button"
            onClick={() => setDraft((q) => Math.max(1, q - 1))}
            disabled={draft <= 1}
            aria-label="Decrease quantity"
            className="hover:bg-breadfruit flex w-12 shrink-0 items-center justify-center disabled:opacity-35"
          >
            <Icon name="QuantityDecrease" size={19} />
          </button>
          <span className="num flex flex-1 items-center justify-center text-md font-bold" aria-live="polite">
            {draft}
          </span>
          <button
            type="button"
            onClick={() => setDraft((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="hover:bg-breadfruit flex w-12 shrink-0 items-center justify-center"
          >
            <Icon name="QuantityIncrease" size={19} />
          </button>
        </div>
      </div>

      <div className={cx('flex-1', 'sm:pt-[22px]')}>
        <Button
          block
          size="lg"
          icon="Add"
          onClick={() => {
            add(product.id, draft);
            openCart();
          }}
        >
          Add to basket · {formatMoney({ amount: effectiveLinePrice(product, draft), currency: 'XCD' })}
        </Button>
      </div>
    </div>
  );
}
