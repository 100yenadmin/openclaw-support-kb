---
type: composio_doc
title: "Custom OAuth webhooks"
source: "https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks.md"
source_hash: "b0eb3e777bdf5d30d3e27b970d54bcb643df6825122d4c8e8065502d305aa36a"
system: "composio"
kb_namespace: "composio"
doc_path: "setting-up-triggers/custom-oauth-webhooks.md"
original_doc_path: "setting-up-triggers/custom-oauth-webhooks.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Custom OAuth webhooks (/docs/setting-up-triggers/custom-oauth-webhooks)
Source: https://docs.composio.dev/docs/setting-up-triggers/custom-oauth-webhooks.md


This page is only for **realtime triggers where you bring your own OAuth app**. With Composio-managed OAuth, ingress is already set up and you can skip this entirely. Create the trigger and events flow.

Some providers only deliver events to URLs you've registered on your OAuth app. When you bring your own app, you register Composio's ingress URL there once, so events can reach Composio. You need this only when the trigger type's `requires_webhook_endpoint_setup` flag is `true`.

Each OAuth app you bring gets its own ingress URL within a project:

```
https://backend.composio.dev/api/v3.1/webhook_ingress/{toolkit_slug}/{we_xxx}/trigger_event
```

A single OAuth app can serve at most one Composio project: providers accept only one callback URL per OAuth app, and each ingress URL routes to a single project. In return, every project becomes its own webhook tenant, with:

* **Its own ingress rate limit and backpressure budget**
* **Project-scoped credentials**: the signing secret and app-level token you provide are stored against this project alone, never shared across projects. Repeat verification handshakes are rejected after the endpoint is verified, so the signing secret can't be silently swapped by a forged challenge.
* **Clean fan-out**: events reach only that project's trigger instances
* **Per-project metering**

Every inbound event is signature-checked at ingress before any trigger fires:

* **HMAC-SHA256** for Slack, **Ed25519** or shared-token matching for other providers
* **Timestamp replay protection**: when the provider signs a request timestamp, requests outside the allowed skew window are rejected
* **Unsigned or tampered requests** are rejected with `400` at ingress, so third parties can't spoof events onto your triggers

> **Sharing one OAuth app across projects?** Consolidate to a single project or register separate OAuth apps per project before continuing.

The walkthrough below uses Slack as the example and the [Webhook Endpoints API](/reference/api-reference/webhook-endpoints). For setup notes specific to each toolkit, see its FAQ section, for example [Slack](/toolkits/slack) or [Notion](/toolkits/notion).

## Step 1: Discover what credentials the endpoint needs [#step-1-discover-what-credentials-the-endpoint-needs]

Call the schema endpoint for the toolkit. The `setup_fields` in the response tell you exactly what to collect from the provider's app dashboard.

```bash
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints/schema?toolkit_slug=slack" \
  -H "x-api-key: "
```

Sample response:

```json
{
  "toolkit_slug": "slack",
  "setup_fields": {
    "webhook_signing_secret": {
      "display_name": "Signing Secret",
      "description": "Webhook request signing secret from your Slack app dashboard",
      "is_required": true,
      "is_secret": true
    },
    "app_token": {
      "display_name": "App-Level Token",
      "description": "Slack xapp- token with authorizations:read scope for event authorization",
      "is_required": true,
      "is_secret": true
    }
  }
}
```

## Step 2: Create the endpoint [#step-2-create-the-endpoint]

```bash
curl -X POST "https://backend.composio.dev/api/v3.1/webhook_endpoints" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "toolkit_slug": "slack",
    "client_id": ""
  }'
```

Sample response:

```json
{
  "id": "we_abc123",
  "toolkit_slug": "slack",
  "client_id": "",
  "webhook_url": "https://backend.composio.dev/api/v3.1/webhook_ingress/slack/we_abc123/trigger_event",
  "data": null,
  "created_at": "2026-04-24T10:00:00.000Z"
}
```

Hold on to two values from the response: `id` (used as `` below) and `webhook_url` (you'll paste this into the provider's app dashboard in step 4). The call is **idempotent per `(toolkit_slug, client_id)` within a project**. Calling it again with the same pair returns the existing endpoint without rotating the URL or wiping the secret.

## Step 3: Store the credentials returned by the schema [#step-3-store-the-credentials-returned-by-the-schema]

`PATCH` all the fields the schema returned in a single request. For Slack, that's the signing secret and (when needed) the app-level token together:

```bash
curl -X PATCH "https://backend.composio.dev/api/v3.1/webhook_endpoints/" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "webhook_signing_secret": "",
      "app_token": "xapp-..."
    }
  }'
```

For Slack, the credentials come from:

* **Signing secret**: Slack app → Basic Information → App Credentials → Signing Secret.
* **App-level token**: Slack app → Basic Information → App-Level Tokens, with scope `authorizations:read`. Required for direct messages, private channels, and reactions. Omit it if you only need public-channel events.

> **Store the credentials before you switch the provider's callback URL in step 4.** If the provider posts to the URL without a secret on the endpoint, every request fails with `400`, and the provider may auto-disable the endpoint after a window of consecutive failures (Slack: \~36 hours).

## Step 4: Point the provider's app dashboard at the URL [#step-4-point-the-providers-app-dashboard-at-the-url]

Paste the `webhook_url` from step 2 into the provider's app dashboard:

* **Slack** → Event Subscriptions → Request URL
* **Notion** → Webhook Endpoints (in the integration's settings)

For providers that issue a verification challenge on save (Slack `url_verification`, Notion's verification token, and so on), Composio responds automatically, with no handshake code on your side. Once the provider accepts the URL, go [create your trigger](/docs/setting-up-triggers/creating-triggers).

## Updating an endpoint [#updating-an-endpoint]

To rotate the signing secret or update any single field, `PATCH` it (other fields are preserved):

```bash
curl -X PATCH "https://backend.composio.dev/api/v3.1/webhook_endpoints/" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{ "data": { "webhook_signing_secret": "" } }'
```

To **replace** `data` wholesale (any field you don't include is cleared), `POST` to the same URL:

```bash
curl -X POST "https://backend.composio.dev/api/v3.1/webhook_endpoints/" \
  -H "x-api-key: " \
  -H "Content-Type: application/json" \
  -d '{ "data": { "webhook_signing_secret": "", "app_token": "" } }'
```

The `webhook_url` is immutable for the lifetime of the endpoint. Rotating the signing secret on the provider side is a `PATCH` on the existing endpoint, not a new one.

To inspect a single endpoint:

```bash
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints/" \
  -H "x-api-key: "
```

To list every endpoint in the current project:

```bash
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints" \
  -H "x-api-key: "
```

## Next [#next]

- [Creating triggers](/docs/setting-up-triggers/creating-triggers): Activate a trigger for a user so events start flowing

---
