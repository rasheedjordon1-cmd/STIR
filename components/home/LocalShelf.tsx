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
  leaf: 'bg-leaf-wash text-leaf-deep border-leaf-deep/30',
  signal: 'bg-signal-wash text-leaf-deep border-leaf-deep/30',
  turmeric: 'bg-turmeric-wash text-cocoa border-cocoa/30',
  nutmeg: 'bg-nutmeg-wash text-nutmeg border-nutmeg/30',
  teal: 'bg-teal-wash text-teal-ink border-teal-ink/30',
  cocoa: 'bg-cocoa-wash text-cocoa border-cocoa/30',
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
                  'hover:border-forest flex w-full flex-col gap-1.5 rounded-[var(--radius-card)] border p-3 transition-colors',
                  ACCENT[vendor.accent],
                )}
              >
                <Icon name="Vendor" size={22} />
                <span className="text-sm leading-tight font-bold">{vendor.name}</span>
                <span className="label opacity-80">{vendor.parish}</span>
                <span className="text-forest-muted mt-auto line-clamp-2 text-xs">{vendor.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ProductRail products={products} label="Products from Grenadian makers" />
      </div>
    </Section>
  );
}
