import { formatMoney, formatUnitPrice, savingsAmount } from '@/lib/format';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   PriceBlock — V2
   Price outranks everything else on the card. Tabular figures keep a column of
   prices aligned on the decimal, and the unit price sits directly beneath in a
   quieter weight — it is the only honest way to compare a 10 lb bag with a
   2 kg one, but it must never compete with the headline number.
   ========================================================================== */

export function PriceBlock({
  product,
  size = 'md',
  className,
}: {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const saving = savingsAmount(product.price, product.compareAtPrice);
  const unit = formatUnitPrice(product.unitPrice);

  return (
    <div className={cx('min-w-0', className)}>
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className={cx(
            'num font-display font-bold',
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-md' : 'text-lg',
            saving ? 'text-state-danger' : 'text-text-primary',
          )}
          style={{ letterSpacing: '-0.03em' }}
        >
          {formatMoney(product.price)}
        </span>
        {product.compareAtPrice ? (
          <>
            <span className="num text-text-tertiary text-sm line-through">
              {formatMoney(product.compareAtPrice)}
            </span>
            <span className="sr-only">
              reduced from {formatMoney(product.compareAtPrice)}, saving {formatMoney(saving!)}
            </span>
          </>
        ) : null}
      </p>
      <p className="text-text-secondary num mt-0.5 text-xs">
        {product.unit}
        {unit ? ` · ${unit}` : ''}
      </p>
    </div>
  );
}
