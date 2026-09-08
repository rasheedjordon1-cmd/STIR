/**
 * ORIGIN — provenance, not branding theater.
 *
 * ⚠ INTEGRITY RULE: every field below is optional and renders as an empty
 *   record line when null. NEVER fill one in with a guess. An unset field
 *   reads as "awaiting entry" in the field-record idiom, which is honest.
 *   A guessed field is a false sourcing claim.
 */

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

  plates: [
    { plate: 'PL. 09', caption: 'Origin — photograph pending', src: null, alt: '' },
    { plate: 'PL. 10', caption: 'Origin — photograph pending', src: null, alt: '' },
  ],
}
