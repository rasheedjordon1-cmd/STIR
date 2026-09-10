/**
 * CIL ILLUSTRATION SET — interim (preparation steps only)
 *
 * ⚠ These stand in for the commissioned CIL illustration assets
 *   for the preparation sequence. The supplied artwork for EDU 001,
 *   PROVENANCE 001 and CURIOSITY 001 now lives in CilAssets.tsx.
 *   They are drawn to the same rules as the mastermark — chunky geometric
 *   masses, soft outer corners, separations cut in the field colour rather
 *   than outlined — so the page reads as one system today and the real
 *   artwork drops into the same slots and viewBoxes later.
 *
 * All artwork paints in `currentColor` and cuts with `var(--bg)`.
 */

interface ArtProps {
  className?: string
  title?: string
}

const svg = (title?: string) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  focusable: 'false' as const,
  'aria-hidden': title ? undefined : (true as const),
  role: title ? ('img' as const) : undefined,
})




/** Preparation 01 — BREAK. The block, snapped. */
export function PrepBreak({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 240" className={className}>
      {title && <title>{title}</title>}
      <g fill="currentColor">
        <path d="M26 74h86l-14 44 16 44H26a10 10 0 0 1-10-10V84a10 10 0 0 1 10-10Z" />
        <g transform="rotate(9 178 118)">
          <path d="M136 74h78a10 10 0 0 1 10 10v68a10 10 0 0 1-10 10h-80l16-44Z" />
        </g>
      </g>
      <g stroke="var(--bg)" strokeWidth="6">
        <path d="M16 118h84M144 122h84" />
        <path d="M62 74v88" />
        <path d="M186 70v92" />
      </g>
      <g fill="currentColor">
        <path d="M40 190l30 8-6 26-30-8Z" />
        <path d="M92 196l24 6-5 21-24-6Z" transform="rotate(-12 104 210)" />
        <path d="M150 192l26 7-5 22-26-7Z" transform="rotate(8 163 206)" />
      </g>
    </svg>
  )
}

/** Preparation 02 — MELT + MIX. */
export function PrepMelt({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 240" className={className}>
      {title && <title>{title}</title>}
      <path
        d="M8 122c-3.4-3.8 2.4-6 -.9-10M28 116c-3.4-3.8 2.4-6-.9-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0"
      />
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <path d="M96 62c-12-14 9-22-3-36M132 62c-12-14 9-22-3-36" />
      </g>
      <g fill="currentColor">
        <path d="M42 86h144v72a44 44 0 0 1-44 44H86a44 44 0 0 1-44-44Z" />
        <rect x="182" y="96" width="52" height="20" rx="10" />
      </g>
      <path d="M42 112h144" stroke="var(--bg)" strokeWidth="6" />
      {/* spoon */}
      <g fill="var(--bg)">
        <rect x="106" y="60" width="14" height="86" rx="7" transform="rotate(14 113 103)" />
        <ellipse cx="126" cy="150" rx="18" ry="12" transform="rotate(14 126 150)" />
      </g>
    </svg>
  )
}

/** Preparation 03 — MAKE IT YOURS. The cup, and what goes in it. */
export function PrepMake({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 240" className={className}>
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <path d="M88 48c-12-14 9-22-3-36M124 48c-12-14 9-22-3-36" />
      </g>
      <g fill="currentColor">
        <path d="M40 78h124l-10 96a26 26 0 0 1-26 22H76a26 26 0 0 1-26-22Z" />
        <path d="M166 96h14a30 30 0 0 1 0 60h-20" />
      </g>
      <path d="M46 100h112" stroke="var(--bg)" strokeWidth="6" />
      <circle cx="180" cy="126" r="15" fill="var(--bg)" />
      {/* a cinnamon stick, a drizzle, a pinch */}
      <rect x="186" y="176" width="46" height="15" rx="7.5" fill="currentColor" transform="rotate(-24 209 183)" />
      <path
        d="M196 44c10 10-6 18 4 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <g fill="currentColor">
        <circle cx="26" cy="150" r="6" />
        <circle cx="16" cy="176" r="4.5" />
        <circle cx="34" cy="188" r="3.5" />
      </g>
    </svg>
  )
}

