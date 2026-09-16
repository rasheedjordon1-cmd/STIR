import type { Metadata } from 'next';
import Link from 'next/link';
import { AddToCalendar } from '@/components/events/AddToCalendar';
import { EventCard } from '@/components/events/EventCard';
import { VendorGrid } from '@/components/events/VendorGrid';
import { VendorInterest } from '@/components/events/VendorInterest';
import { Icon, type IconName } from '@/components/icons';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { Section, SectionHead } from '@/components/ui/Section';
import { FULFILLMENT, SPICE_FAIR } from '@/data/config';
import { SPICE_FAIR_FAQ, getPastEvents, getUpcomingEvents } from '@/data/events';
import { getVendor } from '@/data/vendors';
import { formatEventDate, formatTimeRange, relativeDay } from '@/lib/format';

export const metadata: Metadata = {
  title: 'The Spice Fair',
  description:
    'Shop local. Support local. Celebrate local. A community commerce event on the 1st and 3rd Saturday of every month, across Grenada.',
};

export default function SpiceFairPage() {
  const now = new Date();
  const upcoming = getUpcomingEvents(now, 6);
  const past = getPastEvents(now, 3);
  const next = upcoming[0] ?? null;
  const vendors = next
    ? next.vendorIds.map(getVendor).filter((v): v is NonNullable<typeof v> => Boolean(v))
    : [];

  return (
    <>
      {/* ---- Hero ---------------------------------------------------------- */}
      <section className="bg-forest text-breadfruit on-dark">
        <div className="shell py-10 md:py-16">
          <p className="label text-turmeric mb-4">
            {SPICE_FAIR.rhythm} · across Grenada · free entry
          </p>
          <h1 className="display text-[clamp(3rem,15vw,7rem)]">
            The
            <br />
            Spice Fair
          </h1>
          <p className="display text-turmeric mt-6 text-[clamp(1.5rem,6vw,2.75rem)]">
            {SPICE_FAIR.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="text-breadfruit/85 mt-6 max-w-xl text-md">
            {SPICE_FAIR.strapline} A commerce event first and a party second: growers, makers and
            cooks trading for themselves, with a collection tent for online orders at the sites
            that can take one.
          </p>

          {next ? (
            <div className="border-breadfruit/25 mt-9 border-t pt-7">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
                <div>
                  <p className="label text-breadfruit/65 mb-2">
                    Next edition · {relativeDay(next.date)}
                  </p>
                  <p className="display text-[clamp(1.75rem,6vw,2.75rem)]">
                    {formatEventDate(next.date)}
                  </p>
                  <dl className="mt-4 flex flex-col gap-2 text-md">
                    <div className="flex items-start gap-2.5">
                      <dt className="sr-only">Venue</dt>
                      <Icon name="LocationPin" size={20} className="mt-0.5 shrink-0 opacity-75" />
                      <dd>
                        {next.venue}
                        <span className="text-breadfruit/70 block text-sm">
                          {next.area}, {next.parish}
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <dt className="sr-only">Time</dt>
                      <Icon name="Clock" size={20} className="shrink-0 opacity-75" />
                      <dd className="num">{formatTimeRange(next.startTime, next.endTime)}</dd>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <dt className="sr-only">Collection</dt>
                      <Icon
                        name={next.pickupEnabled ? 'SpiceFairPickup' : 'MarketStall'}
                        size={20}
                        className="mt-0.5 shrink-0 opacity-75"
                      />
                      <dd>
                        {next.pickupEnabled
                          ? next.status === 'on-sale'
                            ? 'Order collection is open'
                            : 'Order collection has closed for this edition'
                          : 'Market only — no collection tent at this site'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <ButtonLink href={`/spice-fair/${next.id}`} intent="accent" size="lg">
                      Edition details
                    </ButtonLink>
                    <AddToCalendar event={next} intent="inverse" />
                  </div>
                </div>

                <div className="border-breadfruit/25 bg-forest/40 rounded-[var(--radius-card)] border p-4">
                  <h2 className="label text-turmeric mb-2.5">The rhythm</h2>
                  <ul className="list-none space-y-2.5 text-sm">
                    {[
                      ['Every 1st and 3rd Saturday', 'Two editions a month, all year.'],
                      ['Four sites in rotation', 'Frequente, Grenville, Gouyave and Sauteurs.'],
                      ['Free to attend', 'No ticket, no entry fee, bring a bag.'],
                      [
                        'Vendors keep their takings',
                        'Spicemart takes no cut of what a stall sells on the day.',
                      ],
                    ].map(([title, detail]) => (
                      <li key={title} className="border-breadfruit/20 flex gap-2.5 border-b pb-2.5 last:border-b-0">
                        <Icon name="Check" size={16} className="text-turmeric mt-0.5 shrink-0" />
                        <span>
                          <span className="block font-bold">{title}</span>
                          <span className="text-breadfruit/75">{detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-9">
              <EmptyState
                icon="Calendar"
                title="The schedule is not published yet"
                body="Editions are published about four months ahead. Nothing is scheduled in that window right now."
                tone="caution"
              />
            </div>
          )}
        </div>
      </section>

      {/* ---- Upcoming ------------------------------------------------------ */}
      <Section>
        <div className="shell">
          <SectionHead
            eyebrow="Schedule"
            title="Upcoming editions"
            blurb="Generated from the twice-monthly rule, so this list is never out of date. Collection is only offered at sites with a chilled van bay."
          />
          {upcoming.length === 0 ? (
            <EmptyState
              icon="Calendar"
              title="No published editions"
              body="When the next dates are confirmed they appear here automatically."
              tone="caution"
            />
          ) : (
            <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id} className="flex">
                  <EventCard event={event} className="w-full" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ---- Pickup -------------------------------------------------------- */}
      <section id="pickup" className="bg-turmeric-wash border-ink-line border-y-2">
        <div className="shell py-10">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
            <div>
              <p className="label text-cocoa mb-2">Shop online. Pick up. Celebrate together.</p>
              <h2 className="text-2xl md:text-3xl">Collect an order at the fair</h2>
              <p className="text-forest-muted mt-3 max-w-md">
                Do your weekly shop online during the week, then collect it from the tent at the
                gate while you walk the stalls. No delivery fee, no waiting at home for a van.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <ButtonLink href="/category/groceries" size="lg" icon="Groceries">
                  Start a shop
                </ButtonLink>
                <ButtonLink href="/delivery" size="lg" intent="secondary" icon="MapArea">
                  Delivery and collection
                </ButtonLink>
              </div>
            </div>

            <ol className="list-none space-y-2.5">
              {[
                {
                  icon: 'Cart' as IconName,
                  title: 'Fill your basket online',
                  detail: 'Anything except chilled and frozen lines, which cannot be staged in a tent.',
                },
                {
                  icon: 'SpiceFairPickup' as IconName,
                  title: 'Choose Spice Fair pickup',
                  detail:
                    'The option only appears when an edition with a collection tent is genuinely open for it.',
                },
                {
                  icon: 'Clock' as IconName,
                  title: `Order ${FULFILLMENT.spiceFairCutoffHours} hours before doors`,
                  detail: 'Collection closes then so the picking team can stage everything on site.',
                },
                {
                  icon: 'Community' as IconName,
                  title: 'Collect, then stay',
                  detail: 'Pick up at the gate tent between 10am and 6pm, then shop the stalls and eat.',
                },
              ].map((step, index) => (
                <li
                  key={step.title}
                  className="border-cocoa/25 bg-paper flex gap-3 rounded-[var(--radius-card)] border p-3.5"
                >
                  <span className="bg-turmeric text-forest font-display num flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <Icon name={step.icon} size={17} />
                      {step.title}
                    </h3>
                    <p className="text-forest-muted mt-0.5 text-sm">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- Programming --------------------------------------------------- */}
      {next ? (
        <Section>
          <div className="shell">
            <SectionHead eyebrow="On the day" title="What is there" />
            <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {next.programming.map((item) => (
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
      ) : null}

      {/* ---- Vendors ------------------------------------------------------- */}
      {vendors.length > 0 ? (
        <Section id="vendors" tone="sunk">
          <div className="shell">
            <SectionHead
              eyebrow="Vendor row"
              title={`Trading at ${next!.area}`}
              blurb="The line-up rotates between editions. Makers marked “also online” sell through Spicemart during the week too."
              href="/category/local"
              linkLabel="Shop local makers"
            />
            <VendorGrid vendors={vendors} />
          </div>
        </Section>
      ) : null}

      {/* ---- Become a vendor ----------------------------------------------- */}
      <Section id="vendor">
        <div className="shell">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
            <div>
              <SectionHead eyebrow="Trade with us" title="Become a vendor" className="mb-3" />
              <p className="text-forest-muted">
                Stall allocation runs about three weeks ahead of each edition. Priority goes to
                Grenadian growers, makers and cooks — particularly anyone who has not had a retail
                outlet before.
              </p>
              <ul className="mt-4 list-none space-y-2 text-sm">
                {[
                  'No commission on what you sell at your stall.',
                  'Tables and shade provided; power is limited and allocated in advance.',
                  'Vendors who sell well at the fair can be listed on the Local shelf online.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Icon name="Check" size={16} className="text-leaf-deep mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-4">
              <VendorInterest />
            </div>
          </div>
        </div>
      </Section>

      {/* ---- FAQ ----------------------------------------------------------- */}
      <Section tone="sunk">
        <div className="shell">
          <SectionHead eyebrow="Questions" title="Before you come" />
          <div className="grid gap-2.5 lg:grid-cols-2">
            {SPICE_FAIR_FAQ.map((item) => (
              <details
                key={item.q}
                className="border-line-strong bg-paper group rounded-[var(--radius-card)] border"
              >
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3.5 py-3 font-bold">
                  {item.q}
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className="shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="text-forest-muted border-line border-t px-3.5 py-3 text-sm">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Archive ------------------------------------------------------- */}
      <Section>
        <div className="shell">
          <SectionHead
            eyebrow="Archive"
            title="Previous editions"
            blurb="Photography, vendor lists and takings from past fairs will live here. The prototype holds the structure, not the content."
          />
          {past.length === 0 ? (
            <EmptyState
              icon="Calendar"
              title="No past editions recorded"
              body="Once an edition has run it moves here with its line-up and a short write-up."
            />
          ) : (
            <>
              <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <li key={event.id} className="flex">
                    <EventCard event={event} className="w-full" />
                  </li>
                ))}
              </ul>
              <Notice tone="prototype" className="mt-3">
                Past editions are generated from the same schedule rule. Real archive content —
                photos, attendance, vendor feedback — is not part of this prototype.
              </Notice>
            </>
          )}
        </div>
      </Section>

      {/* ---- Back to shopping ---------------------------------------------- */}
      <section className="border-ink-line bg-signal-wash border-t-2">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-8">
          <div>
            <h2 className="text-xl">The fair is the other half of the shop</h2>
            <p className="text-forest-muted mt-1 max-w-lg text-sm">
              You never need to understand the fair to buy groceries. But if you shop the Local
              shelf during the week, you are already buying from the people standing behind these
              tables.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink href="/category/local" size="lg" icon="LocalVendors">
              Shop the Local shelf
            </ButtonLink>
            <Link
              href="/"
              className="text-forest-muted hover:text-forest inline-flex min-h-12 items-center text-sm font-semibold underline underline-offset-4"
            >
              Back to shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
