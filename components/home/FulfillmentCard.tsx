'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Button, TextAction } from '@/components/ui/Button';
import { formatEventDate, formatMoney, relativeDay } from '@/lib/format';
import { deliveryFeeFor, serviceCopy } from '@/lib/fulfillment';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';

/* ==========================================================================
   FulfillmentCard — V2
   The working half of the hero, rebuilt as a live service-status surface
   rather than a form.

   V1 gave destination, window and fee three identical rows, so nothing led.
   V2 states the status in a coloured rail across the top, sets the
   destination at display scale as the subject of the card, and demotes the
   fee and window to supporting metadata. The Spice Fair preview is a tonal
   band fused to the bottom edge, not a separate card inside a card.
   ========================================================================== */

const RAIL = {
  ok: { surface: 'bg-leaf text-surface-card', icon: 'DeliveryVan' as const },
  caution: { surface: 'bg-turmeric text-forest', icon: 'StorePickup' as const },
  blocked: { surface: 'bg-nutmeg text-surface-card', icon: 'OutOfStock' as const },
};

export function FulfillmentCard({ className }: { className?: string }) {
  const { zone, confirmed, hydrated } = useLocation();
  const { openLocation } = useUI();
  const { next, collectable } = useFair();
  const { fee, threshold } = deliveryFeeFor(zone);
  const copy = serviceCopy(zone);
  const rail = RAIL[copy.tone];
  const delivers = zone.serviceStatus === 'delivery-available';

  return (
    <aside
      className={cx(
        'border-border-default bg-surface-card overflow-hidden rounded-[var(--radius-module)] border',
        className,
      )}
      aria-label="Delivery availability"
    >
      {/* Status rail — the one thing to read first. */}
      <p className={cx('flex items-center gap-2 px-4 py-2.5 text-sm font-semibold', rail.surface)}>
        <Icon name={rail.icon} size={17} />
        {copy.label}
        <span className="num ml-auto font-medium opacity-90">{copy.detail}</span>
      </p>

      <div className="p-4">
        {/* Never say "delivering to" for an area we do not deliver to. */}
        <p className="text-text-secondary text-xs">
          {!hydrated || !confirmed
            ? 'Showing prices for'
            : delivers
              ? 'Delivering to'
              : 'Your area'}
        </p>
        <p className="font-display mt-0.5 text-xl leading-tight font-bold tracking-[-0.03em]">
          {zone.area}
        </p>
        <p className="text-text-secondary num mt-1 text-sm">
          {zone.parish}
          {delivers ? (
            <>
              {' · '}
              {formatMoney(fee)} delivery
              <span className="text-text-tertiary"> · free over {formatMoney(threshold)}</span>
            </>
          ) : zone.pickupPoint ? (
            <>
              {' · '}collect at {zone.pickupPoint.replace(/^.*— /, '')}
            </>
          ) : null}
        </p>

        {zone.note ? (
          <p className="text-text-secondary mt-2.5 text-sm">{zone.note}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button intent="secondary" size="sm" icon="MapArea" onClick={openLocation}>
            {hydrated && confirmed ? 'Change area' : 'Choose your area'}
          </Button>
          <TextAction href="/delivery">All areas and windows</TextAction>
        </div>
      </div>

      {/* Spice Fair preview — fused to the card, not floating inside it. */}
      {next ? (
        <Link
          href="/spice-fair"
          className="bg-surface-yellow-soft group hover:bg-turmeric/25 flex items-center gap-3 px-4 py-3 transition-colors duration-[var(--duration-tap)]"
        >
          <Icon name="MarketStall" size={20} className="text-state-warning shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="text-state-warning block text-xs font-semibold">
              Next Spice Fair · {relativeDay(next.date)}
            </span>
            <span className="block truncate text-sm font-semibold">
              {formatEventDate(next.date)} · {next.area}
            </span>
            <span className="text-text-secondary block text-xs">
              {collectable ? 'Order collection open' : 'Market only — no order collection'}
            </span>
          </span>
          <Icon
            name="ChevronRight"
            size={18}
            className="shrink-0 transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </aside>
  );
}
