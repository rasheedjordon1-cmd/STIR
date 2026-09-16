import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCalendar } from '@/components/events/AddToCalendar';
import { EventCard } from '@/components/events/EventCard';
import { VendorGrid } from '@/components/events/VendorGrid';
import { Icon, type IconName } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section, SectionHead } from '@/components/ui/Section';
import { FULFILLMENT, SPICE_FAIR } from '@/data/config';
import { getEvent, getUpcomingEvents } from '@/data/events';
import { getVendor } from '@/data/vendors';
import { formatEventDate, formatShortDate, formatTimeRange, relativeDay } from '@/lib/format';

export async function generateStaticParams() {
  return getUpcomingEvents(new Date(), 6).map((event) => ({ id: event.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) return { title: 'Edition not found' };
  return {
    title: `${SPICE_FAIR.name} — ${event.area}, ${formatShortDate(event.date)}`,
    description: event.description,
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = new Date();
  const event = getEvent(id, now);
  if (!event) notFound();

  const vendors = event.vendorIds
    .map(getVendor)
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const others = getUpcomingEvents(now, 4).filter((e) => e.id !== event.id);
  const past = event.status === 'past';

  return (
    <>
      <section className="bg-forest text-breadfruit on-dark">
        <div className="shell py-8 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="text-breadfruit/70 flex list-none items-center gap-1 text-sm">
              <li>
                <Link href="/spice-fair" className="hover:text-turmeric hover:underline">
                  The Spice Fair
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <Icon name="ChevronRight" size={13} />
                <span className="text-breadfruit font-semibold">Edition {event.edition}</span>
              </li>
            </ol>
          </nav>

          <p className="label text-turmeric mb-3">
            Edition {event.edition} · {relativeDay(event.date)}
          </p>
          <h1 className="display text-[clamp(2.25rem,9vw,4.5rem)]">
            {formatEventDate(event.date)}
          </h1>
          <p className="display text-turmeric mt-2 text-[clamp(1.25rem,5vw,2rem)]">{event.area}</p>

          <p className="text-breadfruit/85 mt-5 max-w-xl text-md">{event.description}</p>

          <dl className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { icon: 'LocationPin' as IconName, label: 'Venue', value: `${event.venue}, ${event.parish}` },
              {
                icon: 'Clock' as IconName,
                label: 'Time',
                value: formatTimeRange(event.startTime, event.endTime),
              },
              {
                icon: 'SpiceFairPickup' as IconName,
                label: 'Order collection',
                value: past
                  ? 'Closed — this edition has run'
                  : event.pickupEnabled
                    ? event.status === 'on-sale'
                      ? `Open until ${FULFILLMENT.spiceFairCutoffHours}h before doors`
                      : 'Closed for this edition'
                    : 'Not offered at this site',
              },
            ].map((row) => (
              <div key={row.label} className="border-breadfruit/25 border-t pt-3">
                <dt className="label text-breadfruit/65 flex items-center gap-1.5">
                  <Icon name={row.icon} size={14} />
                  {row.label}
                </dt>
                <dd className="mt-1 font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>

          {!past ? (
            <div className="mt-7 flex flex-wrap gap-2.5">
              {event.pickupEnabled && event.status === 'on-sale' ? (
                <ButtonLink href="/category/groceries" intent="accent" size="lg" icon="Cart">
                  Shop for collection here
                </ButtonLink>
              ) : (
                <ButtonLink href="/delivery" intent="accent" size="lg" icon="MapArea">
                  Check delivery instead
                </ButtonLink>
              )}
              <AddToCalendar event={event} intent="inverse" />
            </div>
          ) : null}
        </div>
      </section>

      {past ? (
        <div className="shell pt-6">
          <Notice tone="caution" title="This edition has run">
            It is kept here as a record. The archive — photographs, vendor feedback and attendance —
            is not part of this prototype.
          </Notice>
        </div>
      ) : null}

      {!event.pickupEnabled && !past ? (
        <div className="shell pt-6">
          <Notice tone="info" title="Market only">
            This site has no chilled van bay, so online orders cannot be staged here. Collection runs
            at the Frequente and Grenville editions.
          </Notice>
        </div>
      ) : null}

      <Section>
        <div className="shell">
          <SectionHead eyebrow="On the day" title="Programme" />
          <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {event.programming.map((item) => (
              <li
                key={item.title}
                className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-3.5"
              >
                <Icon name={item.icon as IconName} size={24} className="text-leaf-deep mb-2.5" />
                <h3 className="text-md">{item.title}</h3>
                <p className="text-forest-muted mt-1 text-sm">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="sunk">
        <div className="shell">
          <SectionHead
            eyebrow="Vendor row"
            title={`${vendors.length} vendors at this edition`}
            blurb="Line-ups rotate between editions."
            href="/category/local"
            linkLabel="Shop local makers"
          />
          <VendorGrid vendors={vendors} />
        </div>
      </Section>

      {others.length > 0 ? (
        <Section>
          <div className="shell">
            <SectionHead
              eyebrow="Also coming up"
              title="Other editions"
              href="/spice-fair"
              linkLabel="Full schedule"
            />
            <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <li key={other.id} className="flex">
                  <EventCard event={other} className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}
    </>
  );
}
