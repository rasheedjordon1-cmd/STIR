'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Logo } from '@/components/brand/Logo';
import { BRAND } from '@/data/config';
import { formatEventDate, relativeDay } from '@/lib/format';
import { useFair } from '@/lib/store/fair';
import { CartButton } from './CartButton';
import { CategoryNav } from './CategoryNav';
import { LocationButton } from './LocationButton';
import { SearchField } from './SearchField';

/* ==========================================================================
   Header
   Desktop: utility strip, then the working row (logo, location, search,
   account, orders, basket), then the aisle bar.
   Mobile: logo + location + basket on one row, search on its own row. The
   whole block is sticky, which is what keeps search and the basket one
   thumb-reach away on every view.
   ========================================================================== */

export function Header() {
  const { next } = useFair();

  return (
    <header className="border-ink-line bg-breadfruit sticky top-0 z-50 border-b-2">
      {/* Utility strip — desktop only */}
      <div className="bg-forest text-breadfruit on-dark hidden lg:block">
        <div className="shell flex h-8 items-center justify-between gap-6 text-xs">
          <p className="label">{BRAND.utilityLine}</p>
          <div className="flex items-center gap-5">
            {next ? (
              <Link href="/spice-fair" className="flex items-center gap-1.5 hover:underline">
                <Icon name="MarketStall" size={14} />
                <span>
                  Next Spice Fair · {formatEventDate(next.date)} · {next.area}
                </span>
                <span className="bg-turmeric text-forest label rounded-[3px] px-1.5 py-0.5">
                  {relativeDay(next.date)}
                </span>
              </Link>
            ) : null}
            <Link href="/account#help" className="hover:underline">
              Help
            </Link>
            <Link href="/rewards" className="hover:underline">
              Rewards
            </Link>
          </div>
        </div>
      </div>

      {/* Working row */}
      <div className="shell">
        <div className="flex min-h-[52px] items-center gap-2 py-1.5 lg:min-h-[60px] lg:gap-4">
          <Link href="/" className="shrink-0" aria-label="Spicemart — home">
            <Logo variant="lockup" tone="ink" width={112} priority className="lg:hidden" alt="" />
            <Logo
              variant="lockup"
              tone="ink"
              width={148}
              priority
              className="hidden lg:block"
              alt=""
            />
          </Link>

          <LocationButton className="min-w-0 flex-1 lg:max-w-[236px] lg:flex-none" />

          <SearchField className="hidden flex-1 lg:block" size="lg" />

          <nav aria-label="Account" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/account/orders"
              className="hover:bg-forest/8 flex min-h-11 items-center gap-1.5 rounded-[var(--radius-control)] px-2.5 text-sm font-semibold"
            >
              <Icon name="Orders" size={20} />
              Orders
            </Link>
            <Link
              href="/account"
              className="hover:bg-forest/8 flex min-h-11 items-center gap-1.5 rounded-[var(--radius-control)] px-2.5 text-sm font-semibold"
            >
              <Icon name="Account" size={20} />
              Account
            </Link>
          </nav>

          <CartButton className="shrink-0" />
        </div>

        {/* Mobile search row */}
        <div className="pb-2 lg:hidden">
          <SearchField />
        </div>
      </div>

      <CategoryNav />
    </header>
  );
}
