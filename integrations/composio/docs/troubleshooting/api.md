---
type: composio_doc
title: "API"
source: "https://docs.composio.dev/docs/troubleshooting/api.md"
source_hash: "814c5d96d67207284569124aa02ca0582a34570fe98e7634ae02ab1948c8a0a4"
system: "composio"
kb_namespace: "composio"
doc_path: "troubleshooting/api.md"
original_doc_path: "troubleshooting/api.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# API (/docs/troubleshooting/api)
Source: https://docs.composio.dev/docs/troubleshooting/api.md


> For a complete list of error codes and their meanings, see [Errors Reference](/reference/errors).

# Reporting API issues

When reporting API issues to support, provide the following:

* **cURL command**: Include the exact cURL to reproduce the issue

* **Request ID**: Add `x-request-id: <uuid>` header to your request and share the UUID (generate at [uuidgenerator.net](https://www.uuidgenerator.net/))

```bash
curl 'https://backend.composio.dev/api/v3.1/tools' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'x-request-id: YOUR_UUID_HERE'
```

* **Error details**: Share the complete error message. For example:

```json
{
  "error": {
    "message": "Validation error while processing request",
    "error_code": 10400,
    "suggested_fix": "Please check the payload.",
    "errors": [
      "Error in payload.text.arguments: Only one of 'text' or 'arguments' must be provided"
    ]
  }
}
```

* **Reproduction steps**: Include any steps needed to reproduce the issue

# Getting help

* **Email**: [support@composio.dev](mailto:support@composio.dev)
* **Discord**: [#support-form](https://discord.com/channels/1170785031560646836/1268871288156323901)

---
