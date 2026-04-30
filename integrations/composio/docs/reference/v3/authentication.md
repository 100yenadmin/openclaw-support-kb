---
type: composio_doc
title: "Authentication"
source: "https://docs.composio.dev/reference/v3/authentication.md"
source_hash: "19d49e5abb40a843b93509d28c7367c56d5e80fea6457fdd813d8da5cb0f9dd2"
doc_path: "reference/v3/authentication.md"
original_doc_path: "reference/v3/authentication.md"
duplicate_index: 1
---

# Authentication (/reference/v3/authentication)
Source: https://docs.composio.dev/reference/v3/authentication.md


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
curl https://backend.composio.dev/api/v3/tools \
  -H "x-api-key: $COMPOSIO_API_KEY"
```

For organization-level endpoints:

```bash
curl https://backend.composio.dev/api/v3/org/projects \
  -H "x-org-api-key: $COMPOSIO_ORG_API_KEY"
```

- [Errors](/reference/v3/errors): 
Understanding API error responses

- [Rate Limits](/reference/v3/rate-limits): 
API rate limits by plan

---
