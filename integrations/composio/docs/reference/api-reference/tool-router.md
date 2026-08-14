---
type: composio_doc
title: "Sessions (prev Tool Router)"
source: "https://docs.composio.dev/reference/api-reference/tool-router.md"
source_hash: "5251e803f8920abd84dbe9f0921c28da355b2c7da82002e871ce714e46bb4d6b"
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


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/tool-router.mdx, not this file. */}

These are Composio's session endpoints. A **session** is the runtime context your agent uses to work for one of your users: it scopes which user's connected accounts are in play, which tools are available, how authentication happens, and where execution state lives. Read [What is a session?](/docs/how-composio-works) for the full concept.

> Sessions were formerly called the "tool router", which is why these endpoints live under `tool_router`. They are the same thing.

In the SDK you do not call these endpoints directly. Use `composio.create(...)` to start a session and `composio.use(...)` to resume one, then call `session.tools()`, `session.execute(...)`, and `session.authorize(...)` on the returned object.

Reach for the raw API when you need lower-level control: creating and patching a session config, attaching to an existing session, searching for tools, executing tools and meta tools, opening link sessions for auth, proxying authenticated requests, and reading or writing files in a session mount.

See [Configuring sessions](/docs/configuring-sessions) for toolkits, auth configs, account selection, and presets.

## Endpoints [#endpoints]

| Method | Path | Endpoint |
| --- | --- | --- |
| `POST` | `/api/v3.1/tool_router/session` | [Create a new tool router session](/reference/api-reference/tool-router/postToolRouterSession) |
| `GET` | `/api/v3.1/tool_router/session/{session_id}` | [Get a tool router session by ID (v3.1)](/reference/api-reference/tool-router/getToolRouterSessionBySessionId) |
| `PATCH` | `/api/v3.1/tool_router/session/{session_id}` | [Patch a tool router session config (v3.1)](/reference/api-reference/tool-router/patchToolRouterSessionBySessionId) |
| `DELETE` | `/api/v3.1/tool_router/session/{session_id}` | [Delete a tool router session](/reference/api-reference/tool-router/deleteToolRouterSessionBySessionId) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/attach` | [Attach to an existing tool router session (v3.1)](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdAttach) |
| `GET` | `/api/v3.1/tool_router/session/{session_id}/config_history` | [List a tool router session config history](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdConfigHistory) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/search` | [Search for tools using a query](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdSearch) |
| `GET` | `/api/v3.1/tool_router/session/{session_id}/tools` | [List tools with schemas for a tool router session (v3.1)](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdTools) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/execute` | [Execute a tool within a tool router session](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecute) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/execute_meta` | [Execute a meta tool within a tool router session](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdExecuteMeta) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/link` | [Create a link session for a toolkit in a tool router session](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdLink) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/proxy_execute` | [Execute proxy request within a tool router session](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdProxyExecute) |
| `GET` | `/api/v3.1/tool_router/session/{session_id}/toolkits` | [Get toolkits for a tool router session](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdToolkits) |
| `GET` | `/api/v3.1/tool_router/session/{session_id}/mounts/{mount_id}/items` | [List files in a session mount](/reference/api-reference/tool-router/getToolRouterSessionBySessionIdMountsByMountIdItems) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/mounts/{mount_id}/download_url` | [Create a presigned download URL for a mount file](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdMountsByMountIdDownloadUrl) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/mounts/{mount_id}/upload_url` | [Create a presigned upload URL for a mount file](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdMountsByMountIdUploadUrl) |
| `POST` | `/api/v3.1/tool_router/session/{session_id}/mounts/{mount_id}/delete` | [Delete a file from a session mount](/reference/api-reference/tool-router/postToolRouterSessionBySessionIdMountsByMountIdDelete) |

---
