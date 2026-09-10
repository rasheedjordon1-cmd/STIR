/**
 * ORIGIN — provenance, not branding theater.
 *
 * ⚠ INTEGRITY RULE: every field below is optional and renders as an empty
 *   record line when null. NEVER fill one in with a guess. An unset field
 *   reads as "awaiting entry" in the field-record idiom, which is honest.
 *   A guessed field is a false sourcing claim.
 */

import { photo } from './photography'

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

  body: [
    'Cacao is a crop before it is a product. It grows on a tree, inside a pod, on a farm, tended by a person with a name.',
    'We are filling in this record as we go, and we will publish it here as it is confirmed. Nothing on this page is a guess.',
  ],

  /* Real photographs from the trees. Captions describe what is shown, never
     where — the region and producer above are still unconfirmed. */
  plates: [
    {
      plate: 'PL. 04',
      caption: 'Pod on the branch',
      src: photo('originPodBranch'),
      alt: 'Two hands holding a ripening cacao pod hanging from a branch.',
    },
    {
      plate: 'PL. 05',
      caption: 'At the trees',
      src: photo('originAtTheTrees'),
      alt: 'Nicolas standing beneath a cacao tree, looking up at the pods.',
    },
    {
      plate: 'PL. 06',
      caption: 'Two pods, backlit',
      src: photo('originTwoPods'),
      alt: 'A hand reaching for two cacao pods on the trunk, lit from behind.',
    },
  ],
}
