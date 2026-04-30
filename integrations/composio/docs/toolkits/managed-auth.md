---
type: composio_doc
title: "Managed Auth"
source: "https://docs.composio.dev/toolkits/managed-auth.md"
source_hash: "4b0d69de9c9801a5701b2f5ac0916fd3dd17305655ab4bb7ad5a0ac52e68f194"
doc_path: "toolkits/managed-auth.md"
original_doc_path: "toolkits/managed-auth.md"
duplicate_index: 1
---

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
