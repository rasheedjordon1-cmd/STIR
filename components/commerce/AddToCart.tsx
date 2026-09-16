'use client';

import { Icon } from '@/components/icons';
import { QuantityStepper } from './QuantityStepper';
import { useCart } from '@/lib/store/cart';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   AddToCart
   One control that becomes a stepper. No modal, no page change, no toast
   that covers the next product — the button itself carries the state.
   ========================================================================== */

export function AddToCart({
  product,
  size = 'md',
  className,
}: {
  product: Product;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const { add, setQuantity, quantityOf, hydrated } = useCart();
  const quantity = quantityOf(product.id);
  const soldOut = product.inventoryStatus === 'out-of-stock';

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className={cx(
          'border-line-strong bg-paper-sunk text-forest-muted flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-control)] border font-semibold',
          size === 'sm' ? 'h-11 text-sm' : 'h-11 text-base',
          className,
        )}
      >
        <Icon name="OutOfStock" size={16} />
        Out of stock
      </button>
    );
  }

  // Before hydration the basket is unknown; render the neutral state rather
  // than flashing a stepper that may be wrong.
  if (hydrated && quantity > 0) {
    return (
      <div className={className}>
        <QuantityStepper
          quantity={quantity}
          onChange={(next) => setQuantity(product.id, next)}
          label={product.title}
          size={size}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(product.id)}
      className={cx(
        'bg-leaf text-paper hover:bg-leaf-deep flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-control)] font-semibold transition-colors duration-[var(--duration-tap)]',
        size === 'sm' ? 'h-11 text-sm' : 'h-11 text-base',
        className,
      )}
    >
      <Icon name="Add" size={size === 'sm' ? 16 : 18} />
      Add
      <span className="sr-only"> {product.title} to basket</span>
    </button>
  );
}
