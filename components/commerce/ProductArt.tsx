import type { ProductImage, ProductMotif } from '@/types';

/* ==========================================================================
   ProductArt
   --------------------------------------------------------------------------
   The prototype has no product photography, and inventing photorealistic
   product shots would misrepresent an assortment that does not exist yet.
   Instead every product renders a flat packaging graphic built from its
   motif and one palette tint: honest about being prototype content, dense
   enough to scan in a grid, and consistent with the brand's flat-colour,
   bold-silhouette direction.

   At integration, swap this component for Shopify CDN images. Nothing else
   needs to change — ProductImage already carries alt text.
   ========================================================================== */

const TINTS = {
  leaf: { solid: '#2E7D32', wash: '#E8F1E4' },
  signal: { solid: '#5DAE35', wash: '#EEF6E5' },
  turmeric: { solid: '#F5B81C', wash: '#FDF1D3' },
  nutmeg: { solid: '#9E1B32', wash: '#FBE9EC' },
  teal: { solid: '#00918C', wash: '#E0F2F1' },
  cocoa: { solid: '#4B2E20', wash: '#F0E7E0' },
} as const;

const INK = '#102515';
const PAPER = '#FFFCF4';

/** Stable small hash so a product's artwork never changes between renders. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* --------------------------------------------------------------------------
   Motifs. Every motif is drawn inside 120×120 with a 16px margin, sits on the
   same baseline (y=104) and carries one PAPER label area so the family reads
   as a single packaging system rather than a set of clip-art objects.
   -------------------------------------------------------------------------- */

