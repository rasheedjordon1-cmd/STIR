'use client';

import Link from 'next/link';
import { CartLineRow } from '@/components/commerce/CartLineRow';
import { CartSummary } from '@/components/commerce/CartSummary';
import { FulfillmentPicker } from '@/components/fulfillment/FulfillmentPicker';
import { ServiceStatusPill } from '@/components/fulfillment/ServiceStatusPill';
import { Icon } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { PROTOTYPE_NOTICE } from '@/data/config';
import { pluralise } from '@/lib/format';
import { useCart } from '@/lib/store/cart';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';

/* ==========================================================================
   Full basket
   The same objects as the drawer, given room: the fulfilment decision sits
   beside the lines rather than above them, and the summary is sticky on
   desktop so the total never scrolls out of sight.
   ========================================================================== */

export default function CartPage() {
  const { lines, itemCount, hydrated, clear } = useCart();
  const { zone } = useLocation();
  const { openLocation } = useUI();

  return (
    <div className="shell py-6 pb-12">
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="text-text-secondary flex list-none items-center gap-1 text-sm">
          <li>
            <Link href="/" className="hover:text-forest hover:underline">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <Icon name="ChevronRight" size={13} />
            <span className="text-forest font-semibold">Basket</span>
          </li>
        </ol>
      </nav>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl">Your basket</h1>
          {hydrated ? (
            <p className="text-text-secondary mt-1 text-md">
              {lines.length === 0
                ? 'Nothing in it yet.'
                : `${pluralise(lines.length, 'line')} · ${pluralise(itemCount, 'item')}`}
            </p>
          ) : null}
        </div>
        {lines.length > 0 ? (
          <Button intent="tertiary" size="sm" icon="Remove" onClick={clear}>
            Empty basket
          </Button>
        ) : null}
      </div>

      {!hydrated ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : lines.length === 0 ? (
        <EmptyState
          icon="Cart"
          level={2}
          title="Your basket is empty"
          body="Nothing has been added yet. Start from an aisle, or reorder the things you bought last time."
        >
          <ButtonLink href="/category/groceries">Shop groceries</ButtonLink>
          <ButtonLink href="/account/orders" intent="secondary">
            Buy it again
          </ButtonLink>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          <div className="flex flex-col gap-5">
            <section
              aria-label="Delivery location"
              className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border p-3.5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-text-secondary text-xs font-semibold">Delivering to</p>
                  <p className="text-md font-bold">
                    {zone.area}, {zone.parish}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ServiceStatusPill zone={zone} />
                  <Button size="sm" intent="secondary" onClick={openLocation}>
                    Change
                  </Button>
                </div>
              </div>
              <FulfillmentPicker />
            </section>

            <section aria-label="Basket contents">
              <h2 className="label text-text-secondary border-border-subtle mb-1 border-b pb-1.5">Items</h2>
              <ul className="list-none">
                {lines.map((line) => (
                  <CartLineRow key={line.lineId} line={line} />
                ))}
              </ul>
            </section>

            <Notice tone="prototype">
              {PROTOTYPE_NOTICE} No order is placed and no payment is taken.
            </Notice>
          </div>

          <aside
            aria-label="Order summary"
            className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border p-4 lg:sticky lg:top-[calc(var(--header-h)+16px)]"
          >
            <h2 className="text-md border-border-subtle mb-3 border-b pb-2">Order summary</h2>
            <CartSummary />
          </aside>
        </div>
      )}
    </div>
  );
}
