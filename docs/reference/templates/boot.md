---
type: openclaw_doc
title: "BOOT.md template"
source: "https://docs.openclaw.ai/reference/templates/BOOT"
source_hash: "e1f42332a7f9533006ed86c3a0785ca19a26d52bbbc477fe246aba8c1e49e0e1"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/templates/boot.md"
original_doc_path: "reference/templates/boot.md"
duplicate_index: 1
---

# BOOT.md template
Source: https://docs.openclaw.ai/reference/templates/BOOT

# BOOT.md

Add short, explicit startup instructions here. The bundled `boot-md` hook runs this file once per agent workspace every time the gateway starts, if the file exists and has non-whitespace content. Multiple agents sharing a workspace only trigger one run.

The hook ships disabled. Enable it first:

```bash
openclaw hooks enable boot-md
```

If a checklist item sends a message, use the message tool, then reply with the exact silent token `NO_REPLY` (case-insensitive).

## Related

- [Agent workspace](/concepts/agent-workspace)
- [Hooks](/automation/hooks#boot-md)

---
