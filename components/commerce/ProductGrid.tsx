import { ProductCard } from './ProductCard';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* Density increases with width: 2 up on mobile, 5 up on a large desktop. */
export function ProductGrid({
  products,
  className,
  dense = false,
}: {
  products: Product[];
  className?: string;
  dense?: boolean;
}) {
  return (
    <ul
      className={cx(
        'grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3',
        dense ? 'lg:grid-cols-5 xl:grid-cols-6' : 'lg:grid-cols-4 xl:grid-cols-5',
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} className="w-full" />
        </li>
      ))}
    </ul>
  );
}

/** Horizontal rail for homepage modules. Scrolls on touch, no arrows needed. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  return (
    <ul className="rail bleed list-none" aria-label={label}>
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
