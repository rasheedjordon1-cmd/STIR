import { CATEGORIES, getCategory } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import { searchProducts as runSearch, sortProducts } from '@/lib/search';
import type { Cart, CartLine, Product } from '@/types';
import type { CommerceAdapter, ProductQuery } from './types';

/* ==========================================================================
   Mock commerce adapter
   Serves the prototype catalogue from /data. Async on purpose: every call
   site is already written the way it will need to be written against a
   network API, so the Shopify swap touches this file only.
   ========================================================================== */

const carts = new Map<string, Cart>();

function applyQuery(products: Product[], query: ProductQuery = {}): Product[] {
  let out = products;

  if (query.ids?.length) {
    const order = new Map(query.ids.map((id, i) => [id, i]));
    out = out.filter((p) => order.has(p.id)).sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  }
  if (query.category) out = out.filter((p) => p.category === query.category);
  if (query.shelf === 'local') out = out.filter((p) => p.local);
  if (query.shelf === 'fresh') out = out.filter((p) => p.fresh);
  if (query.shelf === 'deals') out = out.filter((p) => p.compareAtPrice || p.multibuy);
  if (query.tags?.length) {
    out = out.filter((p) => query.tags!.some((t) => p.tags.includes(t)));
  }
  if (query.excludeHandles?.length) {
    out = out.filter((p) => !query.excludeHandles!.includes(p.handle));
  }
  if (query.sort && !query.ids) out = sortProducts(out, query.sort);
  if (query.limit) out = out.slice(0, query.limit);
  return out;
}

let cartSeq = 0;
const newLineId = () => `line-${Date.now().toString(36)}-${(cartSeq += 1).toString(36)}`;

function persist(cart: Cart): Cart {
  carts.set(cart.id, cart);
  return cart;
}

export const mockCommerce: CommerceAdapter = {
  name: 'mock',
  checkoutConnected: false,

  async getProducts(query) {
    return applyQuery(PRODUCTS, query);
  },

  async getProduct(handle) {
    return PRODUCTS.find((p) => p.handle === handle) ?? null;
  },

  async getCollections() {
    return CATEGORIES;
  },

  async getCollection(handle) {
    return getCategory(handle) ?? null;
  },

  async searchProducts(query, options) {
    const matches = runSearch(PRODUCTS, query);
    // Relevance order is the search's own; other sorts override it.
    const sorted = options?.sort && options.sort !== 'relevance' ? sortProducts(matches, options.sort) : matches;
    return applyQuery(sorted, { ...options, sort: undefined });
  },

  async createCart() {
    const cart: Cart = { id: `mock-cart-${Date.now().toString(36)}`, lines: [], checkoutUrl: null };
    return persist(cart);
  },

  async addCartLines(cart, lines) {
    const next: CartLine[] = [...cart.lines];
    for (const line of lines) {
      const existing = next.find((l) => l.productId === line.productId);
      if (existing) existing.quantity += line.quantity;
      else next.push({ id: newLineId(), ...line });
    }
    return persist({ ...cart, lines: next });
  },

  async updateCartLines(cart, updates) {
    const next = cart.lines
      .map((line) => {
        const update = updates.find((u) => u.id === line.id);
        return update ? { ...line, quantity: update.quantity } : line;
      })
      .filter((line) => line.quantity > 0);
    return persist({ ...cart, lines: next });
  },

  async removeCartLines(cart, lineIds) {
    return persist({ ...cart, lines: cart.lines.filter((l) => !lineIds.includes(l.id)) });
  },

  async getCart(cartId) {
    return carts.get(cartId) ?? null;
  },

  /**
   * Deliberately null. A prototype must not imply that a real, payable
   * checkout exists — the cart renders the "checkout not connected" state.
   */
  async getCheckoutUrl() {
    return null;
  },
};
