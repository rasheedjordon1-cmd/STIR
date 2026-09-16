import { mockCommerce } from './mock';
import { createShopifyCommerce } from './shopify';
import type { CommerceAdapter } from './types';

/* ==========================================================================
   Adapter selection
   The prototype must run with no credentials at all, so the mock is the
   default and Shopify is opt-in via environment. Import the `commerce`
   binding everywhere; never import an adapter module directly.
   ========================================================================== */

function selectAdapter(): CommerceAdapter {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? '2025-07';

  if (domain && token) return createShopifyCommerce({ domain, token, apiVersion });
  return mockCommerce;
}

export const commerce: CommerceAdapter = selectAdapter();

export type { CommerceAdapter, ProductQuery } from './types';
