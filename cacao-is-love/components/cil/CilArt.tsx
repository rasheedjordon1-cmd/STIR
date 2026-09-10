/**
 * CIL ILLUSTRATION SET — interim
 *
 * ⚠ These stand in for the commissioned CIL illustration assets
 *   (EDU 001, PROVENANCE 001, CURIOSITY 001, the preparation hands).
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

const POD =
  'M0-66C26-48 40-24 40 2c0 28-16 52-40 64-24-12-40-36-40-64C-40-24-26-48 0-66Z'

/**
 * CIL PROVENANCE 001 — stand-in.
 *
 * The named asset is HAND + POD. A hand does not survive reduction to geometric
 * masses at this scale — it reads as a blob — so this interim draws the pod on
 * the branch instead, which reads instantly and matches the poster. Swap in the
 * real hand artwork at the same viewBox.
 */
export function ProvenanceHandPod({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 280" className={className}>
      {title && <title>{title}</title>}
      <path
        d="M4 24C68 28 114 52 138 98"
        fill="none"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <g fill="currentColor">
        <path d="M48 18c14-16 40-18 54-4-14 16-40 18-54 4Z" transform="rotate(-16 75 16)" />
        <path d="M96 44c14-16 40-18 54-4-14 16-40 18-54 4Z" transform="rotate(12 123 42)" />
      </g>
      <g transform="translate(140 172) rotate(9) scale(1.2)">
        <path d={POD} fill="currentColor" />
        <g stroke="var(--bg)" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M0-56V56" />
          <path d="M-21-48c-6 34-6 62 0 94" />
          <path d="M21-48c6 34 6 62 0 94" />
        </g>
      </g>
    </svg>
  )
}

/** CIL EDU 001 (left) — WHOLE CACAO: solid mass. */
export function EduWholeCacao({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 200" className={className}>
      {title && <title>{title}</title>}
      <rect x="26" y="42" width="140" height="116" rx="14" fill="currentColor" />
      <g stroke="var(--bg)" strokeWidth="5">
        <path d="M72 42v116M119 42v116M26 88h140M26 122h140" />
      </g>
      {/* a shard broken off the block */}
      <path
        d="M176 104l40 12a6 6 0 0 1 4 7l-8 34a6 6 0 0 1-8 4l-32-12a6 6 0 0 1-4-5l-2-34a6 6 0 0 1 10-6Z"
        fill="currentColor"
      />
      <path d="M182 118l22 30" stroke="var(--bg)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

/** CIL EDU 001 (right) — COCOA POWDER: processed, loose. */
export function EduCocoaPowder({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 200" className={className}>
      {title && <title>{title}</title>}
      {/* scoop */}
      <g fill="currentColor">
        <path d="M132 34h64a10 10 0 0 1 10 10v26a30 30 0 0 1-30 30h-24a30 30 0 0 1-30-30V44a10 10 0 0 1 10-10Z" />
        <rect x="196" y="42" width="34" height="16" rx="8" />
      </g>
      <path d="M140 62h50" stroke="var(--bg)" strokeWidth="4" strokeLinecap="round" />
      {/* mound */}
      <path d="M18 166c0-38 26-58 58-58s58 20 58 58Z" fill="currentColor" />
      <g fill="currentColor">
        <circle cx="150" cy="132" r="5" />
        <circle cx="166" cy="150" r="4" />
        <circle cx="142" cy="156" r="3.5" />
        <circle cx="176" cy="126" r="3" />
      </g>
      <g stroke="var(--bg)" strokeWidth="4" strokeLinecap="round">
        <path d="M44 150h20M76 150h22M60 132h26" />
      </g>
    </svg>
  )
}

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

/** CIL CURIOSITY 001 — TELL ME MORE. */
export function CuriosityTellMeMore({ className, title }: ArtProps) {
  return (
    <svg {...svg(title)} viewBox="0 0 240 240" className={className}>
      {title && <title>{title}</title>}
      <g fill="currentColor">
        <rect x="98" y="26" width="34" height="104" rx="17" />
        <rect x="62" y="104" width="104" height="70" rx="30" />
        <rect x="46" y="172" width="128" height="46" rx="23" />
        <rect x="136" y="112" width="30" height="52" rx="15" transform="rotate(18 151 138)" />
      </g>
      <g stroke="var(--bg)" strokeWidth="4.5" strokeLinecap="round">
        <path d="M80 132h50M80 150h44" />
      </g>
      <g fill="currentColor">
        <circle cx="192" cy="52" r="9" />
        <circle cx="214" cy="82" r="5.5" />
      </g>
    </svg>
  )
}
