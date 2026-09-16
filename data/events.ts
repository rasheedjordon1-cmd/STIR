import { FULFILLMENT, SPICE_FAIR } from './config';
import type { SpiceFairEvent } from '@/types';

/* ==========================================================================
   THE SPICE FAIR — schedule
   The fair runs on the 1st and 3rd Saturday of every month, so the schedule is
   generated from that rule rather than stored as a list of dates. The
   prototype therefore never shows a stale "next event".

   At integration this module is the seam: swap the generator for a Shopify
   metaobject or CMS feed and everything downstream keeps working.

   Collection is NOT offered at every edition. Only venues with a chilled van
   bay can stage online orders — see VENUES[].pickupEnabled.
   ========================================================================== */

const VENUES = [
  {
    venue: 'Spicemart Yard, Frequente',
    area: 'Frequente Industrial Park',
    parish: 'St. George',
    pickupEnabled: true,
    description:
      'The home edition. Sixty stalls across the yard, the collection tent at the gate, and the kitchen row along the back fence.',
  },
  {
    venue: 'Grenville Market Square',
    area: 'Grenville',
    parish: 'St. Andrew',
    pickupEnabled: true,
    description:
      'The east coast edition, held in the square on market day so the fair runs straight on from the morning market.',
  },
  {
    venue: "Gouyave Fisherman's Wharf",
    area: 'Gouyave',
    parish: 'St. John',
    pickupEnabled: false,
    description:
      'The west coast edition on the wharf, built around the fishing fleet, the fish fry and the spice stalls.',
  },
  {
    venue: 'Sauteurs Playing Field',
    area: 'Sauteurs',
    parish: 'St. Patrick',
    pickupEnabled: false,
    description:
      'The north edition on the playing field, with the growers’ tables at the front and the school steel orchestra at four.',
  },
] as const;

const PROGRAMMING = [
  { icon: 'MarketStall', title: 'Vendor row', detail: 'Forty to sixty stalls: growers, makers, preserves, craft and home.' },
  { icon: 'Food', title: 'Kitchen row', detail: 'Oil down, roti, bakes and fry fish cooked on site from 11am.' },
  { icon: 'Celebration', title: 'Afternoon programme', detail: 'Steel pan, school groups and a DJ set from 3pm. Free entry.' },
  { icon: 'Community', title: 'Family corner', detail: 'Shaded seating, a plant stall and a corner for children.' },
] as const;

/** Rotating vendor line-up, keyed off the edition number so it is deterministic. */
const VENDOR_POOL = [
  'v-concord-spice',
  'v-sagesse-farm',
  'v-gouyave-catch',
  'v-victoria-cocoa',
  'v-sauteurs-bakehouse',
  'v-levera-honey',
  'v-petite-anse-preserves',
  'v-woburn-coconut',
  'v-grand-etang-roasters',
  'v-carriacou-salt',
  'v-mt-moritz',
  'v-true-blue-juice',
  'v-belle-isle-soap',
  'v-marquis-craft',
  'v-river-antoine-kitchen',
  'v-morne-fendue-plants',
];

/* ---- date helpers (UTC only, so server and client agree) ----------------- */

const DAY_MS = 86_400_000;

/** The nth given weekday of a month, as a UTC date. */
function nthWeekday(year: number, month: number, weekday: number, nth: number): Date {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month, 1 + offset + (nth - 1) * 7));
}

function fairDatesInMonth(year: number, month: number): Date[] {
  return SPICE_FAIR.saturdaysOfMonth
    .map((n) => nthWeekday(year, month, SPICE_FAIR.weekdayIndex, n))
    .filter((d) => d.getUTCMonth() === month);
}

/** Edition 1 is the first fair on or after this anchor. */
const ANCHOR = Date.UTC(2024, 0, 1);

