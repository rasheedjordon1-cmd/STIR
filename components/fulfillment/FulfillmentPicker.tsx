'use client';

import { Icon, type IconName } from '@/components/icons';
import { formatMoney } from '@/lib/format';
import { getFulfillmentOptions } from '@/lib/fulfillment';
import { useCart } from '@/lib/store/cart';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { cx } from '@/lib/cx';

/* ==========================================================================
   FulfillmentPicker
   Delivery / collect / Spice Fair, driven entirely by lib/fulfillment.ts.
   An unavailable option is shown and disabled with the reason attached,
   rather than hidden — a shopper in Tivoli should be able to see that
   delivery exists and why it is not offered to them yet.
   ========================================================================== */

export function FulfillmentPicker({ compact = false }: { compact?: boolean }) {
  const { zone, method, setMethod } = useLocation();
  const { lines } = useCart();
  const { collectable } = useFair();

  const options = getFulfillmentOptions({
    zone,
    products: lines.map((l) => l.product),
    event: collectable,
  });

  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow text-text-secondary mb-2">How would you like it?</legend>
      <div className="flex flex-col gap-1.5">
        {options.map((option) => {
          const selected = method === option.method && option.available;
          return (
            <label
              key={option.method}
              className={cx(
                'flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-control)] border p-2.5 transition-colors',
                !option.available && 'cursor-not-allowed opacity-70',
                selected
                  ? 'border-leaf bg-surface-green-soft border-2'
                  : 'border-border-subtle bg-surface-card hover:border-border-default',
              )}
            >
              <input
                type="radio"
                name="fulfillment"
                value={option.method}
                checked={selected}
                disabled={!option.available}
                onChange={() => setMethod(option.method)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cx(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  selected ? 'border-leaf bg-leaf text-surface-card' : 'border-border-subtle',
                )}
              >
                {selected ? <Icon name="Check" size={12} /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <Icon name={option.icon as IconName} size={17} className="shrink-0" />
                  <span className="text-base font-bold">{option.label}</span>
                  {option.available ? (
                    option.fee ? (
                      <span className="num text-text-secondary ml-auto text-sm font-semibold">
                        {option.feeWaived ? (
                          <>
                            <span className="line-through">{formatMoney(option.fee)}</span> Free
                          </>
                        ) : (
                          formatMoney(option.fee)
                        )}
                      </span>
                    ) : (
                      <span className="text-text-secondary ml-auto text-sm font-semibold">Free</span>
                    )
                  ) : (
                    <span className="label text-state-danger ml-auto">Unavailable</span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm font-medium">{option.detail}</span>
                {option.note && !compact ? (
                  <span className="text-text-secondary mt-0.5 block text-xs">{option.note}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
