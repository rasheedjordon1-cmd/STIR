import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';
import { CategoryCard } from '@/components/commerce/CategoryCard';
import { ProductCard } from '@/components/commerce/ProductCard';
import { EventCard } from '@/components/events/EventCard';
import { ServiceStatusPill } from '@/components/fulfillment/ServiceStatusPill';
import { Icon } from '@/components/icons';
import { IconGallery } from '@/components/system/IconGallery';
import { StateGallery } from '@/components/system/StateGallery';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { CATEGORIES } from '@/data/categories';
import { getUpcomingEvents } from '@/data/events';
import { DELIVERY_ZONES } from '@/data/zones';
import { commerce } from '@/lib/commerce';
import { contrast, grade } from '@/lib/contrast';
import { cx } from '@/lib/cx';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

const SURFACES = [
  { name: 'Breadfruit', token: '--color-breadfruit', hex: '#F7F2E6', use: 'App surface' },
  { name: 'Paper', token: '--color-paper', hex: '#FFFCF4', use: 'Cards, sheets, inputs' },
  { name: 'Paper sunk', token: '--color-paper-sunk', hex: '#F1EAD9', use: 'Image wells, bands' },
];

const INK = [
  { name: 'Forest', token: '--color-forest', hex: '#102515', use: 'Primary ink, rules' },
  { name: 'Forest muted', token: '--color-forest-muted', hex: '#515E50', use: 'Secondary ink' },
  { name: 'Forest faint', token: '--color-forest-faint', hex: '#7D8879', use: 'Placeholder only' },
  { name: 'Line', token: '--color-line', hex: '#E2DBC7', use: 'Hairline dividers' },
  { name: 'Line strong', token: '--color-line-strong', hex: '#C4BCA5', use: 'Control borders' },
];

const BRAND = [
  { name: 'Leaf', token: '--color-leaf', hex: '#2E7D32', use: 'Primary action' },
  { name: 'Leaf deep', token: '--color-leaf-deep', hex: '#1F5C23', use: 'Hover, action text' },
  { name: 'Signal', token: '--color-signal', hex: '#5DAE35', use: 'Logo ground. Ink only on top' },
  { name: 'Turmeric', token: '--color-turmeric', hex: '#F5B81C', use: 'Promo, Spice Fair' },
  { name: 'Nutmeg', token: '--color-nutmeg', hex: '#9E1B32', use: 'Savings, alerts' },
  { name: 'Ocean teal', token: '--color-teal', hex: '#00918C', use: 'Fulfilment surfaces' },
  { name: 'Teal ink', token: '--color-teal-ink', hex: '#00706C', use: 'Teal at text sizes' },
  { name: 'Cocoa', token: '--color-cocoa', hex: '#4B2E20', use: 'Vendor, editorial' },
];

const PAIRS: { fg: string; bg: string; label: string }[] = [
  { fg: '#102515', bg: '#F7F2E6', label: 'Forest on Breadfruit' },
  { fg: '#515E50', bg: '#F7F2E6', label: 'Forest muted on Breadfruit' },
  { fg: '#FFFCF4', bg: '#2E7D32', label: 'Paper on Leaf (primary button)' },
  { fg: '#102515', bg: '#5DAE35', label: 'Forest on Signal Green' },
  { fg: '#FFFCF4', bg: '#5DAE35', label: 'Paper on Signal Green — never used' },
  { fg: '#102515', bg: '#F5B81C', label: 'Forest on Turmeric' },
  { fg: '#FFFCF4', bg: '#9E1B32', label: 'Paper on Nutmeg' },
  { fg: '#00706C', bg: '#FFFCF4', label: 'Teal ink on Paper' },
  { fg: '#FFFCF4', bg: '#00918C', label: 'Paper on Ocean Teal — large text only' },
  { fg: '#F7F2E6', bg: '#102515', label: 'Breadfruit on Forest (footer)' },
];

