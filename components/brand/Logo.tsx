import Image from 'next/image';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Logo
   Four treatments, all derived from the single supplied artwork by
   scripts/derive-brand-assets.mjs — cropped to the artwork's own clear space,
   and separated from its green ground for light and dark surfaces. The
   drawing itself is never redrawn, distorted, outlined or shadowed.

     tone="green"     the mark as supplied, on its Signal Green ground
     tone="ink"       Forest ink on a light surface
     tone="knockout"  Breadfruit knockout on a dark surface
   ========================================================================== */

type Variant = 'lockup' | 'symbol';
type Tone = 'green' | 'ink' | 'knockout';

const RATIO: Record<Variant, number> = { lockup: 1364 / 467, symbol: 1 };

export function Logo({
  variant = 'lockup',
  tone = 'ink',
  width,
  className,
  priority,
  alt = 'Spicemart',
}: {
  variant?: Variant;
  tone?: Tone;
  width: number;
  className?: string;
  priority?: boolean;
  /** Empty string marks it decorative where a wordmark is already in text. */
  alt?: string;
}) {
  const height = Math.round(width / RATIO[variant]);
  return (
    <Image
      src={`/brand/spicemart-${variant}-${tone}.png`}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cx('h-auto', tone === 'green' && 'rounded-[3px]', className)}
      sizes={`${width}px`}
    />
  );
}
