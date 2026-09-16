import type { Cart, CartLine, Category, Product, SortKey } from '@/types';

/* ==========================================================================
   Commerce service boundary
   Everything the interface knows about "where products come from" is this
   interface. Presentation components import from '@/lib/commerce' only —
   never from a vendor SDK, and never from /data directly.

   The mock implementation reads /data. The Shopify implementation will call
   the Storefront API. Swapping them changes no component.
   ========================================================================== */

export interface ProductQuery {
  category?: string;
  /** Merchandising shelves computed from product flags, not stored fields. */
  shelf?: 'local' | 'deals' | 'fresh';
  tags?: string[];
  sort?: SortKey;
  limit?: number;
  /** Exclude a product from its own "related" rail. */
  excludeHandles?: string[];
  ids?: string[];
}

export interface CommerceAdapter {
  readonly name: string;
  /** False when the adapter cannot reach a real checkout (the mock). */
  readonly checkoutConnected: boolean;

  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getCollections(): Promise<Category[]>;
  getCollection(handle: string): Promise<Category | null>;
  searchProducts(query: string, options?: ProductQuery): Promise<Product[]>;

  createCart(): Promise<Cart>;
  /**
   * Cart mutations take and return the whole cart. Shopify's API is keyed by
   * cart id, which is carried on the object, so this maps directly onto
   * cartLinesAdd / cartLinesUpdate / cartLinesRemove.
   */
  addCartLines(cart: Cart, lines: Omit<CartLine, 'id'>[]): Promise<Cart>;
  updateCartLines(cart: Cart, lines: Pick<CartLine, 'id' | 'quantity'>[]): Promise<Cart>;
  removeCartLines(cart: Cart, lineIds: string[]): Promise<Cart>;
  getCart(cartId: string): Promise<Cart | null>;
  /** Null means "no checkout available" — the UI must say so, not pretend. */
  getCheckoutUrl(cart: Cart): Promise<string | null>;
}