const TYPE = [
  { name: 'Display', className: 'display text-3xl', sample: 'Live easy.', meta: 'Archivo 800 · −0.035em' },
  { name: 'Heading 1', className: 'text-3xl', sample: 'Everything Grenada', meta: '2.5rem · −0.02em' },
  { name: 'Heading 2', className: 'text-2xl', sample: 'The weekly shop', meta: '1.875rem' },
  { name: 'Heading 3', className: 'text-lg', sample: 'Frequently bought together', meta: '1.25rem' },
  { name: 'Body large', className: 'text-md', sample: 'Groceries, fresh produce and household goods.', meta: '1.0625rem' },
  { name: 'Body', className: 'text-base', sample: 'Delivering to Grand Anse, St. George.', meta: '0.9375rem — interface default' },
  { name: 'Small', className: 'text-sm', sample: '2 kg · EC$7.25 / kg', meta: '0.8125rem — dense metadata' },
  { name: 'Label', className: 'label', sample: 'Delivery available', meta: '0.6875rem · 0.08em · uppercase' },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 56, 72];

const SECTIONS = [
  ['brand', 'Brand'],
  ['colour', 'Colour'],
  ['type', 'Typography'],
  ['space', 'Space and radius'],
  ['buttons', 'Buttons and badges'],
  ['fulfilment', 'Fulfilment'],
  ['cards', 'Cards'],
  ['icons', 'Icons'],
  ['states', 'States'],
  ['nav', 'Navigation'],
];

