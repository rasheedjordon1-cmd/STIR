import Image from 'next/image'
import s from './ui.module.css'

/**
 * Real photography, sized to matter. No polite frames, no empty placeholder
 * boxes — if there is no image there is no figure.
 */
export function Figure({
  src,
  alt,
  ratio = '4 / 5',
  plate,
  caption,
  priority = false,
  sizes = '(min-width: 900px) 50vw, 100vw',
  cut = false,
  className,
}: {
  src: string
  alt: string
  ratio?: string
  plate?: string
  caption?: string
  priority?: boolean
  sizes?: string
  /** SOFT OUTSIDE, CUT INSIDE — one corner cut on the image mask. */
  cut?: boolean
  className?: string
}) {
  return (
    <figure className={`${s.figure} ${className ?? ''}`}>
      <div
        className={`${s.figureMedia} ${cut ? 'cut-br' : ''}`}
        style={{ aspectRatio: ratio }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
      </div>
      {(plate || caption) && (
        <figcaption className={s.figureCap}>
          {plate && <span className="t-meta">{plate}</span>}
          {caption && <span className={`t-meta ${s.figureCapRight}`}>{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}
