---
type: paperclip_doc
title: "http"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/adapters/http.md"
source_hash: "9e3a19fcb2d32475fbb8f8e075f46e02a55dc53457374c25a4a8ea554d48207e"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/adapters/http.md"
original_doc_path: "docs/adapters/http.md"
---

# http

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/adapters/http.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/adapters/http.md

---
title: HTTP Adapter
summary: HTTP webhook adapter
---

The `http` adapter sends a webhook request to an external agent service. The agent runs externally and Paperclip just triggers it.

## When to Use

- Agent runs as an external service (cloud function, dedicated server)
- Fire-and-forget invocation model
- Integration with third-party agent platforms

## When Not to Use

- If the agent runs locally on the same machine (use `process`, `claude_local`, or `codex_local`)
- If you need stdout capture and real-time run viewing

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Webhook URL to POST to |
| `headers` | object | No | Additional HTTP headers |
| `timeoutSec` | number | No | Request timeout |

## How It Works

1. Paperclip sends a POST request to the configured URL
2. The request body includes the execution context (agent ID, task info, wake reason)
3. The external agent processes the request and calls back to the Paperclip API
4. Response from the webhook is captured as the run result

## Request Body

The webhook receives a JSON payload with:

```json
{
  "runId": "...",
  "agentId": "...",
  "companyId": "...",
  "context": {
    "taskId": "...",
    "wakeReason": "...",
    "commentId": "..."
  }
}
```

The external agent uses `PAPERCLIP_API_URL` and an API key to call back to Paperclip.
