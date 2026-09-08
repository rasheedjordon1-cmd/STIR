import { product } from '@/content/product'
import { Plate } from '@/components/ui/Plate'
import s from './sections.module.css'

/**
 * PDP GALLERY — merchandising that teaches.
 * Every slide carries a `role`, so the gallery walks a visitor through
 * product → texture → preparation → origin → comparison → voice → packaging
 * rather than showing eight versions of the same beauty shot.
 */
export function ProductGallery() {
  const [lead, ...rest] = product.gallery
  return (
    <div className={s.galleryGrid}>
      <div className={s.galleryLead}>
        <Plate
          plate={lead.plate}
          caption={lead.caption}
          src={lead.src}
          alt={lead.alt}
          ratio="4 / 3"
          priority
          sizes="(min-width: 900px) 50vw, 100vw"
        />
      </div>
      {rest.map((slide) => (
        <Plate
          key={slide.id}
          plate={slide.plate}
          caption={slide.caption}
          src={slide.src}
          alt={slide.alt}
          ratio="1 / 1"
          sizes="(min-width: 900px) 25vw, 50vw"
        />
      ))}
    </div>
  )
}
