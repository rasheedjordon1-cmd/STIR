import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { Icon } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SPICE_FAIR } from '@/data/config';
import { formatEventDate, formatTimeRange, relativeDay } from '@/lib/format';
import type { SpiceFairEvent, Vendor } from '@/types';

/* ==========================================================================
   The Spice Fair, on the homepage
   Distinct enough to read as the other half of the business, related enough
   to read as the same company: same grid, same type, inverted palette.
   Nobody needs to understand it in order to buy rice.
   ========================================================================== */

export function SpiceFairFeature({
  next,
  upcoming,
  vendors,
}: {
  next: SpiceFairEvent | null;
  upcoming: SpiceFairEvent[];
  vendors: Vendor[];
}) {
  if (!next) {
    return (
      <section className="shell py-9">
        <EmptyState
          icon="MarketStall"
          level={2}
          title="The next Spice Fair has not been announced"
          body="Editions are published about four months ahead. When the next date is confirmed it appears here and collection opens with it."
          tone="caution"
        >
          <ButtonLink href="/spice-fair" intent="secondary">
            About the fair
          </ButtonLink>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="bg-forest text-breadfruit on-dark" aria-labelledby="spice-fair-heading">
      <div className="shell py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="label text-turmeric mb-3">{SPICE_FAIR.rhythm}</p>
            <h2 id="spice-fair-heading" className="display text-[clamp(2.25rem,9vw,3.75rem)]">
              The Spice
              <br />
              Fair
            </h2>
            <p className="display text-turmeric mt-4 text-[clamp(1.25rem,4.5vw,1.875rem)]">
              {SPICE_FAIR.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="text-breadfruit/80 mt-5 max-w-md">
              A community commerce event on the 1st and 3rd Saturday of every month. Shop local
              vendors, eat, and — at editions with a collection tent — pick up an order you placed
              online.
            </p>

            <div className="border-breadfruit/25 mt-6 border-t pt-5">
              <p className="label text-breadfruit/65 mb-2">Next edition · {relativeDay(next.date)}</p>
              <p className="font-display text-xl font-bold tracking-tight">
                {formatEventDate(next.date)} · {formatTimeRange(next.startTime, next.endTime)}
              </p>
              <p className="text-breadfruit/80 mt-1 flex items-center gap-2 text-sm">
                <Icon name="LocationPin" size={16} />
                {next.venue}, {next.area}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                <Icon name={next.pickupEnabled ? 'SpiceFairPickup' : 'MarketStall'} size={16} />
                {next.pickupEnabled
                  ? next.status === 'on-sale'
                    ? 'Order collection is open for this edition'
                    : 'Order collection has closed for this edition'
                  : 'Market only — this site has no collection tent'}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <ButtonLink href="/spice-fair" intent="accent" size="lg" icon="MarketStall">
                Explore the Fair
              </ButtonLink>
              <ButtonLink
                href={`/spice-fair/${next.id}`}
                intent="inverse"
                size="lg"
                icon="Calendar"
              >
                Next edition
              </ButtonLink>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <h3 className="label text-breadfruit/65 border-breadfruit/25 mb-2.5 border-b pb-1.5">
                Upcoming editions
              </h3>
              <ul className="grid list-none gap-2.5 sm:grid-cols-2">
                {upcoming.slice(0, 2).map((event) => (
                  <li key={event.id} className="flex">
                    <EventCard event={event} tone="dark" className="w-full" />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label text-breadfruit/65 border-breadfruit/25 mb-2.5 border-b pb-1.5">
                Vendors at this edition
              </h3>
              <ul className="flex list-none flex-wrap gap-1.5">
                {vendors.map((vendor) => (
                  <li key={vendor.id}>
                    <Link
                      href="/spice-fair#vendors"
                      className="border-breadfruit/25 hover:border-turmeric hover:text-turmeric inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-chip)] border px-2.5 text-sm font-medium"
                    >
                      <Icon name="Vendor" size={14} />
                      {vendor.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
