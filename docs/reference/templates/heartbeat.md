---
type: openclaw_doc
title: "HEARTBEAT.md template"
source: "https://docs.openclaw.ai/reference/templates/HEARTBEAT"
source_hash: "ba65c3c92e698e1e77c335f5efdb11a415917240a2bd34e0c89135d188a82128"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/templates/heartbeat.md"
original_doc_path: "reference/templates/heartbeat.md"
duplicate_index: 1
---

# HEARTBEAT.md template
Source: https://docs.openclaw.ai/reference/templates/HEARTBEAT

# HEARTBEAT.md template

`HEARTBEAT.md` lives in the agent workspace and holds the periodic heartbeat checklist. Keep it empty, or with only whitespace, Markdown comments, ATX headings, empty list stubs (`- `, `* [ ]`), or fence markers, to make OpenClaw skip the heartbeat model call entirely (`reason=empty-heartbeat-file`).

Shipped default content:

```markdown
<!-- Heartbeat template; comments-only content prevents scheduled heartbeat API calls. -->

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.
```

Add short tasks below the comment lines only when you want periodic checks. Keep it small: heartbeat runs read this file every tick (default every 30 minutes), so bloated instructions burn tokens on every wake.

For due-only checks instead of a plain checklist, use a structured `tasks:` block with per-task `interval` and `prompt` fields; see [HEARTBEAT.md](/gateway/heartbeat#heartbeatmd-optional) for the format and behavior.

## Related

- [Heartbeat](/gateway/heartbeat)
- [Heartbeat config](/gateway/config-agents)

---
