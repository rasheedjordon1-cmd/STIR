'use client';

import Link from 'next/link';
import { ProductArt } from '@/components/commerce/ProductArt';
import { Icon, type IconName } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatMoney, formatShortDate, pluralise } from '@/lib/format';
import { useCart } from '@/lib/store/cart';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';
import type { Order, Product } from '@/types';

/* ==========================================================================
   OrderCard
   History that is useful rather than archival: what it was, where it went,
   and a one-tap route back into the basket.
   ========================================================================== */

const STATUS: Record<Order['status'], { label: string; tone: 'ok' | 'active' | 'muted' }> = {
  delivered: { label: 'Delivered', tone: 'ok' },
  'out-for-delivery': { label: 'Out for delivery', tone: 'active' },
  packing: { label: 'Packing', tone: 'active' },
  'ready-for-pickup': { label: 'Ready to collect', tone: 'active' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
};

const METHOD_ICON: Record<Order['fulfillmentMethod'], IconName> = {
  delivery: 'DeliveryVan',
  pickup: 'StorePickup',
  'spice-fair-pickup': 'SpiceFairPickup',
};

export function OrderCard({ order, products }: { order: Order; products: Product[] }) {
  const { add } = useCart();
  const { openCart } = useUI();
  const status = STATUS[order.status];
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = order.items.map((item) => ({ item, product: byId.get(item.productId) }));
  const available = lines.filter((l) => l.product && l.product.inventoryStatus !== 'out-of-stock');

  return (
    <article className="border-line-strong bg-paper rounded-[var(--radius-card)] border">
      <header className="border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div>
            <p className="label text-forest-muted">Order</p>
            <p className="num text-sm font-bold">{order.id}</p>
          </div>
          <div>
            <p className="label text-forest-muted">Placed</p>
            <p className="num text-sm font-bold">{formatShortDate(order.date)}</p>
          </div>
          <div>
            <p className="label text-forest-muted">Total</p>
            <p className="num text-sm font-bold">{formatMoney(order.total)}</p>
          </div>
        </div>
        <Badge tone={status.tone === 'ok' ? 'local' : status.tone === 'active' ? 'fair' : 'out'}>
          {status.label}
        </Badge>
      </header>

      {order.tracking ? (
        <div className="border-line bg-paper-sunk border-b p-3.5">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Icon name="OrderTracking" size={17} />
            {order.tracking.eta}
          </p>
          <ol className="flex list-none items-center gap-1">
            {order.tracking.steps.map((step, index) => {
              const done = index < order.tracking!.step;
              const current = index === order.tracking!.step - 1;
              return (
                <li key={step} className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className={cx(
                      'h-1.5 w-full rounded-full',
                      done ? 'bg-leaf' : 'bg-line-strong',
                    )}
                  />
                  <span
                    className={cx(
                      'truncate text-xs',
                      current ? 'text-forest font-bold' : 'text-forest-muted',
                    )}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      <div className="p-3.5">
        <p className="text-forest-muted mb-2.5 flex items-center gap-1.5 text-sm">
          <Icon name={METHOD_ICON[order.fulfillmentMethod]} size={16} />
          {order.fulfillmentLocation}
        </p>

        <ul className="mb-3 flex list-none flex-wrap gap-1.5">
          {lines.map(({ item, product }) =>
            product ? (
              <li key={item.productId} className="relative">
                <Link
                  href={`/product/${product.handle}`}
                  className="border-line hover:border-forest block overflow-hidden rounded-[6px] border"
                  title={`${product.title} × ${item.quantity}`}
                >
                  <ProductArt image={product.images[0]} seed={product.handle} className="h-14 w-14" />
                  <span className="sr-only">
                    {product.title} × {item.quantity}
                  </span>
                </Link>
                {item.quantity > 1 ? (
                  <span className="bg-forest text-breadfruit num pointer-events-none absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold">
                    {item.quantity}
                  </span>
                ) : null}
              </li>
            ) : null,
          )}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            icon="Reorder"
            onClick={() => {
              available.forEach(({ item }) => add(item.productId, item.quantity));
              openCart();
            }}
          >
            Reorder {pluralise(available.length, 'item')}
          </Button>
          {available.length < lines.length ? (
            <p className="text-cocoa flex items-center gap-1 text-xs font-semibold">
              <Icon name="Alert" size={13} />
              {lines.length - available.length} item no longer available
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
