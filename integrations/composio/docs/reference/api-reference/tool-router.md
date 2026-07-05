---
type: composio_doc
title: "Sessions (prev Tool Router)"
source: "https://docs.composio.dev/reference/api-reference/tool-router.md"
source_hash: "b0c3dc02407f544111757b3ca860eb1d04cfda637af47518ee45b44935200fe7"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/tool-router.md"
original_doc_path: "reference/api-reference/tool-router.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Sessions (prev Tool Router) (/reference/api-reference/tool-router)
Source: https://docs.composio.dev/reference/api-reference/tool-router.md


{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/tool-router.mdx, not this file. */}

These are Composio's session endpoints. A **session** is the runtime context your agent uses to work for one of your users: it scopes which user's connected accounts are in play, which tools are available, how authentication happens, and where execution state lives. Read [What is a session?](/docs/how-composio-works) for the full concept.

> Sessions were formerly called the "tool router", which is why these endpoints live under `tool_router`. They are the same thing.

In the SDK you do not call these endpoints directly. Use `composio.create(...)` to start a session and `composio.use(...)` to resume one, then call `session.tools()`, `session.execute(...)`, and `session.authorize(...)` on the returned object.

Reach for the raw API when you need lower-level control: creating and patching a session config, attaching to an existing session, searching for tools, executing tools and meta tools, opening link sessions for auth, proxying authenticated requests, and reading or writing files in a session mount.

See [Configuring sessions](/docs/configuring-sessions) for toolkits, auth configs, account selection, and presets.

# Endpoints

---
