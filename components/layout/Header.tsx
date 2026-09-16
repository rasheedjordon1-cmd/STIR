'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/data/config';
import { formatEventDate, relativeDay } from '@/lib/format';
import { useCompactHeader } from '@/lib/useCompactHeader';
import { useFair } from '@/lib/store/fair';
import { cx } from '@/lib/cx';
import { CartButton } from './CartButton';
import { CategoryNav } from './CategoryNav';
import { LocationButton } from './LocationButton';
import { SearchField } from './SearchField';

/* ==========================================================================
   Header — V2
   Three functional levels, unchanged: a utility strip, the commerce row, and
   the aisle bar. What changed is their hierarchy.

   · the utility strip is thinner and carries only two things — the national
     line and the next fair — so Turmeric marks one timely thing, not several
   · the logo gains authority; the location control loses its shouty label
   · search remains the widest control but sits on a soft surface rather than
     a heavy rectangle
   · Orders, Account and Basket read as one utility group, with only the
     basket contained — it is the one you come back to
   · on scroll the strip collapses and the logo steps down. Search and the
     basket never move. No transformation beyond that.
   ========================================================================== */

export function Header() {
  const { next } = useFair();
  const compact = useCompactHeader();

  return (
    <header
      className={cx(
        'bg-surface-page sticky top-0 z-50 transition-shadow duration-[var(--duration-ui)]',
        compact
          ? 'shadow-[var(--shadow-sticky)]'
          : 'border-border-subtle border-b',
      )}
    >
      {/* ---- Utility strip — desktop only, collapses on scroll ---------- */}
      <div
        className={cx(
          'bg-forest text-text-inverse on-dark hidden overflow-hidden lg:block',
          'transition-[max-height,opacity] duration-[var(--duration-ui)] ease-[var(--ease-out-quint)]',
          compact ? 'max-h-0 opacity-0' : 'max-h-8 opacity-100',
        )}
        aria-hidden={compact}
      >
        <div className="shell flex h-8 items-center justify-between gap-6">
          <p className="text-xs font-medium tracking-[0.01em]">{BRAND.utilityLine}</p>
          {next ? (
            <Link
              href="/spice-fair"
              className="group flex items-center gap-2 text-xs font-medium"
            >
              <Icon name="MarketStall" size={14} className="text-turmeric" />
              <span className="group-hover:underline">
                Next Spice Fair · {formatEventDate(next.date)} · {next.area}
              </span>
              <span className="bg-turmeric text-forest rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold">
                {relativeDay(next.date)}
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* ---- Commerce row ------------------------------------------------ */}
      <div className="shell">
        <div
          className={cx(
            'flex items-center gap-2.5 transition-[padding] duration-[var(--duration-ui)] lg:gap-5',
            compact ? 'py-2' : 'py-2.5 lg:py-3',
          )}
        >
          <Link href="/" className="shrink-0" aria-label="Spicemart — home">
            <Logo variant="lockup" tone="ink" width={120} priority className="lg:hidden" alt="" />
            <Logo
              variant="lockup"
              tone="ink"
              width={160}
              priority
              className={cx('hidden lg:block', compact && 'lg:hidden')}
              alt=""
            />
            <Logo
              variant="lockup"
              tone="ink"
              width={132}
              className={cx('hidden', compact && 'lg:block')}
              alt=""
            />
          </Link>

          <LocationButton className="min-w-0 flex-1 lg:max-w-[232px] lg:flex-none" />

          <SearchField className="hidden flex-1 lg:block" size="lg" />

          {/* Utility group: only the basket is contained. */}
          <nav aria-label="Account" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/account/orders"
              className="text-text-primary hover:bg-forest/6 flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-2.5 text-sm font-semibold transition-colors duration-[var(--duration-tap)]"
            >
              <Icon name="Orders" size={20} />
              Orders
            </Link>
            <Link
              href="/account"
              className="text-text-primary hover:bg-forest/6 flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-2.5 text-sm font-semibold transition-colors duration-[var(--duration-tap)]"
            >
              <Icon name="Account" size={20} />
              Account
            </Link>
          </nav>

          <CartButton className="shrink-0" />
        </div>

        {/* Mobile search row */}
        <div className="pb-2.5 lg:hidden">
          <SearchField />
        </div>
      </div>

      <CategoryNav />
    </header>
  );
}
