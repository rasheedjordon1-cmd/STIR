'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { ProductArt } from './ProductArt';
import { QuantityStepper } from './QuantityStepper';
import { formatMoney } from '@/lib/format';
import { effectiveLinePrice, multibuySaving } from '@/lib/fulfillment';
import { useCart, type ResolvedLine } from '@/lib/store/cart';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { cx } from '@/lib/cx';

/* ==========================================================================
   CartLineRow
   Shows what a line actually costs — including a multibuy that has kicked in —
   and flags any line that the currently chosen fulfilment method cannot carry.
   ========================================================================== */

export function CartLineRow({ line, compact = false }: { line: ResolvedLine; compact?: boolean }) {
  const { setQuantity } = useCart();
  const { method } = useLocation();
  const { collectable } = useFair();
  const { product, quantity } = line;

  const total = effectiveLinePrice(product, quantity);
  const saving = multibuySaving(product, quantity);
  const soldOut = product.inventoryStatus === 'out-of-stock';
  const ineligible = !product.fulfillmentMethods.includes(method);
  const methodLabel =
    method === 'delivery'
      ? 'delivery'
      : method === 'pickup'
        ? 'collection'
        : `the ${collectable ? collectable.area : 'Spice Fair'} fair`;

  return (
    <li className="border-border-subtle flex gap-3 border-b py-3 last:border-b-0">
      <Link
        href={`/product/${product.handle}`}
        className="bg-surface-sunk border-border-subtle shrink-0 overflow-hidden rounded-[6px] border"
      >
        <ProductArt
          image={product.images[0]}
          seed={product.handle}
          className={cx(compact ? 'h-16 w-16' : 'h-20 w-20', soldOut && 'opacity-55 saturate-50')}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-text-secondary truncate text-xs font-semibold">{product.vendor}</p>
            <h3 className="text-sm leading-snug font-semibold">
              <Link href={`/product/${product.handle}`} className="hover:underline">
                {product.title}
              </Link>
            </h3>
            <p className="text-text-secondary num text-xs">{product.unit}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="num text-md font-display font-bold">
              {formatMoney({ amount: total, currency: 'XCD' })}
            </p>
            {saving ? (
              <p className="num text-state-danger text-xs font-semibold">
                Multibuy −{formatMoney(saving)}
              </p>
            ) : null}
          </div>
        </div>

        {soldOut ? (
          <p className="text-state-danger flex items-center gap-1 text-xs font-semibold">
            <Icon name="OutOfStock" size={13} />
            Out of stock — remove to check out
          </p>
        ) : ineligible ? (
          <p className="text-cocoa flex items-center gap-1 text-xs font-semibold">
            <Icon name="Alert" size={13} />
            Not available for {methodLabel}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <div className="w-[128px]">
            <QuantityStepper
              quantity={quantity}
              onChange={(next) => setQuantity(product.id, next)}
              label={product.title}
              size="sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setQuantity(product.id, 0)}
            className="text-text-secondary hover:text-state-danger inline-flex min-h-9 items-center gap-1 px-1 text-xs font-semibold underline-offset-4 hover:underline"
          >
            <Icon name="Remove" size={14} />
            Remove
            <span className="sr-only"> {product.title}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
