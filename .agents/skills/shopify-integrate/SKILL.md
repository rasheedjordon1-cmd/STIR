---
name: shopify-integrate
description: Integrate Shopify with external systems — inventory, ERP, 3PL and fulfilment, CRM. Use when designing webhook consumers, keeping stock counts in sync with a picking or warehouse system, or handling Admin/Storefront API rate limits and retries. Covers integration pattern selection, webhook consumer architecture, rate limiting, error handling and integration testing.
source: domocarroll/shopify-builds (.claude/skills/shopify-integrate.md)
note: Frontmatter added locally; upstream ships this file without it.
---

# Shopify Integrate - Third-Party Integration Workflow

## Context

Use this skill when a project requires integrating Shopify with external systems: ERP,
CRM, 3PL/fulfillment, marketing platforms, custom middleware, or any third-party service.
This skill provides integration pattern selection, architecture design, and implementation
guidance.

## Prerequisites

- Integration requirements from [shopify-discovery] specifying systems to connect.
- Architecture Decision Record from [shopify-architect] for overall system context.
- API credentials and documentation for target systems.
- MCP server available: `@shopify/dev-mcp` for Shopify webhook and API lookups.

## Workflow

### Step 1: Integration Pattern Decision Tree

For each integration, evaluate and select the appropriate pattern:

```
START: What system are you integrating?

IF popular_platform (Klaviyo, HubSpot, NetSuite, ShipStation, etc.):
  -> CHECK: Does an official Shopify app exist?
    YES -> USE the app (lowest maintenance, best support)
    NO  -> Continue to custom evaluation

IF data_flow == one_directional AND volume < 1000/day:
  -> DIRECT API integration (Shopify webhooks -> target API)

IF data_flow == bidirectional OR volume > 1000/day:
  -> CHECK: Team has middleware expertise?
    YES -> CUSTOM MIDDLEWARE (Node.js/Python service)
    NO  -> iPaaS PLATFORM (Celigo, Workato, Make, Zapier)

IF real_time_required AND high_volume:
  -> QUEUE-BASED MIDDLEWARE (with Redis/SQS/RabbitMQ)

IF complex_data_transformation:
  -> iPaaS or CUSTOM MIDDLEWARE with ETL pipeline
```

**Integration patterns summary:**

| Pattern | Best For | Complexity | Maintenance |
|---------|----------|------------|-------------|
| Shopify App | Standard integrations | Low | Vendor-managed |
| Direct API | Simple, one-way, low volume | Medium | Self-managed |
| iPaaS (Celigo, etc.) | Bidirectional, complex mapping, non-technical team | Medium | Platform-managed |
| Custom Middleware | High volume, complex logic, full control | High | Self-managed |
| Queue-based | Real-time, high volume, reliability critical | High | Self-managed |

### Step 2: ERP Integration Architecture

ERP integrations (NetSuite, SAP, Microsoft Dynamics, Acumatica) are the most complex.

**Data model mapping:**

| Shopify Entity | ERP Entity | Sync Direction | Frequency |
|---------------|------------|----------------|-----------|
| Products | Items | ERP -> Shopify | Near real-time or scheduled |
| Inventory | Stock levels | ERP -> Shopify | Near real-time |
| Orders | Sales Orders | Shopify -> ERP | Real-time (webhook) |
| Customers | Customer records | Bidirectional | Event-driven |
| Prices | Price lists | ERP -> Shopify | Scheduled |
| Fulfillments | Shipments | ERP -> Shopify | Event-driven |
| Refunds | Credit memos | Shopify -> ERP | Real-time |

**Bidirectional sync challenges:**
- **Conflict resolution**: Define which system is the source of truth per field.
- **ID mapping**: Maintain a mapping table between Shopify IDs and ERP IDs.
- **Transaction boundaries**: Handle partial failures (order created in Shopify but fails in ERP).
- **Idempotency**: Ensure duplicate webhook deliveries don't create duplicate records.

**ERP sync architecture:**
```
Shopify --webhook--> Middleware --API--> ERP
  ^                    |                  |
  |                    v                  |
  +--- API <--- Transform/Map <---Event--+
                    |
                    v
              Mapping Store (DB)
              Error Queue
              Retry Logic
```

### Step 3: Fulfillment and 3PL Integration

Common 3PL integration flow:

```
Order Created (Shopify webhook)
  -> Middleware transforms to 3PL format
  -> POST to 3PL API (create shipment request)
  -> 3PL processes and ships
  -> 3PL webhook/poll: tracking number available
  -> Middleware calls Shopify Fulfillment API
  -> Order marked as fulfilled with tracking
```

**Shopify Fulfillment API flow:**
```graphql
# Step 1: Create fulfillment order acceptance
mutation FulfillmentOrderAccept {
  fulfillmentOrderAcceptFulfillmentRequest(
    id: "gid://shopify/FulfillmentOrder/123"
  ) { fulfillmentOrder { id status } }
}

# Step 2: Create fulfillment with tracking
mutation CreateFulfillment {
  fulfillmentCreate(fulfillment: {
    lineItemsByFulfillmentOrder: [{
      fulfillmentOrderId: "gid://shopify/FulfillmentOrder/123"
    }]
    trackingInfo: {
      company: "UPS"
      number: "1Z999AA10123456784"
      url: "https://www.ups.com/track?tracknum=1Z999AA10123456784"
    }
  }) {
    fulfillment { id status trackingInfo { number url } }
  }
}
```

