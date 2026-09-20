import { product } from '@/content/product'
import { origin } from '@/content/origin'
import { commerce } from '@/content/commerce'

/**
 * STRUCTURED DATA — only fields this site can actually stand behind.
 *
 * ⚠ DELIBERATELY ABSENT, and none of it goes in without a source:
 *   aggregateRating / review — there are no reviews. Inventing them to win a
 *     star rating in search results is the most common way a new store starts
 *     out lying, and it is the one Google penalises hardest.
 *   shippingDetails / hasMerchantReturnPolicy — no confirmed policy exists.
 *   address / telephone / sameAs — no verified address, phone, or accounts.
 *
 * `availability` is emitted because product.availability is a maintained flag
 * that also drives what the buy module shows — the page and the markup agree.
 * If that flag stops being kept current, remove it from both.
 */
export function StructuredData({ url }: { url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}#org`,
        name: 'Cacao Is Love',
        url,
        logo: `${url}/brand/mastermark-ink.png`,
      },
      {
        '@type': 'Product',
        name: product.name,
        description: `${product.descriptor}. ${product.weightGrams} g, grown in ${origin.country}. Pieces you break apart and melt into a cup.`,
        image: [`${url}/photo/pack-studio-1024.webp`, `${url}/photo/counter-green-1024.webp`],
        brand: { '@id': `${url}#org` },
        countryOfOrigin: origin.country,
        weight: { '@type': 'QuantitativeValue', value: product.weightGrams, unitCode: 'GRM' },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability:
            product.availability === 'sold_out'
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          ...(commerce.checkoutUrl ? { url: `${url}/shop/whole-cacao/` } : {}),
        },
      },
    ],
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
