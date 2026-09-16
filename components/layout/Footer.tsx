import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Icon } from '@/components/icons';
import { BRAND, PROTOTYPE_NOTICE, SPICE_FAIR } from '@/data/config';
import { SERVICE_COVERAGE, zonesByParish } from '@/data/zones';

/* ==========================================================================
   Footer
   Reads as a service directory, not a sitemap: where we go, how to reach us,
   how delivery works, and how to trade with us.
   ========================================================================== */

const COLUMNS = [
  {
    title: 'Shopping',
    links: [
      { label: 'Groceries', href: '/category/groceries' },
      { label: 'Fresh produce', href: '/category/fresh-produce' },
      { label: 'Household', href: '/category/household' },
      { label: 'The Local shelf', href: '/category/local' },
      { label: 'Deals', href: '/category/deals' },
    ],
  },
  {
    title: 'Delivery & collection',
    links: [
      { label: 'Delivery areas and windows', href: '/delivery' },
      { label: 'Collection points', href: '/delivery#collection' },
      { label: 'Spice Fair pickup', href: '/spice-fair#pickup' },
      { label: 'Track an order', href: '/account/orders' },
    ],
  },
  {
    title: 'Your account',
    links: [
      { label: 'Account overview', href: '/account' },
      { label: 'Past orders and reorder', href: '/account/orders' },
      { label: 'Rewards', href: '/rewards' },
      { label: 'Saved list', href: '/account#list' },
    ],
  },
  {
    title: 'Spicemart',
    links: [
      { label: 'The Spice Fair', href: '/spice-fair' },
      { label: 'Become a vendor', href: '/spice-fair#vendor' },
      { label: 'Help and contact', href: '/account#help' },
      { label: 'Design system', href: '/system' },
    ],
  },
];

export function Footer() {
  const parishes = zonesByParish();

  return (
    <footer className="bg-forest text-breadfruit on-dark mt-10 pb-[calc(var(--bottom-nav-h)+16px)] lg:pb-0">
      <div className="shell py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2.4fr)]">
          <div>
            <Logo variant="lockup" tone="knockout" width={168} alt="Spicemart" />
            <p className="display text-breadfruit mt-5 text-2xl">
              Everything
              <br />
              Grenada.
            </p>
            <p className="text-breadfruit/75 mt-3 max-w-xs text-sm">
              {BRAND.proposition}. Groceries, essentials, delivery, payments and rewards — built
              here, for here.
            </p>
            <div className="mt-5 flex gap-2">
              {['Instagram', 'Facebook', 'WhatsApp'].map((network) => (
                <a
                  key={network}
                  href="#"
                  className="border-breadfruit/35 hover:border-breadfruit hover:bg-breadfruit/10 flex min-h-11 items-center rounded-[var(--radius-control)] border px-3 text-sm font-semibold"
                >
                  {network}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="label text-breadfruit/65 mb-2.5">{column.title}</h2>
                <ul className="flex list-none flex-col gap-1.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-turmeric inline-flex min-h-7 items-center text-sm hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Service areas, stated plainly rather than implied. */}
        <div className="border-breadfruit/20 mt-9 border-t pt-6">
          <h2 className="label text-breadfruit/65 mb-2.5">Service areas</h2>
          <p className="text-breadfruit/80 text-sm">
            {SERVICE_COVERAGE.deliveryZones} delivery areas and {SERVICE_COVERAGE.pickupPoints}{' '}
            collection points across {parishes.length} parishes.{' '}
            <Link href="/delivery" className="text-turmeric underline underline-offset-4">
              Check your area
            </Link>
            .
          </p>
          <ul className="text-breadfruit/70 mt-2.5 flex list-none flex-wrap gap-x-4 gap-y-1 text-sm">
            {parishes.map((group) => (
              <li key={group.parish}>{group.parish}</li>
            ))}
          </ul>
        </div>

        <div className="border-breadfruit/20 mt-7 flex flex-col gap-4 border-t pt-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <Icon name="MapArea" size={16} />
              {BRAND.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="SecurePayment" size={16} />
              {BRAND.currencyLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="MarketStall" size={16} />
              {SPICE_FAIR.name} · {SPICE_FAIR.rhythm.toLowerCase()}
            </span>
          </div>
          <ul className="text-breadfruit/70 flex list-none flex-wrap gap-x-5 gap-y-2 text-sm">
            {['Returns and refunds', 'Privacy', 'Terms', 'Accessibility'].map((item) => (
              <li key={item}>
                <Link href="/account#help" className="hover:text-turmeric hover:underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-breadfruit/55 mt-6 text-xs">
          {PROTOTYPE_NOTICE} Returns, refunds and rewards terms are placeholders pending business
          sign-off.
        </p>
      </div>
    </footer>
  );
}
