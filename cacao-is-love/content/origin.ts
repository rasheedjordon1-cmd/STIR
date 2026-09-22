/**
 * ORIGIN — provenance, not branding theater.
 *
 * ⚠ INTEGRITY RULE: every field below is optional and renders as an empty
 *   record line when null. NEVER fill one in with a guess. An unset field
 *   reads as "awaiting entry" in the field-record idiom, which is honest.
 *   A guessed field is a false sourcing claim.
 */

import type { PhotoKey } from './photography'

export interface OriginRecord {
  label: string
  value: string | null
}

export const origin = {
  country: 'Colombia',

  /** Ordered as a field record. Nulls are intentional and safe to ship. */
  records: [
    { label: 'COUNTRY',   value: 'Colombia' },
    { label: 'REGION',    value: null },
    { label: 'PRODUCER',  value: null },
    { label: 'ELEVATION', value: null },
    { label: 'VARIETY',   value: null },
    { label: 'HARVEST',   value: null },
    { label: 'PROCESS',   value: null },
    { label: 'ARRIVAL',   value: null },
  ] satisfies OriginRecord[],

  headline: ['YOU SHOULD KNOW', 'WHERE YOUR CACAO', 'COMES FROM.'],

  subhead: 'Where the cacao begins.',

  body: [
    'Cacao is a crop before it is a product. It grows on a tree, inside a pod, on a farm, tended by a person with a name.',
    'We are filling in this record as we go, and we will publish it here as it is confirmed. Nothing on this page is a guess.',
  ],

  /* Real photographs from the trees. Captions name the subject and the COUNTRY
     only. Colombia is on the bag and is stated site-wide; the region and the
     producer above are still unconfirmed and must not appear here. */
  plates: [
    {
      plate: 'POD ON THE BRANCH',
      caption: 'Colombia',
      photo: 'originPodBranch' as PhotoKey,
    },
    {
      plate: 'AT THE TREES',
      caption: 'Colombia',
      photo: 'originAtTheTrees' as PhotoKey,
    },
    {
      plate: 'TWO PODS, BACKLIT',
      caption: 'Colombia',
      photo: 'originTwoPods' as PhotoKey,
    },
  ],
}
