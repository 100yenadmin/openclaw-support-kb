---
type: composio_doc
title: "Triggers"
source: "https://docs.composio.dev/reference/api-reference/triggers.md"
source_hash: "732f13df0d5d74227d754f780ee9263b296ffbc63ed179f599f6365a54a3114a"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/triggers.md"
original_doc_path: "reference/api-reference/triggers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Triggers (/reference/api-reference/triggers)
Source: https://docs.composio.dev/reference/api-reference/triggers.md


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/triggers.mdx, not this file. */}

Triggers let you subscribe to events from a user's connected app, such as a new Gmail message, a GitHub commit, or a Slack message, and receive the event data as a structured payload at your webhook endpoint.

There are two layers to understand:

* A **trigger type** is a template that defines what event to listen for and what configuration it needs. For example, `GITHUB_COMMIT_EVENT` requires an `owner` and a `repo`. Each toolkit exposes its own trigger types.
* A **trigger instance** is a trigger type scoped to a specific user and connected account. Creating one produces an instance with its own `ti_*` ID that you can enable, disable, or delete independently.

Reach for these endpoints when you want to:

* Discover the trigger types a toolkit offers, or fetch one type by `slug` to inspect its config and payload schema.
* Create or update a trigger instance for a connected account with the upsert endpoint.
* List active trigger instances, or enable, disable, and delete an instance by `triggerId`.

These endpoints authenticate with your project API key in the `x-api-key` header.

> Creating a trigger instance only registers it. To actually receive events, set a webhook URL for your project once, then route incoming events on `metadata.trigger_slug`. See [Subscribing to events](/docs/setting-up-triggers/subscribing-to-events).

For the full concept overview, see [Triggers](/docs/triggers).

## Endpoints [#endpoints]

| Method | Path | Endpoint |
| --- | --- | --- |
| `POST` | `/api/v3.1/trigger_instances/{slug}/upsert` | [Create or update a trigger](/reference/api-reference/triggers/postTriggerInstancesBySlugUpsert) |
| `GET` | `/api/v3.1/trigger_instances/active` | [List active triggers](/reference/api-reference/triggers/getTriggerInstancesActive) |
| `DELETE` | `/api/v3.1/trigger_instances/manage/{triggerId}` | [Delete a trigger](/reference/api-reference/triggers/deleteTriggerInstancesManageByTriggerId) |
| `PATCH` | `/api/v3.1/trigger_instances/manage/{triggerId}` | [Enable or disable a trigger](/reference/api-reference/triggers/patchTriggerInstancesManageByTriggerId) |
| `GET` | `/api/v3.1/triggers_types/list/enum` | [List trigger type enums](/reference/api-reference/triggers/getTriggersTypesListEnum) |
| `GET` | `/api/v3.1/triggers_types/{slug}` | [Get trigger type by slug](/reference/api-reference/triggers/getTriggersTypesBySlug) |
| `GET` | `/api/v3.1/triggers_types` | [List trigger types](/reference/api-reference/triggers/getTriggersTypes) |

---
