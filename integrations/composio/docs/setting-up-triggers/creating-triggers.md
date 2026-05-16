---
type: composio_doc
title: "Creating triggers"
source: "https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md"
source_hash: "c3be4707d981d6a2912975cb79b5e60d9f9dfecaf997ca02edac7c9674317e6f"
system: "composio"
kb_namespace: "composio"
doc_path: "setting-up-triggers/creating-triggers.md"
original_doc_path: "setting-up-triggers/creating-triggers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Creating triggers (/docs/setting-up-triggers/creating-triggers)
Source: https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md


Create a trigger to start receiving events. A trigger watches for a specific event (e.g., `GITHUB_COMMIT_EVENT`) on a specific user's connected account. For an overview of how triggers work, see [Triggers](/docs/triggers).

> **Prerequisites**: * An [auth config](/docs/authentication#how-composio-manages-authentication) for the toolkit you want to monitor
  * A connected account for the user whose events you want to capture
  * A [webhook subscription](/docs/setting-up-triggers/subscribing-to-events) on the project, so events have somewhere to land

You can create triggers using the [SDK](#using-the-sdk) or the Composio [dashboard](#using-the-dashboard). Some webhook triggers also need a webhook endpoint configured first — covered in [Configuring the webhook endpoint](#configuring-the-webhook-endpoint) below.

# Configuring the webhook endpoint

Some webhook triggers require a webhook endpoint registered with the provider before they can fire. With Composio-managed OAuth, this is already done for you. You only run the steps below when you bring your own OAuth app and the trigger type's `requires_webhook_endpoint_setup` flag is `true`.

Each OAuth app you bring gets its own ingress URL within a project:

```
https://backend.composio.dev/api/v3.1/webhook_ingress/{toolkit_slug}/{we_xxx}/trigger_event
```

A single OAuth app can serve at most one Composio project: providers accept only one callback URL per OAuth app, and each ingress URL routes to a single project. In return, every project becomes its own webhook tenant — with:

* **Its own ingress rate limit and backpressure budget**
* **Project-scoped credentials** — the signing secret and app-level token you provide are stored against this project alone, never shared across projects. Repeat verification handshakes are rejected after the endpoint is verified, so the signing secret can't be silently swapped by a forged challenge.
* **Clean fan-out** — events reach only that project's trigger instances
* **Per-project metering**

Every inbound event is signature-checked at ingress before any trigger fires:

* **HMAC-SHA256** for Slack, **Ed25519** or shared-token matching for other providers
* **Timestamp replay protection** — when the provider signs a request timestamp, requests outside the allowed skew window are rejected
* **Unsigned or tampered requests** are rejected with `400` at ingress, so third parties can't spoof events onto your triggers

> **Sharing one OAuth app across projects?** Consolidate to a single project or register separate OAuth apps per project before continuing.

The walkthrough below uses Slack as the example and walks through the [Webhook Endpoints API](/reference/api-reference/webhook-endpoints). For setup notes specific to each toolkit, see its FAQ section — e.g., [Slack](/toolkits/slack), [Notion](/toolkits/notion).

## Step 1: Discover what credentials the endpoint needs

Call the schema endpoint for the toolkit. The `setup_fields` in the response tell you exactly what to collect from the provider's app dashboard.

```bash
curl "https://backend.composio.dev/api/v3.1/webhook_endpoints/schema?toolkit_slug=slack" \
  -H "x-api-key:

# What to read next

- [Subscribing to events](/docs/setting-up-triggers/subscribing-to-events): Set up the webhook subscription URL Composio delivers events to

- [Verifying webhooks](/docs/webhook-verification): Validate webhook signatures so you know payloads came from Composio

- [Managing triggers](/docs/setting-up-triggers/managing-triggers): List, enable, disable, and delete trigger instances

---
