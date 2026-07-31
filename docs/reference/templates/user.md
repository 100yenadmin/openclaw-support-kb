---
type: openclaw_doc
title: "USER template"
source: "https://docs.openclaw.ai/reference/templates/USER"
source_hash: "2d526dd3f08df50dd439d4f441aebb34944a0602c4dd7dd53baf6da25e2bf8c6"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/templates/user.md"
original_doc_path: "reference/templates/user.md"
duplicate_index: 1
---

# USER template
Source: https://docs.openclaw.ai/reference/templates/USER

# USER.md - User Model

Store stable user preferences and profile facts as directives that can guide future sessions.

Use one directive per entry:

```md
<!-- observed: YYYY-MM-DD | status: active -->

- Prefer concise progress updates during implementation work.
```

- Begin each directive with an imperative such as `Always`, `Never`, or `Prefer`.
- Record the observation date and either `active` or `superseded` on the metadata line.
- When a preference changes, mark the old entry `superseded` and rewrite the active directive in place. Never append a contradictory active directive.
- Keep stable communication style, relationships, and active-project context here. Put durable non-profile facts and decisions in `MEMORY.md`.

## Directives

<!-- observed: YYYY-MM-DD | status: active -->

- Prefer ...

## Related

- [Agent workspace](/concepts/agent-workspace)

---
