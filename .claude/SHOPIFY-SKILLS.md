# Shopify skills and agents

Installed from [`domocarroll/shopify-builds`](https://github.com/domocarroll/shopify-builds)
for the eventual Shopify integration (see the README's "Shopify readiness" section).

That repository is a context-engineering framework — instructions, not code. It ships
12 skills and 6 agents covering every Shopify build shape. Most of them assume a Liquid
theme or a Hydrogen storefront, so only the parts that apply to **a headless Next.js
storefront with a commerce adapter** are installed here.

## Installed

| Skill | Why it applies to Spicemart |
|---|---|
| `shopify-content` | Metafields and metaobjects. `unit`, `unitPrice`, `local`, `fresh` and `fulfillmentMethods` have no native Shopify field, and Spice Fair events belong in a metaobject rather than the product catalogue. This is Phase 1 of the integration. |
| `shopify-i18n` | Markets, store currency, duties and tax. Confirms XCD as the store currency. Ignore the translation and localised-URL steps — Spicemart is single-language. |
| `shopify-integrate` | Webhook consumers, rate limiting and error handling. This is the inventory-sync problem, which is the hardest ongoing operational commitment in the whole build. |
| `shopify-checkout` | Functions and checkout UI extensions. Native shipping profiles cannot express "north route runs Saturdays only, no chilled items" or per-product fulfilment eligibility. Note: checkout branding needs Shopify Plus. |

| Agent | Role |
|---|---|
| `shopify-api-dev` | GraphQL Storefront/Admin API, webhooks. This is the agent that implements `lib/commerce/shopify.ts`. |
| `shopify-content-dev` | Metafield and metaobject modelling. Pairs with `shopify-content`. |
| `shopify-functions-dev` | Wasm Functions and checkout UI. Pairs with `shopify-checkout`. |

## Deliberately not installed

| Skipped | Reason |
|---|---|
| `shopify-hydrogen`, `shopify-hydrogen-dev` | **Hydrogen is a competing framework.** Spicemart is a Next.js app with a clean adapter boundary; following the Hydrogen path means rebuilding the storefront rather than connecting it. |
| `shopify-theme`, `shopify-liquid-dev` | Liquid themes. Irrelevant to a headless build. |
| `shopify-discovery`, `shopify-architect` | Requirements gathering and the theme-vs-headless-vs-app decision. Both already settled. |
| `shopify-audit`, `shopify-qa` | Built around Theme Check and Lighthouse. Spicemart already has stronger, project-specific coverage: `npm run test:e2e` (21 interaction checks) and `npm run test:audit` (responsive + accessibility across every route at five widths). |
| `shopify-deploy` | Covers theme, app and Oxygen deployment. Spicemart deploys to Netlify — see `netlify.toml`. |
| `shopify-app` | Embedded app development. Only needed if delivery routing eventually requires a custom app; premature now. |
| `shopify-handoff` | Client handoff documentation. Spicemart is the client. |

## Provenance

Upstream ships these skill files **without YAML frontmatter**, so Claude Code cannot
discover them as skills. Frontmatter (`name`, `description`) was added locally during
install — each file records this in its own header. They are therefore modified copies
and are intentionally **not** listed in `skills-lock.json`, which tracks
installer-managed, unmodified skills. Re-syncing from upstream would drop the
frontmatter and make them undiscoverable again.
