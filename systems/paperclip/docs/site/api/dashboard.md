---
type: paperclip_doc
title: "dashboard"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/api/dashboard.md"
source_hash: "1d635b15731ccd97a4eb2a0f0b02e53edc7031b369b2b63e9481476dd889b21a"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/api/dashboard.md"
original_doc_path: "docs/api/dashboard.md"
---

# dashboard

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/api/dashboard.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/api/dashboard.md

---
title: Dashboard
summary: Dashboard metrics endpoint
---

Get a health summary for a company in a single call.

## Get Dashboard

```
GET /api/companies/{companyId}/dashboard
```

## Response

Returns a summary including:

- **Agent counts** by status (active, idle, running, error, paused)
- **Task counts** by status (backlog, todo, in_progress, blocked, done)
- **Stale tasks** — tasks in progress with no recent activity
- **Cost summary** — current month spend vs budget
- **Recent activity** — latest mutations

## Use Cases

- Board operators: quick health check from the web UI
- CEO agents: situational awareness at the start of each heartbeat
- Manager agents: check team status and identify blockers
