/**
 * CIL MICRO 2.0 — GLYPH TIER
 *
 * Simplified SVG geometry derived from the MICRO 2.0 silhouettes, for every
 * interface mark UNDER 48px. This is the tier that has to survive 11px in a
 * table row, so it carries silhouette and one cut — never texture, never the
 * authored three-colour palette.
 *
 * THE TWO RULES THAT MAKE THIS TIER WORK
 *   · every form paints `currentColor`
 *   · every cut paints `var(--bg)`
 * so one glyph inherits the correct foreground on cream, red, green and ink
 * without a per-field export. A fixed-palette raster cannot do this — the
 * drawn Curious Finger measured as INVISIBLE on the green panel, which is
 * exactly why the object tier is not allowed down here.
 *
 * DO NOT enlarge these as a substitute for MICRO 2.0 artwork. Above 48px the
 * object tier takes over: real illustration, authored palette, print texture.
 *
 * Espresso Ink is an illustration material. It is not a token and it never
 * appears in this file.
 *
 * Sizes were proved by rendering every glyph at 11/13/16/20/26/40 on all four
 * fields before any of them shipped. The first pass had cuts at ~6% of the
 * form width and they disappeared below 16px; these are ~16%.
 */

interface MarkProps {
  size?: number | string
  className?: string
  title?: string
}

const base = (title?: string) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  focusable: 'false' as const,
  'aria-hidden': title ? undefined : (true as const),
  role: title ? ('img' as const) : undefined,
})

/**
 * CIL MICRO 001 — SEED CHAMBER. The primary recurring punctuation mark.
 *
 * Seventeen call sites and counting: bullets, tags, utility rows, the marquee,
 * the cart slip, the footer. It is the site's full stop.
 *
 * Drawn UPRIGHT rather than at the master form's tilt. That is a deliberate
 * simplification for this tier: rotated, the silhouette reads as a lump below
 * about 14px and it will not sit on a text baseline cleanly. The tilt is an
 * object-tier property.
 */
export function SeedChamber({ size = 14, className, title }: MarkProps) {
  return (
    <svg {...base(title)} width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M12 2.2C16.4 6 19.2 9.5 19.2 12.5 19.2 15.5 16.4 19 12 22.8 7.6 19 4.8 15.5 4.8 12.5 4.8 9.5 7.6 6 12 2.2Z"
        fill="currentColor"
      />
      <path
        d="M14.6 5.9c2.1 3.7-.3 6.7-2.4 9.4-1.5 2-2 3.4-1.1 5.3-2.9-1.8-2.5-4.5-.6-7.1 2.2-3 3.7-5.1 2.3-8Z"
        fill="var(--bg)"
      />
    </svg>
  )
}

/** CIL MICRO 002 — STEAM, SINGLE. One ribbon. Warmth, a single step. */
export function SingleSteam({ size = 18, className, title }: MarkProps) {
  return (
    <svg {...base(title)} width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M9.6 22c-3.6-4.6 1.7-6.8 1.7-10.2 0-2.4-2.4-3.8-2.4-6.6 0-2.4 1.5-4.1 3.7-5.2-1.2 2.4-.7 4.1.8 6.1 1.6 2.1 2.4 3.9 2.4 6.3 0 4.1-4.9 6.1-6.2 9.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * CIL MICRO 002 — STEAM, DOUBLE. Preparation headings, warming cues.
 * Solid ribbons, not strokes: the MICRO 2.0 steam is a poured form, and the
 * previous hairline version read as two apostrophes at nav scale.
 */
export function DoubleSteam({ size = 20, className, title }: MarkProps) {
  return (
    <svg {...base(title)} width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M8.4 21.8c-3-3.8 1.4-5.6 1.4-8.4 0-2-2-3.1-2-5.4 0-2 1.2-3.4 3-4.4-.9 2-.5 3.4.7 5 1.3 1.8 2 3.2 2 5.2 0 3.4-4 5-5.1 8Z"
        fill="currentColor"
      />
      <path
        d="M16 21.8c-2.6-3.3 1.2-4.9 1.2-7.3 0-1.7-1.7-2.7-1.7-4.7 0-1.7 1-2.9 2.6-3.8-.8 1.7-.4 2.9.6 4.3 1.1 1.6 1.7 2.8 1.7 4.5 0 3-3.5 4.4-4.4 7Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * CIL MICRO 003 — CACAO SHARD. Section transitions, rule interruptions.
 * The CHUNK silhouette with the fracture carried as a single cut, because at
 * 13px the master form's three separate fracture planes merge into noise.
 */
export function CacaoShard({ size = 16, className, title }: MarkProps) {
  return (
    <svg {...base(title)} width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M8.8 2.6 19.6 5.4a1.8 1.8 0 0 1 1.3 2.2l-2 9.4a1.8 1.8 0 0 1-2.2 1.4L5.4 15.8a1.8 1.8 0 0 1-1.3-1.6L3 5.2a1.8 1.8 0 0 1 2.4-2Z"
        fill="currentColor"
      />
      <path d="M17 4.2 11.4 11l3.4 1.5-6.2 6.2 1.8-6-3.4-1.2Z" fill="var(--bg)" />
    </svg>
  )
}

/**
 * CIL MICRO 004 — CUP RIM / VESSEL. The counter, the shared cup.
 * Derived from the RIM master: the ellipse and its band, with the body cut
 * away to a suggestion. A full mug with a handle does not survive 13px.
 */
export function CupRim({ size = 16, className, title }: MarkProps) {
  return (
    <svg {...base(title)} width={size} height={size} className={className}>
      {title && <title>{title}</title>}
      <path
        d="M12 4.6c5.1 0 9.2 2.1 9.2 4.7s-4.1 4.7-9.2 4.7S2.8 11.9 2.8 9.3 6.9 4.6 12 4.6Z"
        fill="currentColor"
      />
      <ellipse cx="12" cy="9.3" rx="5.6" ry="2.4" fill="var(--bg)" />
      <path
        d="M3.3 11.6c1.3 2.2 4.7 3.7 8.7 3.7s7.4-1.5 8.7-3.7l-1.1 5.6c-.5 2.6-3.4 4.2-7.6 4.2s-7.1-1.6-7.6-4.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * SPLIT POD HALF — NOT YET FROM MICRO 2.0.
 *
 * The supplied sheets cover Shard (01?), Steam (02), Vessel (04) and the Seed
 * Chamber. There is no pod family among them, and the numbering skips, so at
 * least one sheet is still outstanding. This is the SOURCE nav mark, so it
 * stays as drawn until that sheet arrives — flagged rather than faked, because
 * inventing a MICRO 2.0 silhouette is exactly the thing this system is for.
 */
export function SplitPodHalf({ size = 120, className, title }: MarkProps) {
  return (
    <svg
      {...base(title)}
      viewBox="0 0 120 200"
      width={size}
      className={className}
    >
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

/**
 * CURIOUS FINGER — retired from the glyph tier.
 *
 * It has failed measurement twice on this project: a red smudge at 13–26px and
 * a wrench at 128px. It is kept only for the one education-chapter call site
 * that still uses the drawn artwork at 64px on cream. Do not reintroduce it to
 * navigation or to any small position.
 */
export function CuriousFinger({ size = 18, className, title }: MarkProps) {
  return (
    <svg {...base(title)} width={size} height={size} className={className}>
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
