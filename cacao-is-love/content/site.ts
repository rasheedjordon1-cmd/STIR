import { photo } from './photography'

/** SITE — navigation, contents, shipping, and the email capture. */

export const site = {
  brand: 'CACAO IS LOVE',
  tagline: '100% whole cacao from Colombia.',

  nav: [
    { label: 'CACAO',  href: '/#cacao'  },
    { label: 'SOURCE', href: '/#source' },
    { label: 'MAKE',   href: '/#make'   },
    { label: 'PEOPLE', href: '/#people' },
  ],
  shopHref: '/shop/whole-cacao',

  secondaryNav: [
    { label: 'FAQ',     href: '/shop/whole-cacao#faq' },
    { label: 'ABOUT',   href: '/#nicolas' },
    { label: 'CONTACT', href: 'mailto:hello@example.com' }, // PLACEHOLDER
  ],

  hero: {
    eyebrow: 'A GIFT FROM CURIOSITY',
    headline: 'CACAO, MADE TO BE SHARED.',
    supporting: '100% whole cacao.',
    secondLine: 'Grown in Colombia.',
    primaryCta: 'MAKE A CUP',
    secondaryCta: 'WHAT IS CACAO?',
  },

  /** The product-truth strip under the hero. Keep every item short. */
  marquee: [
    'ONE INGREDIENT',
    'WHOLE CACAO',
    'GROWN IN COLOMBIA',
    'MADE TO SHARE',
    'NOTHING ADDED',
    '250 G',
  ],

  /** PLACEHOLDER — set real shipping terms before launch. */
  shipping: [
    { label: 'SHIPS FROM', value: 'New York, NY' },
    { label: 'DISPATCH',   value: '1–2 business days' },
    { label: 'FREE OVER',  value: '$60' },
  ],

  email: {
    eyebrow: 'STAY CLOSE',
    headline: ['GOOD THINGS ARE MEANT TO BE SHARED.'],
    supporting: 'Next drops, cacao, stories, and things worth knowing about.',
    cta: 'JOIN THE NEIGHBORHOOD',
    note: 'No discount codes. We send when there is something to say.',
  },

  footer: {
    lines: ['CACAO IS LOVE', '100% WHOLE CACAO', 'COLOMBIA'],
    legal: '© ' + new Date().getFullYear() + ' Cacao Is Love. All rights reserved.',
  },
}
