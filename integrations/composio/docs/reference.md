---
type: composio_doc
title: "Overview"
source: "https://docs.composio.dev/reference.md"
source_hash: "8b705728efbbe97e2903af89cc765a6b6cffeb9ea0c889b03c56be9fea3ccb85"
system: "composio"
kb_namespace: "composio"
doc_path: "reference.md"
original_doc_path: "reference.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Overview (/reference)
Source: https://docs.composio.dev/reference.md


Composio powers tool discovery, execution, authentication, and context management for your AI agents with 1000+ toolkits. This reference covers our REST APIs and SDKs.

# Quick Reference [#quick-reference]

* **Base URL**:
* **[Authenticating to Composio](/reference/authenticating-to-composio)**: `x-api-key` (project) or `x-org-api-key` (organization) header
* **[Rate Limits](/reference/rate-limits)**: 2K-10K requests per minute (plan-dependent)

# REST API [#rest-api]

| API                                                               | Description                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| [Tool Router](/reference/api-reference/tool-router)               | Session-based API for AI agents to discover and execute tools |
| [Tools](/reference/api-reference/tools)                           | List, search, and execute individual actions                  |
| [Connected Accounts](/reference/api-reference/connected-accounts) | Manage user OAuth connections to apps                         |
| [Auth Configs](/reference/api-reference/auth-configs)             | Configure how users authenticate to toolkits                  |
| [Triggers](/reference/api-reference/triggers)                     | Subscribe to webhooks from connected apps                     |
| [Toolkits](/reference/api-reference/toolkits)                     | Browse available apps and their tools                         |

# SDK Reference [#sdk-reference]

- [TypeScript SDK](/reference/sdk-reference/typescript):
TypeScript SDK reference

- [Python SDK](/reference/sdk-reference/python):
Python SDK reference

---
