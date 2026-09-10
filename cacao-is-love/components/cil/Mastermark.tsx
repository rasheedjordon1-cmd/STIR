import Image from 'next/image'

/**
 * THE CACAO IS LOVE MASTERMARK.
 *
 * Treated as letterform art, never as text and never approximated with a font.
 * The supplied artwork was separated onto an alpha channel and emitted in each
 * brand colour, so the mark can sit on any field without a plate behind it.
 *
 * Intrinsic artwork is 1304 x 638 (2.044:1).
 */

const RATIO = 1304 / 638

const SRC = {
  cream: '/brand/mastermark-cream.png',
  red: '/brand/mastermark-red.png',
  ink: '/brand/mastermark-ink.png',
} as const

export function Mastermark({
  height = 32,
  tone = 'ink',
  priority = false,
  className,
}: {
  height?: number
  /** Pick the colourway that clears contrast on the field it sits on. */
  tone?: keyof typeof SRC
  priority?: boolean
  className?: string
}) {
  const width = Math.round(height * RATIO)
  return (
    <Image
      src={SRC[tone]}
      alt="Cacao Is Love"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: 'auto' }}
    />
  )
}

/** Fluid version for brand moments — the hero and the footer. */
export function MastermarkDisplay({
  tone = 'ink',
  priority = false,
  maxWidth = 620,
  className,
}: {
  tone?: keyof typeof SRC
  priority?: boolean
  maxWidth?: number
  className?: string
}) {
  return (
    <Image
      src={SRC[tone]}
      alt="Cacao Is Love"
      width={1304}
      height={638}
      priority={priority}
      sizes="(min-width: 900px) 40vw, 86vw"
      className={className}
      style={{ width: '100%', maxWidth, height: 'auto' }}
    />
  )
}
