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
  /** Chapter code where the destination section carries one. */
  ch?: string
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

export const megaMenus: MegaMenu[] = [
  {
    key: 'cacao',
    label: 'CACAO',
    href: '/#cacao',
    field: 'red',
    brandline: 'ONE INGREDIENT.',
    brandNote: 'Whole cacao. Nothing added, nothing taken out.',
    links: [
      { ch: 'CH. 01', label: 'THE CACAO',    href: '/#truth',       note: 'What is actually in the bag.' },
      { ch: 'CH. 02', label: 'THE CATEGORY', href: '/#cacao',       note: 'Cacao is not cocoa powder, and not a chocolate bar.' },
      { ch: 'CH. 03', label: 'COMPOSITION',  href: '/#composition', note: 'The compounds the whole bean carries.' },
      {               label: 'CACAO & COFFEE', href: '/#coffee',    note: 'How the cup compares to the one you already drink.' },
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
      { ch: 'CH. 04', label: 'ORIGIN',   href: '/#source',  note: 'Where the cacao comes from, and what we can prove.' },
      { ch: 'CH. 05', label: 'WORLDVIEW', href: '/#nicolas', note: 'Nicolas, in his own words.' },
      {               label: 'WHY THIS EXISTS', href: '/#why', note: 'The reason for a single bag.' },
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
      {               label: 'MAKE A CUP', href: '/#make',                   note: 'The method, start to finish.' },
      {               label: 'QUESTIONS',  href: '/#faq',                    note: 'Storage, strength, sweetening, shipping.' },
      { ch: 'CH. 06', label: 'THE COUNTER', href: '/shop/whole-cacao',       note: '250 g of whole cacao.' },
    ],
  },
  {
    key: 'people',
    label: 'PEOPLE',
    href: '/#people',
    field: 'green',
    brandline: 'CACAO IS LOVE.',
    brandNote: 'A bag is usually bought for someone else. That is the whole idea.',
    links: [
      {               label: 'THE NEIGHBORHOOD', href: '/#people',     note: 'Who is drinking it.' },
      { ch: 'CH. 05', label: 'NICOLAS',          href: '/#nicolas',    note: 'The person who started it.' },
      {               label: 'STAY CLOSE',       href: '/#newsletter', note: 'Next drops, and nothing else.' },
    ],
  },
]

/** Information voice. Derived, so it can never drift out of true. */
export function menuRecord(menu: MegaMenu): string {
  const chapters = menu.links.map((l) => l.ch).filter(Boolean) as string[]
  const count = `${String(menu.links.length).padStart(2, '0')} ENTRIES`
  if (chapters.length === 0) return count
  const nums = chapters.map((c) => c.replace('CH. ', ''))
  const span = nums.length === 1 ? `CH. ${nums[0]}` : `CH. ${nums[0]}–${nums[nums.length - 1]}`
  return `${span} · ${count}`
}