function Motif({ motif, solid }: { motif: ProductMotif; solid: string }) {
  const fill = { fill: solid, stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const };
  const label = { fill: PAPER, stroke: INK, strokeWidth: 2.5 };

  switch (motif) {
    case 'bottle':
      return (
        <>
          <path d="M53 20h14v13c0 5 15 10 15 22v41a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V55c0-12 15-17 15-22Z" {...fill} />
          <rect x="38" y="58" width="44" height="22" {...label} />
        </>
      );
    case 'jar':
      return (
        <>
          <path d="M34 40h52v56a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8Z" {...fill} />
          <rect x="30" y="22" width="60" height="18" rx="5" {...fill} />
          <rect x="34" y="58" width="52" height="22" {...label} />
        </>
      );
    case 'carton':
      return (
        <>
          <path d="M36 34 60 16l24 18v62a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8Z" {...fill} />
          <path d="M36 34h48" stroke={INK} strokeWidth={2.5} fill="none" />
          <rect x="40" y="56" width="40" height="24" {...label} />
        </>
      );
    case 'sack':
      return (
        <>
          <path d="M40 46c0-10 6-16 20-16s20 6 20 16l6 44a10 10 0 0 1-10 12H44a10 10 0 0 1-10-12Z" {...fill} />
          <path d="M44 30h32l-4 10H48Z" {...label} />
          <rect x="40" y="62" width="40" height="20" {...label} />
        </>
      );
    case 'can':
      return (
        <>
          <rect x="36" y="26" width="48" height="76" rx="6" {...fill} />
          <path d="M36 36h48M36 92h48" stroke={INK} strokeWidth={2.5} fill="none" />
          <rect x="36" y="50" width="48" height="26" {...label} />
        </>
      );
    case 'box':
      return (
        <>
          <rect x="30" y="30" width="60" height="72" rx="4" {...fill} />
          <path d="M30 50h60" stroke={INK} strokeWidth={2.5} fill="none" />
          <rect x="40" y="62" width="40" height="26" {...label} />
        </>
      );
    case 'pouch':
      return (
        <>
          <path d="M34 34h52l4 58a10 10 0 0 1-10 12H40a10 10 0 0 1-10-12Z" {...fill} />
          <path d="M34 34l8-10h36l8 10" {...label} />
          <rect x="40" y="58" width="40" height="24" {...label} />
        </>
      );
    case 'tube':
      return (
        <>
          <path d="M42 34h36v56a14 14 0 0 1-14 14h-8a14 14 0 0 1-14-14Z" {...fill} />
          <rect x="50" y="16" width="20" height="18" rx="3" {...fill} />
          <rect x="42" y="52" width="36" height="22" {...label} />
        </>
      );
    case 'bar':
      return (
        <>
          <rect x="24" y="42" width="72" height="38" rx="6" {...fill} />
          <path d="M48 42v38M72 42v38" stroke={INK} strokeWidth={2.5} fill="none" />
          <rect x="24" y="54" width="72" height="14" {...label} />
        </>
      );
    case 'loaf':
      return (
        <>
          <path d="M26 92V64c0-18 14-30 34-30s34 12 34 30v28a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8Z" {...fill} />
          <path d="M42 50c4 6 4 10 0 16M60 46c4 6 4 12 0 18M78 50c4 6 4 10 0 16" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );
    case 'leaf':
      return (
        <>
          <path d="M98 16c0 48-28 78-58 76C24 90 16 76 20 60 28 30 58 18 98 16Z" {...fill} />
          <path d="M22 100C34 68 56 44 90 28" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );
    case 'root':
      return (
        <>
          <path d="M30 62c0-20 14-34 32-34s28 12 28 28c0 22-16 38-34 38S30 80 30 62Z" {...fill} />
          <path d="M62 28c2-8 8-12 16-12M30 76c-8 4-12 10-12 18" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M50 44c-4 14-4 30 2 44M70 46c4 14 4 28 0 40" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );
    case 'citrus':
      return (
        <>
          <circle cx="60" cy="64" r="34" {...fill} />
          <path d="M60 30v68M30 64h60M38 40l44 48M82 40 38 88" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M60 30c4-10 12-14 22-14" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );
    case 'bunch':
      return (
        <>
          <path d="M28 44c0 34 16 54 42 54 10 0 16-6 16-14-22 0-36-16-38-40Z" {...fill} />
          <path d="M40 34c0 34 16 54 42 54 10 0 16-6 16-14-22 0-36-16-38-40Z" {...fill} />
        </>
      );
    case 'pod':
      return (
        <>
          <path d="M44 34c14-6 32-2 38 12 8 18 0 40-16 48-14 7-30 1-34-14-4-16 0-40 12-46Z" {...fill} />
          <path d="M54 32V18M44 20c6-4 14-4 20 2" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );
    case 'fish':
      return (
        <>
          <path d="M20 62c14-20 34-30 54-30s32 12 32 30c0 18-12 30-32 30S34 82 20 62Z" {...fill} />
          <path d="m20 62-10-16v32Z" {...fill} />
          <circle cx="86" cy="54" r="4" fill={INK} />
          <path d="M60 40c6 8 6 36 0 44" stroke={INK} strokeWidth={2.5} fill="none" />
        </>
      );
    case 'egg':
      return (
        <>
          <path d="M44 66c0-20 8-34 18-34s18 14 18 34c0 16-8 26-18 26s-18-10-18-26Z" {...fill} />
          <path d="M22 78c0-14 6-24 13-24s13 10 13 24c0 11-6 18-13 18s-13-7-13-18Z" {...fill} />
          <path d="M72 78c0-14 6-24 13-24s13 10 13 24c0 11-6 18-13 18s-13-7-13-18Z" {...fill} />
        </>
      );
    case 'spray':
      return (
        <>
          <path d="M44 42h32a8 8 0 0 1 8 8v46a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V50a8 8 0 0 1 8-8Z" {...fill} />
          <path d="M50 42V24h18v18" {...fill} />
          <path d="M68 24h18M36 52 20 42" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <rect x="40" y="62" width="40" height="22" {...label} />
        </>
      );
    case 'roll':
      return (
        <>
          <rect x="30" y="28" width="60" height="74" rx="10" {...fill} />
          <ellipse cx="60" cy="30" rx="30" ry="10" {...label} />
          <circle cx="60" cy="30" r="9" fill={PAPER} stroke={INK} strokeWidth={2.5} />
        </>
      );
    case 'bulb':
      return (
        <>
          <path d="M60 32c20 0 32 16 32 34S78 100 60 100 28 84 28 66s12-34 32-34Z" {...fill} />
          <path d="M60 32c-4-10-2-16 4-20M60 32c4-8 10-12 16-12" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M44 44c-4 14-4 30 2 44M76 44c4 14 4 30-2 44" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      );
    default:
      return <rect x="32" y="32" width="56" height="68" rx="6" {...fill} />;
  }
}

/**
 * The back-of-pack view used as the gallery's second image. It is plainly an
 * information panel rather than a photograph of a real label, which is the
 * honest way to show "there is more on the pack" without inventing one.
 */
function InfoPanel({ solid }: { solid: string }) {
  return (
    <>
      <rect x="22" y="18" width="76" height="84" rx="4" fill={PAPER} stroke={INK} strokeWidth={2.5} />
      <rect x="30" y="26" width="38" height="8" fill={solid} />
      <path
        d="M30 46h60M30 54h60M30 62h48M30 70h56M30 78h40"
        stroke={INK}
        strokeWidth={2}
        opacity="0.35"
        strokeLinecap="round"
      />
      <g fill={INK}>
        {[0, 4, 7, 12, 14, 19, 23, 26, 30].map((x) => (
          <rect key={x} x={62 + x} y="86" width={x % 3 === 0 ? 3 : 1.6} height="10" />
        ))}
      </g>
    </>
  );
}

interface ProductArtProps {
  image: ProductImage;
  /** The product handle — seeds the background variant. */
  seed: string;
  /** Pass a string to expose alt text; omit for decorative use beside a title. */
  alt?: string;
  /** 'back' renders the information panel used as the gallery's second view. */
  face?: 'front' | 'back';
  className?: string;
}

export function ProductArt({ image, seed, alt, face = 'front', className }: ProductArtProps) {
  const tint = TINTS[image.tint];
  const variant = hash(seed) % 3;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={alt ? 'img' : undefined}
      aria-hidden={alt ? undefined : true}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      {alt ? <title>{alt}</title> : null}
      <rect width="120" height="120" fill={tint.wash} />
      {/* One of three ground treatments, so a grid reads as a shelf of
          different packages rather than a repeated template. */}
      {variant === 1 ? <rect y="78" width="120" height="42" fill={tint.solid} opacity="0.14" /> : null}
      {variant === 2 ? <circle cx="60" cy="58" r="42" fill={tint.solid} opacity="0.13" /> : null}
      {face === 'back' ? (
        <InfoPanel solid={tint.solid} />
      ) : (
        <Motif motif={image.motif} solid={tint.solid} />
      )}
    </svg>
  );
}
