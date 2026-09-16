import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';
import { CategoryCard } from '@/components/commerce/CategoryCard';
import { ProductCard } from '@/components/commerce/ProductCard';
import { EventCard } from '@/components/events/EventCard';
import { FulfillmentCard } from '@/components/home/FulfillmentCard';
import { ServiceStatusPill } from '@/components/fulfillment/ServiceStatusPill';
import { Icon } from '@/components/icons';
import { IconGallery } from '@/components/system/IconGallery';
import { Compare } from '@/components/system/SpecimenCompare';
import { StateGallery } from '@/components/system/StateGallery';
import { Badge } from '@/components/ui/Badge';
import { Button, TextAction } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { CATEGORIES } from '@/data/categories';
import { getUpcomingEvents } from '@/data/events';
import { DELIVERY_ZONES } from '@/data/zones';
import { commerce } from '@/lib/commerce';
import { contrast, grade } from '@/lib/contrast';
import { cx } from '@/lib/cx';

export const metadata: Metadata = {
  title: 'Design system · V2',
  robots: { index: false, follow: false },
};

/* ---- Token tables -------------------------------------------------------- */

const SURFACES = [
  ['--surface-page', '#F7F2E6', 'App surface. Breadfruit, unchanged.'],
  ['--surface-card', '#FDFAF2', 'Cards and modules. Warmer than white by design.'],
  ['--surface-raised', '#FFFDF8', 'Drawers and menus — the only lifted surface.'],
  ['--surface-sunk', '#F1E9D7', 'Image stages and tonal bands.'],
  ['--surface-green-soft', '#E9F1E4', 'Commerce, availability, primary affirmation.'],
  ['--surface-yellow-soft', '#FBF0D4', 'Spice Fair and timely notices.'],
  ['--surface-teal-soft', '#E1F1F0', 'Service and household information.'],
  ['--surface-nutmeg-soft', '#F9E8EC', 'Deals and selected merchandising.'],
  ['--surface-cocoa-soft', '#F2E9E1', 'Heritage and food-supporting moments.'],
];

const INK = [
  ['--text-primary', '#102515', 'Body and headings. 14.5:1 on page.'],
  ['--text-secondary', '#4F5C4E', 'Supporting copy. 6.3:1 on page.'],
  ['--text-tertiary', '#64705E', 'Placeholders and struck-through prices. 4.6:1.'],
  ['--state-success', '#1F5C23', 'Commerce, in stock, confirmed.'],
  ['--state-warning', '#6B4715', 'Caution ink — Turmeric is a ground, never text.'],
  ['--state-danger', '#9E1B32', 'Savings, unavailable, destructive.'],
  ['--state-information', '#00706C', 'Fulfilment and service notes.'],
];

const BORDERS = [
  ['--border-subtle', 'Forest 13%', 'Level 2 surfaces, dividers, list seams.'],
  ['--border-default', 'Forest 26%', 'Level 3 controls: search, location, pickers.'],
  ['--border-strong', 'Forest 82%', 'The basket, and selected operational state only.'],
];

const RADII = [
  ['--radius-chip', '6px', 'Badges and status chips'],
  ['--radius-control', '9px', 'Buttons, inputs, steppers'],
  ['--radius-card', '12px', 'Product, category and event cards'],
  ['--radius-module', '16px', 'Delivery module, empty states, promotional fields'],
];

const SHADOWS = [
  ['--shadow-raised', 'Card hover and menus'],
  ['--shadow-sticky', 'Sticky header and bottom navigation'],
  ['--shadow-overlay', 'Cart drawer and location sheet'],
];

const MOTION = [
  ['--duration-tap', '150ms', 'Buttons, hovers, quantity ticks'],
  ['--duration-ui', '180ms', 'Module and header transitions'],
  ['--duration-drawer', '230ms', 'Drawers and sheets'],
  ['--ease-out-quint', 'cubic-bezier(0.22, 1, 0.36, 1)', 'Every transition in the system'],
];

