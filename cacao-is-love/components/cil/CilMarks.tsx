/**
 * CIL MICRO-ASSETS
 *
 * Drawn to the mastermark's own logic — SOFT OUTSIDE, CUT INSIDE. Forms are
 * geometric and chunky; separations are cuts of the field colour showing
 * through rather than outlines.
 *
 * Every mark paints in `currentColor` and cuts with `var(--bg)`, so it inherits
 * whatever field it lands on and never needs a colour prop.
 *
 * Restraint is the rule: never more than one or two on a screen.
 */

interface MarkProps {
  size?: number | string
  className?: string
  title?: string
}

const base = (title?: string) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  focusable: 'false' as const,
  'aria-hidden': title ? undefined : (true as const),
  role: title ? ('img' as const) : undefined,
})

/** CIL MICRO 001 — SEED CHAMBER. Bullets, dots, inventory markers, punctuation. */
export function SeedChamber({ size = 14, className, title }: MarkProps) {
  return (
    <svg {...base(title)} viewBox="0 0 24 24" width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M12 5.4c3.1 1.9 4.6 4 4.6 6.6S15.1 16.7 12 18.6c-3.1-1.9-4.6-4-4.6-6.6S8.9 7.3 12 5.4Z"
        fill="currentColor"
      />
      <path d="M12 7.6v8.8" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/** CIL MICRO 002 — DOUBLE STEAM. Preparation headings, warming cues. */
export function DoubleSteam({ size = 20, className, title }: MarkProps) {
  return (
    <svg {...base(title)} viewBox="0 0 24 24" width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M9 20c-3-3.4 2.2-5.3-.8-8.8M16 20c-3-3.4 2.2-5.3-.8-8.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** CIL MICRO 003 — CACAO SHARD. Section transitions, rule interruptions. */
export function CacaoShard({ size = 16, className, title }: MarkProps) {
  return (
    <svg {...base(title)} viewBox="0 0 24 24" width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M8.6 2.4 20.4 6a2 2 0 0 1 1.4 2.3l-2 9.6a2 2 0 0 1-2.4 1.6L5.2 16.6a2 2 0 0 1-1.5-1.7L2.5 5.1a2 2 0 0 1 2.6-2.2Z"
        fill="currentColor"
      />
      <path d="M8.9 6.2 15.6 15" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** CIL MICRO 004 — SPLIT POD HALF. Cropped off section edges, large punctuation. */
export function SplitPodHalf({ size = 120, className, title }: MarkProps) {
  return (
    <svg {...base(title)} viewBox="0 0 120 200" width={size} className={className}>
      {title && <title>{title}</title>}
      <path d="M0 0c44 14 78 52 84 100s-24 88-84 100Z" fill="currentColor" />
      <g fill="var(--bg)">
        <ellipse cx="30" cy="62" rx="11" ry="15" />
        <ellipse cx="41" cy="100" rx="11" ry="15" />
        <ellipse cx="30" cy="138" rx="11" ry="15" />
      </g>
    </svg>
  )
}

/** CIL MICRO 005 — CUP RIM. Preparation interactions, FAQ markers. */
export function CupRim({ size = 16, className, title }: MarkProps) {
  return (
    <svg {...base(title)} viewBox="0 0 24 24" width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <circle cx="12" cy="12" r="10.5" fill="currentColor" />
      <circle cx="12" cy="12" r="6.2" fill="var(--bg)" />
      <circle cx="12" cy="12" r="3.4" fill="currentColor" />
    </svg>
  )
}

/** CIL MICRO 006 — CURIOUS FINGER. Educational links only, very sparingly. */
export function CuriousFinger({ size = 18, className, title }: MarkProps) {
  return (
    <svg {...base(title)} viewBox="0 0 24 24" width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <rect x="3.5" y="9.4" width="9" height="6.6" rx="3.3" fill="currentColor" />
      <rect x="10.4" y="10.4" width="10.2" height="4.6" rx="2.3" fill="currentColor" />
      <rect x="5.4" y="14.2" width="7.6" height="4.4" rx="2.2" fill="currentColor" />
      <path d="M13.4 12.7h6" stroke="var(--bg)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M7.2 13.6h4.4" stroke="var(--bg)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

/** A rule interrupted by a mark — the system's default divider. */
export function MarkedRule({
  mark = 'seed',
  label,
  className,
}: {
  mark?: 'seed' | 'shard' | 'steam'
  label?: string
  className?: string
}) {
  const Mark = mark === 'shard' ? CacaoShard : mark === 'steam' ? DoubleSteam : SeedChamber
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', color: 'var(--fg)' }}
    >
      <span style={{ flex: '0 0 auto', display: 'flex' }}>
        <Mark size={14} />
      </span>
      {label && <span className="t-label">{label}</span>}
      <span style={{ flex: 1, borderTop: 'var(--hair) solid var(--rule)' }} />
    </div>
  )
}
