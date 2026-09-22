import { canSignup } from './commerce'

/* ============================================================================
   NAVIGATION MODEL

   The four primary items are the four questions a first-time buyer asks, in
   the order they ask them: what is it / where is it from / what do I do with
   it / who else is here. That order is the site's argument, so it is also the
   navigation.

   EVERY href below resolves to a section id that exists on the homepage or to
   the product route. Nothing here points at a page we have not built, and no
   line of copy claims anything the content model cannot support.
   ========================================================================== */

export type MegaLink = {
  label: string
  href: string
  /** One line. What the reader gets, not what we think of it. */
  note: string
}

export type MegaMenu = {
  key: 'cacao' | 'source' | 'make' | 'people'
  label: string
  /** Where the top-level item itself goes when clicked or activated. */
  href: string
  /** Ground for the 40% brand panel. Never cream — it sits beside cream. */
  field: 'red' | 'green' | 'ink'
  /** Locked brand phrase. Identity voice. Drawn only from real brand copy. */
  brandline: string
  /** One supporting line, language voice. */
  brandNote: string
  links: MegaLink[]
}

const allMenus: MegaMenu[] = [
  {
    key: 'cacao',
    label: 'CACAO',
    href: '/#cacao',
    field: 'red',
    brandline: 'ONE INGREDIENT.',
    brandNote: 'Cacao and nothing else. It comes as pieces you break apart.',
    links: [
      { label: 'THE CACAO',    href: '/#truth',       note: 'What is actually in the bag.' },
      { label: 'THE CATEGORY', href: '/#cacao',       note: 'Cacao is not cocoa powder, and not a chocolate bar.' },
      { label: 'COMPOSITION',  href: '/#composition', note: 'The compounds the bean carries.' },
      { label: 'CACAO & COFFEE', href: '/shop/whole-cacao/#coffee', note: 'How the cup compares to the one you already drink.' },
    ],
  },
  {
    key: 'source',
    label: 'SOURCE',
    href: '/#source',
    field: 'green',
    brandline: 'GROWN IN COLOMBIA.',
    brandNote: 'One country, named. The rest of the record stays blank until it is confirmed.',
    links: [
      { label: 'ORIGIN',   href: '/#source',  note: 'Where the cacao comes from, and what we can prove.' },
      { label: 'WORLDVIEW', href: '/#nicolas', note: 'Nicolas, in his own words.' },
      { label: 'WHY THIS EXISTS', href: '/shop/whole-cacao/#why', note: 'The reason for a single bag.' },
    ],
  },
  {
    key: 'make',
    label: 'MAKE',
    href: '/#make',
    field: 'ink',
    brandline: 'MADE TO BE SHARED.',
    brandNote: 'Break it, steam it, stir it. Four steps and a pot.',
    links: [
      { label: 'MAKE A CUP', href: '/#make',                   note: 'The method, start to finish.' },
      { label: 'QUESTIONS',  href: '/shop/whole-cacao/#faq',   note: 'Storage, strength, sweetening.' },
      { label: 'THE COUNTER', href: '/shop/whole-cacao/',      note: '250 g of cacao, in pieces.' },
    ],
  },
  {
    key: 'people',
    label: 'PEOPLE',
    href: '/#people',
    field: 'green',
    brandline: 'CACAO IS LOVE.',
    brandNote: 'One cup has a habit of becoming two. That is the whole idea.',
    links: [
      { label: 'THE NEIGHBORHOOD', href: '/#people',     note: 'Who is drinking it.' },
      { label: 'NICOLAS',          href: '/#nicolas',    note: 'The person who started it.' },
      { label: 'STAY CLOSE',       href: '/#newsletter', note: 'Next drops, and nothing else.' },
    ],
  },
]

/**
 * STAY CLOSE points at #newsletter, and the newsletter section only renders
 * once a signup endpoint is configured. Rather than ship a menu row that
 * scrolls nowhere, the row is filtered out while that is unset — the model
 * keeps its original content and the menu stays honest either way.
 */
export const megaMenus: MegaMenu[] = allMenus.map((m) => ({
  ...m,
  links: m.links.filter((l) => canSignup || l.href !== '/#newsletter'),
}))
