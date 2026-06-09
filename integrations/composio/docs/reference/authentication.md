---
type: composio_doc
title: "Overview"
source: "https://docs.composio.dev/reference/authentication.md"
source_hash: "94c1d9c60d29879f2f5223ba8359252690aa0dd3174fd569250459eeb084f7ba"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/authentication.md"
original_doc_path: "reference/authentication.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Overview (/reference/authentication)
Source: https://docs.composio.dev/reference/authentication.md


All Composio API endpoints require authentication via API key.

# API Key Authentication

Include your API key in the `x-api-key` header.

## Getting Your API Key

1. Sign in to [composio.dev](https://composio.dev)
2. Navigate to **Settings**
3. In **Project Settings**, copy the key from the **API Keys** section

# Organization API Key

For organization-level access across multiple projects, use the `x-org-api-key` header instead.

## Getting Your Organization API Key

1. Sign in to [composio.dev](https://composio.dev)
2. Navigate to **Organization Settings** → **General Settings**
3. Copy the token under **Organization Access Tokens**

# Using the API Key

Include your API key in the request header:

```bash
curl https://backend.composio.dev/api/v3.1/tools \
  -H "x-api-key: $COMPOSIO_API_KEY"
```

For organization-level endpoints:

```bash
curl https://backend.composio.dev/api/v3.1/org/projects \
  -H "x-org-api-key: $COMPOSIO_ORG_API_KEY"
```

- [Project API key permissions](/reference/authentication/project-api-key-permissions):
Scoped project API key access levels and covered routes

- [Errors](/reference/errors):
Understanding API error responses

- [Rate Limits](/reference/rate-limits):
API rate limits by plan

---
