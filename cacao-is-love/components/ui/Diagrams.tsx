/**
 * CUT-PAPER DIAGRAMS
 *
 * Flat two-colour silhouettes — the Saul Bass / woodcut / 1-bit-Macintosh
 * intersection. Inline SVG, so they cost nothing to load, scale losslessly,
 * and carry the brand before any photography or commissioned art exists.
 *
 * To replace with commissioned artwork, keep the same viewBox and the
 * `ink` / `accent` currentColor contract.
 */

const ink = 'var(--fg)'
const accent = 'var(--marker)'

const shared = {
  'aria-hidden': true as const,
  focusable: 'false' as const,
  xmlns: 'http://www.w3.org/2000/svg',
}

export function PodGlyph({ className }: { className?: string }) {
  return (
    <svg {...shared} viewBox="0 0 100 124" className={className}>
      <path d="M46 16c1-6 3-9 6-12 1 4 1 8-1 12z" fill={accent} />
      <path
        d="M50 14c24 8 36 36 36 58 0 27-16 44-36 44S14 99 14 72c0-22 12-50 36-58z"
        fill={ink}
      />
      <path
        d="M50 22c0 30 0 62 0 86M32 30c-4 28-4 58 2 82M68 30c4 28 4 58-2 82"
        stroke="var(--bg)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BeanGlyph({ className }: { className?: string }) {
  return (
    <svg {...shared} viewBox="0 0 100 124" className={className}>
      <path
        d="M50 14c24 0 36 26 36 52 0 30-17 46-36 46S14 96 14 66c0-26 12-52 36-52z"
        fill={ink}
      />
      <path d="M50 22v84" stroke="var(--bg)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M50 22v84" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
    </svg>
  )
}

export function BlockGlyph({ className }: { className?: string }) {
  return (
    <svg {...shared} viewBox="0 0 100 124" className={className}>
      <path d="M10 32h62v70H10z" fill={ink} />
      <path d="M72 32l16-14v70l-16 14z" fill={accent} />
      <path
        d="M30.7 32v70M51.3 32v70M10 55.3h62M10 78.7h62"
        stroke="var(--bg)"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}

export function CupGlyph({ className }: { className?: string }) {
  return (
    <svg {...shared} viewBox="0 0 100 124" className={className}>
      <path
        d="M32 14c-5 9 5 13 0 22M50 8c-5 11 6 15 0 26M68 14c-5 9 5 13 0 22"
        stroke={accent}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 48h62l-8 56a10 10 0 0 1-10 9H32a10 10 0 0 1-10-9z"
        fill={ink}
      />
      <path
        d="M79 62h5a15 15 0 0 1 0 30h-8"
        stroke={ink}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const flowGlyphs = [PodGlyph, BeanGlyph, BlockGlyph, CupGlyph]

/** A hairline arrow used between flow stages. Rotates to vertical on mobile. */
export function FlowArrow({ className }: { className?: string }) {
  return (
    <svg {...shared} viewBox="0 0 40 12" className={className}>
      <path
        d="M0 6h34M28 1l6 5-6 5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
