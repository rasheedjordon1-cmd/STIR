import { photos, type PhotoKey } from '@/content/photography'

/**
 * PHOTO — the only way a photograph reaches the page.
 *
 * The site is a static export with `images: { unoptimized: true }`, so
 * next/image does no resizing: whatever we reference is what a phone
 * downloads. This emits a real srcset over the variants on disk instead, which
 * is the difference between a 390px screen pulling 32KB and pulling 218KB.
 *
 * `sizes` is required rather than defaulted, because a wrong `sizes` silently
 * serves the wrong file and looks identical in review. Every call site has to
 * say how wide the image actually renders.
 *
 * width/height come from the registry, so the box is reserved before the file
 * arrives and the layout never jumps.
 */
export function Photo({
  name,
  sizes,
  priority = false,
  className,
  alt,
  style,
}: {
  name: PhotoKey
  /** e.g. "(min-width: 900px) 55vw, 100vw" — describe the rendered width. */
  sizes: string
  /** Set on the LCP image only. */
  priority?: boolean
  className?: string
  /** Override the registry alt. Pass "" when the photograph is decorative. */
  alt?: string
  style?: React.CSSProperties
}) {
  const p = photos[name]
  const dir = p.dir ?? '/photo'
  const srcSet = p.widths.map((w) => `${dir}/${p.file}-${w}.webp ${w}w`).join(', ')
  const largest = p.widths[p.widths.length - 1]

  return (
    <img
      src={`${dir}/${p.file}-${largest}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={alt ?? p.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      style={{ display: 'block', width: '100%', height: 'auto', ...style }}
    />
  )
}
