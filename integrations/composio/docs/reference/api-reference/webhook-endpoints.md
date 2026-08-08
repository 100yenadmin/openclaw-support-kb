---
type: composio_doc
title: "Webhook Endpoints"
source: "https://docs.composio.dev/reference/api-reference/webhook-endpoints.md"
source_hash: "45a9ebab99900b2a813f7aedfc2f26f7fdf007c84a12935d680270473ebc2832"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/webhook-endpoints.md"
original_doc_path: "reference/api-reference/webhook-endpoints.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Webhook Endpoints (/reference/api-reference/webhook-endpoints)
Source: https://docs.composio.dev/reference/api-reference/webhook-endpoints.md


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/webhook-endpoints.mdx, not this file. */}

Webhook endpoints are per-OAuth-app webhook ingress configurations. They define the inbound URL a provider posts events to, along with the signing secret Composio stores and uses to verify those incoming payloads.

Reach for these endpoints when an OAuth app you have configured needs to deliver provider-side events into Composio. You create an endpoint, configure or update it by its `nano_id`, and store the signing secret Composio uses to authenticate inbound requests.

Each endpoint is addressed by its `nano_id`. The `POST` to `/webhook_endpoints/{nano_id}` replaces the full configuration, while `PATCH` updates it in place.

This is distinct from [webhook subscriptions](/reference/api-reference/webhook-subscriptions), which control where Composio delivers outbound trigger events. To verify the signature on payloads Composio sends you, see [Verifying signatures](/docs/setting-up-triggers/subscribing-to-events#verifying-signatures). To set up the trigger events those payloads carry, see [Triggers](/docs/triggers).

# Endpoints [#endpoints]

| Method | Path | Endpoint |
| --- | --- | --- |
| `POST` | `/api/v3.1/webhook_endpoints` | [Create webhook endpoint](/reference/api-reference/webhook-endpoints/postWebhookEndpoints) |
| `GET` | `/api/v3.1/webhook_endpoints` | [List webhook endpoints](/reference/api-reference/webhook-endpoints/getWebhookEndpoints) |
| `GET` | `/api/v3.1/webhook_endpoints/{nano_id}` | [Get webhook endpoint](/reference/api-reference/webhook-endpoints/getWebhookEndpointsByNanoId) |
| `POST` | `/api/v3.1/webhook_endpoints/{nano_id}` | [Put webhook endpoint configuration](/reference/api-reference/webhook-endpoints/postWebhookEndpointsByNanoId) |
| `PATCH` | `/api/v3.1/webhook_endpoints/{nano_id}` | [Update webhook endpoint configuration](/reference/api-reference/webhook-endpoints/patchWebhookEndpointsByNanoId) |

---
