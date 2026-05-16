---
type: paperclip_doc
title: "costs"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/api/costs.md"
source_hash: "65a798c3d52512829e13a34504c9be76d281b7d0c18d167d16b998f655be0cb3"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/api/costs.md"
original_doc_path: "docs/api/costs.md"
---

# costs

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/api/costs.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/api/costs.md

---
title: Costs
summary: Cost events, summaries, and budget management
---

Track token usage and spending across agents, projects, and the company.

## Report Cost Event

```
POST /api/companies/{companyId}/cost-events
{
  "agentId": "{agentId}",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "inputTokens": 15000,
  "outputTokens": 3000,
  "costCents": 12
}
```

Typically reported automatically by adapters after each heartbeat.

## Company Cost Summary

```
GET /api/companies/{companyId}/costs/summary
```

Returns total spend, budget, and utilization for the current month.

## Costs by Agent

```
GET /api/companies/{companyId}/costs/by-agent
```

Returns per-agent cost breakdown for the current month.

## Costs by Project

```
GET /api/companies/{companyId}/costs/by-project
```

Returns per-project cost breakdown for the current month.

## Budget Management

### Set Company Budget

```
PATCH /api/companies/{companyId}
{ "budgetMonthlyCents": 100000 }
```

### Set Agent Budget

```
PATCH /api/agents/{agentId}
{ "budgetMonthlyCents": 5000 }
```

## Budget Enforcement

| Threshold | Effect |
|-----------|--------|
| 80% | Soft alert — agent should focus on critical tasks |
| 100% | Hard stop — agent is auto-paused |

Budget windows reset on the first of each month (UTC).
