import type { Cart, CartLine, Category, Product } from '@/types';
import type { CommerceAdapter, ProductQuery } from './types';

/* ==========================================================================
   Shopify Storefront adapter — PLACEHOLDER
   ==========================================================================

   This file is where every Shopify call will live. Nothing outside it should
   ever import a Shopify type, know about GIDs, or build a GraphQL document.

   Required environment variables (see .env.example):

     SHOPIFY_STORE_DOMAIN            your-store.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN public Storefront API token
     SHOPIFY_API_VERSION             e.g. 2025-07

   The Storefront token is public by design but is still read server-side only:
   these names are not prefixed NEXT_PUBLIC_, so they are never bundled into the
   client. Product and collection reads run in server components; cart mutations
   run through route handlers or server actions that call this adapter.

   Mapping notes for whoever wires this up:

   - Money      Storefront returns decimal strings ("32.95"). Convert to minor
                units on the way in: Math.round(parseFloat(amount) * 100).
   - unit /     Shopify has no first-class unit field. Use a `unit` metafield,
     unitPrice  or variant.unitPrice when Shopify's own unit pricing is enabled.
   - local /    Product tags ("local", "fresh") or metafields. Keep the mapping
     fresh      in this file so the shelf logic in the UI never changes.
   - fulfilment Model as a product metafield listing eligible methods. Cold
     methods    chain items must exclude 'spice-fair-pickup'.
   - inventory  availableForSale + quantityAvailable behind
     status     `@inContext`; map <= 5 to 'low-stock'.
   - images     Replace the generated ProductArt motifs with image.url +
                image.altText once real photography exists.
   - cart       cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove.
                Persist cart.id in a cookie. cart.checkoutUrl is returned by
                the API and is what getCheckoutUrl must return.
   - context    Use @inContext(country: GD, language: EN) so prices come back
                in XCD via Shopify Markets.

   Content that does NOT belong in the product catalogue:
   - Spice Fair events, venues and vendor line-ups → Shopify metaobjects or an
     external CMS. See data/events.ts, which is already isolated behind
     functions for exactly this reason.
   - Delivery zones, windows and fees → operational config, not Shopify. See
     data/zones.ts. At launch this should come from the delivery/routing
     system of record so a window is never wrong.
   ========================================================================== */

const NOT_IMPLEMENTED = (method: string) =>
  new Error(
    `ShopifyCommerce.${method} is not implemented. The prototype runs on the mock adapter; ` +
      'set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN and implement this file to connect.',
  );

export function createShopifyCommerce(config: {
  domain: string;
  token: string;
  apiVersion: string;
}): CommerceAdapter {
  void config;

  return {
    name: 'shopify',
    checkoutConnected: true,

    async getProducts(_query?: ProductQuery): Promise<Product[]> {
      throw NOT_IMPLEMENTED('getProducts');
    },
    async getProduct(_handle: string): Promise<Product | null> {
      throw NOT_IMPLEMENTED('getProduct');
    },
    async getCollections(): Promise<Category[]> {
      throw NOT_IMPLEMENTED('getCollections');
    },
    async getCollection(_handle: string): Promise<Category | null> {
      throw NOT_IMPLEMENTED('getCollection');
    },
    async searchProducts(_query: string): Promise<Product[]> {
      throw NOT_IMPLEMENTED('searchProducts');
    },
    async createCart(): Promise<Cart> {
      throw NOT_IMPLEMENTED('createCart');
    },
    async addCartLines(_cart: Cart, _lines: Omit<CartLine, 'id'>[]): Promise<Cart> {
      throw NOT_IMPLEMENTED('addCartLines');
    },
    async updateCartLines(_cart: Cart, _lines: Pick<CartLine, 'id' | 'quantity'>[]): Promise<Cart> {
      throw NOT_IMPLEMENTED('updateCartLines');
    },
    async removeCartLines(_cart: Cart, _lineIds: string[]): Promise<Cart> {
      throw NOT_IMPLEMENTED('removeCartLines');
    },
    async getCart(_cartId: string): Promise<Cart | null> {
      throw NOT_IMPLEMENTED('getCart');
    },
    async getCheckoutUrl(_cart: Cart): Promise<string | null> {
      throw NOT_IMPLEMENTED('getCheckoutUrl');
    },
  };
}