### Step 4: CRM and Marketing Integration

**CRM sync (Salesforce, HubSpot):**
- Sync customer data on `CUSTOMERS_CREATE` and `CUSTOMERS_UPDATE` webhooks.
- Sync order data on `ORDERS_CREATE` for purchase history.
- Map Shopify customer tags to CRM segments/lists.
- Handle consent and GDPR compliance for data transfer.

**Marketing platform sync (Klaviyo, Attentive, etc.):**
- Most have official Shopify apps; use them when available.
- For custom integrations, sync: customer profiles, order events, browse behavior, product catalog.
- Use Shopify's web pixel for client-side event tracking.
- Use webhooks for server-side event relay.

### Step 5: Webhook Consumer Architecture

Design robust webhook handling:

**Webhook registration:**
```graphql
mutation WebhookCreate {
  webhookSubscriptionCreate(
    topic: ORDERS_CREATE
    webhookSubscription: {
      callbackUrl: "https://middleware.example.com/webhooks/shopify/orders"
      format: JSON
    }
  ) {
    webhookSubscription { id topic }
    userErrors { field message }
  }
}
```

**Webhook consumer best practices:**

1. **Respond immediately (2xx within 5 seconds)**:
```javascript
app.post('/webhooks/shopify/orders', async (req, res) => {
  // Verify HMAC
  const verified = verifyShopifyWebhook(req);
  if (!verified) return res.status(401).send();

  // Acknowledge immediately
  res.status(200).send();

  // Queue for async processing
  await queue.add('process-order', {
    topic: req.headers['x-shopify-topic'],
    shop: req.headers['x-shopify-shop-domain'],
    payload: req.body,
  });
});
```

2. **Idempotency**: Use `X-Shopify-Webhook-Id` header to deduplicate.
```javascript
async function processWebhook(webhookId, payload) {
  const existing = await db.webhookLog.findUnique({where: {webhookId}});
  if (existing) return; // Already processed

  await db.webhookLog.create({data: {webhookId, processedAt: new Date()}});
  // Process payload...
}
```

3. **Retry handling**: Shopify retries failed webhooks (non-2xx) up to 19 times over 48 hours.
   After consecutive failures, the subscription is removed. Monitor webhook health.

4. **Queue-based processing**: Use a job queue (BullMQ, SQS, Cloud Tasks) for reliable processing:
```
Webhook -> Express handler -> Redis Queue -> Worker -> Target System
                                              |
                                              v
                                         Dead Letter Queue (failures)
```

5. **HMAC verification**: Always verify the `X-Shopify-Hmac-SHA256` header:
```javascript
const crypto = require('crypto');
function verifyShopifyWebhook(req) {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const hash = crypto.createHmac('sha256', SHOPIFY_API_SECRET)
    .update(req.rawBody, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(hash));
}
```

### Step 6: Rate Limiting and Error Handling

**Shopify API rate limits:**
- REST Admin API: 40 requests per app per store (leaky bucket, 2/second refill).
- GraphQL Admin API: 2,000 cost points per app per store (50/second refill).
- Storefront API: No per-store limit, but IP-based throttling.

**Handle rate limits:**
```javascript
async function shopifyApiCall(query, variables, retries = 3) {
  const response = await fetch(endpoint, {method: 'POST', body: JSON.stringify({query, variables})});

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') || 2;
    await sleep(retryAfter * 1000);
    return shopifyApiCall(query, variables, retries - 1);
  }

  // Check GraphQL throttle status
  const data = await response.json();
  const cost = data.extensions?.cost;
  if (cost?.throttleStatus?.currentlyAvailable < 100) {
    await sleep(1000); // Back off proactively
  }

  return data;
}
```

### Step 7: Integration Testing

- [ ] Webhook delivery verified (use Shopify CLI `shopify app webhooks trigger`).
- [ ] HMAC verification working.
- [ ] Idempotency tested (send same webhook twice).
- [ ] Rate limit handling tested.
- [ ] Error recovery tested (target system down, then recovers).
- [ ] Data mapping verified for all entity types.
- [ ] End-to-end flow tested: create order -> sync to ERP -> fulfill -> update Shopify.
- [ ] Monitoring and alerting configured for integration failures.

## Reference

- Related skills: [shopify-discovery] (requirements), [shopify-architect] (architecture), [shopify-app] (custom app hosting)
- Webhooks: https://shopify.dev/docs/apps/build/webhooks
- Admin API: https://shopify.dev/docs/api/admin
- Fulfillment API: https://shopify.dev/docs/apps/build/fulfillment
- Rate limits: https://shopify.dev/docs/api/usage/rate-limits
- MCP: `@shopify/dev-mcp` for API lookups
