---
type: composio_doc
title: "Toolkits"
source: "https://docs.composio.dev/reference/api-reference/toolkits.md"
source_hash: "3c1b719bd5fdb6d9f0d96763f2e0b7333507d531611c2df7995dfd5fa856574f"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/toolkits.md"
original_doc_path: "reference/api-reference/toolkits.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Toolkits (/reference/api-reference/toolkits)
Source: https://docs.composio.dev/reference/api-reference/toolkits.md


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/toolkits.mdx, not this file. */}

A toolkit is a collection of related tools for a single app, like `gmail`, `github`, or `slack`. Each toolkit groups the actions for that service, its authentication requirements, and the trigger types it exposes.

Reach for these endpoints when you want to:

* List the toolkits in the catalog, sorted by popularity, to browse what is available before configuring a session.
* Fetch a single toolkit by `slug` for its name, logo, categories, and metadata.
* Fetch several toolkits at once with the multi endpoint.
* List the available toolkit categories to filter the catalog by use case.
* Read the toolkits changelog to track when tools or schemas change.

These endpoints authenticate with your project API key in the `x-api-key` header.

> Tools within a toolkit are versioned. When you execute a tool, resolve to a known version with `toolkit_versions=latest` or a pinned dated version. See the [toolkit versioning migration guide](/docs/migration-guide/toolkit-versioning).

To browse toolkits visually, see the [toolkits catalog](/toolkits). For the concepts and SDK usage, see [Tools and toolkits](/docs/how-composio-works) and [Configuring sessions](/docs/configuring-sessions).

## Endpoints [#endpoints]

| Method | Path | Endpoint |
| --- | --- | --- |
| `DELETE` | `/api/v3.1/custom/toolkits/{slug}` | [Delete a custom toolkit](/reference/api-reference/toolkits/deleteCustomToolkitsBySlug) |
| `POST` | `/api/v3.1/toolkits/{toolkit_slug}/scopes/recommended` | [Get required scopes](/reference/api-reference/toolkits/recommendToolkitScopes) |
| `GET` | `/api/v3.1/toolkits/{toolkit_slug}/scopes/grant_context` | [List grant_context options](/reference/api-reference/toolkits/recommendToolkitScopesGrantContext) |
| `GET` | `/api/v3.1/toolkits` | [List available toolkits](/reference/api-reference/toolkits/getToolkits) |
| `GET` | `/api/v3.1/toolkits/categories` | [List toolkit categories](/reference/api-reference/toolkits/getToolkitsCategories) |
| `POST` | `/api/v3.1/custom/toolkits/upsert` | [Upsert a custom toolkit](/reference/api-reference/toolkits/postCustomToolkitsUpsert) |
| `POST` | `/api/v3.1/custom/toolkits/sync` | [Sync a custom toolkit](/reference/api-reference/toolkits/postCustomToolkitsSync) |
| `GET` | `/api/v3.1/toolkits/{slug}` | [Get toolkit by slug](/reference/api-reference/toolkits/getToolkitsBySlug) |
| `POST` | `/api/v3.1/toolkits/multi` | [Fetch multiple toolkits](/reference/api-reference/toolkits/postToolkitsMulti) |
| `GET` | `/api/v3.1/toolkits/changelog` | [Get toolkits changelog](/reference/api-reference/toolkits/getToolkitsChangelog) |

---
