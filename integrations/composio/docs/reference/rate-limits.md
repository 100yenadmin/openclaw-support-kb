---
type: composio_doc
title: "Rate Limits"
source: "https://docs.composio.dev/reference/rate-limits.md"
source_hash: "63f7dc5da20cd3b330f6b46ab43ba887529d51282e35a8f0536550273a273df2"
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


Composio enforces rate limits **per organization** over a fixed one-minute window. Every authenticated endpoint draws from the same budget — tool execution, connected accounts, triggers, and the rest — so the limit below is your organization's total across all API calls.

# Rate limits by plan [#rate-limits-by-plan]

| Plan       | Rate limit      | Window   |
| ---------- | --------------- | -------- |
| Starter    | 2,000 requests  | 1 minute |
| Hobby      | 2,000 requests  | 1 minute |
| Growth     | 10,000 requests | 1 minute |
| Enterprise | Custom          | -        |

# Rate limit headers [#rate-limit-headers]

Every response includes headers so you can track usage without guessing:

| Header                    | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `X-RateLimit`             | Total requests allowed in the current window            |
| `X-RateLimit-Remaining`   | Requests remaining in the current window                |
| `X-RateLimit-Window-Size` | Window size (e.g., `60s` for 60 seconds)                |
| `Retry-After`             | Seconds until the window resets (only on 429 responses) |

# Rate limit response [#rate-limit-response]

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "message": "Rate limit exceeded. Limit: 10000 requests per 1 minutes"
}
```

# Best practices [#best-practices]

1. **Watch `X-RateLimit-Remaining`** — read it on each response to know how much headroom you have left in the window.

2. **Honor `Retry-After`** — on a `429`, wait the number of seconds it gives you before retrying instead of hammering the endpoint.

3. **Cache what doesn't change** — keep tool definitions and other static data client-side so you don't spend requests re-fetching them.

# Need higher limits? [#need-higher-limits]

If you hit these limits regularly, upgrade your plan or [talk to us](https://calendly.com/composiohq/enterprise) about custom limits for your use case.

- [Errors](/reference/errors):
Understanding API error responses

- [Pricing](https://composio.dev/pricing):
Compare plans and limits

---