const TYPE = [
  { name: 'Display', cls: 'display text-3xl uppercase', sample: 'Live easy.', meta: 'Instrument Sans · 700 · −0.04em · 0.94' },
  { name: 'Heading 1', cls: 'text-3xl', sample: 'Everything Grenada', meta: 'Display · 650 · −0.032em' },
  { name: 'Heading 2', cls: 'text-2xl', sample: 'The weekly shop', meta: 'Display · 650 · −0.025em' },
  { name: 'Heading 3', cls: 'text-lg', sample: 'Frequently bought together', meta: 'Display · 650' },
  { name: 'Eyebrow', cls: 'eyebrow', sample: 'Shop by category', meta: 'Display · 650 · sentence case' },
  { name: 'Body large', cls: 'text-md', sample: 'Groceries, fresh produce and household goods.', meta: 'Hanken · 420 · 1.5' },
  { name: 'Body', cls: 'text-base', sample: 'Delivering to Grand Anse, St. George.', meta: 'Hanken · 420 · 1.55' },
  { name: 'Small', cls: 'text-sm', sample: '2 kg · EC$7.25 / kg', meta: 'Hanken · 1.45' },
  { name: 'Infrastructure label', cls: 'label', sample: 'Deliver to', meta: 'Hanken · 650 · 0.075em · uppercase' },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 56, 76, 96];

const SECTIONS = [
  ['thesis', 'Thesis'],
  ['type', 'Typography'],
  ['colour', 'Colour'],
  ['surface', 'Surface & border'],
  ['shape', 'Radius, shadow, space'],
  ['controls', 'Controls'],
  ['cards', 'Cards'],
  ['fulfilment', 'Fulfilment'],
  ['icons', 'Icons'],
  ['states', 'States'],
  ['motion', 'Motion'],
  ['nav', 'Navigation'],
  ['compare', 'V1 → V2'],
];

