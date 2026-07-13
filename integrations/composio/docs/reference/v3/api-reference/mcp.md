---
type: composio_doc
title: "MCP"
source: "https://docs.composio.dev/reference/v3/api-reference/mcp.md"
source_hash: "f641bd932e2596045e04d87ff3438d0077304be0726301cdb35941c4f77e4008"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/v3/api-reference/mcp.md"
original_doc_path: "reference/v3/api-reference/mcp.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# MCP (/reference/v3/api-reference/mcp)
Source: https://docs.composio.dev/reference/v3/api-reference/mcp.md


{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/mcp.mdx, not this file. */}

> This API is deprecated. Use a session's MCP endpoint instead. In TypeScript, create a session with `composio.sessions.create(userId, { mcp: true })`, then read the hosted URL off `session.mcp.url`. See [Using sessions via MCP](/docs/sessions-via-mcp) and [migrating MCP servers to sessions](/docs/migration-guide/mcp-servers-to-sessions).

The MCP API is the standalone, hosted [Model Context Protocol](https://modelcontextprotocol.io) server-management surface. It let you stand up and manage a separate server config per toolkit, then mint a per-user MCP URL that any MCP-compatible client could connect to.

These endpoints create, list, update, and delete MCP servers, including custom servers spanning multiple apps, generate per-user MCP URLs, and manage per-user server instances and their connected accounts.

Sessions replace this. In TypeScript, a single `composio.sessions.create(...)` gives you the same MCP URL pattern, keyed by `user_id`, while handling tool discovery, authentication, context, and versioning for you. Your existing tools, auth configs (`ac_…`), and connected accounts carry over with no re-authentication. To pin a session to a fixed tool list the way a server did, use the direct-tools preset described in [Configuring sessions](/docs/configuring-sessions).

# Endpoints

---
