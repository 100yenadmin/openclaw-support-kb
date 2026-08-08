---
type: composio_doc
title: "Webhook Events"
source: "https://docs.composio.dev/reference/api-reference/webhook-events.md"
source_hash: "8619a384c65ce6d915ed0cec4e401194dedf4762d5def49f900d6e35c7956e14"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/webhook-events.md"
original_doc_path: "reference/api-reference/webhook-events.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Webhook Events (/reference/api-reference/webhook-events)
Source: https://docs.composio.dev/reference/api-reference/webhook-events.md


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from openapi-webhooks.json. Edit the overview at api-overviews/webhook-events.mdx, not this file. */}

Webhook events delivered by the Composio platform to your registered endpoints.

Configure your webhook subscriptions via the [Webhook Subscriptions API](/reference/api-reference/webhook-subscriptions/postWebhookSubscriptions), and verify signatures as described in [Verifying signatures](/docs/setting-up-triggers/subscribing-to-events#verifying-signatures).

# Events [#events]

| Event                                | Description                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `composio.trigger.message`           | [Trigger message](/reference/api-reference/webhook-events/composio_trigger_message)              |
| `composio.connected_account.expired` | [Connection expired](/reference/api-reference/webhook-events/composio_connected_account_expired) |
| `composio.trigger.disabled`          | [Trigger disabled](/reference/api-reference/webhook-events/composio_trigger_disabled)            |

# Legacy payloads (deprecated) [#legacy-payloads-deprecated]

Older subscriptions may still receive these payload formats. The event type is unchanged — only the payload shape differs, selected by the subscription's version. You can upgrade an existing subscription at any time by updating its `version` — see [Update a webhook subscription](/reference/api-reference/webhook-subscriptions/patchWebhookSubscriptionsById). New integrations should use the current events above.

| Event                      | Version | Description                                                                                 |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `composio.trigger.message` | V2      | [Trigger message (V2)](/reference/api-reference/webhook-events/composio_trigger_message_v2) |
| `composio.trigger.message` | V1      | [Trigger message (V1)](/reference/api-reference/webhook-events/composio_trigger_message_v1) |

---
