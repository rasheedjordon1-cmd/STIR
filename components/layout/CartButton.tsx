'use client';

import { Icon } from '@/components/icons';
import { formatMoney } from '@/lib/format';
import { useCart, useCartTotals } from '@/lib/store/cart';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';

export function CartButton({ className }: { className?: string }) {
  const { itemCount, hydrated } = useCart();
  const totals = useCartTotals();
  const { openCart } = useUI();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cx(
        'border-forest bg-paper hover:bg-breadfruit relative flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border-2 px-2.5 transition-colors',
        className,
      )}
      aria-label={
        hydrated
          ? `Open basket, ${itemCount} item${itemCount === 1 ? '' : 's'}, ${formatMoney(totals.subtotal)}`
          : 'Open basket'
      }
    >
      <span className="relative">
        <Icon name="Cart" size={22} />
        {hydrated && itemCount > 0 ? (
          <span className="bg-nutmeg text-paper num absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-bold">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        ) : null}
      </span>
      <span className="hidden text-left lg:block">
        <span className="label text-forest-muted block">Basket</span>
        <span className="num block text-sm leading-tight font-bold">
          {hydrated ? formatMoney(totals.subtotal) : '—'}
        </span>
      </span>
    </button>
  );
}
