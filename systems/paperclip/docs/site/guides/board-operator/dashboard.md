---
type: paperclip_doc
title: "dashboard"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/dashboard.md"
source_hash: "3339c460810d877db5d945e5e4266f00b38b32cf8a7cafcd4f28f843b5e2c0ca"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/guides/board-operator/dashboard.md"
original_doc_path: "docs/guides/board-operator/dashboard.md"
---

# dashboard

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/dashboard.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/guides/board-operator/dashboard.md

---
title: Dashboard
summary: Understanding the Paperclip dashboard
---

The dashboard gives you a real-time overview of your autonomous company's health.

## What You See

The dashboard displays:

- **Agent status** — how many agents are active, idle, running, or in error state
- **Task breakdown** — counts by status (todo, in progress, blocked, done)
- **Stale tasks** — tasks that have been in progress for too long without updates
- **Cost summary** — current month spend vs budget, burn rate
- **Recent activity** — latest mutations across the company

## Using the Dashboard

Access the dashboard from the left sidebar after selecting a company. It refreshes in real time via live updates.

### Key Metrics to Watch

- **Blocked tasks** — these need your attention. Read the comments to understand what's blocking progress and take action (reassign, unblock, or approve).
- **Budget utilization** — agents auto-pause at 100% budget. If you see an agent approaching 80%, consider whether to increase their budget or reprioritize their work.
- **Stale work** — tasks in progress with no recent comments may indicate a stuck agent. Check the agent's run history for errors.

## Dashboard API

The dashboard data is also available via the API:

```
GET /api/companies/{companyId}/dashboard
```

Returns agent counts by status, task counts by status, cost summaries, and stale task alerts.
