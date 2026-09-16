import type { Money } from '@/types';

/* ==========================================================================
   SPICEMART — platform configuration
   Every operational assumption the interface makes lives here so it can be
   corrected in one place once the business confirms real numbers.
   None of these values are contractual. See README "Assumptions".
   ========================================================================== */

export const BRAND = {
  name: 'Spicemart',
  wordmark: 'SPICEMART',
  proposition: "Grenada's homegrown commerce platform",
  position: 'The operating system for island commerce',
  promise: 'Everything Grenada',
  utilityLine: 'Built in Grenada. For Grenada.',
  country: 'Grenada',
  currencyLabel: 'EC$ · XCD',
} as const;

/** Flipping this to false is the single switch for prototype disclosure copy. */
export const IS_PROTOTYPE = true;

export const PROTOTYPE_NOTICE =
  'Prototype. Catalogue, prices, delivery windows and order history are sample data.';

/* ---- Fulfilment ---------------------------------------------------------- */

export const FULFILLMENT = {
  /** Zone fees can override this; it is the fallback used by the estimator. */
  defaultDeliveryFee: { amount: 1200, currency: 'XCD' } as Money,
  /** Free delivery threshold applied when a zone does not set its own. */
  defaultFreeDeliveryThreshold: { amount: 15000, currency: 'XCD' } as Money,
  /** Standard pickup counter used when a zone has no nearer one. */
  defaultPickupPoint: 'Spicemart Counter — Frequente, St. George',
  /** Minimum basket before checkout is offered. */
  minimumOrder: { amount: 3000, currency: 'XCD' } as Money,
  /**
   * Orders stop routing to a fair this many hours before doors open, so the
   * picking team can stage the collection tent.
   */
  spiceFairCutoffHours: 36,
} as const;

/* ---- Rewards ------------------------------------------------------------- */

export const REWARDS = {
  /** Concept only — economics are not signed off. Shown as "concept" in the UI. */
  pointsPerDollar: 1,
  /** Points required for the next reward tier in the prototype. */
  nextRewardAt: 2500,
  programName: 'Spicemart Rewards',
} as const;

/* ---- The Spice Fair ------------------------------------------------------ */

export const SPICE_FAIR = {
  name: 'The Spice Fair',
  rhythm: 'Twice a month',
  lines: ['Shop local.', 'Support local.', 'Celebrate local.'] as const,
  strapline: 'Shop online. Pick up. Celebrate together.',
  /**
   * Schedule rule rather than a hardcoded list, so the prototype never goes
   * stale: the fair runs on the 1st and 3rd Saturday of each month.
   * Replace with a CMS/metaobject feed at integration.
   */
  weekdayIndex: 6, // Saturday
  saturdaysOfMonth: [1, 3] as const,
  startTime: '10:00',
  endTime: '18:00',
  /** Editions are only "published" this far ahead; beyond that the UI says so. */
  publishedHorizonDays: 120,
} as const;

/* ---- Checkout ------------------------------------------------------------ */

export const CHECKOUT = {
  /**
   * The mock adapter returns null so the UI renders the honest
   * "checkout not connected" state instead of implying a real transaction.
   * The Shopify adapter returns cart.checkoutUrl from the Storefront API.
   */
  provider: 'shopify' as const,
  handoffLabel: 'Continue to secure checkout',
  unavailableReason:
    'Checkout is not connected in this prototype. At launch this hands off to Shopify’s hosted, PCI-compliant checkout.',
} as const;

/* ---- Trust strip --------------------------------------------------------- */

export const TRUST_POINTS = [
  {
    icon: 'DeliveryVan',
    title: 'Local delivery',
    detail: 'Run by Spicemart drivers in serviced parishes — not a third-party courier.',
  },
  {
    icon: 'Clock',
    title: 'Named delivery windows',
    detail: 'You see the window for your area before you add anything to the basket.',
  },
  {
    icon: 'SecurePayment',
    title: 'Secure Shopify checkout',
    detail: 'Payment is handled by Shopify’s hosted checkout. We never hold card details.',
  },
  {
    icon: 'FreshProduce',
    title: 'Fresh and local first',
    detail: 'Produce and maker goods are bought from Grenadian growers and small producers.',
  },
] as const;
