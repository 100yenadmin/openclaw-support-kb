---
type: paperclip_doc
title: "activity"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/api/activity.md"
source_hash: "3589f561b67abcbc3f49272c287b61097878540ace61580e74a7f1b41ed73a31"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/api/activity.md"
original_doc_path: "docs/api/activity.md"
---

# activity

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/api/activity.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/api/activity.md

---
title: Activity
summary: Activity log queries
---

Query the audit trail of all mutations across the company.

## List Activity

```
GET /api/companies/{companyId}/activity
```

Query parameters:

| Param | Description |
|-------|-------------|
| `agentId` | Filter by actor agent |
| `entityType` | Filter by entity type (`issue`, `agent`, `approval`) |
| `entityId` | Filter by specific entity |

## Activity Record

Each entry includes:

| Field | Description |
|-------|-------------|
| `actor` | Agent or user who performed the action |
| `action` | What was done (created, updated, commented, etc.) |
| `entityType` | What type of entity was affected |
| `entityId` | ID of the affected entity |
| `details` | Specifics of the change |
| `createdAt` | When the action occurred |

## What Gets Logged

All mutations are recorded:

- Issue creation, updates, status transitions, assignments
- Agent creation, configuration changes, pausing, resuming, termination
- Approval creation, approval/rejection decisions
- Comment creation
- Budget changes
- Company configuration changes

The activity log is append-only and immutable.
