import { CATEGORIES } from '@/data/categories';
import type { Product, SortKey } from '@/types';

/* ==========================================================================
   Search + sort
   A small weighted matcher over title, vendor, category and tags. It runs in
   memory over the mock catalogue; the Shopify adapter will hand the same
   query to the Storefront API's `search` connection instead.
   ========================================================================== */

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const categoryTitle = (handle: string) =>
  CATEGORIES.find((c) => c.handle === handle)?.title ?? handle;

interface Scored {
  product: Product;
  score: number;
}

function scoreProduct(product: Product, terms: string[]): number {
  const title = product.title.toLowerCase();
  const vendor = product.vendor.toLowerCase();
  const category = categoryTitle(product.category).toLowerCase();
  const tags = product.tags.map((t) => t.toLowerCase());
  let score = 0;

  for (const term of terms) {
    let termScore = 0;
    if (title === term) termScore += 120;
    else if (title.startsWith(term)) termScore += 80;
    else if (title.includes(term)) termScore += 55;

    if (vendor.includes(term)) termScore += 30;
    if (category.includes(term)) termScore += 25;
    if (tags.some((t) => t === term)) termScore += 35;
    else if (tags.some((t) => t.includes(term))) termScore += 18;
    if (product.unit.toLowerCase().includes(term)) termScore += 6;

    // Every term must contribute something, otherwise it is not a match.
    if (termScore === 0) return 0;
    score += termScore;
  }

  // Gentle merchandising nudges, never enough to outrank a real text match.
  if (product.local) score += 6;
  if (product.inventoryStatus === 'out-of-stock') score -= 40;
  return score;
}

export function searchProducts(products: Product[], query: string): Product[] {
  const terms = normalise(query);
  if (terms.length === 0) return [];
  const scored: Scored[] = [];
  for (const product of products) {
    const score = scoreProduct(product, terms);
    if (score > 0) scored.push({ product, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title)).map((s) => s.product);
}

/** Query suggestions for the search field — categories and tags people type. */
export function suggest(products: Product[], query: string, limit = 6): string[] {
  const terms = normalise(query);
  if (terms.length === 0) return [];
  const pool = new Set<string>();
  for (const product of products) {
    if (scoreProduct(product, terms) > 0) {
      pool.add(product.title);
      if (pool.size > 40) break;
    }
  }
  return [...pool].slice(0, limit);
}

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Most relevant' },
  { key: 'local-first', label: 'Local first' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'title-asc', label: 'Name: A–Z' },
];

export function sortProducts(products: Product[], key: SortKey): Product[] {
  const out = [...products];
  switch (key) {
    case 'price-asc':
      return out.sort((a, b) => a.price.amount - b.price.amount);
    case 'price-desc':
      return out.sort((a, b) => b.price.amount - a.price.amount);
    case 'title-asc':
      return out.sort((a, b) => a.title.localeCompare(b.title));
    case 'local-first':
      return out.sort((a, b) => Number(b.local) - Number(a.local) || a.title.localeCompare(b.title));
    default:
      return out;
  }
}
