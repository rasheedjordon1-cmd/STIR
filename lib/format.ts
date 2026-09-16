import type { Money } from '@/types';

/* ==========================================================================
   Formatting
   Money is stored in EC cents and only ever formatted here. Dates are
   formatted in UTC so a server render and a client render always agree.
   ========================================================================== */

const decimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** EC$32.95 — the currency is written the way it is written in Grenada. */
export function formatMoney(money: Money | null | undefined): string {
  if (!money) return '—';
  return `EC$${decimal.format(money.amount / 100)}`;
}

/** Whole dollars where the cents are always .00, e.g. thresholds. */
export function formatMoneyShort(money: Money | null | undefined): string {
  if (!money) return '—';
  const whole = money.amount / 100;
  return Number.isInteger(whole) ? `EC$${whole.toLocaleString('en-US')}` : formatMoney(money);
}

export function formatUnitPrice(unitPrice?: Money & { per: string }): string | null {
  if (!unitPrice) return null;
  return `${formatMoney(unitPrice)} / ${unitPrice.per}`;
}

export function addMoney(a: Money, b: Money | null): Money {
  return { amount: a.amount + (b?.amount ?? 0), currency: a.currency };
}

export function multiplyMoney(a: Money, factor: number): Money {
  return { amount: Math.round(a.amount * factor), currency: a.currency };
}

export function savingsPercent(price: Money, compareAt?: Money): number | null {
  if (!compareAt || compareAt.amount <= price.amount) return null;
  return Math.round(((compareAt.amount - price.amount) / compareAt.amount) * 100);
}

export function savingsAmount(price: Money, compareAt?: Money): Money | null {
  if (!compareAt || compareAt.amount <= price.amount) return null;
  return { amount: compareAt.amount - price.amount, currency: price.currency };
}

/* ---- Dates --------------------------------------------------------------- */

const dateFmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts });

/** "Sat 4 October" */
export const formatEventDate = (iso: string) =>
  dateFmt({ weekday: 'short', day: 'numeric', month: 'long' }).format(new Date(`${iso}T12:00:00Z`));

/** "4 Oct 2025" */
export const formatShortDate = (iso: string) =>
  dateFmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${iso}T12:00:00Z`));

/** "October" */
export const formatMonth = (iso: string) =>
  dateFmt({ month: 'long' }).format(new Date(`${iso}T12:00:00Z`));

/** "10am–6pm" from 24h strings. */
export function formatTimeRange(start: string, end: string): string {
  const one = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return m ? `${hour}.${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
  };
  return `${one(start)}–${one(end)}`;
}

/**
 * Whole days between today and an event date, both floored to UTC midnight so
 * the answer does not change between a server render and a client render.
 */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const target = Date.parse(`${iso}T00:00:00Z`);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((target - today) / 86_400_000);
}

/** "Today", "Tomorrow", "In 9 days", "3 weeks ago" */
export function relativeDay(iso: string, now: Date = new Date()): string {
  const days = daysUntil(iso, now);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1 && days < 14) return `In ${days} days`;
  if (days >= 14) return `In ${Math.round(days / 7)} weeks`;
  if (days > -14) return `${Math.abs(days)} days ago`;
  return `${Math.round(Math.abs(days) / 7)} weeks ago`;
}

export const pluralise = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;
