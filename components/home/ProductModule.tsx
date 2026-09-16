import { ProductRail } from '@/components/commerce/ProductGrid';
import { Section, SectionHead } from '@/components/ui/Section';
import type { Product } from '@/types';

/** A titled rail. Used for Everyday Essentials and Fresh in Grenada. */
export function ProductModule({
  id,
  eyebrow,
  title,
  blurb,
  href,
  linkLabel,
  products,
  tone,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  blurb?: string;
  href?: string;
  linkLabel?: string;
  products: Product[];
  tone?: 'default' | 'sunk';
}) {
  return (
    <Section id={id} tone={tone}>
      <div className="shell">
        <SectionHead eyebrow={eyebrow} title={title} blurb={blurb} href={href} linkLabel={linkLabel} />
        <ProductRail products={products} label={title} />
      </div>
    </Section>
  );
}
