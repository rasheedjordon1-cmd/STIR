'use client';

import { useState } from 'react';
import { ProductArt } from './ProductArt';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   ProductGallery
   Two views: the pack front and its information panel. Thumbnails are real
   buttons with pressed state, so the gallery works from the keyboard.
   ========================================================================== */

export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="bg-surface-sunk overflow-hidden rounded-[var(--radius-module)]">
        <ProductArt
          image={product.images[index]}
          seed={`${product.handle}-${index}`}
          face={index === 0 ? 'front' : 'back'}
          alt={product.images[index].alt}
          className="aspect-square w-full p-6"
        />
      </div>

      <ul className="flex list-none gap-2">
        {product.images.map((image, i) => (
          <li key={image.alt}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={`Show ${image.alt}`}
              className={cx(
                'block overflow-hidden rounded-[6px] border-2 transition-colors',
                i === index ? 'border-forest' : 'border-border-subtle hover:border-border-default',
              )}
            >
              <ProductArt
                image={image}
                seed={`${product.handle}-${i}`}
                face={i === 0 ? 'front' : 'back'}
                className="h-16 w-16 p-1"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