export default async function SystemPage() {
  const products = await commerce.getProducts();
  const events = getUpcomingEvents(new Date(), 2);

  const pick = (handle: string) => {
    const found = products.find((p) => p.handle === handle);
    if (!found) throw new Error(`/system references a missing product: ${handle}`);
    return found;
  };
  const zone = (id: string) => {
    const found = DELIVERY_ZONES.find((z) => z.id === id);
    if (!found) throw new Error(`/system references a missing zone: ${id}`);
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
  const zones = {
    delivery: zone('sg-grand-anse'),
    pickup: zone('sm-victoria'),
    none: zone('sp-river-sallee'),
  };

  const PAIRS: { fg: string; bg: string; label: string }[] = [
    { fg: '#102515', bg: '#F7F2E6', label: 'Primary ink on page' },
    { fg: '#4F5C4E', bg: '#F7F2E6', label: 'Secondary ink on page' },
    { fg: '#FDFAF2', bg: '#2E7D32', label: 'Card on Leaf (primary button)' },
    { fg: '#102515', bg: '#5DAE35', label: 'Ink on Signal Green' },
    { fg: '#1F5C23', bg: '#E9F1E4', label: 'Success ink on green soft' },
    { fg: '#6B4715', bg: '#FBF0D4', label: 'Warning ink on yellow soft' },
    { fg: '#9E1B32', bg: '#F9E8EC', label: 'Danger ink on nutmeg soft' },
    { fg: '#00706C', bg: '#E1F1F0', label: 'Info ink on teal soft' },
    { fg: '#102515', bg: '#F5B81C', label: 'Ink on Turmeric' },
    { fg: '#F7F2E6', bg: '#102515', label: 'Breadfruit on Forest' },
  ];

  return (
    <div className="shell py-10 pb-20">
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow text-text-secondary mb-2">Internal · not linked from navigation</p>
        <h1 className="display text-[clamp(2.75rem,9vw,4.25rem)]">Spicemart system</h1>
        <p className="text-text-secondary mt-4 text-md">
          Visual System <strong className="text-text-primary">V2</strong> — island utility
          modernism. Tokens live in <code className="text-sm">styles/tokens.css</code>; every
          component on this page reads them, so a change there changes the product everywhere at
          once.
        </p>
        <nav aria-label="Sections" className="mt-6">
          <ul className="flex list-none flex-wrap gap-2">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="border-border-subtle bg-surface-card hover:border-border-default inline-flex min-h-9 items-center rounded-[var(--radius-chip)] border px-2.5 text-sm font-semibold"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="flex flex-col gap-14">
        {/* ---- Thesis + brand -------------------------------------------- */}
        <Block id="thesis" title="Thesis and brand" note="Soft enough to feel homegrown. Structured enough to feel dependable. Modern enough to feel like national infrastructure.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Swatch label="Light surface" sub="Forest ink, transparent ground" className="bg-surface-card">
              <Logo variant="lockup" tone="ink" width={180} alt="Spicemart" />
            </Swatch>
            <Swatch label="Dark surface" sub="Breadfruit knockout" className="bg-forest">
              <Logo variant="lockup" tone="knockout" width={180} alt="Spicemart" />
            </Swatch>
            <Swatch label="As supplied" sub="Ink on Signal Green ground" className="bg-surface-page">
              <Logo variant="lockup" tone="green" width={180} alt="Spicemart" />
            </Swatch>
            <Swatch label="Symbol" sub="Header, favicon, avatar" className="bg-surface-page">
              <div className="flex items-end gap-3">
                <Logo variant="symbol" tone="ink" width={56} alt="" />
                <Logo variant="symbol" tone="green" width={40} alt="" />
                <Logo variant="symbol" tone="ink" width={24} alt="" />
              </div>
            </Swatch>
          </div>
        </Block>

        {/* ---- Typography -------------------------------------------------- */}
        <Block
          id="type"
          title="Typography"
          note="Two roles. Instrument Sans carries brand and headings; its softer, slightly humanist forms sit closer to the logo's rounded S than V1's Archivo did. Hanken Grotesk carries everything transactional."
        >
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="bg-surface-card rounded-[var(--radius-card)] p-4">
              <p className="eyebrow mb-1.5">Display · --font-display</p>
              <p className="font-display text-2xl font-bold tracking-[-0.03em]">Instrument Sans</p>
              <p className="text-text-secondary mt-2 text-sm">
                Brand moments, headings, prices, dates. The token is ordered{' '}
                <code className="text-xs">&quot;FK Grotesk Neue&quot;, &quot;Instrument Sans&quot;</code> so
                licensed files supersede it with no component changes.
              </p>
            </div>
            <div className="bg-surface-card rounded-[var(--radius-card)] p-4">
              <p className="eyebrow mb-1.5">Utility · --font-ui</p>
              <p className="font-ui text-2xl font-bold">Hanken Grotesk</p>
              <p className="text-text-secondary mt-2 text-sm">
                Body, navigation, buttons, search, product data, forms, cart, account and all
                metadata. Unchanged from V1 — it holds up at 13px on inexpensive phones.
              </p>
            </div>
          </div>

          <ul className="list-none">
            {TYPE.map((style) => (
              <li
                key={style.name}
                className="border-border-subtle flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3.5"
              >
                <span className={cx('min-w-0', style.cls)}>{style.sample}</span>
                <span className="text-text-secondary shrink-0 text-right text-xs">
                  <span className="block font-semibold">{style.name}</span>
                  {style.meta}
                </span>
              </li>
            ))}
          </ul>

          <div className="bg-surface-card mt-4 rounded-[var(--radius-card)] p-4">
            <p className="eyebrow mb-2">Tabular figures</p>
            <ul className="num list-none text-lg font-bold">
              <li>EC$8.00</li>
              <li>EC$14.50</li>
              <li>EC$165.00</li>
              <li>EC$1,840.00</li>
            </ul>
            <p className="text-text-secondary mt-2 text-sm">
              Every digit occupies the same width, so a column of prices aligns on the decimal
              without extra markup. Price always outranks vendor and pack size.
            </p>
          </div>
        </Block>

        {/* ---- Colour ------------------------------------------------------ */}
        <Block
          id="colour"
          title="Colour"
          note="Roughly 70% warm neutral, 20% Forest structure, 8% Leaf commerce, 2% Turmeric, Nutmeg and Teal. Accents are never distributed evenly — each one means something."
        >
          <TokenTable
            heading="Surfaces"
            rows={SURFACES.map(([token, hex, use]) => ({
              token,
              swatch: hex,
              value: hex,
              use,
            }))}
          />
          <TokenTable
            heading="Ink and state"
            rows={INK.map(([token, hex, use]) => ({ token, swatch: hex, value: hex, use }))}
          />

          <h3 className="eyebrow mt-6 mb-3">Measured contrast</h3>
          <ul className="grid list-none gap-2 sm:grid-cols-2">
            {PAIRS.map((pair) => {
              const ratio = contrast(pair.fg, pair.bg);
              const result = grade(ratio);
              return (
                <li
                  key={pair.label}
                  className="flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5"
                  style={{ background: pair.bg, color: pair.fg }}
                >
                  <span className="flex-1 text-sm font-semibold">{pair.label}</span>
                  <span className="num text-sm font-bold">{ratio.toFixed(2)}</span>
                  <span
                    className={cx(
                      'rounded-[var(--radius-chip)] px-1.5 py-1 text-[11px] font-bold',
                      result.pass ? 'bg-leaf text-surface-card' : 'bg-nutmeg text-surface-card',
                    )}
                  >
                    {result.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <Notice tone="info" className="mt-3">
            Signal Green is the logo ground, not a text colour. Turmeric is the same: it carries
            Forest ink, never light text. Where an accent cannot hold body copy, a paired{' '}
            <code className="text-xs">--state-*</code> ink exists for it.
          </Notice>
        </Block>

        {/* ---- Surface + border -------------------------------------------- */}
        <Block
          id="surface"
          title="Surface and border hierarchy"
          note="Three levels. V1 outlined almost everything, so a passive group of text weighed the same as the basket. V2 reserves a visible border for things you act through."
        >
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="p-4">
              <p className="eyebrow mb-2">Level 1 — open content</p>
              <p className="text-text-secondary text-sm">
                Section introductions, editorial copy, product rows, maker stories. No border at
                all: spacing and typography carry the hierarchy.
              </p>
            </div>
            <div className="surface-soft p-4">
              <p className="eyebrow mb-2">Level 2 — soft surface</p>
              <p className="text-text-secondary text-sm">
                Category cards, product cards, event previews, informational modules. Warm surface,
                a hairline at Forest 13%, modest radius, no shadow at rest.
              </p>
            </div>
            <div className="surface-active p-4">
              <p className="eyebrow mb-2">Level 3 — active / operational</p>
              <p className="text-text-secondary text-sm">
                Search, location, the delivery module, fulfilment selection, the basket, checkout.
                Stronger border, contained behaviour, visible focus.
              </p>
            </div>
          </div>

          <h3 className="eyebrow mt-6 mb-3">Border tokens</h3>
          <ul className="list-none">
            {BORDERS.map(([token, value, use]) => (
              <li
                key={token}
                className="border-border-subtle flex flex-wrap items-center gap-x-4 gap-y-1 border-b py-3"
              >
                <span
                  aria-hidden
                  className="h-8 w-16 shrink-0 rounded-[var(--radius-chip)] border"
                  style={{ borderColor: `var(${token})` }}
                />
                <code className="num text-sm font-semibold break-all">{token}</code>
                <span className="text-text-secondary text-sm break-all">{value}</span>
                <span className="text-text-secondary w-full text-sm sm:w-auto sm:flex-1">{use}</span>
              </li>
            ))}
          </ul>
        </Block>

        {/* ---- Radius / shadow / space -------------------------------------- */}
        <Block id="shape" title="Radius, shadow and space">
          <h3 className="eyebrow mb-3">Radius</h3>
          <ul className="mb-7 grid list-none gap-2 sm:grid-cols-4">
            {RADII.map(([token, value, use]) => (
              <li
                key={token}
                className="bg-surface-card border-border-subtle flex flex-col gap-1 border p-4"
                style={{ borderRadius: `var(${token})` }}
              >
                <span className="num text-sm font-bold">{value}</span>
                <code className="text-text-secondary text-xs">{token}</code>
                <span className="text-text-secondary mt-1 text-xs">{use}</span>
              </li>
            ))}
          </ul>

          <h3 className="eyebrow mb-3">Shadow</h3>
          <ul className="mb-7 grid list-none gap-4 sm:grid-cols-3">
            {SHADOWS.map(([token, use]) => (
              <li
                key={token}
                className="bg-surface-card rounded-[var(--radius-card)] p-4"
                style={{ boxShadow: `var(${token})` }}
              >
                <code className="text-sm font-semibold">{token}</code>
                <span className="text-text-secondary mt-1 block text-xs">{use}</span>
              </li>
            ))}
          </ul>

          <h3 className="eyebrow mb-3">Space</h3>
          <ul className="flex list-none flex-wrap items-end gap-3">
            {SPACING.map((step) => (
              <li key={step} className="text-center">
                <div className="bg-leaf rounded-[2px]" style={{ width: step, height: step }} />
                <span className="num text-text-secondary mt-1.5 block text-xs">{step}</span>
              </li>
            ))}
          </ul>
          <p className="text-text-secondary mt-3 text-sm">
            Section rhythm is a token, not a guess:{' '}
            <code className="text-xs">--section-gap</code> is 56px on mobile, 76px at tablet and
            96px on desktop, applied as half per side so two adjacent sections sum to exactly the
            gap.
          </p>
        </Block>

        {/* ---- Controls ------------------------------------------------------ */}
        <Block
          id="controls"
          title="Controls"
          note="One geometry, four intents. Every control settles 1px on press, so the whole interface feels like one piece of hardware."
        >
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <Button intent="primary" icon="Add">Primary</Button>
            <Button intent="secondary" icon="MapArea">Secondary</Button>
            <Button intent="tertiary" icon="Info">Tertiary</Button>
            <Button intent="accent" icon="MarketStall">Accent</Button>
            <Button intent="primary" disabled>Disabled</Button>
          </div>
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <Button size="sm">Small · 40px</Button>
            <Button size="md">Medium · 44px</Button>
            <Button size="lg">Large · 48px</Button>
            <TextAction href="#controls">Text action</TextAction>
          </div>
          <div className="bg-forest on-dark mb-5 flex flex-wrap gap-3 rounded-[var(--radius-card)] p-5">
            <Button intent="inverse" icon="Calendar">On dark</Button>
            <Button intent="accent" icon="MarketStall">Accent on dark</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="deal" icon="Discount">Save 15%</Badge>
            <Badge tone="multibuy">4 for EC$17.90</Badge>
            <Badge tone="local" icon="LocalVendors">Local</Badge>
            <Badge tone="fresh" icon="FreshProduce">Fresh</Badge>
            <Badge tone="low" icon="LowStock" uppercase>Low stock</Badge>
            <Badge tone="out" icon="OutOfStock" uppercase>Out of stock</Badge>
            <Badge tone="fair">Collection open</Badge>
            <Badge tone="new">New</Badge>
            <Badge tone="neutral">Prototype</Badge>
          </div>
          <p className="text-text-secondary mt-3 text-sm">
            Badges are sentence case. Uppercase is reserved for the two true status chips, where the
            label behaves like signage rather than merchandising.
          </p>
        </Block>

        {/* ---- Cards --------------------------------------------------------- */}
        <Block
          id="cards"
          title="Cards"
          note="Product cards keep a fixed vertical rhythm so a grid row shares one baseline. Category cards let the tint own the whole surface rather than sitting in a small square inside a white box."
        >
          <h3 className="eyebrow mb-3">Product card variants</h3>
          <ul className="mb-8 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              [
                ['Plain', sample.plain],
                ['Reduced', sample.deal],
                ['Multibuy', sample.multibuy],
                ['Local + fresh', sample.localFresh],
                ['Local only', sample.localOnly],
                ['Out of stock', sample.soldOut],
              ] as const
            ).map(([label, product]) => (
              <li key={label} className="flex flex-col gap-1.5">
                <span className="text-text-secondary text-xs font-semibold">{label}</span>
                <ProductCard product={product} className="w-full" />
              </li>
            ))}
          </ul>

          <h3 className="eyebrow mb-3">Category cards</h3>
          <ul className="mb-8 grid list-none grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <li key={category.handle} className="flex">
                <CategoryCard category={category} count={12} className="w-full" />
              </li>
            ))}
          </ul>

          <h3 className="eyebrow mb-3">Event cards</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* ---- Fulfilment ----------------------------------------------------- */}
        <Block
          id="fulfilment"
          title="Fulfilment"
          note="The delivery module is a live service-status surface: the status leads in a coloured rail, the destination is the subject, and the fee and window are supporting metadata."
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
            <FulfillmentCard />
            <div>
              <h3 className="eyebrow mb-3">Serviceability states</h3>
              <ul className="grid list-none gap-2">
                {(
                  [
                    ['Delivery available', zones.delivery],
                    ['Collection only', zones.pickup],
                    ['Not serviced', zones.none],
                  ] as const
                ).map(([label, z]) => (
                  <li key={label} className="bg-surface-card rounded-[var(--radius-card)] p-3.5">
                    <p className="text-md font-bold">{z.area}</p>
                    <p className="text-text-secondary mb-2.5 text-sm">{z.parish}</p>
                    <ServiceStatusPill zone={z} withDetail />
                    {z.note ? (
                      <p className="text-text-secondary mt-2 text-xs">{z.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Block>

        {/* ---- Icons ----------------------------------------------------------- */}
        <Block
          id="icons"
          title="Icon system"
          note="One grammar: 24px box, 1.75 stroke, round caps, currentColor. 16px for compact metadata, 20px for controls, 24px for navigation, 28–32px for category anchors. Click an icon to copy its JSX."
        >
          <IconGallery />
        </Block>

        {/* ---- States ----------------------------------------------------------- */}
        <Block id="states" title="Controls, states and focus">
          <StateGallery />
          <div className="border-border-subtle mt-8 border-t pt-5">
            <h3 className="eyebrow mb-3">Focus</h3>
            <p className="text-text-secondary mb-4 max-w-[60ch] text-sm">
              One focus treatment across the system: a 2px Forest ring, offset by 2px. On dark and
              accent grounds it inverts to Breadfruit. Tab through the controls below to see it.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button intent="secondary">Focus me</Button>
              <TextAction href="#states">And me</TextAction>
              <span className="bg-forest on-dark inline-flex rounded-[var(--radius-card)] p-3">
                <Button intent="inverse">On dark</Button>
              </span>
            </div>
          </div>
        </Block>

        {/* ---- Motion ------------------------------------------------------------ */}
        <Block
          id="motion"
          title="Motion"
          note="Fast, quiet, tactile, informative. Motion acknowledges an action; it never performs. All of it opts out under prefers-reduced-motion."
        >
          <ul className="list-none">
            {MOTION.map(([token, value, use]) => (
              <li
                key={token}
                className="border-border-subtle flex flex-wrap items-center gap-x-4 gap-y-1 border-b py-3"
              >
                <code className="text-sm font-semibold break-all">{token}</code>
                <span className="num text-text-secondary text-sm break-all">{value}</span>
                <span className="text-text-secondary w-full text-sm sm:w-auto sm:flex-1">{use}</span>
              </li>
            ))}
          </ul>
        </Block>

        {/* ---- Navigation --------------------------------------------------------- */}
        <Block
          id="nav"
          title="Mobile navigation"
          note="Five destinations. The basket is not one of them — it lives in the sticky header, so browsing, ordering and account each keep a permanent slot."
        >
          <div className="border-border-subtle mx-auto max-w-[420px] overflow-hidden rounded-[var(--radius-card)] border">
            <div className="border-border-subtle bg-surface-raised border-t">
              <ul className="grid list-none grid-cols-5">
                {(
                  [
                    ['Home', 'Home', true],
                    ['Categories', 'Categories', false],
                    ['Orders', 'Orders', false],
                    ['Rewards', 'Rewards', false],
                    ['Account', 'Account', false],
                  ] as const
                ).map(([label, icon, active]) => (
                  <li key={label}>
                    <span
                      className={cx(
                        'flex min-h-[60px] flex-col items-center justify-center gap-0.5 px-1 py-1.5',
                        active ? 'text-state-success' : 'text-text-secondary',
                      )}
                    >
                      <Icon name={icon} size={22} />
                      <span className="text-[11px] font-semibold">{label}</span>
                      <span
                        className={cx(
                          'h-[2px] w-6 rounded-full',
                          active ? 'bg-leaf' : 'bg-transparent',
                        )}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Block>

        {/* ---- V1 → V2 ------------------------------------------------------------ */}
        <Block
          id="compare"
          title="V1 → V2"
          note="Static specimens, not duplicated production components. Each pair shows the treatment that changed and why."
        >
          <div className="flex flex-col gap-8">
            <Compare
              label="Display typography"
              note="Archivo ExtraBold read as industrial and rectangular, fighting the logo's rounded, organic S. Instrument Sans at 700 with −0.04em tracking is softer and more commerce-friendly at the same decisive scale."
              before={
                <span
                  className="text-4xl uppercase"
                  style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}
                >
                  Live easy.
                </span>
              }
              after={<span className="display text-4xl uppercase">Live easy.</span>}
            />

            <Compare
              label="Category card"
              note="A small tinted square inside a white bordered box made eight aisles read as eight identical containers. The tint now owns the card, the icon gains presence, and a directional cue appears on hover."
              before={
                <div className="w-[160px] rounded-[10px] border border-[#C4BCA5] bg-white p-3">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-[6px] bg-[#E8F1E4] text-[#1F5C23]">
                    <Icon name="Groceries" size={24} />
                  </span>
                  <span className="block text-sm font-bold">Groceries</span>
                  <span className="num block text-xs text-[#515E50]">14 items</span>
                </div>
              }
              after={
                <div className="w-[160px]">
                  <CategoryCard category={CATEGORIES[0]} count={14} />
                </div>
              }
            />

            <Compare
              label="Product card"
              note="Vendor moved below the price, the outline softened to a hairline on a warm surface, and the image sits on a neutral stage with consistent padding. The price now outranks the brand that made it."
              before={
                <div className="w-[170px] rounded-[10px] border border-[#C4BCA5] bg-white p-2.5">
                  <div className="mb-2.5 aspect-square rounded-[6px] bg-[#F1EAD9]" />
                  <p className="truncate text-[11px] font-semibold text-[#515E50]">Caribbean Mills</p>
                  <p className="text-[13px] font-semibold">All-Purpose Flour</p>
                  <p className="num mt-1 text-[15px] font-bold">EC$11.95</p>
                  <p className="num text-[11px] text-[#515E50]">2 kg · EC$5.98 / kg</p>
                </div>
              }
              after={
                <ul className="w-[170px] list-none">
                  <li className="flex">
                    <ProductCard product={sample.plain} showFavorite={false} className="w-full" />
                  </li>
                </ul>
              }
            />

            <Compare
              label="Delivery module"
              note="Three equally weighted rows read as an administrative form. V2 leads with a coloured status rail, sets the destination at display scale, and demotes fee and window to metadata."
              before={
                <div className="w-full max-w-[260px] rounded-[14px] border-2 border-[#102515] bg-white p-3 text-[12px]">
                  <p className="mb-2 border-b border-[#E2DBC7] pb-2 text-[10px] font-bold tracking-[0.08em] uppercase">
                    Your delivery
                  </p>
                  {['Delivering to', 'Next window', 'Delivery'].map((row) => (
                    <p key={row} className="border-b border-[#E2DBC7] py-1.5">
                      <span className="block text-[10px] font-bold tracking-[0.08em] text-[#515E50] uppercase">
                        {row}
                      </span>
                      <span className="font-semibold">St. George&apos;s</span>
                    </p>
                  ))}
                </div>
              }
              after={
                <div className="w-full max-w-[260px] overflow-hidden rounded-[var(--radius-module)]">
                  <p className="bg-leaf text-surface-card flex items-center gap-2 px-3 py-2 text-xs font-semibold">
                    <Icon name="DeliveryVan" size={15} />
                    Delivery available
                    <span className="num ml-auto opacity-90">Today, 4–7pm</span>
                  </p>
                  <div className="bg-surface-card p-3">
                    <p className="text-text-secondary text-[11px]">Delivering to</p>
                    <p className="font-display text-lg leading-tight font-bold tracking-[-0.03em]">
                      St. George&apos;s
                    </p>
                    <p className="text-text-secondary num text-xs">St. George · EC$8.00 delivery</p>
                  </div>
                </div>
              }
            />

            <Compare
              label="Buttons"
              note="The secondary button lost its heavy second outline. A primary and a secondary side by side now read as a hierarchy rather than two competing rectangles."
              before={
                <div className="flex gap-2">
                  <span className="inline-flex h-11 items-center rounded-[6px] bg-[#2E7D32] px-4 text-sm font-semibold text-white">
                    Shop essentials
                  </span>
                  <span className="inline-flex h-11 items-center rounded-[6px] border-2 border-[#102515] bg-white px-4 text-sm font-semibold">
                    Choose area
                  </span>
                </div>
              }
              after={
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Shop essentials</Button>
                  <Button intent="secondary">Choose area</Button>
                </div>
              }
            />

            <Compare
              label="Event module"
              note="The date is now the subject at display scale, with collection status as the only badge. An edition reads like an event rather than a product listing."
              before={
                <div className="w-[220px] rounded-[10px] border border-[#C4BCA5] bg-white p-3">
                  <p className="text-[10px] font-bold tracking-[0.08em] uppercase">Edition 67</p>
                  <p className="text-[17px] font-bold">Sat 3 October</p>
                  <p className="mt-1 text-[12px] text-[#515E50]">Gouyave Fisherman&apos;s Wharf</p>
                  <p className="num text-[12px] text-[#515E50]">10am–6pm</p>
                </div>
              }
              after={
                <div className="w-[220px]">
                  <EventCard event={events[0]} />
                </div>
              }
            />
          </div>
        </Block>
      </div>
    </div>
  );
}

/* ---- Local layout helpers ------------------------------------------------- */

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
    <section id={id} className="scroll-mt-[calc(var(--header-h-compact)+28px)]">
      <div className="border-border-default mb-6 border-t pt-4">
        <h2 className="text-2xl">{title}</h2>
        {note ? <p className="text-text-secondary mt-2 max-w-[70ch] text-base">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function TokenTable({
  heading,
  rows,
}: {
  heading: string;
  rows: { token: string; swatch: string; value: string; use: string }[];
}) {
  return (
    <div className="mb-6">
      <h3 className="eyebrow mb-3">{heading}</h3>
      <ul className="list-none">
        {rows.map((row) => (
          <li
            key={row.token}
            className="border-border-subtle flex flex-wrap items-center gap-x-4 gap-y-1 border-b py-2.5"
          >
            <span
              aria-hidden
              className="border-border-subtle h-8 w-16 shrink-0 rounded-[var(--radius-chip)] border"
              style={{ background: row.swatch }}
            />
            <code className="text-sm font-semibold break-all">{row.token}</code>
            <span className="num text-text-secondary text-sm">{row.value}</span>
            <span className="text-text-secondary w-full text-sm sm:w-auto sm:flex-1">{row.use}</span>
          </li>
        ))}
      </ul>
    </div>
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
    <div className="border-border-subtle overflow-hidden rounded-[var(--radius-card)] border">
      <div className={cx('flex min-h-[128px] items-center justify-center p-4', className)}>
        {children}
      </div>
      <div className="border-border-subtle bg-surface-card border-t p-3">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-text-secondary text-xs">{sub}</p>
      </div>
    </div>
  );
}
