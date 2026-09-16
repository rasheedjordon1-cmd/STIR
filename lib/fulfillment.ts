import { FULFILLMENT, REWARDS } from '@/data/config';
import type {
  CartTotals,
  DeliveryZone,
  FulfillmentMethod,
  Money,
  Product,
  SpiceFairEvent,
} from '@/types';
import { formatEventDate } from './format';

/* ==========================================================================
   Fulfilment rules
   The one place that decides what Spicemart is willing to promise. Every
   delivery window, fee and eligibility message in the interface comes from
   here, so a rule change in data/zones.ts or data/config.ts propagates
   everywhere at once.
   ========================================================================== */

export interface FulfillmentOption {
  method: FulfillmentMethod;
  label: string;
  icon: string;
  available: boolean;
  /** The promise, when available. */
  detail: string;
  /** Why it is unavailable, or an operational caveat when it is. */
  note?: string;
  fee: Money | null;
  feeWaived: boolean;
}

interface OptionInput {
  zone: DeliveryZone;
  /** Products currently in the basket. Empty is fine — used before adding. */
  products?: Product[];
  event?: SpiceFairEvent | null;
  subtotal?: Money;
}

const zero: Money = { amount: 0, currency: 'XCD' };

export function deliveryFeeFor(zone: DeliveryZone, subtotal: Money = zero) {
  const fee = zone.deliveryFee ?? FULFILLMENT.defaultDeliveryFee;
  const threshold = zone.freeDeliveryThreshold ?? FULFILLMENT.defaultFreeDeliveryThreshold;
  const waived = subtotal.amount >= threshold.amount;
  return { fee, threshold, waived, payable: waived ? zero : fee };
}

export function getFulfillmentOptions({
  zone,
  products = [],
  event = null,
  subtotal = zero,
}: OptionInput): FulfillmentOption[] {
  const { fee, waived } = deliveryFeeFor(zone, subtotal);
  const canDeliver = zone.serviceStatus === 'delivery-available';

  const notDeliverable = products.filter((p) => !p.fulfillmentMethods.includes('delivery'));
  const notFairable = products.filter((p) => !p.fulfillmentMethods.includes('spice-fair-pickup'));

  const options: FulfillmentOption[] = [
    {
      method: 'delivery',
      label: 'Local delivery',
      icon: 'DeliveryVan',
      available: canDeliver && notDeliverable.length === 0,
      detail: canDeliver ? (zone.deliveryWindow ?? 'Window confirmed at checkout') : 'Not available here',
      note: !canDeliver
        ? zone.note ??
          (zone.serviceStatus === 'pickup-only'
            ? 'No driver route to this area yet. Collection is available.'
            : 'This area is not on a route yet.')
        : notDeliverable.length > 0
          ? `${notDeliverable.length} item${notDeliverable.length === 1 ? '' : 's'} in your basket cannot be delivered.`
          : zone.note,
      fee,
      feeWaived: waived,
    },
    {
      method: 'pickup',
      label: 'Collect in person',
      icon: 'StorePickup',
      available: zone.pickupAvailable,
      detail: zone.pickupAvailable
        ? (zone.pickupPoint ?? FULFILLMENT.defaultPickupPoint)
        : 'No collection point near this area',
      note: zone.pickupAvailable ? 'Ready within 4 hours during opening times. No fee.' : undefined,
      fee: null,
      feeWaived: false,
    },
    {
      method: 'spice-fair-pickup',
      label: 'Spice Fair pickup',
      icon: 'SpiceFairPickup',
      available: Boolean(event) && notFairable.length === 0,
      detail: event
        ? `${event.venue} — ${formatEventDate(event.date)}`
        : 'No fair is open for collection',
      note: !event
        ? 'Collection opens once the next eligible fair is announced, and closes 36 hours before doors.'
        : notFairable.length > 0
          ? `${notFairable.length} chilled or frozen item${notFairable.length === 1 ? '' : 's'} cannot be collected at the fair.`
          : 'Free. Collect from the tent at the gate between 10am and 6pm.',
      fee: null,
      feeWaived: false,
    },
  ];

  return options;
}

/** The method the interface should preselect for a given zone. */
export function defaultMethodFor(zone: DeliveryZone): FulfillmentMethod {
  if (zone.serviceStatus === 'delivery-available') return 'delivery';
  if (zone.pickupAvailable) return 'pickup';
  return 'pickup';
}

export interface ServiceCopy {
  tone: 'ok' | 'caution' | 'blocked';
  label: string;
  detail: string;
}

/** The short serviceability statement shown in the header and location sheet. */
export function serviceCopy(zone: DeliveryZone): ServiceCopy {
  switch (zone.serviceStatus) {
    case 'delivery-available':
      return {
        tone: 'ok',
        label: 'Delivery available',
        detail: zone.deliveryWindow ?? 'Window confirmed at checkout',
      };
    case 'pickup-only':
      return {
        tone: 'caution',
        label: 'Collection only',
        detail: zone.pickupPoint ?? FULFILLMENT.defaultPickupPoint,
      };
    default:
      return {
        tone: 'blocked',
        label: 'Not serviced yet',
        detail: zone.note ?? 'No delivery or collection here yet.',
      };
  }
}

/* ---- Totals -------------------------------------------------------------- */

export function computeTotals(
  lines: { product: Product; quantity: number }[],
  zone: DeliveryZone,
  method: FulfillmentMethod,
): CartTotals {
  const subtotal: Money = {
    amount: lines.reduce((t, l) => t + effectiveLinePrice(l.product, l.quantity), 0),
    currency: 'XCD',
  };
  const itemCount = lines.reduce((t, l) => t + l.quantity, 0);
  const { payable, waived } = deliveryFeeFor(zone, subtotal);
  const deliveryFee = method === 'delivery' ? payable : null;

  return {
    itemCount,
    subtotal,
    deliveryFee,
    deliveryFeeWaived: method === 'delivery' && waived,
    estimatedPoints: Math.floor((subtotal.amount / 100) * REWARDS.pointsPerDollar),
    total: { amount: subtotal.amount + (deliveryFee?.amount ?? 0), currency: 'XCD' },
  };
}

/** Multibuy applies per complete set; the remainder is charged at unit price. */
export function effectiveLinePrice(product: Product, quantity: number): number {
  const mb = product.multibuy;
  if (!mb || quantity < mb.quantity) return product.price.amount * quantity;
  const sets = Math.floor(quantity / mb.quantity);
  const rest = quantity % mb.quantity;
  return sets * mb.price.amount + rest * product.price.amount;
}

export function multibuySaving(product: Product, quantity: number): Money | null {
  const full = product.price.amount * quantity;
  const paid = effectiveLinePrice(product, quantity);
  return full > paid ? { amount: full - paid, currency: 'XCD' } : null;
}

export function meetsMinimum(subtotal: Money): boolean {
  return subtotal.amount >= FULFILLMENT.minimumOrder.amount;
}
