'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { AddToCart } from './AddToCart';
import { FavoriteButton } from './FavoriteButton';
import { PriceBlock } from './PriceBlock';
import { ProductArt } from './ProductArt';
import { STOCK_COPY, badgesFor } from './badges';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   ProductCard — V2
   The most-repeated component in the platform, so it sets the tone for
   everything else.

   V2 changes:
   · a soft surface with a hairline instead of a hard outlined rectangle —
     the card lifts on hover rather than shouting at rest
   · a warm neutral image stage with consistent internal padding, so packshots
     of different shapes sit on the same optical baseline
   · hierarchy reordered to name → price → unit → vendor, so the number a
     shopper is actually scanning for outranks the brand that made it
   · at most two merchandising badges, sentence case
   ========================================================================== */

export function ProductCard({
  product,
  showFavorite = true,
  className,
}: {
  product: Product;
  showFavorite?: boolean;
  className?: string;
}) {
  const badges = badgesFor(product);
  const stock = STOCK_COPY[product.inventoryStatus];
  const soldOut = product.inventoryStatus === 'out-of-stock';

  return (
    <article
      className={cx(
        'group border-border-subtle bg-surface-card relative flex h-full flex-col rounded-[var(--radius-card)] border p-2.5',
        'transition-[border-color,box-shadow,transform] duration-[var(--duration-ui)] ease-[var(--ease-out-quint)]',
        'hover:border-border-default hover:shadow-[var(--shadow-raised)] focus-within:border-border-default',
        className,
      )}
    >
      {/* The title link below spans the whole card, so the artwork needs no
          link of its own — one accessible name per card, not two. */}
      <div className="bg-surface-sunk relative mb-3 overflow-hidden rounded-[10px]">
        <ProductArt
          image={product.images[0]}
          seed={product.handle}
          className={cx(
            'aspect-square w-full p-1.5 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out-quint)] group-hover:scale-[1.02]',
            soldOut && 'opacity-50 saturate-50',
          )}
        />
        {showFavorite ? (
          <FavoriteButton
            productId={product.id}
            title={product.title}
            /* Above the card-wide link overlay, or it cannot be clicked. */
            className="absolute top-1.5 right-1.5 z-10"
          />
        ) : null}
        {badges.length > 0 ? (
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 flex flex-wrap gap-1 pr-10">
            {badges.map((badge) => (
              <Badge key={badge.label} tone={badge.tone} icon={badge.icon}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <h3 className="font-ui text-sm leading-snug font-semibold tracking-normal">
        <Link
          href={`/product/${product.handle}`}
          className="after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          {product.title}
        </Link>
      </h3>

      <div className="mt-auto pt-2">
        <PriceBlock product={product} size="sm" />

        <p className="text-text-secondary mt-1 truncate text-xs">{product.vendor}</p>

        <p
          className={cx(
            'mt-1.5 flex min-h-4 items-center gap-1 text-xs font-semibold',
            stock ? (soldOut ? 'text-state-danger' : 'text-state-warning') : 'text-state-success',
          )}
        >
          {stock ? (
            <>
              <Icon name={stock.icon} size={13} />
              {stock.label}
            </>
          ) : (
            <>
              <Icon name="Check" size={13} />
              In stock
            </>
          )}
        </p>

        {/* The action sits above the card-wide link so it stays clickable. */}
        <div className="relative z-10 mt-2.5">
          <AddToCart product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
