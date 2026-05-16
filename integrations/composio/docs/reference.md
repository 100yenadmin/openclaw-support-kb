---
type: composio_doc
title: "Overview"
source: "https://docs.composio.dev/reference.md"
source_hash: "47c553991a6ad0fcbab6374fb936bfc5bc1691a569f4d9a45972bfab0b569785"
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

# Quick Reference

* **Base URL**:
* **[Authentication](/reference/authentication)**: `x-api-key` (project) or `x-org-api-key` (organization) header
* **[Rate Limits](/reference/rate-limits)**: 20K-100K requests per 10 minutes (plan-dependent)

# REST API

| API                                                               | Description                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| [Tool Router](/reference/api-reference/tool-router)               | Session-based API for AI agents to discover and execute tools |
| [Tools](/reference/api-reference/tools)                           | List, search, and execute individual actions                  |
| [Connected Accounts](/reference/api-reference/connected-accounts) | Manage user OAuth connections to apps                         |
| [Auth Configs](/reference/api-reference/auth-configs)             | Configure how users authenticate to toolkits                  |
| [Triggers](/reference/api-reference/triggers)                     | Subscribe to webhooks from connected apps                     |
| [Toolkits](/reference/api-reference/toolkits)                     | Browse available apps and their tools                         |

# SDK Reference

- [TypeScript SDK](/reference/sdk-reference/typescript):
TypeScript SDK reference

- [Python SDK](/reference/sdk-reference/python):
Python SDK reference

---
