---
name: shopify-content
description: Model Shopify metafields and metaobjects. Use when mapping product data Shopify has no native field for (unit size, unit price, local/fresh flags, fulfilment eligibility), or when structured content such as events, venues or vendor line-ups belongs in a metaobject rather than a product. Covers metafield types, creating definitions via the API, metaobject schema design, taxonomy mapping and environment migration. On a headless build, skip the Liquid step.
source: domocarroll/shopify-builds (.claude/skills/shopify-content.md)
note: Frontmatter added locally; upstream ships this file without it.
---

# Shopify Content - Content Modeling Workflow

## Context

Use this skill when a project requires custom content modeling beyond standard Shopify product
fields. This covers metafield definitions, metaobject schema design, product taxonomy mapping,
and content migration. Essential for projects with complex product data, custom page builders,
or structured content needs.

## Prerequisites

- A Shopify store with API access (Admin API).
- Understanding of the project's content requirements from [shopify-discovery].
- MCP server available: `@shopify/dev-mcp` for Admin API metafield and metaobject lookups.

## Workflow

### Step 1: Content Audit and Modeling

Analyze the project's content requirements and map them to Shopify's content primitives:

**Content Primitives:**

| Primitive | Use Case | Limits |
|-----------|----------|--------|
| Product fields | Standard product data (title, description, price, images) | Built-in |
| Variant fields | Variant-level data (size, color, SKU) | Up to 3 options, 100 variants |
| Metafields | Extended data on any resource (product, collection, order, shop, etc.) | 250 per resource |
| Metaobjects | Standalone content types (team members, FAQs, store locations, lookbooks) | Custom schemas |
| Files | Media assets (images, videos, 3D models, PDFs) | Files API |

**Design the content model** by listing every content type and its fields:

```markdown
## Content Model

### Product Metafields
- product.custom.care_instructions (multi_line_text_field)
- product.custom.materials (list.single_line_text_field)
- product.custom.size_guide (file_reference)
- product.custom.related_products (list.product_reference)

### Collection Metafields
- collection.custom.hero_image (file_reference)
- collection.custom.seo_content (rich_text_field)

### Metaobjects
- custom.designer { name, bio, headshot, products }
- custom.store_location { name, address, hours, coordinates, image }
- custom.faq { question, answer, category }
```

### Step 2: Metafield Type System

Shopify supports 20+ metafield types. Choose the correct type for each field:

