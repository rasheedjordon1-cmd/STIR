import type { DeliveryZone } from '@/types';

/* ==========================================================================
   SPICEMART — serviceability
   Mock delivery zones covering Grenada, Carriacou and Petite Martinique.
   Windows, fees and statuses are prototype assumptions: replace wholesale
   once routing and driver coverage are confirmed. Nothing else in the app
   hardcodes a delivery promise.
   ========================================================================== */

const xcd = (amount: number) => ({ amount, currency: 'XCD' as const });

export const DELIVERY_ZONES: DeliveryZone[] = [
  /* ---- St. George --------------------------------------------------------- */
  {
    id: 'sg-town',
    parish: "St. George",
    area: "St. George's",
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Today, 4–7pm',
    deliveryFee: xcd(800),
    freeDeliveryThreshold: xcd(15000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
  },
  {
    id: 'sg-grand-anse',
    parish: 'St. George',
    area: 'Grand Anse',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Today, 5–8pm',
    deliveryFee: xcd(800),
    freeDeliveryThreshold: xcd(15000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
  },
  {
    id: 'sg-morne-rouge',
    parish: 'St. George',
    area: 'Morne Rouge',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Today, 5–8pm',
    deliveryFee: xcd(1000),
    freeDeliveryThreshold: xcd(15000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
  },
  {
    id: 'sg-true-blue',
    parish: 'St. George',
    area: 'True Blue & Calliste',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Today, 5–8pm',
    deliveryFee: xcd(1000),
    freeDeliveryThreshold: xcd(15000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
  },
  {
    id: 'sg-woburn',
    parish: 'St. George',
    area: 'Woburn & Lower Woburn',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Tomorrow, 9am–12pm',
    deliveryFee: xcd(1200),
    freeDeliveryThreshold: xcd(18000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
    note: 'Same-day delivery is not offered here yet. Orders placed before 6pm go out the next morning.',
  },
  {
    id: 'sg-st-pauls',
    parish: 'St. George',
    area: "St. Paul's & Springs",
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Today, 4–7pm',
    deliveryFee: xcd(1000),
    freeDeliveryThreshold: xcd(15000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
  },

  /* ---- St. John ----------------------------------------------------------- */
  {
    id: 'sj-gouyave',
    parish: 'St. John',
    area: 'Gouyave',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Tomorrow, 1–5pm',
    deliveryFee: xcd(1500),
    freeDeliveryThreshold: xcd(20000),
    pickupAvailable: true,
    pickupPoint: 'Gouyave Collection Point — Depradine Street',
    note: 'West coast route runs Tuesday, Thursday and Saturday.',
  },
  {
    id: 'sj-concord',
    parish: 'St. John',
    area: 'Concord & Grand Roy',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Tomorrow, 1–5pm',
    deliveryFee: xcd(1800),
    freeDeliveryThreshold: xcd(20000),
    pickupAvailable: true,
    pickupPoint: 'Gouyave Collection Point — Depradine Street',
  },

  /* ---- St. Mark ----------------------------------------------------------- */
  {
    id: 'sm-victoria',
    parish: 'St. Mark',
    area: 'Victoria',
    serviceStatus: 'pickup-only',
    deliveryWindow: null,
    deliveryFee: null,
    pickupAvailable: true,
    pickupPoint: 'Victoria Collection Point — Main Street',
    note: 'No driver route here yet. Order online and collect at the Victoria counter, or at a Spice Fair.',
  },

  /* ---- St. Patrick -------------------------------------------------------- */
  {
    id: 'sp-sauteurs',
    parish: 'St. Patrick',
    area: 'Sauteurs',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Saturday, 11am–3pm',
    deliveryFee: xcd(2000),
    freeDeliveryThreshold: xcd(25000),
    pickupAvailable: true,
    pickupPoint: 'Sauteurs Collection Point — Chapel Street',
    note: 'North route runs Saturdays only. Chilled and frozen items are not carried on this route.',
  },
  {
    id: 'sp-river-sallee',
    parish: 'St. Patrick',
    area: 'River Sallee & Levera',
    serviceStatus: 'not-serviced',
    deliveryWindow: null,
    deliveryFee: null,
    pickupAvailable: false,
    note: 'Not on a route yet. Nearest collection point is Sauteurs, about 15 minutes away.',
  },

  /* ---- St. Andrew --------------------------------------------------------- */
  {
    id: 'sa-grenville',
    parish: 'St. Andrew',
    area: 'Grenville',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Tomorrow, 10am–2pm',
    deliveryFee: xcd(1500),
    freeDeliveryThreshold: xcd(20000),
    pickupAvailable: true,
    pickupPoint: 'Grenville Collection Point — Victoria Street',
  },
  {
    id: 'sa-paradise',
    parish: 'St. Andrew',
    area: 'Paradise & Soubise',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Tomorrow, 10am–2pm',
    deliveryFee: xcd(1800),
    freeDeliveryThreshold: xcd(20000),
    pickupAvailable: true,
    pickupPoint: 'Grenville Collection Point — Victoria Street',
  },
  {
    id: 'sa-tivoli',
    parish: 'St. Andrew',
    area: 'Tivoli & La Poterie',
    serviceStatus: 'pickup-only',
    deliveryWindow: null,
    deliveryFee: null,
    pickupAvailable: true,
    pickupPoint: 'Grenville Collection Point — Victoria Street',
    note: 'Collect in Grenville, about 10 minutes away. Delivery here is under assessment.',
  },

  /* ---- St. David ---------------------------------------------------------- */
  {
    id: 'sd-westerhall',
    parish: 'St. David',
    area: 'Westerhall & Perdmontemps',
    serviceStatus: 'delivery-available',
    deliveryWindow: 'Tomorrow, 9am–1pm',
    deliveryFee: xcd(1200),
    freeDeliveryThreshold: xcd(18000),
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
  },
  {
    id: 'sd-la-sagesse',
    parish: 'St. David',
    area: 'La Sagesse & Crochu',
    serviceStatus: 'pickup-only',
    deliveryWindow: null,
    deliveryFee: null,
    pickupAvailable: true,
    pickupPoint: 'Spicemart Counter — Frequente, St. George',
    note: 'Delivery to this area is planned but not running. Collection is available today.',
  },

  /* ---- Carriacou & Petite Martinique -------------------------------------- */
  {
    id: 'ca-hillsborough',
    parish: 'Carriacou',
    area: 'Hillsborough',
    serviceStatus: 'not-serviced',
    deliveryWindow: null,
    deliveryFee: null,
    pickupAvailable: false,
    note: 'Inter-island freight is being assessed. Nothing is scheduled to Carriacou yet.',
  },
  {
    id: 'pm-petite-martinique',
    parish: 'Petite Martinique',
    area: 'Petite Martinique',
    serviceStatus: 'not-serviced',
    deliveryWindow: null,
    deliveryFee: null,
    pickupAvailable: false,
    note: 'Inter-island freight is being assessed. Nothing is scheduled to Petite Martinique yet.',
  },
];

export const DEFAULT_ZONE_ID = 'sg-town';

export const getZone = (id: string): DeliveryZone | undefined =>
  DELIVERY_ZONES.find((z) => z.id === id);

export const defaultZone = (): DeliveryZone =>
  getZone(DEFAULT_ZONE_ID) ?? DELIVERY_ZONES[0];

/** Grouped for the serviceability sheet. Parish order follows the island clockwise. */
const PARISH_ORDER = [
  'St. George',
  'St. John',
  'St. Mark',
  'St. Patrick',
  'St. Andrew',
  'St. David',
  'Carriacou',
  'Petite Martinique',
];

export const zonesByParish = (): { parish: string; zones: DeliveryZone[] }[] =>
  PARISH_ORDER.map((parish) => ({
    parish,
    zones: DELIVERY_ZONES.filter((z) => z.parish === parish),
  })).filter((g) => g.zones.length > 0);

export const SERVICE_COVERAGE = {
  parishes: PARISH_ORDER.length,
  deliveryZones: DELIVERY_ZONES.filter((z) => z.serviceStatus === 'delivery-available').length,
  pickupPoints: [
    ...new Set(DELIVERY_ZONES.filter((z) => z.pickupPoint).map((z) => z.pickupPoint)),
  ].length,
};
