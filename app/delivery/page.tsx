'use client';

import { useMemo, useState } from 'react';
import { FulfillmentPicker } from '@/components/fulfillment/FulfillmentPicker';
import { ServiceStatusPill } from '@/components/fulfillment/ServiceStatusPill';
import { Icon } from '@/components/icons';
import { PageHeading } from '@/components/layout/PageHeading';
import { Field, TextInput } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { Section, SectionHead } from '@/components/ui/Section';
import { FULFILLMENT } from '@/data/config';
import { DELIVERY_ZONES, SERVICE_COVERAGE, zonesByParish } from '@/data/zones';
import { formatEventDate, formatMoney, formatMoneyShort } from '@/lib/format';
import { serviceCopy } from '@/lib/fulfillment';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Delivery and collection
   The serviceability reference. Every window and fee on this page is read
   from data/zones.ts — there is no second source of truth, so the promise on
   a product page and the promise here cannot diverge.
   ========================================================================== */

export default function DeliveryPage() {
  const { zone, setZone } = useLocation();
  const { next, collectable } = useFair();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zonesByParish();
    return zonesByParish()
      .map((group) => ({
        parish: group.parish,
        zones: group.zones.filter(
          (z) => z.area.toLowerCase().includes(q) || z.parish.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.zones.length > 0);
  }, [query]);

  const collectionPoints = useMemo(
    () => [...new Set(DELIVERY_ZONES.filter((z) => z.pickupPoint).map((z) => z.pickupPoint!))],
    [],
  );

  const matches = groups.reduce((total, group) => total + group.zones.length, 0);

  return (
    <>
      <PageHeading
        eyebrow="Delivery and collection"
        title="Where we go, and when"
        blurb="Spicemart only publishes a window it can run. Areas without a route say so plainly, and offer the nearest collection point instead."
        icon="MapArea"
        breadcrumbs={[{ label: 'Delivery' }]}
      >
        <div className="flex flex-wrap gap-2.5">
          {[
            { label: 'Delivery areas', value: SERVICE_COVERAGE.deliveryZones },
            { label: 'Collection points', value: SERVICE_COVERAGE.pickupPoints },
            { label: 'Parishes covered', value: SERVICE_COVERAGE.parishes },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border-border-subtle bg-surface-card rounded-[var(--radius-control)] border px-3 py-2"
            >
              <p className="num font-display text-xl font-bold">{stat.value}</p>
              <p className="text-text-secondary text-xs font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageHeading>

      <div className="shell pb-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-8">
          <aside className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border p-4 lg:sticky lg:top-[calc(var(--header-h)+16px)]">
            <h2 className="label text-text-secondary border-border-subtle mb-2.5 border-b pb-2">
              Your selection
            </h2>
            <p className="font-display text-xl font-bold tracking-tight">{zone.area}</p>
            <p className="text-text-secondary text-sm">{zone.parish}</p>
            <div className="mt-2.5">
              <ServiceStatusPill zone={zone} withDetail />
            </div>
            {zone.note ? <p className="text-text-secondary mt-2.5 text-sm">{zone.note}</p> : null}

            <div className="border-border-subtle mt-4 border-t pt-4">
              <FulfillmentPicker />
            </div>

            <Notice tone="info" className="mt-4" title="Minimum order">
              Orders start at {formatMoneyShort(FULFILLMENT.minimumOrder)} for both delivery and
              collection.
            </Notice>
          </aside>

          <div className="flex flex-col gap-6">
            <section aria-labelledby="zones-heading">
              <SectionHead
                eyebrow="Serviceability"
                title="Find your area"
                blurb="Pick an area to set it as your delivery destination. Everything in the shop updates to match."
                className="mb-3"
              />
              <h2 id="zones-heading" className="sr-only">
                Delivery areas
              </h2>

              <Field label="Search areas and parishes" className="mb-4 max-w-sm">
                {(props) => (
                  <TextInput
                    {...props}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Grenville, Gouyave, Woburn…"
                  />
                )}
              </Field>

              {matches === 0 ? (
                <Notice tone="caution" title="No match">
                  Nothing matches “{query}”. Spicemart covers {SERVICE_COVERAGE.parishes} parishes —
                  try the nearest town.
                </Notice>
              ) : null}

              <div className="flex flex-col gap-5">
                {groups.map((group) => (
                  <div key={group.parish}>
                    <h3 className="label text-text-secondary border-border-default mb-2 border-b-2 pb-1.5">
                      {group.parish}
                    </h3>
                    <ul className="grid list-none gap-2 sm:grid-cols-2">
                      {group.zones.map((z) => {
                        const copy = serviceCopy(z);
                        const selected = z.id === zone.id;
                        return (
                          <li key={z.id} className="flex">
                            <button
                              type="button"
                              onClick={() => setZone(z.id)}
                              aria-current={selected ? 'true' : undefined}
                              className={cx(
                                'w-full rounded-[var(--radius-card)] border p-3 text-left transition-colors',
                                selected
                                  ? 'border-leaf bg-surface-green-soft border-2'
                                  : 'border-border-subtle bg-surface-card hover:border-border-default',
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-md font-bold">{z.area}</p>
                                {selected ? (
                                  <span className="bg-leaf-deep text-paper flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                                    <Icon name="Check" size={12} />
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1.5">
                                <ServiceStatusPill zone={z} />
                              </div>
                              <dl className="mt-2 space-y-0.5 text-sm">
                                <div className="flex gap-1.5">
                                  <dt className="text-text-secondary shrink-0">
                                    {z.serviceStatus === 'delivery-available' ? 'Window' : 'Nearest'}
                                  </dt>
                                  <dd className="min-w-0 font-semibold">{copy.detail}</dd>
                                </div>
                                {z.deliveryFee ? (
                                  <div className="flex gap-1.5">
                                    <dt className="text-text-secondary shrink-0">Fee</dt>
                                    <dd className="num font-semibold">
                                      {formatMoney(z.deliveryFee)}
                                      {z.freeDeliveryThreshold
                                        ? ` · free over ${formatMoneyShort(z.freeDeliveryThreshold)}`
                                        : ''}
                                    </dd>
                                  </div>
                                ) : null}
                              </dl>
                              {z.note ? (
                                <p className="text-text-secondary mt-1.5 text-xs">{z.note}</p>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <Section id="collection" className="py-0">
              <SectionHead eyebrow="Collection" title="Counters you can collect from" className="mb-3" />
              <ul className="grid list-none gap-2 sm:grid-cols-2">
                {collectionPoints.map((point) => (
                  <li
                    key={point}
                    className="border-border-subtle bg-surface-card flex items-start gap-2.5 rounded-[var(--radius-card)] border p-3"
                  >
                    <Icon name="StorePickup" size={20} className="text-state-info mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{point}</p>
                      <p className="text-text-secondary text-sm">
                        Ready within 4 hours during opening times. No fee.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-cocoa/30 bg-surface-yellow-soft mt-3 rounded-[var(--radius-card)] border p-3.5">
                <h3 className="flex items-center gap-2 text-md">
                  <Icon name="SpiceFairPickup" size={20} />
                  Spice Fair collection
                </h3>
                <p className="text-text-secondary mt-1.5 text-sm">
                  At editions with a collection tent you can pick an order up at the fair.{' '}
                  {collectable
                    ? `Collection is open now for ${formatEventDate(collectable.date)} at ${collectable.venue}, and closes ${FULFILLMENT.spiceFairCutoffHours} hours before doors.`
                    : next
                      ? `The next edition on ${formatEventDate(next.date)} at ${next.venue} is market-only, so collection is not offered for it.`
                      : 'No edition is currently open for collection.'}
                </p>
              </div>
            </Section>

            <Notice tone="prototype">
              Zones, windows and fees are prototype configuration held in{' '}
              <code className="text-xs">data/zones.ts</code>. Final service areas depend on driver
              coverage and routing, which are not decided yet.
            </Notice>
          </div>
        </div>
      </div>
    </>
  );
}