function editionNumber(date: Date): number {
  let count = 0;
  const anchor = new Date(ANCHOR);
  const cursor = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
  while (cursor.getTime() <= date.getTime()) {
    for (const d of fairDatesInMonth(cursor.getUTCFullYear(), cursor.getUTCMonth())) {
      if (d.getTime() >= ANCHOR && d.getTime() <= date.getTime()) count += 1;
    }
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return count;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

function buildEvent(date: Date, now: Date): SpiceFairEvent {
  const edition = editionNumber(date);
  const venue = VENUES[(edition - 1) % VENUES.length];
  const start = new Date(`${iso(date)}T${SPICE_FAIR.startTime}:00-04:00`);
  const cutoff = new Date(start.getTime() - FULFILLMENT.spiceFairCutoffHours * 3_600_000);

  const isPast = date.getTime() + DAY_MS < now.getTime();
  const collecting = venue.pickupEnabled && !isPast && now.getTime() < cutoff.getTime();

  // Twelve vendors per edition, rotated so the line-up changes between fairs.
  const vendorIds = Array.from({ length: 12 }, (_, i) => VENDOR_POOL[(edition * 3 + i) % VENDOR_POOL.length]);

  return {
    id: `sf-${iso(date)}`,
    title: `The Spice Fair — ${venue.area}`,
    date: iso(date),
    startTime: SPICE_FAIR.startTime,
    endTime: SPICE_FAIR.endTime,
    venue: venue.venue,
    area: venue.area,
    parish: venue.parish,
    description: venue.description,
    vendorIds: [...new Set(vendorIds)],
    programming: [...PROGRAMMING],
    pickupEnabled: venue.pickupEnabled,
    pickupCutoff: venue.pickupEnabled ? cutoff.toISOString() : undefined,
    status: isPast ? 'past' : collecting ? 'on-sale' : 'scheduled',
    edition,
  };
}

/** Every generated edition inside [from, to]. */
function generate(from: Date, to: Date, now: Date): SpiceFairEvent[] {
  const out: SpiceFairEvent[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  while (cursor.getTime() <= to.getTime()) {
    for (const d of fairDatesInMonth(cursor.getUTCFullYear(), cursor.getUTCMonth())) {
      if (d.getTime() >= from.getTime() && d.getTime() <= to.getTime()) out.push(buildEvent(d, now));
    }
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Upcoming editions, limited to the published horizon. Anything beyond that is
 * deliberately absent so the interface can say the schedule is not published yet
 * rather than inventing a date.
 */
export function getUpcomingEvents(now: Date = new Date(), limit = 6): SpiceFairEvent[] {
  const from = new Date(now.getTime() - DAY_MS); // a fair running today is still upcoming
  const to = new Date(now.getTime() + SPICE_FAIR.publishedHorizonDays * DAY_MS);
  return generate(from, to, now).slice(0, limit);
}

export function getNextEvent(now: Date = new Date()): SpiceFairEvent | null {
  return getUpcomingEvents(now, 1)[0] ?? null;
}

export function getPastEvents(now: Date = new Date(), limit = 4): SpiceFairEvent[] {
  const from = new Date(now.getTime() - 150 * DAY_MS);
  const to = new Date(now.getTime() - DAY_MS);
  return generate(from, to, now).reverse().slice(0, limit);
}

export function getEvent(id: string, now: Date = new Date()): SpiceFairEvent | null {
  const date = id.replace(/^sf-/, '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  // Only real fair dates resolve — an arbitrary date must 404, not render.
  const valid = fairDatesInMonth(d.getUTCFullYear(), d.getUTCMonth()).some((x) => iso(x) === date);
  return valid ? buildEvent(d, now) : null;
}

/**
 * The single source of truth for whether a basket can be routed to a fair.
 * Returns the event only when collection is genuinely open.
 */
export function getCollectableEvent(now: Date = new Date()): SpiceFairEvent | null {
  const upcoming = getUpcomingEvents(now, 4);
  return upcoming.find((e) => e.status === 'on-sale' && e.pickupEnabled) ?? null;
}

export const SPICE_FAIR_FAQ = [
  {
    q: 'Do I need a ticket?',
    a: 'No. Entry is free and open to everyone. Bring a bag.',
  },
  {
    q: 'Can I collect a Spicemart order at the fair?',
    a: 'At editions with a collection tent, yes. Choose Spice Fair pickup at checkout — the option only appears when an eligible fair is open for collection, and it closes 36 hours before doors so the picking team can stage your order.',
  },
  {
    q: 'Which editions have a collection tent?',
    a: 'The Frequente and Grenville editions. Gouyave and Sauteurs are market-only for now because those sites have no chilled van bay.',
  },
  {
    q: 'Can I pay a vendor directly?',
    a: 'Yes. Vendors trade for themselves at the fair and set their own prices. Spicemart does not take a cut of stall sales.',
  },
  {
    q: 'What happens if it rains?',
    a: 'The fair runs. Vendor row is covered. If a site has to close for weather we post it here and message anyone with an order routed to that edition.',
  },
  {
    q: 'How do I become a vendor?',
    a: 'Register interest below. Stall allocation runs about three weeks ahead of each edition and priority goes to Grenadian growers, makers and cooks.',
  },
];
