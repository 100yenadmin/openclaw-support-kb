---
type: composio_doc
title: "Managed Auth"
source: "https://docs.composio.dev/toolkits/managed-auth.md"
source_hash: "ebb5e74dc042d1e7c99c51b06e39a53d8c16d9bb25dd4889f1417c7dd7ceb16e"
system: "composio"
kb_namespace: "composio"
doc_path: "toolkits/managed-auth.md"
original_doc_path: "toolkits/managed-auth.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Managed Auth (/toolkits/managed-auth)
Source: https://docs.composio.dev/toolkits/managed-auth.md


Toolkits with managed auth work out of the box with no OAuth setup. For toolkits without managed auth, you need to provide your own credentials.

You can also check programmatically whether a toolkit has managed auth:

```bash
curl 'https://backend.composio.dev/api/v3.1/toolkits/posthog' \
  -H 'x-api-key: YOUR_API_KEY'
```

See [When to use your own developer credentials](/docs/custom-app-vs-managed-app) for help deciding which approach fits your use case.

---
