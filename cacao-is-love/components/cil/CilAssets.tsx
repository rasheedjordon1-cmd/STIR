import Image from 'next/image'

/**
 * CIL ILLUSTRATION ASSETS — the supplied artwork.
 *
 * Each was lifted off its near-white ground onto an alpha channel and snapped
 * to the canonical palette, so the internal cut lines show the field colour
 * through and nothing carries a bright rectangle. See the asset pipeline note
 * in the README.
 *
 * These paint their own colours and therefore do NOT inherit the field. The
 * hands are MARKET GREEN, so any of them placed on a green field would vanish;
 * that constraint is why the provenance section is a cream/green split rather
 * than a single green field.
 */

interface AssetProps {
  className?: string
  /** Empty string marks the artwork as decorative where the heading says it. */
  alt: string
  sizes?: string
  priority?: boolean
}

function Art({
  src,
  width,
  height,
  alt,
  className,
  sizes = '(min-width: 900px) 40vw, 80vw',
  priority = false,
}: AssetProps & { src: string; width: number; height: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

/** CIL PROVENANCE 001 — HAND + POD. */
export const ProvenanceHandPod = (p: AssetProps) => (
  <Art {...p} src="/cil/provenance-hand-pod.webp" width={854} height={957} />
)

/** CIL EDU 001 (left) — WHOLE CACAO. */
export const EduWholeCacao = (p: AssetProps) => (
  <Art {...p} src="/cil/edu-whole-cacao.webp" width={696} height={479} />
)

/** CIL EDU 001 (right) — COCOA POWDER. */
export const EduCocoaPowder = (p: AssetProps) => (
  <Art {...p} src="/cil/edu-cocoa-powder.webp" width={638} height={369} />
)

/** CIL CURIOSITY 001 — TELL ME MORE. */
export const CuriosityTellMeMore = (p: AssetProps) => (
  <Art {...p} src="/cil/curiosity-tell-me-more.webp" width={900} height={681} />
)

/** Preparation 01 — BREAK. */
export const PrepBreakArt = (p: AssetProps) => (
  <Art {...p} src="/cil/prep-break.webp" width={820} height={300} />
)

/**
 * CIL MICRO 006 — CURIOUS FINGER.
 *
 * The drawn hand points down and to the left, so it sits AFTER a link and
 * approaches it on hover — see `.quietMarkLeft`. It is also carried at 26px
 * rather than the ~16px the vector version used: raster detail this fine turns
 * to a smudge below roughly 22px.
 */
export function CuriousFingerMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/cil/micro-curious-finger.webp"
      alt=""
      width={300}
      height={218}
      className={className}
      style={{ height: size, width: 'auto' }}
    />
  )
}

/** CIL MICRO 002 — DOUBLE STEAM. Preparation headings, warming cues. */
export function DoubleSteamMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/cil/micro-double-steam.webp"
      alt=""
      width={420}
      height={475}
      className={className}
      style={{ height: size, width: 'auto' }}
    />
  )
}

/** CIL MICRO 004 — SPLIT POD HALF. Cropped off a section edge. */
export function SplitPodHalfMark({ size = 190, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/cil/micro-split-pod-half.webp"
      alt=""
      width={420}
      height={642}
      className={className}
      style={{ width: size, height: 'auto' }}
    />
  )
}
