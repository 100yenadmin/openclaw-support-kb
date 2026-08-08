---
type: composio_doc
title: "Overview"
source: "https://docs.composio.dev/reference.md"
source_hash: "e27ddc9f2f896d4e0f8441b3bcc6f8fdcdcb2620ecad5a43fc1a476cd0a66f3a"
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


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

Composio powers tool discovery, execution, authentication, and context management for your AI agents with 1000+ toolkits. This reference covers our REST APIs and SDKs.

# Quick Reference [#quick-reference]

* **Base URL**: `https://backend.composio.dev/api/v3.1`
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
