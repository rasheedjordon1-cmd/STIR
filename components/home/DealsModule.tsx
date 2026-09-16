import { AddToCart } from '@/components/commerce/AddToCart';
import { ProductArt } from '@/components/commerce/ProductArt';
import { ProductCard } from '@/components/commerce/ProductCard';
import { Icon } from '@/components/icons';
import { Section, SectionHead } from '@/components/ui/Section';
import { formatMoney, formatUnitPrice, savingsAmount } from '@/lib/format';
import type { Product } from '@/types';

/* ==========================================================================
   Deals and multibuys
   Savings are stated as money and as a unit price, never as a countdown.
   If a deal is only good because it will "expire in 4:59", it is not a deal.
   ========================================================================== */

export function DealsModule({ products }: { products: Product[] }) {
  const [lead, ...rest] = products;
  if (!lead) return null;

  const saving = savingsAmount(lead.price, lead.compareAtPrice);
  const unit = formatUnitPrice(lead.unitPrice);

  return (
    <Section id="deals">
      <div className="shell">
        <SectionHead
          eyebrow="Deals and multibuys"
          title="Lower prices, shown honestly"
          blurb="Every reduction shows the previous price and, where it helps, the price per kilo or litre. No countdown timers."
          href="/category/deals"
          linkLabel="All deals"
        />

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,2fr)]">
          <article className="bg-surface-nutmeg-soft flex flex-col justify-between gap-5 rounded-[var(--radius-module)] p-5">
            <div>
              <span className="bg-nutmeg text-surface-card inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] px-2 py-1 text-xs font-semibold">
                <Icon name="Discount" size={13} />
                {lead.multibuy ? 'Multibuy' : 'Reduced'}
              </span>
              <h3 className="font-display mt-3 text-xl leading-tight font-bold tracking-tight">
                {lead.title}
              </h3>
              <p className="text-text-secondary mt-1 text-sm">{lead.vendor}</p>
              <p className="num font-display text-state-danger mt-3 text-3xl font-extrabold tracking-tight">
                {formatMoney(lead.multibuy ? lead.multibuy.price : lead.price)}
              </p>
              <p className="num text-sm font-semibold">
                {lead.multibuy ? lead.multibuy.label : lead.unit}
                {unit ? ` · ${unit}` : ''}
              </p>
              {saving ? (
                <p className="num text-text-secondary mt-1 text-sm">
                  Was {formatMoney(lead.compareAtPrice)} — you save {formatMoney(saving)}
                </p>
              ) : null}
            </div>
            <div className="border-nutmeg/25 bg-surface-card overflow-hidden rounded-[var(--radius-control)] border">
              <ProductArt
                image={lead.images[0]}
                seed={lead.handle}
                className="h-40 w-full sm:h-48"
              />
            </div>

            <div>
              <AddToCart product={lead} />
              <ul className="text-text-secondary mt-3.5 list-none space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={15} className="shrink-0" />
                  Unit price shown so sizes compare honestly
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={15} className="shrink-0" />
                  Multibuy applies automatically in the basket
                </li>
              </ul>
            </div>
          </article>

          <ul className="grid list-none grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {rest.slice(0, 8).map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
