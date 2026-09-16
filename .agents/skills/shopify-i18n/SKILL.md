---
name: shopify-i18n
description: Configure Shopify Markets, store currency, duties and taxes. Use when setting a store's currency (for example XCD for an Eastern Caribbean store), deciding a multi-currency strategy, or setting up tax and duties. The translation architecture and localised URL-routing steps apply only to multi-language storefronts and can be skipped for a single-language store.
source: domocarroll/shopify-builds (.claude/skills/shopify-i18n.md)
note: Frontmatter added locally; upstream ships this file without it.
---

# Shopify I18n - Internationalization Setup

## Context

Use this skill when a project requires international selling: multiple currencies, languages,
markets, duties/taxes, or localized URLs. This covers Shopify Markets configuration, translation
architecture, tax setup, and URL routing strategies for both Theme and Hydrogen storefronts.

## Prerequisites

- A Shopify store on Advanced ($399/mo) or Plus ($2300+/mo) for full Markets features.
  Basic and Shopify plans support limited Markets.
- Requirements from [shopify-discovery] specifying target markets, languages, and currencies.
- Architecture decision from [shopify-architect] (Theme vs Headless affects implementation).

## Workflow

### Step 1: Shopify Markets Configuration

Configure markets in Shopify Admin -> Settings -> Markets, or via the Admin API:

**Market structure:**
- **Primary market**: Your home country/region. Always active.
- **International markets**: Additional countries/regions you sell to.
- **Market groups**: Bundle countries with similar pricing/settings.

```graphql
mutation CreateMarket {
  marketCreate(input: {
    name: "Europe"
    regions: [
      {countryCode: DE},
      {countryCode: FR},
      {countryCode: IT},
      {countryCode: ES},
      {countryCode: NL}
    ]
  }) {
    market { id name }
    userErrors { field message }
  }
}
```

**Market capabilities by plan:**

| Feature | Basic | Shopify | Advanced | Plus |
|---------|-------|---------|----------|------|
| Markets | 3 | 3 | 3 | 50 |
| Languages | 2 | 5 | 5 | 20 |
| Currency conversion | Auto | Auto | Auto | Auto |
| Fixed pricing | No | No | Yes | Yes |
| Duties & import taxes | No | No | Yes | Yes |
| Custom market domains | No | No | Yes | Yes |

### Step 2: Multi-Currency Strategy

**Dynamic (automatic) currency conversion:**
- Shopify converts prices using daily exchange rates.
- Rounding rules can be configured (e.g., end in .99).
- Simple to maintain but prices fluctuate.

**Fixed pricing per market (Advanced/Plus):**
- Set explicit prices per product per market.
- Stable prices, better for marketing and print materials.
- Requires manual price management or automation scripts.

```graphql
mutation SetMarketPrice {
  priceListFixedPricesAdd(priceListId: "gid://shopify/PriceList/123", prices: [
    {
      variantId: "gid://shopify/ProductVariant/456"
      price: { amount: "29.99", currencyCode: EUR }
      compareAtPrice: { amount: "39.99", currencyCode: EUR }
    }
  ]) {
    prices { variant { id } price { amount currencyCode } }
    userErrors { field message }
  }
}
```

**Currency display:**
- Use `Shopify.currency.active` in JS for client-side formatting.
- In Liquid: `{{ product.price | money }}` auto-formats to market currency.
- In Hydrogen: Use the `Money` component from `@shopify/hydrogen`.

### Step 3: Language Setup and Translation Architecture

**Add languages in Shopify Admin -> Settings -> Languages.**

Shopify supports up to 20 languages (plan-dependent). Translation sources:

**Source 1: Locale files (Theme translations)**

Theme-level translations live in `locales/` directory:

```json
// locales/en.default.json
{
  "general": {
    "cart": {
      "title": "Your Cart",
      "empty": "Your cart is empty",
      "checkout": "Check out"
    }
  },
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "sold_out": "Sold out"
    }
  }
}
```

```json
// locales/fr.json
{
  "general": {
    "cart": {
      "title": "Votre panier",
      "empty": "Votre panier est vide",
      "checkout": "Passer la commande"
    }
  },
  "products": {
    "product": {
      "add_to_cart": "Ajouter au panier",
      "sold_out": "En rupture de stock"
    }
  }
}
```

Access in Liquid: `{{ 'general.cart.title' | t }}`

**Source 2: Translations API (Content translations)**

Product titles, descriptions, metafields, and other content are translated
via the Translations API:

