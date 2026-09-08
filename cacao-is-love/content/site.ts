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

  /** The CONTENTS rail. Doubles as the fast-orientation device in the hero. */
  contents: [
    { n: '01', label: 'THE PRODUCT',      href: '#truth'   },
    { n: '02', label: 'WHAT IS CACAO',    href: '#cacao'   },
    { n: '03', label: 'CACAO / COFFEE',   href: '#coffee'  },
    { n: '04', label: 'WHY PEOPLE DRINK', href: '#why'     },
    { n: '05', label: 'HOW TO MAKE IT',   href: '#make'    },
    { n: '06', label: 'NICOLAS',          href: '#nicolas' },
    { n: '07', label: 'SOURCE',           href: '#source'  },
    { n: '08', label: 'THE NEIGHBORHOOD', href: '#people'  },
  ],

  hero: {
    eyebrow: 'A GIFT FROM CURIOSITY',
    supporting: '100% whole cacao from Colombia.',
    secondLine: 'Made simply. Shared freely.',
    primaryCta: 'SHOP CACAO',
    secondaryCta: 'WHAT IS CACAO?',
    plate: { plate: 'PL. 00', caption: 'Whole cacao, 250 g — Colombia', src: null, alt: '' },
  },

  /** PLACEHOLDER — set real shipping terms before launch. */
  shipping: [
    { label: 'SHIPS FROM', value: 'New York, NY' },
    { label: 'DISPATCH',   value: '1–2 business days' },
    { label: 'FREE OVER',  value: '$60' },
  ],

  email: {
    eyebrow: 'CHAPTER 13',
    headline: ['GOOD THINGS', 'ARE MEANT', 'TO BE SHARED.'],
    supporting: 'Next drops, cacao, stories, and things worth knowing about.',
    cta: 'JOIN THE NEIGHBORHOOD',
    note: 'No discount codes. We send when there is something to say.',
  },

  footer: {
    lines: ['CACAO IS LOVE', '100% WHOLE CACAO', 'COLOMBIA'],
    legal: '© ' + new Date().getFullYear() + ' Cacao Is Love. All rights reserved.',
  },
}
