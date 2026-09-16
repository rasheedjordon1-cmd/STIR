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
   ProductCard
   The most-repeated component in the product, so it is the one that has to be
   densest. Fixed vertical rhythm: art, badges, vendor, title, price, status,
   action. Every card is the same height in a row whatever its content, and
   the action sits on the same baseline across the grid.
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
        'group border-line-strong bg-paper hover:border-forest relative flex h-full flex-col rounded-[var(--radius-card)] border p-2.5 transition-colors',
        className,
      )}
    >
      {/* The title link below spans the whole card, so the artwork needs no
          link of its own — one accessible name per card, not two. */}
      <div className="bg-paper-sunk relative mb-2.5 overflow-hidden rounded-[6px]">
        <ProductArt
          image={product.images[0]}
          seed={product.handle}
          className={cx('aspect-square w-full', soldOut && 'opacity-55 saturate-50')}
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

      <p className="text-forest-muted mb-0.5 truncate text-xs font-semibold">{product.vendor}</p>

      <h3 className="text-sm leading-snug font-semibold tracking-normal">
        <Link
          href={`/product/${product.handle}`}
          className="after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          {product.title}
        </Link>
      </h3>

      <div className="mt-auto pt-2">
        <PriceBlock product={product} size="sm" />

        <p
          className={cx(
            'mt-1.5 flex min-h-4 items-center gap-1 text-xs font-semibold',
            stock ? (soldOut ? 'text-nutmeg' : 'text-cocoa') : 'text-leaf-deep',
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
        <div className="relative z-10 mt-2">
          <AddToCart product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
