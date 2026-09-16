import { getProductById } from './products';
import type { Money, Order, OrderLine } from '@/types';

/* ==========================================================================
   SPICEMART — prototype order history
   Dates are generated as offsets from today so the account never shows a
   "recent" order from last year. Line prices are read from the catalogue so
   the history cannot drift out of sync with the products it references.
   Replace entirely with Shopify customer orders at integration.
   ========================================================================== */

const DAY_MS = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString().slice(0, 10);

interface OrderSeed {
  ref: string;
  days: number;
  status: Order['status'];
  method: Order['fulfillmentMethod'];
  where: string;
  /** [productId, quantity] */
  lines: [string, number][];
  tracking?: { step: number; steps: string[]; eta: string };
}

const SEEDS: OrderSeed[] = [
  {
    ref: 'SM-24818',
    days: 1,
    status: 'out-for-delivery',
    method: 'delivery',
    where: 'Grand Anse, St. George',
    lines: [
      ['p-001', 1],
      ['p-008', 1],
      ['p-019', 2],
      ['p-030', 1],
      ['p-047', 2],
      ['p-060', 1],
    ],
    tracking: {
      step: 2,
      steps: ['Order placed', 'Packing', 'Out for delivery', 'Delivered'],
      eta: 'Arriving today, 5–8pm',
    },
  },
  {
    ref: 'SM-24755',
    days: 4,
    status: 'ready-for-pickup',
    method: 'pickup',
    where: 'Spicemart Counter — Frequente, St. George',
    lines: [
      ['p-053', 2],
      ['p-057', 1],
      ['p-064', 1],
    ],
    tracking: {
      step: 3,
      steps: ['Order placed', 'Packing', 'Ready for pickup', 'Collected'],
      eta: 'Hold until Friday, 6pm',
    },
  },
  {
    ref: 'SM-24702',
    days: 11,
    status: 'delivered',
    method: 'delivery',
    where: "St. George's, St. George",
    lines: [
      ['p-001', 1],
      ['p-002', 1],
      ['p-006', 4],
      ['p-009', 2],
      ['p-026', 1],
      ['p-029', 1],
      ['p-070', 1],
      ['p-047', 1],
    ],
  },
  {
    ref: 'SM-24588',
    days: 24,
    status: 'delivered',
    method: 'spice-fair-pickup',
    where: 'The Spice Fair — Spicemart Yard, Frequente',
    lines: [
      ['p-016', 1],
      ['p-018', 2],
      ['p-037', 3],
      ['p-054', 1],
      ['p-062', 1],
    ],
  },
  {
    ref: 'SM-24455',
    days: 39,
    status: 'delivered',
    method: 'delivery',
    where: 'Grand Anse, St. George',
    lines: [
      ['p-001', 1],
      ['p-008', 1],
      ['p-010', 3],
      ['p-027', 1],
      ['p-030', 1],
      ['p-048', 2],
      ['p-074', 1],
    ],
  },
];

const buildLines = (seed: OrderSeed): OrderLine[] =>
  seed.lines
    .map(([productId, quantity]) => {
      const product = getProductById(productId);
      return product ? { productId, quantity, price: product.price } : null;
    })
    .filter((l): l is OrderLine => l !== null);

const sum = (lines: OrderLine[]): Money => ({
  amount: lines.reduce((t, l) => t + l.price.amount * l.quantity, 0),
  currency: 'XCD',
});

export const ORDERS: Order[] = SEEDS.map((seed) => {
  const items = buildLines(seed);
  return {
    id: seed.ref,
    date: daysAgo(seed.days),
    status: seed.status,
    items,
    total: sum(items),
    fulfillmentMethod: seed.method,
    fulfillmentLocation: seed.where,
    tracking: seed.tracking,
  };
});

export const getOrder = (id: string): Order | undefined => ORDERS.find((o) => o.id === id);

/**
 * "Buy it again" is ranked by how often a product has been ordered, then by
 * how recently — the two signals that actually predict a repeat grocery basket.
 */
export function buyItAgainProductIds(limit = 12): string[] {
  const score = new Map<string, { count: number; recency: number }>();
  ORDERS.forEach((order, orderIndex) => {
    for (const line of order.items) {
      const existing = score.get(line.productId) ?? { count: 0, recency: Infinity };
      score.set(line.productId, {
        count: existing.count + 1,
        recency: Math.min(existing.recency, orderIndex),
      });
    }
  });
  return [...score.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].recency - b[1].recency)
    .slice(0, limit)
    .map(([id]) => id);
}

/** Recently viewed is a session behaviour; seeded here for the signed-in preview. */
export const RECENTLY_VIEWED_IDS = ['p-057', 'p-071', 'p-004', 'p-049', 'p-030', 'p-022'];

export const SHOPPING_LIST_IDS = ['p-001', 'p-006', 'p-030', 'p-060', 'p-008'];
