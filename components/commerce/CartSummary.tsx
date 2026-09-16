'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { CHECKOUT, FULFILLMENT } from '@/data/config';
import { commerce } from '@/lib/commerce';
import { formatMoney, formatMoneyShort } from '@/lib/format';
import { deliveryFeeFor, meetsMinimum } from '@/lib/fulfillment';
import { useCart, useCartTotals } from '@/lib/store/cart';
import { useLocation } from '@/lib/store/location';

/* ==========================================================================
   CartSummary
   Totals, then the honest checkout state. The mock adapter returns no
   checkout URL, so the button explains that rather than pretending a payment
   flow exists. When the Shopify adapter is wired in, the same button follows
   cart.checkoutUrl to Shopify's hosted checkout.
   ========================================================================== */

/**
 * Split into a breakdown and a checkout block so the cart drawer can put the
 * numbers in the scrolling body and keep only the decision in its footer —
 * on a short phone screen a tall footer leaves no room for the basket itself.
 */
export function CartTotals() {
  const { lines } = useCart();
  const { zone, method } = useLocation();
  const totals = useCartTotals();
  const { threshold, waived } = deliveryFeeFor(zone, totals.subtotal);
  const remaining = threshold.amount - totals.subtotal.amount;
  const belowMinimum = !meetsMinimum(totals.subtotal);
  const blocked = lines.filter(
    (l) =>
      l.product.inventoryStatus === 'out-of-stock' || !l.product.fulfillmentMethods.includes(method),
  );

  return (
    <div className="flex flex-col gap-3">
      <dl className="num flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-forest-muted">Subtotal</dt>
          <dd className="font-semibold">{formatMoney(totals.subtotal)}</dd>
        </div>
        {method === 'delivery' ? (
          <div className="flex justify-between gap-4">
            <dt className="text-forest-muted">Delivery — {zone.area}</dt>
            <dd className="font-semibold">
              {waived ? (
                <>
                  <span className="text-forest-faint mr-1 line-through">
                    {formatMoney(zone.deliveryFee ?? FULFILLMENT.defaultDeliveryFee)}
                  </span>
                  Free
                </>
              ) : (
                formatMoney(totals.deliveryFee)
              )}
            </dd>
          </div>
        ) : (
          <div className="flex justify-between gap-4">
            <dt className="text-forest-muted">Collection</dt>
            <dd className="font-semibold">Free</dd>
          </div>
        )}
        <div className="border-line mt-1 flex justify-between gap-4 border-t pt-2">
          <dt className="font-display text-md font-bold">Estimated total</dt>
          <dd className="font-display text-lg font-bold">{formatMoney(totals.total)}</dd>
        </div>
      </dl>

      <p className="text-forest-muted flex items-center gap-1.5 text-xs">
        <Icon name="Rewards" size={14} />
        Earns about{' '}
        <span className="num font-semibold">{totals.estimatedPoints.toLocaleString('en-US')}</span>{' '}
        points — rewards economics are not final.
      </p>

      {method === 'delivery' && !waived && remaining > 0 ? (
        <Notice tone="info" title="Free delivery">
          Add {formatMoneyShort({ amount: remaining, currency: 'XCD' })} more to {zone.area} and
          delivery is free.
        </Notice>
      ) : null}

      {belowMinimum ? (
        <Notice tone="caution" title="Minimum order">
          Orders start at {formatMoneyShort(FULFILLMENT.minimumOrder)}. Add{' '}
          {formatMoneyShort({
            amount: FULFILLMENT.minimumOrder.amount - totals.subtotal.amount,
            currency: 'XCD',
          })}{' '}
          more to check out.
        </Notice>
      ) : null}

      {blocked.length > 0 ? (
        <Notice tone="error" title="Check your basket">
          {blocked.length} item{blocked.length === 1 ? '' : 's'} cannot be sent this way. Remove{' '}
          {blocked.length === 1 ? 'it' : 'them'} or change your fulfilment choice.
        </Notice>
      ) : null}
    </div>
  );
}

export function CartCheckout({
  showTotal = false,
  onNavigate,
}: {
  showTotal?: boolean;
  onNavigate?: () => void;
}) {
  const { cart, lines } = useCart();
  const { method } = useLocation();
  const totals = useCartTotals();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const belowMinimum = !meetsMinimum(totals.subtotal);
  const blocked = lines.filter(
    (l) =>
      l.product.inventoryStatus === 'out-of-stock' || !l.product.fulfillmentMethods.includes(method),
  );
  const canCheckout = !belowMinimum && blocked.length === 0 && lines.length > 0;

  const startCheckout = async () => {
    setChecking(true);
    setCheckoutError(null);
    const url = await commerce.getCheckoutUrl(cart);
    setChecking(false);
    if (url) window.location.href = url;
    else setCheckoutError(CHECKOUT.unavailableReason);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {showTotal ? (
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-md font-bold">Estimated total</span>
          <span className="num font-display text-xl font-bold">{formatMoney(totals.total)}</span>
        </div>
      ) : null}

      <Button
        block
        size="lg"
        icon="SecurePayment"
        disabled={!canCheckout || checking}
        onClick={startCheckout}
      >
        {checking ? 'Checking…' : CHECKOUT.handoffLabel}
      </Button>

      {checkoutError ? (
        <Notice tone="prototype" role="status" title="Checkout not connected">
          {checkoutError}
        </Notice>
      ) : (
        <p className="text-forest-muted text-center text-xs">
          Payment is handled by Shopify. Spicemart never sees your card details.
        </p>
      )}

      {onNavigate ? (
        <Button intent="secondary" block onClick={onNavigate}>
          View full basket
        </Button>
      ) : null}
    </div>
  );
}

export function CartSummary({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <CartTotals />
      <CartCheckout onNavigate={onNavigate} />
    </div>
  );
}
