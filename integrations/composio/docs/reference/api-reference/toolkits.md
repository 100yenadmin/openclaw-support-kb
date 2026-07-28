---
type: composio_doc
title: "Toolkits"
source: "https://docs.composio.dev/reference/api-reference/toolkits.md"
source_hash: "62304467ce9805f05bc39f694ef580fcb6fe20daada85b8eaa42306239c4aaae"
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

# Endpoints [#endpoints]

---
