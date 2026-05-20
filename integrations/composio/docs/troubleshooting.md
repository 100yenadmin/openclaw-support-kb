---
type: composio_doc
title: "Troubleshooting"
source: "https://docs.composio.dev/docs/troubleshooting.md"
source_hash: "ccab5be59a642442f6a393f69bf6f468d1f666216098c4756fc5784c2ee8d721"
system: "composio"
kb_namespace: "composio"
doc_path: "troubleshooting.md"
original_doc_path: "troubleshooting.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Troubleshooting (/docs/troubleshooting)
Source: https://docs.composio.dev/docs/troubleshooting.md


import { Bug, Brain, Sparkles, MessageCircle, MessageSquare, BookOpen, Mail, AlertCircle } from 'lucide-react';

This section is designed to help you quickly identify and resolve common issues encountered with Composio.

# Common queries

**How do I find the log ID for a failed tool execution?**

Every tool execution response includes a `log_id` field. You can also find it in the [dashboard logs](https://dashboard.composio.dev/~/project/logs) under **Logs > Tools**. Use this ID when reporting issues to support.

See [Troubleshooting tools](/docs/troubleshooting/tools#reporting-tool-issues) for more details.

**How do I find my auth config ID or connected account ID?**

Go to the [dashboard](https://dashboard.composio.dev) and navigate to **Auth Configs** for your auth config ID, or **Connected Accounts** for the connected account ID. Both IDs are visible in the detail view of each entry.

See [Troubleshooting authentication](/docs/troubleshooting/authentication#reporting-authentication-issues) for screenshots.

**How do I find my MCP server ID?**

Your MCP server ID is the UUID in the server URL (e.g., `https://backend.composio.dev/v3/mcp//mcp`). You can also find it in the [dashboard](https://dashboard.composio.dev) under your MCP server's detail page.

See [Troubleshooting MCP](/docs/troubleshooting/mcp#reporting-mcp-issues) for a visual guide.

**How do I get the request ID for API debugging?**

Add an `x-request-id` header with a UUID to your API request. This lets support trace your exact request in server logs.

```bash
curl 'https://backend.composio.dev/api/v3.1/tools' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'x-request-id: YOUR_UUID_HERE'
```

Generate a UUID at [uuidgenerator.net](https://www.uuidgenerator.net/). See [Troubleshooting API](/docs/troubleshooting/api#reporting-api-issues).

**How do I find the trigger ID for a trigger instance?**

Go to the [dashboard](https://dashboard.composio.dev) and navigate to **Active Triggers**. The trigger ID is shown for each trigger instance.

See [Troubleshooting triggers](/docs/troubleshooting/triggers#reporting-issues) for a screenshot.

**Why does the API return fewer tools than the platform UI?**

The Get Tools API defaults to the base toolkit version (`00000000_00`) when `toolkit_versions` is not specified. Pass `toolkit_versions=latest` to get all available tools.

See [Troubleshooting tools](/docs/troubleshooting/tools#api-returning-fewer-tools-than-expected) for details.

# Quick links

- [Errors Reference](/reference/errors): }>
HTTP status codes and how to resolve common errors.

- [Report issues](https://github.com/ComposioHQ/composio/issues/new?labels=bug): }>
Found a bug? Please create a Github issue!

- [Ask AI](https://deepwiki.com/ComposioHQ/composio): }>
Try to use Ask AI in the docs or deepwiki to get the fastest responses on features, types, and best practices.

- [Feature requests](https://github.com/ComposioHQ/composio/issues/new?labels=enhancement): }>
Have an idea for improving Composio? Share your feature suggestions with us and we will prioritise your requests

- [Ask the community](https://github.com/ComposioHQ/composio/discussions): }>
Join our GitHub discussions to get help from the community

- [Discord community](https://discord.com/channels/1170785031560646836/1268871288156323901): }>
Post support queries on our discord channel

- [Contact Support](mailto:support@composio.dev): }>
Reach out to support for account, billing, or escalations

- [Migration guides](/docs/migration-guide): }>
Check out our migration guides to help you upgrade to the latest version.

---
