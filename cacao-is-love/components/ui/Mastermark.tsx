import s from './ui.module.css'

/**
 * The handwritten CACAO IS LOVE mastermark.
 *
 * ⚠ The mark is NEVER redrawn in code and NEVER approximated with a typeface.
 *   Drop the supplied file at /public/mastermark.svg and flip HAS_ASSET.
 *   Until then this renders labelled reserved space at the correct optical
 *   size — in the same picture-box idiom as an empty Plate — so the layout is
 *   already solved when the real asset lands.
 */
const HAS_ASSET = false

export function Mastermark({
  height = 26,
  label = 'CACAO IS LOVE',
  variant = 'inline',
}: {
  height?: number
  label?: string
  variant?: 'inline' | 'display'
}) {
  const display = variant === 'display'

  if (HAS_ASSET) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/mastermark.svg"
        alt={label}
        className={`${s.mastermarkImg} ${display ? s.mastermarkImgDisplay : ''}`}
        style={display ? undefined : ({ ['--mm-h' as string]: `${height}px` } as React.CSSProperties)}
      />
    )
  }

  if (display) {
    return (
      <span className={s.mastermarkDisplay} role="img" aria-label={label}>
        <svg className={s.mastermarkCross} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden focusable="false">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.3" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.3" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className={`t-label ${s.mastermarkDisplayLabel}`} aria-hidden="true">
          Mastermark — handwritten asset pending
        </span>
      </span>
    )
  }

  return (
    <span className={s.mastermarkFallback} style={{ height }} role="img" aria-label={label}>
      <span className="t-label" aria-hidden="true">
        {label}
      </span>
    </span>
  )
}