```graphql
mutation TranslateProduct {
  translationsRegister(
    resourceId: "gid://shopify/Product/123"
    translations: [
      {
        locale: "fr"
        key: "title"
        value: "T-shirt en coton biologique"
        translatableContentDigest: "abc123"
      },
      {
        locale: "fr"
        key: "body_html"
        value: "<p>T-shirt en coton biologique de haute qualite</p>"
        translatableContentDigest: "def456"
      }
    ]
  ) {
    translations { locale key value }
    userErrors { field message }
  }
}
```

**Translation workflow recommendation:**
1. Use a translation app (Shopify Translate & Adapt, Langify, Weglot) for merchant-managed translations.
2. Use the Translations API for programmatic/bulk translations.
3. Use locale files for theme UI strings only.

### Step 4: Duties and Taxes

**For international shipping with duties (Advanced/Plus):**

1. **HS Codes**: Assign Harmonized System codes to products for customs classification.
```graphql
mutation SetHSCode {
  productVariantUpdate(input: {
    id: "gid://shopify/ProductVariant/123"
    harmonizedSystemCode: "6109.10"
    countryOfOrigin: "PT"
  }) {
    productVariant { harmonizedSystemCode }
  }
}
```

2. **Country of Origin**: Set per product for duty calculation.

3. **Landed Cost**: Enable duties at checkout so customers pay upfront (DDP - Delivered Duty Paid)
   rather than being surprised at delivery (DDU - Delivered Duty Unpaid).

4. **Tax-inclusive vs Tax-exclusive display:**
   - EU/UK/AU: Prices typically include tax (VAT). Configure per market.
   - US/CA: Prices typically exclude tax. Tax calculated at checkout.
   - Configure in Settings -> Taxes and Duties -> per market.

**Tax registration:**
Register tax IDs for each country where you have tax obligations.
Shopify auto-calculates tax rates based on registration.

### Step 5: URL Routing Strategies

**Strategy 1: Subfolders (Recommended)**
- `store.com/en-us/products/shirt`
- `store.com/fr/products/shirt`
- Default for Shopify themes and Hydrogen.
- Best for SEO (single domain authority).

**Strategy 2: Subdomains**
- `us.store.com/products/shirt`
- `fr.store.com/products/shirt`
- Requires DNS configuration per market.
- Good for distinct market branding.

**Strategy 3: Country TLDs**
- `store.com/products/shirt`
- `store.fr/products/shirt`
- Requires separate domains per market.
- Strongest local SEO signal but highest maintenance.

**Theme implementation:**
Shopify auto-handles subfolder routing for themes. Use the `Shopify.locale` JS object
and `request.locale` Liquid object for locale detection.

```liquid
{% if request.locale.iso_code == 'fr' %}
  {%- comment -%} French-specific content {%- endcomment -%}
{% endif %}
```

**Hydrogen implementation:**
```bash
shopify hydrogen setup markets
```

This generates the i18n configuration. Implement in `server.ts`:

```typescript
function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const locale = pathParts[1]; // e.g., "fr-FR"

  // Map to Shopify locale
  return LOCALE_MAP[locale] || DEFAULT_LOCALE;
}
```

### Step 6: SEO for International

Ensure proper SEO signals for international pages:

- **hreflang tags**: Shopify auto-generates for themes. For Hydrogen, implement manually:
```html
<link rel="alternate" hreflang="en" href="https://store.com/en/products/shirt" />
<link rel="alternate" hreflang="fr" href="https://store.com/fr/products/shirt" />
<link rel="alternate" hreflang="x-default" href="https://store.com/products/shirt" />
```

- **Canonical URLs**: Point to the correct localized version.
- **Sitemap**: Include all localized URLs with hreflang annotations.
- **Translated meta titles and descriptions** via the Translations API.

### Step 7: Verification Checklist

- [ ] All target markets created and configured.
- [ ] Currency strategy implemented (dynamic or fixed).
- [ ] Languages added and translations complete (theme + content).
- [ ] HS codes assigned to all products (if duties enabled).
- [ ] Tax registrations entered for all required countries.
- [ ] URL routing working correctly with proper hreflang tags.
- [ ] Checkout displays correct currency and language.
- [ ] Shipping rates configured per market.
- [ ] Payment methods available per market (local payment methods).
- [ ] Test purchase completed in each major market.

## Reference

- Related skills: [shopify-discovery] (requirements), [shopify-theme] (Liquid i18n), [shopify-hydrogen] (headless i18n)
- Shopify Markets: https://shopify.dev/docs/apps/build/markets
- Translations API: https://shopify.dev/docs/api/admin-graphql/latest/mutations/translationsRegister
- Duties and taxes: https://help.shopify.com/en/manual/markets/duties-and-import-taxes
- Hydrogen i18n: https://shopify.dev/docs/storefronts/headless/hydrogen/markets
- MCP: `@shopify/dev-mcp` for API lookups
