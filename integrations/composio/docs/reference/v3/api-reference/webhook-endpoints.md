---
type: composio_doc
title: "Webhook Endpoints"
source: "https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints.md"
source_hash: "c804f405b8b33cb48a12771bc5cac3cffbad696278a534ebfa188a377bcb10d5"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/v3/api-reference/webhook-endpoints.md"
original_doc_path: "reference/v3/api-reference/webhook-endpoints.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Webhook Endpoints (/reference/v3/api-reference/webhook-endpoints)
Source: https://docs.composio.dev/reference/v3/api-reference/webhook-endpoints.md


{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/webhook-endpoints.mdx, not this file. */}

Webhook endpoints are per-OAuth-app webhook ingress configurations. They define the inbound URL a provider posts events to, along with the signing secret Composio stores and uses to verify those incoming payloads.

Reach for these endpoints when an OAuth app you have configured needs to deliver provider-side events into Composio. You create an endpoint, configure or update it by its `nano_id`, and store the signing secret Composio uses to authenticate inbound requests.

Each endpoint is addressed by its `nano_id`. The `POST` to `/webhook_endpoints/{nano_id}` replaces the full configuration, while `PATCH` updates it in place.

This is distinct from [webhook subscriptions](/reference/api-reference/webhook-subscriptions), which control where Composio delivers outbound trigger events. To verify the signature on payloads Composio sends you, see [Verifying signatures](/docs/setting-up-triggers/subscribing-to-events#verifying-signatures). To set up the trigger events those payloads carry, see [Triggers](/docs/triggers).

# Endpoints

---
