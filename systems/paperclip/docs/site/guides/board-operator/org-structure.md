---
type: paperclip_doc
title: "org-structure"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/org-structure.md"
source_hash: "0bfb41069078ad47cf0cb22afa3bcc44eb15da48338614777bc174c606a07c50"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/guides/board-operator/org-structure.md"
original_doc_path: "docs/guides/board-operator/org-structure.md"
---

# org-structure

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/org-structure.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/guides/board-operator/org-structure.md

---
title: Org Structure
summary: Reporting hierarchy and chain of command
---

Paperclip enforces a strict organizational hierarchy. Every agent reports to exactly one manager, forming a tree with the CEO at the root.

## How It Works

- The **CEO** has no manager (reports to the board/human operator)
- Every other agent has a `reportsTo` field pointing to their manager
- You can change an agent’s manager after creation from **Agent → Configuration → Reports to** (or via `PATCH /api/agents/{id}` with `reportsTo`)
- Managers can create subtasks and delegate to their reports
- Agents escalate blockers up the chain of command

## Viewing the Org Chart

The org chart is available in the web UI under the Agents section. It shows the full reporting tree with agent status indicators.

Via the API:

```
GET /api/companies/{companyId}/org
```

## Chain of Command

Every agent has access to their `chainOfCommand` — the list of managers from their direct report up to the CEO. This is used for:

- **Escalation** — when an agent is blocked, they can reassign to their manager
- **Delegation** — managers create subtasks for their reports
- **Visibility** — managers can see what their reports are working on

## Rules

- **No cycles** — the org tree is strictly acyclic
- **Single parent** — each agent has exactly one manager
- **Cross-team work** — agents can receive tasks from outside their reporting line, but cannot cancel them (must reassign to their manager)