export default async function SystemPage() {
  const products = await commerce.getProducts();
  const events = getUpcomingEvents(new Date(), 2);

  const pick = (handle: string) => {
    const found = products.find((p) => p.handle === handle);
    if (!found) throw new Error(`/system references a missing product: ${handle}`);
    return found;
  };

  const sample = {
    plain: pick('all-purpose-flour-2kg'),
    deal: pick('laundry-powder-4kg'),
    multibuy: pick('evaporated-milk-410g'),
    localFresh: pick('callaloo-bundle'),
    soldOut: pick('ice-bag-5kg'),
    localOnly: pick('cocoa-tea-balls'),
  };

  const zone = (id: string) => {
    const found = DELIVERY_ZONES.find((z) => z.id === id);
    if (!found) throw new Error(`/system references a missing zone: ${id}`);
    return found;
  };

  const zones = {
    delivery: zone('sg-grand-anse'),
    pickup: zone('sm-victoria'),
    none: zone('sp-river-sallee'),
  };

  return (
    <div className="shell py-8 pb-16">
      <header className="border-ink-line mb-8 border-b-2 pb-6">
        <p className="label text-forest-muted mb-2">Internal · not linked from navigation</p>
        <h1 className="display text-[clamp(2.5rem,9vw,4rem)]">Spicemart system</h1>
        <p className="text-forest-muted mt-3 max-w-2xl text-md">
          The working parts of the prototype in one place. Tokens live in{' '}
          <code className="text-sm">styles/tokens.css</code>; every component on this page reads
          them, so a change there changes the product everywhere at once.
        </p>
        <nav aria-label="Sections" className="mt-5">
          <ul className="flex list-none flex-wrap gap-1.5">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="border-line-strong bg-paper hover:border-forest inline-flex min-h-9 items-center rounded-[var(--radius-chip)] border px-2.5 text-sm font-semibold"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="flex flex-col gap-12">
        {/* ---- Brand ------------------------------------------------------- */}
        <Block id="brand" title="Logo treatments" note="All four derived from the single supplied artwork by scripts/derive-brand-assets.mjs. The drawing is never redrawn, distorted or outlined.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Swatch label="Light surface" sub="Forest ink, transparent ground" className="bg-paper">
              <Logo variant="lockup" tone="ink" width={180} alt="Spicemart" />
            </Swatch>
            <Swatch label="Dark surface" sub="Breadfruit knockout" className="bg-forest">
              <Logo variant="lockup" tone="knockout" width={180} alt="Spicemart" />
            </Swatch>
            <Swatch label="As supplied" sub="Ink on Signal Green ground" className="bg-breadfruit">
              <Logo variant="lockup" tone="green" width={180} alt="Spicemart" />
            </Swatch>
            <Swatch label="Symbol" sub="Small header, favicon, avatar" className="bg-breadfruit">
              <div className="flex items-end gap-3">
                <Logo variant="symbol" tone="ink" width={56} alt="" />
                <Logo variant="symbol" tone="green" width={40} alt="" />
                <Logo variant="symbol" tone="ink" width={24} alt="" />
              </div>
            </Swatch>
          </div>
          <div className="border-line-strong bg-paper mt-3 rounded-[var(--radius-card)] border p-4">
            <p className="label text-forest-muted mb-2">Header treatment at real size</p>
            <div className="flex flex-wrap items-center gap-6">
              <Logo variant="lockup" tone="ink" width={112} alt="" />
              <Logo variant="lockup" tone="ink" width={148} alt="" />
            </div>
          </div>
        </Block>

        {/* ---- Colour ------------------------------------------------------ */}
        <Block id="colour" title="Colour tokens" note="Colour carries function. Nothing on this list is decorative, and no screen uses more than three of the accents at once.">
          {[
            ['Surfaces', SURFACES],
            ['Ink and structure', INK],
            ['Brand and accent', BRAND],
          ].map(([title, set]) => (
            <div key={title as string} className="mb-5">
              <h3 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
                {title as string}
              </h3>
              <ul className="grid list-none gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(set as typeof SURFACES).map((colour) => (
                  <li
                    key={colour.token}
                    className="border-line-strong bg-paper overflow-hidden rounded-[var(--radius-card)] border"
                  >
                    <div className="border-line h-14 border-b" style={{ background: colour.hex }} />
                    <div className="p-2.5">
                      <p className="text-sm font-bold">{colour.name}</p>
                      <p className="num text-forest-muted text-xs">{colour.hex}</p>
                      <p className="text-forest-muted mt-1 text-xs">{colour.use}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h3 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
            Measured contrast
          </h3>
          <ul className="grid list-none gap-2 sm:grid-cols-2">
            {PAIRS.map((pair) => {
              const ratio = contrast(pair.fg, pair.bg);
              const result = grade(ratio);
              return (
                <li
                  key={pair.label}
                  className="border-line-strong flex items-center gap-3 rounded-[var(--radius-control)] border p-2.5"
                  style={{ background: pair.bg, color: pair.fg }}
                >
                  <span className="flex-1 text-sm font-semibold">{pair.label}</span>
                  <span className="num text-sm font-bold">{ratio.toFixed(2)}</span>
                  <span
                    className={cx(
                      'label rounded-[var(--radius-chip)] px-1.5 py-1',
                      result.pass ? 'bg-leaf text-paper' : 'bg-nutmeg text-paper',
                    )}
                  >
                    {result.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <Notice tone="info" className="mt-3">
            Signal Green is the logo ground, not a text colour: Paper on it measures 2.71 and is
            never used. Ocean Teal carries white only at large sizes, which is why{' '}
            <code className="text-xs">--color-teal-ink</code> exists for body text.
          </Notice>
        </Block>

        {/* ---- Type -------------------------------------------------------- */}
        <Block id="type" title="Typography" note="Archivo for display and headings, Hanken Grotesk for interface. Prices, quantities and dates are tabular everywhere.">
          <ul className="list-none">
            {TYPE.map((style) => (
              <li
                key={style.name}
                className="border-line flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3"
              >
                <span className={cx('min-w-0', style.className)}>{style.sample}</span>
                <span className="text-forest-muted shrink-0 text-right text-xs">
                  <span className="label block">{style.name}</span>
                  {style.meta}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-line-strong bg-paper mt-4 rounded-[var(--radius-card)] border p-4">
            <p className="label text-forest-muted mb-2">Tabular figures</p>
            <ul className="num list-none text-md font-semibold">
              <li>EC$8.00</li>
              <li>EC$14.50</li>
              <li>EC$165.00</li>
              <li>EC$1,840.00</li>
            </ul>
            <p className="text-forest-muted mt-2 text-sm">
              Every digit occupies the same width, so a column of prices aligns without extra markup.
            </p>
          </div>
        </Block>

        {/* ---- Space ------------------------------------------------------- */}
        <Block id="space" title="Space and radius" note="A four-point scale. Radii stay modest — nothing is a pill except a status chip.">
          <ul className="mb-5 flex list-none flex-wrap items-end gap-3">
            {SPACING.map((step) => (
              <li key={step} className="text-center">
                <div className="bg-leaf rounded-[2px]" style={{ width: step, height: step }} />
                <span className="num text-forest-muted mt-1.5 block text-xs">{step}</span>
              </li>
            ))}
          </ul>
          <ul className="grid list-none gap-2 sm:grid-cols-4">
            {[
              ['Chip', 'var(--radius-chip)', '3px'],
              ['Control', 'var(--radius-control)', '6px'],
              ['Card', 'var(--radius-card)', '10px'],
              ['Module', 'var(--radius-module)', '14px'],
            ].map(([name, token, value]) => (
              <li
                key={name}
                className="border-line-strong bg-paper flex flex-col items-center gap-2 border p-3"
                style={{ borderRadius: token }}
              >
                <span className="text-sm font-bold">{name}</span>
                <span className="num text-forest-muted text-xs">{value}</span>
              </li>
            ))}
          </ul>
        </Block>

        {/* ---- Buttons ----------------------------------------------------- */}
        <Block id="buttons" title="Buttons and badges" note="Every real action is at least 44px tall. Badge priority is defined once, in components/commerce/badges.ts.">
          <div className="mb-5 flex flex-wrap items-end gap-2.5">
            <Button intent="primary" icon="Add">Primary</Button>
            <Button intent="secondary" icon="MapArea">Secondary</Button>
            <Button intent="accent" icon="MarketStall">Accent</Button>
            <Button intent="quiet">Quiet</Button>
            <Button intent="primary" disabled>Disabled</Button>
          </div>
          <div className="mb-5 flex flex-wrap items-end gap-2.5">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="bg-forest mb-5 flex flex-wrap gap-2.5 rounded-[var(--radius-card)] p-4">
            <Button intent="inverse" icon="Calendar">On dark</Button>
            <Button intent="accent" icon="MarketStall">Accent on dark</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="deal" icon="Discount">Save 15%</Badge>
            <Badge tone="multibuy">4 for EC$17.90</Badge>
            <Badge tone="local" icon="LocalVendors">Local</Badge>
            <Badge tone="fresh" icon="FreshProduce">Fresh</Badge>
            <Badge tone="low" icon="LowStock">Low stock</Badge>
            <Badge tone="out" icon="OutOfStock">Out of stock</Badge>
            <Badge tone="fair">Collection open</Badge>
            <Badge tone="new">New</Badge>
            <Badge tone="neutral">Prototype</Badge>
          </div>
        </Block>

        {/* ---- Fulfilment -------------------------------------------------- */}
        <Block id="fulfilment" title="Fulfilment states" note="Three serviceability states, each carried by an icon and a word as well as a colour.">
          <ul className="grid list-none gap-2 lg:grid-cols-3">
            {[
              ['Delivery available', zones.delivery],
              ['Collection only', zones.pickup],
              ['Not serviced', zones.none],
            ].map(([label, zone]) => (
              <li
                key={label as string}
                className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-3.5"
              >
                <p className="text-md font-bold">{(zone as typeof zones.delivery).area}</p>
                <p className="text-forest-muted mb-2.5 text-sm">
                  {(zone as typeof zones.delivery).parish}
                </p>
                <ServiceStatusPill zone={zone as typeof zones.delivery} withDetail />
                {(zone as typeof zones.delivery).note ? (
                  <p className="text-forest-muted mt-2 text-xs">
                    {(zone as typeof zones.delivery).note}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Block>

        {/* ---- Cards ------------------------------------------------------- */}
        <Block id="cards" title="Card variants" note="Product cards keep a fixed vertical rhythm so a grid row shares one baseline whatever the content.">
          <h3 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
            Product cards
          </h3>
          <ul className="mb-6 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ['Plain', sample.plain],
              ['Reduced', sample.deal],
              ['Multibuy', sample.multibuy],
              ['Local + fresh', sample.localFresh],
              ['Local only', sample.localOnly],
              ['Out of stock', sample.soldOut],
            ].map(([label, product]) => (
              <li key={label as string} className="flex flex-col gap-1.5">
                <span className="label text-forest-muted">{label as string}</span>
                <ProductCard product={product as typeof sample.plain} className="w-full" />
              </li>
            ))}
          </ul>

          <h3 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
            Category cards
          </h3>
          <ul className="mb-6 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((category) => (
              <li key={category.handle} className="flex">
                <CategoryCard category={category} className="w-full" />
              </li>
            ))}
          </ul>

          <h3 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
            Event cards
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {events.map((event) => (
              <div key={`${event.id}-dark`} className="bg-forest rounded-[var(--radius-card)] p-2">
                <EventCard event={event} tone="dark" />
              </div>
            ))}
          </div>
        </Block>

        {/* ---- Icons ------------------------------------------------------- */}
        <Block id="icons" title="Icon system" note="One grammar: 24px box, 1.75 stroke, round caps, currentColor. Click an icon to copy its JSX.">
          <IconGallery />
        </Block>

        {/* ---- States ------------------------------------------------------ */}
        <Block id="states" title="Controls and states">
          <StateGallery />
        </Block>

        {/* ---- Navigation -------------------------------------------------- */}
        <Block id="nav" title="Mobile bottom navigation" note="Five destinations. The basket is not one of them — it lives in the sticky header, so browsing, ordering and account each keep a permanent slot.">
          <div className="border-line-strong mx-auto max-w-[420px] overflow-hidden rounded-[var(--radius-card)] border">
            <div className="border-ink-line bg-paper border-t-2">
              <ul className="grid list-none grid-cols-5">
                {[
                  ['Home', 'Home', true],
                  ['Categories', 'Categories', false],
                  ['Orders', 'Orders', false],
                  ['Rewards', 'Rewards', false],
                  ['Account', 'Account', false],
                ].map(([label, icon, active]) => (
                  <li key={label as string}>
                    <span
                      className={cx(
                        'flex min-h-[60px] flex-col items-center justify-center gap-0.5 px-1 py-1.5',
                        active ? 'text-leaf-deep' : 'text-forest-muted',
                      )}
                    >
                      <Icon name={icon as 'Home'} size={22} />
                      <span className="label">{label as string}</span>
                      <span
                        className={cx(
                          'h-[3px] w-6 rounded-full',
                          active ? 'bg-leaf-deep' : 'bg-transparent',
                        )}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}

function Block({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--header-h)+24px)]">
      <div className="border-ink-line mb-5 border-t-2 pt-3">
        <h2 className="text-2xl">{title}</h2>
        {note ? <p className="text-forest-muted mt-1.5 max-w-2xl text-sm">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Swatch({
  label,
  sub,
  className,
  children,
}: {
  label: string;
  sub: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line-strong overflow-hidden rounded-[var(--radius-card)] border">
      <div className={cx('flex min-h-[128px] items-center justify-center p-4', className)}>
        {children}
      </div>
      <div className="border-line bg-paper border-t p-2.5">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-forest-muted text-xs">{sub}</p>
      </div>
    </div>
  );
}
