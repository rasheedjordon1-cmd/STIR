import Link from 'next/link';
import { ProductRail } from '@/components/commerce/ProductGrid';
import { Icon } from '@/components/icons';
import { Section, SectionHead } from '@/components/ui/Section';
import { cx } from '@/lib/cx';
import type { Product, Vendor } from '@/types';

/* ==========================================================================
   The Local shelf
   Local is merchandised as a place in the shop with its own makers, not a
   sticker on a card. The vendor strip is the discovery mechanism: people
   remember a grower's name long before they remember a SKU.
   ========================================================================== */

const ACCENT: Record<Vendor['accent'], string> = {
  leaf: 'bg-surface-green-soft text-state-success border-leaf-deep/15 hover:border-leaf-deep/40',
  signal: 'bg-surface-green-soft text-state-success border-leaf-deep/15 hover:border-leaf-deep/40',
  turmeric: 'bg-surface-yellow-soft text-state-warning border-cocoa/15 hover:border-cocoa/40',
  nutmeg: 'bg-surface-nutmeg-soft text-state-danger border-nutmeg/15 hover:border-nutmeg/40',
  teal: 'bg-surface-teal-soft text-state-info border-teal-ink/15 hover:border-teal-ink/40',
  cocoa: 'bg-surface-cocoa-soft text-cocoa border-cocoa/15 hover:border-cocoa/40',
};

export function LocalShelf({ products, vendors }: { products: Product[]; vendors: Vendor[] }) {
  return (
    <Section tone="sunk">
      <div className="shell">
        <SectionHead
          eyebrow="The Local shelf"
          title="Grown, made and packed in Grenada"
          blurb="Every maker here trades with Spicemart directly and most of them also hold a stall at the Spice Fair."
          href="/category/local"
          linkLabel="Shop the Local shelf"
        />

        <ul className="rail bleed mb-5 list-none" aria-label="Local makers">
          {vendors.map((vendor) => (
            <li key={vendor.id} className="flex">
              <Link
                href={`/search?q=${encodeURIComponent(vendor.name)}`}
                className={cx(
                  'flex w-full flex-col gap-1.5 rounded-[var(--radius-card)] border p-3.5 transition-colors duration-[var(--duration-tap)]',
                  ACCENT[vendor.accent],
                )}
              >
                <Icon name="Vendor" size={24} />
                <span className="text-sm leading-tight font-bold">{vendor.name}</span>
                <span className="text-xs font-semibold opacity-75">{vendor.parish}</span>
                <span className="text-text-secondary mt-auto line-clamp-2 text-xs">{vendor.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ProductRail products={products} label="Products from Grenadian makers" />
      </div>
    </Section>
  );
}
