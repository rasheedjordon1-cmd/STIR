/**
 * PRODUCT — single source of truth for the buy experience.
 *
 * Nothing in this file is a claim about sourcing. See origin.ts for that.
 *
 * ⚠ PRODUCT TRUTH. The descriptor is "100% cacao", not "whole cacao". The
 *   photographs show short broken pieces; "whole" invited copy elsewhere to
 *   describe a solid block, which the bag does not contain. The packaging also
 *   reads "organic", "raw" and "ceremonial-grade" — none of those are repeated
 *   here, because packaging artwork is not the same as an approved web claim.
 */

export type Availability = 'in_stock' | 'low_stock' | 'sold_out'

export interface PurchaseOption {
  id: string
  label: string
  sublabel: string
  quantity: number
  /** Enables the recipient note field on the buy module. */
  allowsGiftNote: boolean
}

export interface Product {
  slug: string
  name: string
  descriptor: string
  originCountry: string
  weightGrams: number
  price: number
  currency: string
  availability: Availability
  /** Shown only when availability is `low_stock`. Tie to a real harvest count. */
  unitsRemaining: number | null
  /** Shown only when availability is `sold_out` AND this is non-null. */
  nextDropLabel: string | null
  ingredients: string[]
  options: PurchaseOption[]
}

export const product: Product = {
  slug: 'whole-cacao',
  name: 'CACAO IS LOVE',
  descriptor: '100% cacao',
  originCountry: 'Colombia',
  weightGrams: 250,
  price: 28,
  currency: 'USD',
  availability: 'in_stock',
  /* No live inventory feed. A number here would be invented, and it only
     renders on low_stock anyway — leave it null until a real count exists. */
  unitsRemaining: null,
  nextDropLabel: null,
  ingredients: ['Cacao'],

  options: [
    {
      id: 'one-bag',
      label: 'ONE BAG',
      sublabel: 'For your kitchen.',
      quantity: 1,
      allowsGiftNote: false,
    },
    {
      id: 'make-two',
      label: 'MAKE TWO',
      sublabel: 'One for you. One to share.',
      quantity: 2,
      allowsGiftNote: true,
    },
  ],

}

export const formatPrice = (amount: number, currency = product.currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
