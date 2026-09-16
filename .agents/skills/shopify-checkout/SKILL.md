---
name: shopify-checkout
description: Customise Shopify checkout with Functions and checkout UI extensions. Use when delivery or pickup rules cannot be expressed by native shipping profiles — route-day restrictions, per-product fulfilment eligibility, custom or temporary pickup locations — or when adding validation and fields to checkout. Covers Functions, UI extensions, web pixels and testing. Checkout branding requires Shopify Plus.
source: domocarroll/shopify-builds (.claude/skills/shopify-checkout.md)
note: Frontmatter added locally; upstream ships this file without it.
---

# Shopify Checkout - Checkout Customization Workflow

## Context

Use this skill when a project requires checkout customization: UI extensions for the checkout
page, Shopify Functions for custom business logic (discounts, validation, shipping, payment
customization), checkout branding, or web pixels for analytics. This covers the spectrum from
simple branding to complex logic.

## Prerequisites

- A Shopify app scaffold (from [shopify-app]) to host extensions and functions.
- Shopify CLI installed.
- For checkout branding: Shopify Plus plan required.
- For checkout UI extensions: Any plan (but Plus has more extensibility points).
- MCP server available: `@shopify/dev-mcp` for Checkout API and Functions API lookups.

## Workflow

### Step 1: Assess Checkout Requirements

Categorize the requirements into:

| Category | Examples | Technology |
|----------|----------|------------|
| Visual customization | Colors, fonts, logo, layout | Checkout Branding API (Plus) |
| UI additions | Trust badges, upsells, gift messages, delivery instructions | Checkout UI Extensions |
| Discount logic | BOGO, tiered discounts, bundle pricing, loyalty | Shopify Functions (Discounts) |
| Validation | Address validation, age verification, order limits | Shopify Functions (Validation) |
| Shipping rules | Custom rates, free shipping thresholds, delivery promises | Shopify Functions (Shipping) |
| Payment rules | Hide/reorder payment methods by cart contents or customer | Shopify Functions (Payment) |
| Cart transforms | Auto-add gifts, bundle expansion, line item modifications | Shopify Functions (Cart Transform) |
| Analytics | Conversion tracking, pixel firing, attribution | Web Pixel Extensions |

### Step 2: Checkout UI Extensions

Generate a checkout UI extension:
```bash
shopify app generate extension --template checkout_ui --name my-checkout-ext
```

**Technical constraints:**
- **Runtime**: Preact (React-like but lighter), running in a sandboxed iframe.
- **Bundle limit**: 64KB total (JS + CSS). Monitor with `shopify app build`.
- **No DOM access**: Use Checkout UI Components only (no custom HTML).
- **No external network**: Cannot fetch external APIs at render time.
- **Extension points**: `purchase.checkout.block.render`, `purchase.checkout.delivery-address.render-before`, etc.

**Extension structure:**
```typescript
// extensions/my-checkout-ext/src/Checkout.tsx
import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  useCartLines,
  useApplyCartLinesChange,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();

  return (
    <BlockStack spacing="loose">
      <Banner title="Free shipping on orders over $50!" status="info" />
      <Text>You have {cartLines.length} items in your cart.</Text>
    </BlockStack>
  );
}
```

**Available Checkout UI hooks:**
- `useCartLines()` - Current cart contents
- `useTotalAmount()` - Cart total
- `useShippingAddress()` - Shipping address
- `useBuyerJourney()` - Intercept checkout progression
- `useApplyCartLinesChange()` - Modify cart
- `useApplyMetafieldChange()` - Store custom data
- `useExtensionCapability()` - Check capabilities

Delegate checkout UI implementation to the `shopify-functions-dev` agent.

### Step 3: Shopify Functions

Generate a function extension:
```bash
# Discount function
shopify app generate extension --template discount --name my-discount

# Order validation
shopify app generate extension --template order_validation --name my-validation

# Payment customization
shopify app generate extension --template payment_customization --name my-payment

# Delivery customization
shopify app generate extension --template delivery_customization --name my-delivery

# Cart transform
shopify app generate extension --template cart_transform --name my-cart-transform
```

**Function architecture:**
1. Shopify sends an **input query** (GraphQL) with cart/checkout data.
2. Your function processes the input and returns a **function result** (JSON).
3. The function runs as **WebAssembly** in Shopify's runtime.

**JavaScript function example (discount):**
```javascript
// extensions/my-discount/src/run.js
export function run(input) {
  const targets = input.cart.lines
    .filter(line => line.quantity >= 3)
    .map(line => ({
      cartLine: {id: line.id},
    }));

  if (targets.length === 0) return {discounts: []};

  return {
    discounts: [{
      targets,
      value: {percentage: {value: "10.0"}},
      message: "10% off when you buy 3+",
    }],
  };
}
```

