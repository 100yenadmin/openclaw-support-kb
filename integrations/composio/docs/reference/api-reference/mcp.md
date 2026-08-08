---
type: composio_doc
title: "MCP"
source: "https://docs.composio.dev/reference/api-reference/mcp.md"
source_hash: "0a0d3003543e6f307f58f7505826d14660b56d049887bba9b9e4da8f7a61fd60"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/mcp.md"
original_doc_path: "reference/api-reference/mcp.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# MCP (/reference/api-reference/mcp)
Source: https://docs.composio.dev/reference/api-reference/mcp.md


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/mcp.mdx, not this file. */}

> This API is deprecated. Use a session's MCP endpoint instead. Create a session with `composio.create(userId, { mcp: true })`, then read the hosted URL off `session.mcp.url`. See [Using sessions via MCP](/docs/sessions-via-mcp) and [migrating MCP servers to sessions](/docs/migration-guide/mcp-servers-to-sessions).

The MCP API is the standalone, hosted [Model Context Protocol](https://modelcontextprotocol.io) server-management surface. It let you stand up and manage a separate server config per toolkit, then mint a per-user MCP URL that any MCP-compatible client could connect to.

These endpoints create, list, update, and delete MCP servers, including custom servers spanning multiple apps, generate per-user MCP URLs, and manage per-user server instances and their connected accounts.

Sessions replace this. A single `composio.create(...)` gives you the same MCP URL pattern, keyed by `user_id`, while handling tool discovery, authentication, context, and versioning for you. Your existing tools, auth configs (`ac_…`), and connected accounts carry over with no re-authentication. To pin a session to a fixed tool list the way a server did, use the direct-tools preset described in [Configuring sessions](/docs/configuring-sessions).

# Endpoints [#endpoints]

| Method | Path | Endpoint |
| --- | --- | --- |
| `GET` | `/api/v3.1/mcp/servers` | [List MCP servers with optional filters and pagination](/reference/api-reference/mcp/getMcpServers) |
| `POST` | `/api/v3.1/mcp/servers` | [Create a new MCP server](/reference/api-reference/mcp/postMcpServers) |
| `POST` | `/api/v3.1/mcp/servers/custom` | [Create a new custom MCP server with multiple apps](/reference/api-reference/mcp/postMcpServersCustom) |
| `POST` | `/api/v3.1/mcp/servers/generate` | [Generate MCP URL with custom parameters](/reference/api-reference/mcp/postMcpServersGenerate) |
| `GET` | `/api/v3.1/mcp/{id}` | [Get MCP server details by ID](/reference/api-reference/mcp/getMcpById) |
| `PATCH` | `/api/v3.1/mcp/{id}` | [Update MCP server configuration](/reference/api-reference/mcp/patchMcpById) |
| `DELETE` | `/api/v3.1/mcp/{id}` | [Delete an MCP server](/reference/api-reference/mcp/deleteMcpById) |
| `GET` | `/api/v3.1/mcp/app/{appKey}` | [List MCP servers for a specific app](/reference/api-reference/mcp/getMcpAppByAppKey) |
| `GET` | `/api/v3.1/mcp/servers/{serverId}/instances` | [List all instances for an MCP server](/reference/api-reference/mcp/getMcpServersByServerIdInstances) |
| `POST` | `/api/v3.1/mcp/servers/{serverId}/instances` | [Create a new MCP server instance](/reference/api-reference/mcp/postMcpServersByServerIdInstances) |
| `DELETE` | `/api/v3.1/mcp/servers/{serverId}/instances/{instanceId}` | [Delete an MCP server instance and associated connected accounts](/reference/api-reference/mcp/deleteMcpServersByServerIdInstancesByInstanceId) |

---
