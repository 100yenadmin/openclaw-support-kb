---
type: composio_doc
title: "Rate Limits"
source: "https://docs.composio.dev/reference/rate-limits.md"
source_hash: "d88be566290f11f705ad38b3cbfd020a3443527346268cc72b1632fd5db0f874"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/rate-limits.md"
original_doc_path: "reference/rate-limits.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Rate Limits (/reference/rate-limits)
Source: https://docs.composio.dev/reference/rate-limits.md


Rate limits are enforced **per organization** and reset on a rolling 10-minute window.

# Rate limits by plan

| Plan       | Rate Limit       | Window     |
| ---------- | ---------------- | ---------- |
| Starter    | 20,000 requests  | 10 minutes |
| Hobby      | 20,000 requests  | 10 minutes |
| Growth     | 100,000 requests | 10 minutes |
| Enterprise | Unlimited        | -          |

> All authenticated API endpoints share your organization's rate limit. This includes tool execution, connected accounts, triggers, and all other API operations.

# Rate limit headers

API responses include headers to help you track your usage:

| Header                    | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `X-RateLimit`             | Total requests allowed in the current window            |
| `X-RateLimit-Remaining`   | Requests remaining in the current window                |
| `X-RateLimit-Window-Size` | Window size (e.g., `600s` for 600 seconds)              |
| `Retry-After`             | Seconds until the window resets (only on 429 responses) |

# Rate limit response

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "message": "Rate limit exceeded. Limit: 100000 requests per 10 minutes"
}
```

# Best practices

1. **Monitor your usage** - Check the `X-RateLimit-Remaining` header to track how close you are to the limit.

2. **Implement backoff** - When you receive a `429`, wait for the duration specified in `Retry-After` before retrying.

3. **Cache responses** - Cache tool definitions and other static data to reduce unnecessary API calls.

# Need higher limits?

If you're hitting rate limits regularly, consider upgrading your plan or [talk to us](https://calendly.com/composiohq/enterprise) to discuss custom limits for your use case.

- [Errors](/reference/errors):
Understanding API error responses

- [Pricing](https://composio.dev/pricing):
Compare plans and limits

---