**Rust vs JavaScript trade-off:**

| Factor | JavaScript | Rust |
|--------|-----------|------|
| Bundle size | Larger (~200KB Wasm) | Smaller (~50KB Wasm) |
| Performance | Good for most cases | Better for complex logic |
| Instruction limit | 11M instructions | 11M instructions |
| Developer experience | Familiar, faster iteration | Steeper learning curve |
| Ecosystem | npm packages (limited) | Cargo crates (limited) |
| Recommendation | Default choice | Only if hitting limits |

**Function constraints:**
- **No network access**: All data must come via the input query.
- **No file system**: Pure computation only.
- **Instruction limit**: 11 million instructions per execution.
- **Input query**: Define exactly what data you need; minimize payload.
- **Deterministic**: Same input must produce same output.

### Step 4: Checkout Branding (Plus Only)

Use the Checkout Branding API to customize visual appearance:

```graphql
mutation checkoutBrandingUpsert($checkoutBrandingInput: CheckoutBrandingInput!, $checkoutProfileId: ID!) {
  checkoutBrandingUpsert(checkoutBrandingInput: $checkoutBrandingInput, checkoutProfileId: $checkoutProfileId) {
    checkoutBranding {
      customizations {
        headingLevel1 { typography { font size weight } }
        control { cornerRadius colorScheme }
        primaryButton { cornerRadius typography { font } }
      }
    }
  }
}
```

Branding covers: colors, typography, corner radius, spacing, header/footer, logo,
background images, form controls, buttons, and overall layout.

### Step 5: Web Pixels for Analytics

Generate a web pixel extension:
```bash
shopify app generate extension --template web_pixel --name my-pixel
```

**Web pixel structure:**
```javascript
// extensions/my-pixel/src/index.js
import {register} from "@shopify/web-pixels-extension";

register(({analytics, browser}) => {
  analytics.subscribe("page_viewed", (event) => {
    browser.sendBeacon("https://analytics.example.com/collect", {
      event: "page_view",
      url: event.context.document.location.href,
    });
  });

  analytics.subscribe("product_added_to_cart", (event) => {
    const {cartLine} = event.data;
    browser.sendBeacon("https://analytics.example.com/collect", {
      event: "add_to_cart",
      product_id: cartLine.merchandise.product.id,
    });
  });

  analytics.subscribe("checkout_completed", (event) => {
    const {checkout} = event.data;
    browser.sendBeacon("https://analytics.example.com/collect", {
      event: "purchase",
      order_total: checkout.totalPrice.amount,
    });
  });
});
```

**Web pixel constraints:**
- Sandboxed: No DOM access, limited browser APIs.
- Uses `browser.sendBeacon()` or `browser.fetch()` for outbound calls.
- Standard events: `page_viewed`, `product_viewed`, `product_added_to_cart`,
  `checkout_started`, `checkout_completed`, `collection_viewed`, `search_submitted`.

### Step 6: Scripts-to-Functions Migration

If migrating from legacy Shopify Scripts to Functions:

| Scripts Feature | Functions Equivalent |
|----------------|---------------------|
| Line item scripts | Cart Transform function |
| Shipping scripts | Delivery Customization function |
| Payment scripts | Payment Customization function |
| Script discounts | Discount function |

**Migration steps:**
1. Audit existing Scripts and document their logic.
2. Create equivalent Function extensions.
3. Test in parallel (Scripts + Functions) on a dev store.
4. Disable Scripts and activate Functions in production.
5. Remove Scripts after verification period.

### Step 7: Testing and Deployment

```bash
# Build and validate all extensions
shopify app build

# Deploy extensions to Shopify
shopify app deploy

# Test in development
shopify app dev
```

Test checkout customizations by completing test purchases on the development store.
Verify functions with the function execution log in the Partner Dashboard.

## Reference

- Related skills: [shopify-app] (prerequisite), [shopify-theme], [shopify-hydrogen]
- Checkout UI: https://shopify.dev/docs/api/checkout-ui-extensions
- Shopify Functions: https://shopify.dev/docs/apps/build/functions
- Checkout Branding: https://shopify.dev/docs/apps/build/checkout/styling
- Web Pixels: https://shopify.dev/docs/apps/build/marketing-analytics/pixels
- MCP: `@shopify/dev-mcp` for API lookups
- Agent: `shopify-functions-dev` for implementation tasks
