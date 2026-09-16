/* ==========================================================================
   SPICEMART — domain types
   These describe the shapes the interface renders. The mock adapter satisfies
   them from /data; a Shopify adapter will satisfy the same shapes from the
   Storefront API. Presentation components must never import a vendor SDK type.
   ========================================================================== */

export type CurrencyCode = 'XCD';

/** Money is kept in minor units (EC cents) so arithmetic never drifts. */
export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export type CategoryHandle =
  | 'groceries'
  | 'fresh-produce'
  | 'household'
  | 'personal-care'
  | 'drinks'
  | 'pantry'
  | 'frozen-chilled'
  | 'local'
  | 'deals';

export type FulfillmentMethod = 'delivery' | 'pickup' | 'spice-fair-pickup';

export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

/** Motif key for the generated packaging graphic. See components/commerce/ProductArt. */
export type ProductMotif =
  | 'bottle'
  | 'jar'
  | 'carton'
  | 'sack'
  | 'can'
  | 'box'
  | 'pouch'
  | 'tube'
  | 'bar'
  | 'loaf'
  | 'leaf'
  | 'root'
  | 'citrus'
  | 'bunch'
  | 'pod'
  | 'fish'
  | 'egg'
  | 'spray'
  | 'roll'
  | 'bulb';

export interface ProductImage {
  /** Generated prototype artwork. Swap for Shopify CDN URLs at integration. */
  motif: ProductMotif;
  /** Token name (not a hex value) so art stays inside the palette. */
  tint: 'leaf' | 'turmeric' | 'nutmeg' | 'teal' | 'cocoa' | 'signal';
  alt: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  details?: string;
  storage?: string;
  category: CategoryHandle;
  images: ProductImage[];
  price: Money;
  compareAtPrice?: Money;
  /** e.g. "500 g", "1 L", "pack of 6" */
  unit: string;
  /** Derived, comparable price. e.g. { amount: 1290, currency, per: 'kg' } */
  unitPrice?: Money & { per: string };
  inventoryStatus: InventoryStatus;
  tags: string[];
  local: boolean;
  fresh: boolean;
  fulfillmentMethods: FulfillmentMethod[];
  /** Multibuy mechanic shown on deal cards. */
  multibuy?: { quantity: number; price: Money; label: string };
}

export interface Category {
  handle: CategoryHandle;
  title: string;
  /** Icon component name in components/icons. */
  icon: string;
  blurb: string;
  accent: 'leaf' | 'turmeric' | 'nutmeg' | 'teal' | 'cocoa' | 'signal';
  /** Shown in navigation chrome. */
  inMainNav: boolean;
}

export type ServiceStatus =
  | 'delivery-available'
  | 'pickup-only'
  | 'not-serviced';

export interface DeliveryZone {
  id: string;
  parish: string;
  area: string;
  serviceStatus: ServiceStatus;
  /** Human window, e.g. "Today, 4–7pm". Null when delivery is not offered. */
  deliveryWindow: string | null;
  deliveryFee: Money | null;
  /** Order value at/above which delivery fee is waived. */
  freeDeliveryThreshold?: Money;
  pickupAvailable: boolean;
  /** Named counter for standard pickup. */
  pickupPoint?: string;
  /** Notes shown in the serviceability sheet — honest operational caveats. */
  note?: string;
}

/** The customer's chosen destination. Held in localStorage. */
export interface SavedLocation {
  zoneId: string;
  addressLine?: string;
  landmark?: string;
  phone?: string;
  instructions?: string;
}

export type EventStatus = 'scheduled' | 'on-sale' | 'past' | 'cancelled';

export interface SpiceFairEvent {
  id: string;
  title: string;
  /** ISO date, Atlantic Standard Time (UTC-4). */
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  area: string;
  parish: string;
  description: string;
  vendorIds: string[];
  programming: { icon: string; title: string; detail: string }[];
  pickupEnabled: boolean;
  /** Last moment an online order can be routed to this fair. ISO datetime. */
  pickupCutoff?: string;
  status: EventStatus;
  edition: number;
}

export interface Vendor {
  id: string;
  name: string;
  parish: string;
  category: string;
  blurb: string;
  /** Tint token for the vendor tile. */
  accent: 'leaf' | 'turmeric' | 'nutmeg' | 'teal' | 'cocoa' | 'signal';
  sellsOnline: boolean;
}

export type OrderStatus = 'delivered' | 'out-for-delivery' | 'packing' | 'ready-for-pickup' | 'cancelled';

export interface OrderLine {
  productId: string;
  quantity: number;
  /** Price paid at the time of the order, not today's price. */
  price: Money;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderLine[];
  total: Money;
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentLocation: string;
  /** Present while an order is in motion. */
  tracking?: { step: number; steps: string[]; eta: string };
}

export type RewardActivityKind = 'earned' | 'redeemed' | 'expiring' | 'bonus';

export interface RewardActivity {
  id: string;
  date: string;
  label: string;
  points: number;
  kind: RewardActivityKind;
}

export interface PossibleReward {
  id: string;
  title: string;
  detail: string;
  points: number;
  /** Prototype concepts are labelled as such in the interface. */
  status: 'concept' | 'confirmed';
}

export interface RewardsSummary {
  points: number;
  tierLabel: string;
  nextRewardAt: number;
  activity: RewardActivity[];
  possibleRewards: PossibleReward[];
}

/* ---- Cart ---------------------------------------------------------------- */

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  /** Populated by the adapter so presentation never joins data itself. */
  checkoutUrl: string | null;
}

export interface CartTotals {
  itemCount: number;
  subtotal: Money;
  deliveryFee: Money | null;
  deliveryFeeWaived: boolean;
  estimatedPoints: number;
  total: Money;
}

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'title-asc' | 'local-first';
