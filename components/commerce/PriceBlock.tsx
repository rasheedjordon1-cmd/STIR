import { formatMoney, formatUnitPrice, savingsAmount } from '@/lib/format';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   PriceBlock
   Price, was-price and unit price, in tabular figures so a column of prices
   aligns on the decimal. Unit price is shown whenever the product has one —
   it is the only honest way to compare a 10 lb bag with a 2 kg one.
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
      <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span
          className={cx(
            'num font-display font-bold tracking-tight',
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-md',
            saving && 'text-nutmeg',
          )}
        >
          {formatMoney(product.price)}
        </span>
        {product.compareAtPrice ? (
          <>
            <span className="num text-forest-muted text-sm line-through">
              {formatMoney(product.compareAtPrice)}
            </span>
            <span className="sr-only">
              reduced from {formatMoney(product.compareAtPrice)}, saving {formatMoney(saving!)}
            </span>
          </>
        ) : null}
      </p>
      <p className="text-forest-muted num mt-0.5 text-xs">
        {product.unit}
        {unit ? ` · ${unit}` : ''}
      </p>
    </div>
  );
}
