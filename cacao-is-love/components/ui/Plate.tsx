import Image from 'next/image'
import s from './ui.module.css'

/**
 * PLATE — every image and diagram in the system sits in a numbered, captioned
 * frame. Because the frame carries the identity, the site reads as designed
 * before a single photograph exists, and reads identically once they arrive.
 */
export function Plate({
  plate,
  caption,
  src,
  alt = '',
  ratio = '4 / 5',
  priority = false,
  sizes = '(min-width: 900px) 40vw, 100vw',
  children,
}: {
  plate?: string
  caption?: string
  src?: string | null
  alt?: string
  ratio?: string
  priority?: boolean
  sizes?: string
  children?: React.ReactNode
}) {
  return (
    <figure className={s.plate}>
      <div className={s.plateFrame} style={{ aspectRatio: ratio }}>
        {children ? (
          children
        ) : src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <EmptyPlate />
        )}
      </div>
      {(plate || caption) && (
        <figcaption className={s.plateCaption}>
          {plate && <span className={`t-meta ${s.plateNum}`}>{plate}</span>}
          {caption && <span className={`t-meta ${s.plateText}`}>{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/** Reserved space in the printer's-picture-box idiom: deliberate, not broken. */
function EmptyPlate() {
  return (
    <div className={s.plateEmpty}>
      <svg
        className={s.plateEmptyMark}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.35" opacity="0.35" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.35" opacity="0.35" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={`t-label ${s.plateEmptyLabel}`}>Image pending</span>
    </div>
  )
}