**Scalar Types:**
- `single_line_text_field` - Short text (product subtitle, badge text)
- `multi_line_text_field` - Long text without formatting
- `rich_text_field` - Formatted text (headings, lists, links, bold/italic)
- `number_integer` - Whole numbers (sort order, quantity)
- `number_decimal` - Decimal numbers (ratings, measurements)
- `boolean` - True/false (featured, sale, new arrival)
- `date` - Date only (launch date, expiry)
- `date_time` - Date and time (event start, sale end)
- `color` - Hex color (#FF0000)
- `url` - URL string
- `json` - Raw JSON (complex structured data, last resort)

**Measurement Types:**
- `weight` - With unit (kg, lb, g, oz)
- `dimension` - With unit (cm, mm, in, ft, m)
- `volume` - With unit (ml, l, fl_oz, gal)

**Reference Types:**
- `product_reference` - Link to a product
- `collection_reference` - Link to a collection
- `variant_reference` - Link to a variant
- `page_reference` - Link to a page
- `file_reference` - Link to a file (image, video, PDF, 3D model)
- `metaobject_reference` - Link to a metaobject
- `mixed_reference` - Link to multiple resource types

**List Types:**
Any scalar or reference type can be a list: `list.single_line_text_field`, `list.product_reference`, etc.

### Step 3: Create Metafield Definitions via API

Use the Admin API to create metafield definitions programmatically:

```graphql
mutation CreateMetafieldDefinition {
  metafieldDefinitionCreate(definition: {
    name: "Care Instructions"
    namespace: "custom"
    key: "care_instructions"
    type: "multi_line_text_field"
    ownerType: PRODUCT
    description: "Product care and washing instructions"
    pin: true
    validations: [
      { name: "min", value: "10" }
      { name: "max", value: "500" }
    ]
  }) {
    createdDefinition { id name }
    userErrors { field message }
  }
}
```

**Naming conventions:**
- Namespace: Use `custom` for merchant-defined fields. Use your app's namespace for app-owned fields.
- Key: `snake_case`, descriptive, consistent.
- Always pin important metafields so they appear in the Shopify admin UI.

Delegate bulk metafield definition creation to the `shopify-content-dev` agent.

### Step 4: Metaobject Schema Design

Create metaobject definitions for standalone content types:

```graphql
mutation CreateMetaobjectDefinition {
  metaobjectDefinitionCreate(definition: {
    name: "Store Location"
    type: "store_location"
    fieldDefinitions: [
      { name: "Name", key: "name", type: "single_line_text_field", required: true }
      { name: "Address", key: "address", type: "multi_line_text_field", required: true }
      { name: "Hours", key: "hours", type: "json" }
      { name: "Coordinates", key: "coordinates", type: "json" }
      { name: "Image", key: "image", type: "file_reference" }
      { name: "Phone", key: "phone", type: "single_line_text_field" }
    ]
    access: { storefront: PUBLIC_READ }
    displayNameKey: "name"
  }) {
    metaobjectDefinition { id name type }
    userErrors { field message }
  }
}
```

**Metaobject design principles:**
- Set `access.storefront: PUBLIC_READ` if the data needs to be queried via Storefront API.
- Use `displayNameKey` to control how entries appear in the admin.
- Create reference fields between metaobjects for relational content.
- Keep metaobject types focused; avoid monolithic schemas.

### Step 5: Product Taxonomy Mapping

Shopify uses a standardized product taxonomy for categorization:

```graphql
mutation UpdateProduct {
  productUpdate(input: {
    id: "gid://shopify/Product/123"
    productCategory: {
      productTaxonomyNodeId: "gid://shopify/TaxonomyNode/352"
    }
  }) {
    product { productCategory { productTaxonomyNode { name } } }
  }
}
```

Map your product types to the Shopify taxonomy for:
- Accurate tax calculation across jurisdictions.
- Better product recommendations.
- Correct categorization in sales channels (Google, Meta).
- Proper HS code suggestions for international shipping.

Use `@shopify/dev-mcp` to look up taxonomy node IDs.

### Step 6: Connecting Metafields to Liquid

In theme development, access metafields in Liquid templates:

```liquid
{% comment %} Product metafield {% endcomment %}
{% if product.metafields.custom.care_instructions %}
  <div class="care-instructions">
    {{ product.metafields.custom.care_instructions.value }}
  </div>
{% endif %}

{% comment %} List metafield {% endcomment %}
{% for material in product.metafields.custom.materials.value %}
  <span class="material-tag">{{ material }}</span>
{% endfor %}

{% comment %} Reference metafield (file) {% endcomment %}
{% if product.metafields.custom.size_guide %}
  <a href="{{ product.metafields.custom.size_guide.value | file_url }}">
    Size Guide (PDF)
  </a>
{% endif %}

{% comment %} Metaobject reference {% endcomment %}
{% assign designer = product.metafields.custom.designer.value %}
{% if designer %}
  <div class="designer-info">
    <img src="{{ designer.headshot.value | image_url: width: 200 }}" alt="{{ designer.name.value }}">
    <h3>{{ designer.name.value }}</h3>
    <p>{{ designer.bio.value }}</p>
  </div>
{% endif %}
```

For Hydrogen (headless), query metafields via Storefront API:
```graphql
query Product($handle: String!) {
  product(handle: $handle) {
    metafield(namespace: "custom", key: "care_instructions") {
      value
      type
    }
    metafields(identifiers: [
      {namespace: "custom", key: "materials"},
      {namespace: "custom", key: "size_guide"}
    ]) {
      value
      type
      key
    }
  }
}
```

### Step 7: Environment Migration

Shopify has no native content model migration tooling between environments.
You must script migrations manually:

**Migration approach:**
1. Export metafield definitions from source store via Admin API.
2. Transform definitions for the target store (strip IDs).
3. Create definitions on target store via API.
4. Export metaobject definitions similarly.
5. Export metaobject entries and recreate them.
6. Handle references (IDs change between environments).

Delegate migration script creation to the `shopify-content-dev` agent. The script should:
- Be idempotent (safe to re-run).
- Handle reference resolution (map old IDs to new IDs).
- Log successes and failures.
- Support dry-run mode.

### Step 8: Content Validation

Verify the content model:
- [ ] All metafield definitions created with correct types and validations.
- [ ] Metaobjects have proper access settings (storefront read if needed).
- [ ] Reference fields resolve correctly.
- [ ] Liquid templates render metafield values without errors.
- [ ] Storefront API queries return expected metafield data.
- [ ] Taxonomy mapping complete for all products.

## Reference

- Related skills: [shopify-theme] (Liquid rendering), [shopify-hydrogen] (API queries), [shopify-i18n] (translated content)
- Metafields: https://shopify.dev/docs/apps/build/custom-data/metafields
- Metaobjects: https://shopify.dev/docs/apps/build/custom-data/metaobjects
- Product taxonomy: https://shopify.dev/docs/apps/build/graphql/migrate/new-product-model
- MCP: `@shopify/dev-mcp` for API lookups
- Agent: `shopify-content-dev` for implementation tasks
