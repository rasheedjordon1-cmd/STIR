'use client';

import { Icon, type IconName } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { formatMoney } from '@/lib/format';
import { getFulfillmentOptions } from '@/lib/fulfillment';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   ProductFulfillment
   Answers "when would I get this?" on the product page itself, for the
   selected area and for this specific product — a frozen line honestly shows
   Spice Fair collection as unavailable.
   ========================================================================== */

export function ProductFulfillment({ product }: { product: Product }) {
  const { zone } = useLocation();
  const { collectable } = useFair();
  const { openLocation } = useUI();

  const options = getFulfillmentOptions({ zone, products: [product], event: collectable });

  return (
    <section
      aria-label="Delivery and collection for this product"
      className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border"
    >
      <div className="border-border-subtle flex items-center justify-between gap-3 border-b px-3 py-2.5">
        <p className="min-w-0 text-sm">
          <span className="label text-text-secondary mr-1.5">To</span>
          <span className="font-semibold">
            {zone.area}, {zone.parish}
          </span>
        </p>
        <Button size="sm" intent="tertiary" onClick={openLocation}>
          Change
        </Button>
      </div>

      <ul className="list-none">
        {options.map((option) => (
          <li key={option.method} className="border-border-subtle flex gap-2.5 border-b px-3 py-2.5 last:border-b-0">
            <span
              className={cx(
                'mt-0.5 shrink-0',
                option.available ? 'text-state-success' : 'text-text-tertiary',
              )}
            >
              <Icon name={option.available ? (option.icon as IconName) : 'OutOfStock'} size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold">
                {option.label}
                {option.available && option.fee ? (
                  <span className="num text-text-secondary font-semibold">
                    {formatMoney(option.fee)}
                  </span>
                ) : null}
                {!option.available ? (
                  <span className="label text-state-danger">Not available</span>
                ) : null}
              </p>
              <p className={cx('text-sm', option.available ? '' : 'text-text-secondary')}>
                {option.detail}
              </p>
              {option.note ? (
                <p className="text-text-secondary mt-0.5 text-xs">{option.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
