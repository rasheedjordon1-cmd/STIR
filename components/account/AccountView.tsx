'use client';

import Link from 'next/link';
import { ProductRail } from '@/components/commerce/ProductGrid';
import { ServiceStatusPill } from '@/components/fulfillment/ServiceStatusPill';
import { Icon, type IconName } from '@/components/icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section, SectionHead } from '@/components/ui/Section';
import { OrderCard } from './OrderCard';
import { SignedOutPrompt } from './SignedOutPrompt';
import { REWARDS_SUMMARY } from '@/data/rewards';
import { formatEventDate } from '@/lib/format';
import { useFair } from '@/lib/store/fair';
import { useLocation } from '@/lib/store/location';
import { useSession } from '@/lib/store/session';
import { useUI } from '@/lib/store/ui';
import type { Order, Product } from '@/types';

/* ==========================================================================
   Account overview
   The retention surface: where an order goes, what is in motion, what is
   saved, and what is coming up at the fair.
   ========================================================================== */

const HELP: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'Phone',
    title: 'Contact',
    body: 'Message the Spicemart desk on WhatsApp during opening hours, or call the number on your order confirmation.',
  },
  {
    icon: 'DeliveryInstructions',
    title: 'Something missing or wrong?',
    body: 'Report it within 24 hours of delivery and the line is credited or replaced on the next run. Fresh produce is always replaced, never argued about.',
  },
  {
    icon: 'Receipt',
    title: 'Returns and refunds',
    body: 'Policy placeholder. Final returns terms are pending business sign-off and are not stated in this prototype.',
  },
];

export function AccountView({
  orders,
  products,
  savedProducts,
  recentProducts,
}: {
  orders: Order[];
  products: Product[];
  savedProducts: Product[];
  recentProducts: Product[];
}) {
  const { signedIn, hydrated, name, signOut, favorites } = useSession();
  const { zone, saved } = useLocation();
  const { openLocation } = useUI();
  const { next, collectable } = useFair();

  if (!hydrated) return null;

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const listProducts = favoriteProducts.length > 0 ? favoriteProducts : savedProducts;
  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div className="flex flex-col gap-8">
      {signedIn ? (
        <div className="border-ink-line bg-paper flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border-2 p-4">
          <div>
            <p className="label text-forest-muted">Signed in as</p>
            <p className="font-display text-xl font-bold tracking-tight">{name}</p>
            <p className="text-forest-muted text-sm">Sample account · prototype only</p>
          </div>
          <Button intent="secondary" size="sm" onClick={signOut}>
            Sign out of the preview
          </Button>
        </div>
      ) : (
        <SignedOutPrompt
          icon="Account"
          title="You are browsing signed out"
          body="Spicemart works without an account — you can shop, search and check delivery to your area. Signing in adds order history, reordering, a saved list and rewards."
        />
      )}

      <section
        aria-labelledby="location-heading"
        className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-4"
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 id="location-heading" className="text-md">
            Saved delivery location
          </h2>
          <Button size="sm" intent="secondary" icon="LocationPin" onClick={openLocation}>
            Edit
          </Button>
        </div>
        <p className="text-lg font-bold">
          {zone.area}, {zone.parish}
        </p>
        <div className="mt-2">
          <ServiceStatusPill zone={zone} withDetail />
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {[
            ['Address', saved.addressLine],
            ['Landmark', saved.landmark],
            ['Phone', saved.phone],
            ['Instructions', saved.instructions],
          ].map(([label, value]) => (
            <div key={label} className="border-line flex gap-2 border-b py-1">
              <dt className="label text-forest-muted w-24 shrink-0 pt-0.5">{label}</dt>
              <dd className={value ? 'font-medium' : 'text-forest-faint'}>{value || 'Not set'}</dd>
            </div>
          ))}
        </dl>
      </section>

      {signedIn && activeOrder ? (
        <section aria-labelledby="active-heading">
          <h2 id="active-heading" className="label text-forest-muted border-ink-line mb-3 border-b-2 pb-1.5">
            In motion
          </h2>
          <OrderCard order={activeOrder} products={products} />
        </section>
      ) : null}

      {signedIn ? (
        <section
          aria-labelledby="rewards-heading"
          className="border-cocoa/30 bg-turmeric-wash rounded-[var(--radius-card)] border p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="rewards-heading" className="label text-cocoa">
                Spicemart Rewards
              </h2>
              <p className="num font-display mt-1 text-3xl font-extrabold tracking-tight">
                {REWARDS_SUMMARY.points.toLocaleString('en-US')}
                <span className="text-md ml-1.5 font-bold">points</span>
              </p>
              <p className="text-forest-muted text-sm">
                {(REWARDS_SUMMARY.nextRewardAt - REWARDS_SUMMARY.points).toLocaleString('en-US')} to
                the next reward
              </p>
            </div>
            <ButtonLink href="/rewards" intent="secondary" icon="Rewards">
              Open rewards
            </ButtonLink>
          </div>
        </section>
      ) : null}

      <Section id="list" className="py-0">
        <SectionHead
          eyebrow="Saved list"
          title={favoriteProducts.length > 0 ? 'Things you saved' : 'A shopping list, ready to go'}
          blurb={
            favoriteProducts.length > 0
              ? 'Tap the heart on any product to add it here.'
              : 'Nothing saved yet — this is a sample list. Tap the heart on any product card to build your own.'
          }
          className="mb-3"
        />
        <ProductRail products={listProducts} label="Saved list" />
      </Section>

      <Section className="py-0">
        <SectionHead eyebrow="Recently viewed" title="Back where you left off" className="mb-3" />
        <ProductRail products={recentProducts} label="Recently viewed" />
      </Section>

      {next ? (
        <section
          aria-labelledby="fair-heading"
          className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-4"
        >
          <h2 id="fair-heading" className="text-md flex items-center gap-2">
            <Icon name="MarketStall" size={20} />
            Event reminders
          </h2>
          <p className="text-forest-muted mt-1.5 text-sm">
            The next Spice Fair is {formatEventDate(next.date)} at {next.venue}, {next.area}.{' '}
            {collectable
              ? 'Order collection is open for it.'
              : 'This edition is market-only, so orders cannot be collected there.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ButtonLink href={`/spice-fair/${next.id}`} size="sm" intent="secondary">
              Event details
            </ButtonLink>
            <ButtonLink href="/spice-fair" size="sm" intent="quiet">
              All editions
            </ButtonLink>
          </div>
        </section>
      ) : null}

      <section id="help" aria-labelledby="help-heading">
        <h2 id="help-heading" className="label text-forest-muted border-ink-line mb-3 border-b-2 pb-1.5">
          Help and contact
        </h2>
        <ul className="grid list-none gap-2.5 md:grid-cols-3">
          {HELP.map((item) => (
            <li
              key={item.title}
              className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-3.5"
            >
              <Icon name={item.icon} size={22} className="text-leaf-deep mb-2" />
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="text-forest-muted mt-1 text-sm">{item.body}</p>
            </li>
          ))}
        </ul>
        <Notice tone="prototype" className="mt-3">
          There is no real authentication, and no personal data leaves this device. The sign-in
          switch exists so the signed-in and signed-out states can both be reviewed.{' '}
          <Link href="/system" className="underline underline-offset-4">
            See the design system
          </Link>
          .
        </Notice>
      </section>
    </div>
  );
}
