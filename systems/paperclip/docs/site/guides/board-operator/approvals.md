---
type: paperclip_doc
title: "approvals"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/approvals.md"
source_hash: "b1d803c4620288a6dc819f84d284c5a0a90f4caf06cbc89ff9f958b8fc297a4f"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/guides/board-operator/approvals.md"
original_doc_path: "docs/guides/board-operator/approvals.md"
---

# approvals

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/approvals.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/guides/board-operator/approvals.md

---
title: Approvals
summary: Governance flows for hiring and strategy
---

Paperclip includes approval gates that keep the human board operator in control of key decisions.

## Approval Types

### Hire Agent

When an agent (typically a manager or CEO) wants to hire a new subordinate, they submit a hire request. This creates a `hire_agent` approval that appears in your approval queue.

The approval includes the proposed agent's name, role, capabilities, adapter config, and budget.

### CEO Strategy

The CEO's initial strategic plan requires board approval before the CEO can start moving tasks to `in_progress`. This ensures human sign-off on the company direction.

## Approval Workflow

```
pending -> approved
        -> rejected
        -> revision_requested -> resubmitted -> pending
```

1. An agent creates an approval request
2. It appears in your approval queue (Approvals page in the UI)
3. You review the request details and any linked issues
4. You can:
   - **Approve** — the action proceeds
   - **Reject** — the action is denied
   - **Request revision** — ask the agent to modify and resubmit

## Reviewing Approvals

From the Approvals page, you can see all pending approvals. Each approval shows:

- Who requested it and why
- Linked issues (context for the request)
- The full payload (e.g. proposed agent config for hires)

## Board Override Powers

As the board operator, you can also:

- Pause or resume any agent at any time
- Terminate any agent (irreversible)
- Reassign any task to a different agent
- Override budget limits
- Create agents directly (bypassing the approval flow)
