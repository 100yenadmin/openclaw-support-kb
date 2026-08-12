---
type: composio_doc
title: "Logs"
source: "https://docs.composio.dev/reference/api-reference/logs.md"
source_hash: "899dfb20e486a985a946c49936957e40be1858d01433ca9a2aec06daae9c2063"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/logs.md"
original_doc_path: "reference/api-reference/logs.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Logs (/reference/api-reference/logs)
Source: https://docs.composio.dev/reference/api-reference/logs.md


> **API version:** This page documents Composio REST API v3.1, the current version, at `https://backend.composio.dev/api/v3.1`. `https://backend.composio.dev/api/v3` is the previous version and remains supported.

{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/logs.mdx, not this file. */}

The Logs API returns **individual tool execution events**, one record per tool call. Use it to debug failures, inspect request/response payloads, and trace specific user activity. For aggregated counts (how many tool calls happened), use the [Usage API](/reference/api-reference/organization) instead.

All endpoints in this section require a **project API key** (`x-api-key`) or a valid session cookie.

## List logs [#list-logs]

```bash
curl -X POST https://backend.composio.dev/api/v3.1/logs/tool_execution \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 20,
    "time_range": {
      "from": 1744848000000,
      "to": 1744934400000
    },
    "filters": [
      { "field": "toolkit_slug", "operator": "==", "value": "gmail" },
      { "field": "status", "operator": "==", "value": "failed" }
    ]
  }'
```

The response contains a page of log entries and a `next_cursor`:

```json
{
  "logs": [
    {
      "id": "log_-jRTWClpBoVo",
      "timestamp": "2026-04-17T10:25:00.000Z",
      "type": "tool.execution",
      "status": "failed",
      "level": "error",
      "message": "GMAIL_SEND_EMAIL failed: invalid recipient",
      "metadata": { /* tool, toolkit, user_id, connected_account_id, ... */ },
      "metrics": { "duration_ms": 202 },
      "parent": null
    }
  ],
  "next_cursor": "eyJwYWdlIjoyfQ=="
}
```

Pass `next_cursor` back as `cursor` on the next request to paginate. When `next_cursor` is `null`, you've reached the end.

### Filter fields [#filter-fields]

Pass one or more filters in the `filters` array. Filters are **AND**-combined.

| Field                  | What it matches                                             |
| ---------------------- | ----------------------------------------------------------- |
| `tool_slug`            | The specific tool that was called (e.g. `GMAIL_SEND_EMAIL`) |
| `toolkit_slug`         | The toolkit (e.g. `gmail`, `slack`, `github`)               |
| `connected_account_id` | The connected account used for the call                     |
| `auth_config_id`       | The auth config (integration) behind the connected account  |
| `status`               | `success` or `failed`                                       |
| `user_id`              | Entity that initiated the call                              |
| `session_id`           | Tool router session, if routed through a session            |
| `sandbox_id`           | Sandbox the call ran in, if applicable                      |
| `request_id`           | Request ID (useful for correlating with your own logs)      |
| `log_id`               | Exact log ID (equivalent to the detail endpoint)            |

### Operators [#operators]

| Operator       | Meaning                  |
| -------------- | ------------------------ |
| `==`           | Exact match              |
| `!=`           | Not equal                |
| `contains`     | Substring match          |
| `not_contains` | Substring does not match |

### Parameters [#parameters]

| Field             | Type           | Default | Notes                                          |
| ----------------- | -------------- | ------- | ---------------------------------------------- |
| `limit`           | number         | `20`    | Max 100                                        |
| `cursor`          | string \| null | `null`  | Opaque pagination token from previous response |
| `filters`         | array          | `[]`    | AND-combined                                   |
| `time_range.from` | number         | —       | Epoch milliseconds                             |
| `time_range.to`   | number         | —       | Epoch milliseconds                             |

## Get a single log [#get-a-single-log]

Fetch one log by ID to get the **full** payload, including request/response bodies, timing breakdowns, and source metadata:

```bash
curl https://backend.composio.dev/api/v3.1/logs/tool_execution/log_-jRTWClpBoVo \
  -H "x-api-key: YOUR_PROJECT_API_KEY"
```

The detail response includes everything from the list shape plus:

* `timings`: `start_time` and `end_time` in epoch ms
* `context`: `session_id`, `trace_id`, `request_id`
* `source`: `host` (e.g. `mcp`, `sdk`, `api`), `framework`, `language`
* `data`: the full request payload and response body

This is the endpoint to call when you need to reconstruct *exactly* what happened, for example when debugging a 500 from a user report.

## Recipes [#recipes]

### Find failed Gmail tool calls in the last hour [#find-failed-gmail-tool-calls-in-the-last-hour]

```bash
NOW=$(date +%s)000
HOUR_AGO=$(( $(date +%s) - 3600 ))000
curl -X POST https://backend.composio.dev/api/v3.1/logs/tool_execution \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"time_range\": { \"from\": ${HOUR_AGO}, \"to\": ${NOW} },
    \"filters\": [
      { \"field\": \"toolkit_slug\", \"operator\": \"==\", \"value\": \"gmail\" },
      { \"field\": \"status\", \"operator\": \"==\", \"value\": \"failed\" }
    ]
  }"
```

### Get failures for a specific user [#get-failures-for-a-specific-user]

```bash
curl -X POST https://backend.composio.dev/api/v3.1/logs/tool_execution \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [
      { "field": "user_id", "operator": "==", "value": "user_abc123" },
      { "field": "status", "operator": "==", "value": "failed" }
    ]
  }'
```

### Fetch a single log's full request/response [#fetch-a-single-logs-full-requestresponse]

```bash
curl https://backend.composio.dev/api/v3.1/logs/tool_execution/log_-jRTWClpBoVo \
  -H "x-api-key: YOUR_PROJECT_API_KEY"
```

## Endpoints [#endpoints]

| Method | Path | Endpoint |
| --- | --- | --- |
| `POST` | `/api/v3.1/logs/tool_execution` | [Search and retrieve tool execution logs](/reference/api-reference/logs/postLogsToolExecution) |
| `GET` | `/api/v3.1/logs/tool_execution/{id}` | [Get log details by ID](/reference/api-reference/logs/getLogsToolExecutionById) |

---
