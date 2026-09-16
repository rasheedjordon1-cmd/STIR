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
        'border-border-strong bg-surface-card relative flex min-h-11 items-center gap-2.5 rounded-[var(--radius-control)] border px-3',
        'transition-[background-color,transform] duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] hover:bg-surface-page active:translate-y-px',
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
          <span className="bg-nutmeg text-surface-card num anim-tick absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-bold">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        ) : null}
      </span>
      <span className="hidden text-left lg:block">
        <span className="text-text-secondary block text-xs">Basket</span>
        <span className="num block text-sm leading-tight font-bold">
          {hydrated ? formatMoney(totals.subtotal) : '—'}
        </span>
      </span>
    </button>
  );
}
