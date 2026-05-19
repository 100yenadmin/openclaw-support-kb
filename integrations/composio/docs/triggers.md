---
type: composio_doc
title: "Triggers"
source: "https://docs.composio.dev/docs/triggers.md"
source_hash: "f4207dfe8ff3e31ee1505fa58119bf80336aba1462d18a8fc6828d4680e526d8"
system: "composio"
kb_namespace: "composio"
doc_path: "triggers.md"
original_doc_path: "triggers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Triggers (/docs/triggers)
Source: https://docs.composio.dev/docs/triggers.md


When events occur in apps — a new Slack message, a GitHub commit, an incoming email — triggers send event data to your application as structured payloads.

![Triggers flow: connected apps send events to Composio, which delivers them to your webhook subscription URL via HTTP POST](/images/triggers-flow.svg)
*How triggers deliver events from apps to your application*

# Two trigger types

| Type        | What happens                                                                                                                                                                                       | Examples                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Webhook** | The provider pushes events to a Composio-issued ingress URL in real time. Composio verifies the provider's signature, processes the payload, and fans the event out to matching trigger instances. | Slack, Asana, Notion, Outlook |
| **Polling** | Composio polls the provider on a schedule. Composio managed auth has a 15-minute minimum interval; expect that as the worst-case delay between source event and delivery.                          | Gmail, Google Calendar        |

Composio handles ingress setup on most webhook triggers. For some webhook triggers — typically when you bring your own OAuth app — providers only deliver webhooks to URLs you've registered on the OAuth app, so you'll need to register the Composio-issued ingress URL there once for events to start flowing into Composio. See [Configuring the webhook endpoint](/docs/setting-up-triggers/creating-triggers#configuring-the-webhook-endpoint).

# Working with triggers

1. **Subscribe** to events so Composio knows which URL to deliver to. One-time per project.
2. **Discover** available trigger types for a toolkit (e.g., `GITHUB_COMMIT_EVENT`).
3. **Create** an active trigger scoped to a user's connected account — see [Creating triggers](/docs/setting-up-triggers/creating-triggers), which also covers [Configuring the webhook endpoint](/docs/setting-up-triggers/creating-triggers#configuring-the-webhook-endpoint) for triggers that need it.
4. **Receive events** at your subscription URL and route on `metadata.trigger_slug`.
5. **Manage** triggers — enable, disable, or delete as needed.

**What is a trigger type?**

A trigger type is a template that defines what event to listen for and what configuration is required. For example, `GITHUB_COMMIT_EVENT` requires an `owner` and `repo`. Each toolkit exposes its own set of trigger types.

**What is a trigger instance?**

When you create a trigger from a type, it's scoped to a specific [user and connected account](/docs/how-composio-works). For example, creating a `GITHUB_COMMIT_EVENT` trigger for user `alice` on the `composio` repo produces a trigger instance with its own `ti_*` ID that you can enable, disable, or delete independently.

> Triggers are scoped to a connected account. If you haven't set up authentication yet, see [Authentication](/docs/authentication).

# Next steps

- [Subscribing to events](/docs/setting-up-triggers/subscribing-to-events): One-time per project: tell Composio which URL to deliver events to

- [Creating triggers](/docs/setting-up-triggers/creating-triggers): Inspect a trigger type and create trigger instances via the SDK or dashboard

- [Verifying webhooks](/docs/webhook-verification): Verify webhook signatures and understand payload versions

- [Managing triggers](/docs/setting-up-triggers/managing-triggers): Discover, list, enable, disable, and delete triggers

- [Example: Gmail labeler](/cookbooks/gmail-labeler): Build an automated email labeling agent using triggers

---
