/** SITE — navigation, contents, shipping, and the email capture. */

export const site = {
  brand: 'CACAO IS LOVE',
  tagline: '100% cacao from Colombia.',

  nav: [
    { label: 'CACAO',  href: '/#cacao'  },
    { label: 'SOURCE', href: '/#source' },
    { label: 'MAKE',   href: '/#make'   },
    { label: 'PEOPLE', href: '/#people' },
  ],
  shopHref: '/shop/whole-cacao',

  secondaryNav: [
    { label: 'FAQ',     href: '/#faq' },
    { label: 'ABOUT',   href: '/#nicolas' },
    /* CONTACT is intentionally absent. There is no verified address, and
       hello@example.com was rendering in the live footer. Add it back here the
       moment a real one exists — the footer renders this list as-is. */
  ],

  hero: {
    eyebrow: 'A GIFT FROM CURIOSITY',
    headline: 'CACAO, MADE TO BE SHARED.',
    supporting: '100% cacao.',
    secondLine: 'Grown in Colombia.',
    thirdLine: 'Nothing added.',
    primaryCta: 'GET THE CACAO',
    secondaryCta: 'SEE HOW TO MAKE IT',
  },

  /** The product-truth strip under the hero. Keep every item short. */
  marquee: [
    'ONE INGREDIENT',
    '100% CACAO',
    'GROWN IN COLOMBIA',
    'MADE TO SHARE',
    'NOTHING ADDED',
    '250 G',
  ],

  /**
   * FULFILMENT — renders only when populated.
   *
   * ⚠ Every row here is a promise to a customer. The previous values (New York,
   *   1–2 business days, free over $60) were placeholders and were displaying
   *   on the live buy module as though they were policy. Nothing goes back in
   *   this array until it is confirmed; the buy module hides the block while it
   *   is empty rather than guessing.
   */
  shipping: [] as { label: string; value: string }[],

  email: {
    eyebrow: 'STAY CLOSE',
    headline: ['GOOD THINGS ARE MEANT TO BE SHARED.'],
    supporting: 'Next drops, cacao, stories, and things worth knowing about.',
    cta: 'JOIN THE NEIGHBORHOOD',
    note: 'No discount codes. We send when there is something to say.',
  },

  footer: {
    lines: ['CACAO IS LOVE', '100% CACAO', 'COLOMBIA'],
    legal: '© ' + new Date().getFullYear() + ' Cacao Is Love. All rights reserved.',
  },
}
