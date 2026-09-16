'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { ServiceStatusPill } from '@/components/fulfillment/ServiceStatusPill';
import { formatEventDate, formatMoney, relativeDay } from '@/lib/format';
import { deliveryFeeFor } from '@/lib/fulfillment';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';

/* ==========================================================================
   FulfillmentCard
   The working half of the hero. Before a shopper adds anything, this states
   exactly what Spicemart can do for their area — and when it cannot, it says
   so and offers the collection route instead.
   ========================================================================== */

export function FulfillmentCard({ className }: { className?: string }) {
  const { zone, confirmed, hydrated } = useLocation();
  const { openLocation } = useUI();
  const { next, collectable } = useFair();
  const { fee, threshold } = deliveryFeeFor(zone);

  const rows = [
    {
      icon: 'LocationPin' as const,
      label: 'Delivering to',
      value: `${zone.area}, ${zone.parish}`,
    },
    zone.serviceStatus === 'delivery-available'
      ? {
          icon: 'Clock' as const,
          label: 'Next window',
          value: zone.deliveryWindow ?? 'Confirmed at checkout',
        }
      : {
          icon: 'StorePickup' as const,
          label: 'Collect from',
          value: zone.pickupPoint ?? 'No collection point nearby',
        },
    zone.serviceStatus === 'delivery-available'
      ? {
          icon: 'DeliveryVan' as const,
          label: 'Delivery',
          value: `${formatMoney(fee)} · free over ${formatMoney(threshold)}`,
        }
      : {
          icon: 'MapArea' as const,
          label: 'Status',
          value: zone.note ?? 'Delivery is not running here yet.',
        },
  ];

  return (
    <aside
      className={cx(
        'border-ink-line bg-paper rounded-[var(--radius-module)] border-2 p-4',
        className,
      )}
      aria-label="Delivery availability"
    >
      <div className="border-line flex items-center justify-between gap-3 border-b pb-3">
        <h2 className="label">Your delivery</h2>
        <ServiceStatusPill zone={zone} />
      </div>

      <dl className="flex flex-col">
        {rows.map((row) => (
          <div key={row.label} className="border-line flex items-start gap-2.5 border-b py-2.5">
            <Icon name={row.icon} size={18} className="text-forest-muted mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <dt className="label text-forest-muted">{row.label}</dt>
              <dd className="text-sm font-semibold">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button intent="secondary" size="sm" icon="MapArea" onClick={openLocation}>
          {hydrated && confirmed ? 'Change area' : 'Choose delivery area'}
        </Button>
        <Link
          href="/delivery"
          className="text-forest-muted hover:text-forest inline-flex min-h-9 items-center text-sm font-semibold underline underline-offset-4"
        >
          All areas and windows
        </Link>
      </div>

      {next ? (
        <Link
          href="/spice-fair"
          className="bg-turmeric-wash border-cocoa/25 hover:border-cocoa mt-3 flex items-center gap-2.5 rounded-[var(--radius-control)] border p-2.5 transition-colors"
        >
          <span className="bg-turmeric text-forest flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-chip)]">
            <Icon name="MarketStall" size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="label text-cocoa block">
              Next Spice Fair · {relativeDay(next.date)}
            </span>
            <span className="block truncate text-sm font-semibold">
              {formatEventDate(next.date)} · {next.area}
            </span>
            <span className="text-forest-muted block text-xs">
              {collectable ? 'Order collection open' : 'Market only — no order collection'}
            </span>
          </span>
          <Icon name="ChevronRight" size={17} className="shrink-0" />
        </Link>
      ) : null}
    </aside>
  );
}
