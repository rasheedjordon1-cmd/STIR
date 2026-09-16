'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Overlay } from '@/components/ui/Overlay';
import { FulfillmentPicker } from '@/components/fulfillment/FulfillmentPicker';
import { CartLineRow } from './CartLineRow';
import { CartCheckout, CartTotals } from './CartSummary';
import { formatMoney } from '@/lib/format';
import { useCart, useCartTotals } from '@/lib/store/cart';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';
import { pluralise } from '@/lib/format';

/* ==========================================================================
   CartDrawer
   The basket stays one tap away from every view. It carries the full
   fulfilment decision, because where an order is going changes what it costs
   and sometimes whether an item can be in it at all.
   ========================================================================== */

export function CartDrawer() {
  const { overlay, close, openLocation } = useUI();
  const { lines, itemCount } = useCart();
  const { zone } = useLocation();
  const totals = useCartTotals();
  const router = useRouter();

  const empty = lines.length === 0;

  return (
    <Overlay
      open={overlay === 'cart'}
      onClose={close}
      title="Your basket"
      description={empty ? undefined : `${pluralise(itemCount, 'item')} · ${formatMoney(totals.subtotal)}`}
      footer={
        empty ? undefined : (
          // Only the decision lives in the footer; the breakdown is in the body,
          // so the basket itself stays visible on a short screen.
          <CartCheckout
            showTotal
            onNavigate={() => {
              close();
              router.push('/cart');
            }}
          />
        )
      }
    >
      {empty ? (
        <EmptyState
          icon="Cart"
          title="Your basket is empty"
          body="Start with the things you buy every week — rice, milk, bread, produce — or pick up where your last order left off."
        >
          <ButtonLink href="/category/groceries" onClick={close}>
            Shop essentials
          </ButtonLink>
          <ButtonLink href="/account/orders" intent="secondary" onClick={close}>
            Buy it again
          </ButtonLink>
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="border-line-strong bg-paper flex items-start justify-between gap-3 rounded-[var(--radius-control)] border p-3">
            <div className="min-w-0">
              <p className="label text-forest-muted">Delivering to</p>
              <p className="truncate text-sm font-semibold">
                {zone.area}, {zone.parish}
              </p>
            </div>
            <Button size="sm" intent="secondary" onClick={openLocation}>
              Change
            </Button>
          </div>

          <FulfillmentPicker compact />

          <div>
            <h3 className="label text-forest-muted border-line mb-1 border-b pb-1.5">
              {pluralise(lines.length, 'line')}
              {itemCount !== lines.length ? ` · ${pluralise(itemCount, 'item')}` : ''}
            </h3>
            <ul className="list-none">
              {lines.map((line) => (
                <CartLineRow key={line.lineId} line={line} compact />
              ))}
            </ul>
          </div>

          <CartTotals />

          <div className="flex items-center gap-2">
            <Badge tone="neutral">Prototype</Badge>
            <p className="text-forest-muted text-xs">
              Basket is stored on this device only. No order is placed.
            </p>
          </div>
        </div>
      )}
    </Overlay>
  );
}
