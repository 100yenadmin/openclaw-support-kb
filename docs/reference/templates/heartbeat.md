---
type: openclaw_doc
title: "HEARTBEAT.md template"
source: "https://docs.openclaw.ai/reference/templates/HEARTBEAT"
source_hash: "ddef96b39f31962b421146cc38f1f63f8367c499a478c85693b779fca1c001e8"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/templates/heartbeat.md"
original_doc_path: "reference/templates/heartbeat.md"
duplicate_index: 1
---

# HEARTBEAT.md template
Source: https://docs.openclaw.ai/reference/templates/HEARTBEAT

# HEARTBEAT.md template

`HEARTBEAT.md` lives in the agent workspace. Keep the file empty, or with only Markdown comments and headings, when you want OpenClaw to skip heartbeat model calls.

The default runtime template is:

```markdown
# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.
```

Add short tasks below the comments only when you want the agent to check something periodically. Keep heartbeat instructions small because they are read during recurring wakes.

## Related

- [Heartbeat config](/gateway/config-agents)

---
