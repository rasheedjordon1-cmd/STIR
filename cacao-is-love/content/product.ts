/**
 * PRODUCT — single source of truth for the buy experience.
 *
 * ⚠ FIELDS MARKED "PLACEHOLDER" MUST BE SET BEFORE LAUNCH.
 *   Nothing in this file is a claim about sourcing. See origin.ts for that.
 */

import { photo } from './photography'

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
  /** PLACEHOLDER — set the real retail price. */
  price: number
  currency: string
  availability: Availability
  /** Shown only when availability is `low_stock`. Tie to a real harvest count. */
  unitsRemaining: number | null
  /** Shown only when availability is `sold_out` AND this is non-null. */
  nextDropLabel: string | null
  ingredients: string[]
  options: PurchaseOption[]
  /** Image swap points. Drop files into /public and update the paths. */
  gallery: GallerySlide[]
}

export interface GallerySlide {
  id: string
  /** The gallery teaches, it does not only flatter. Each slide carries a job. */
  role: 'product' | 'texture' | 'preparation' | 'origin' | 'comparison' | 'voice' | 'packaging' | 'spec'
  plate: string
  caption: string
  src: string | null
  alt: string
}

export const product: Product = {
  slug: 'whole-cacao',
  name: 'CACAO IS LOVE',
  descriptor: '100% Whole Cacao',
  originCountry: 'Colombia',
  weightGrams: 250,
  price: 28, // PLACEHOLDER
  currency: 'USD',
  availability: 'in_stock',
  unitsRemaining: 41,
  nextDropLabel: null,
  ingredients: ['Whole cacao'],

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

  gallery: [
    { id: 'g1', role: 'product',     plate: 'PL. 01', caption: '250 g — whole cacao, Colombia',        src: photo('productFlat'), alt: 'The CACAO IS LOVE bag, front.' },
    { id: 'g2', role: 'texture',     plate: 'PL. 02', caption: 'Broken block, close',                   src: photo('texture'), alt: 'A block of whole cacao broken to show its texture.' },
    { id: 'g3', role: 'preparation', plate: 'PL. 03', caption: 'Chop — a knife and a board',            src: photo('chop'), alt: 'Cacao being chopped on a wooden board.' },
    { id: 'g4', role: 'preparation', plate: 'PL. 04', caption: 'Melt — low heat, hot water',            src: photo('melt'), alt: 'Cacao melting into hot water in a pot.' },
    { id: 'g5', role: 'origin',      plate: 'PL. 05', caption: 'Colombia — origin record',              src: photo('originTree'), alt: 'Documentary photograph from the origin region.' },
    { id: 'g6', role: 'comparison',  plate: 'PL. 06', caption: 'Cacao beside coffee',                   src: photo('comparison'), alt: 'A cup of cacao next to a cup of coffee.' },
    { id: 'g7', role: 'voice',       plate: 'PL. 07', caption: 'A cup, made somebody else’s way',  src: photo('cupInHands'), alt: 'A person holding a mug of cacao.' },
    { id: 'g8', role: 'packaging',   plate: 'PL. 08', caption: 'Back of bag — ingredients',             src: photo('pouchBack'), alt: 'The back of the bag showing the ingredient panel.' },
  ],
}

export const formatPrice = (amount: number, currency = product.currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
