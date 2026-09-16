'use client';

import { Icon } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   QuantityStepper
   Replaces the Add button once an item is in the basket, so quantity changes
   never require a page change. Both controls are ≥40px wide and the value is
   announced politely so a screen-reader user hears the new count.
   ========================================================================== */

export function QuantityStepper({
  quantity,
  onChange,
  label,
  size = 'md',
  max = 99,
}: {
  quantity: number;
  onChange: (next: number) => void;
  /** Product title — makes each control uniquely labelled in a grid. */
  label: string;
  size?: 'sm' | 'md';
  max?: number;
}) {
  // Both sizes are 44px tall: adding and adjusting quantity is the most-used
  // action in the product and must always be a full touch target. `sm` only
  // reduces the type and icon size, for dense contexts like a cart row.
  // Geometry matches the Add button exactly, so the swap reads as one control
  // changing state rather than two different controls.
  const height = 'h-11';

  return (
    <div
      className={cx(
        'border-leaf bg-surface-green-soft flex w-full items-stretch overflow-hidden rounded-[var(--radius-control)] border',
        height,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={quantity === 1 ? `Remove ${label} from basket` : `Decrease quantity of ${label}`}
        className="text-state-success hover:bg-leaf hover:text-surface-card flex w-11 shrink-0 items-center justify-center transition-colors duration-[var(--duration-tap)] active:translate-y-px"
      >
        <Icon name={quantity === 1 ? 'Remove' : 'QuantityDecrease'} size={size === 'sm' ? 17 : 19} />
      </button>
      {/* Keyed on the value so React remounts it and the bump replays — no
          state, and nothing to clean up. */}
      <span
        key={quantity}
        className="num text-state-success anim-tick flex flex-1 items-center justify-center text-base font-bold"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">{label}: </span>
        {quantity}
        <span className="sr-only"> in basket</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label={`Increase quantity of ${label}`}
        className="text-state-success hover:bg-leaf hover:text-surface-card flex w-11 shrink-0 items-center justify-center transition-colors duration-[var(--duration-tap)] active:translate-y-px disabled:opacity-40"
      >
        <Icon name="QuantityIncrease" size={size === 'sm' ? 17 : 19} />
      </button>
    </div>
  );
}
