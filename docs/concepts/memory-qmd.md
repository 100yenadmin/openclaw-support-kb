---
type: openclaw_doc
title: "QMD memory backend removal"
source: "https://docs.openclaw.ai/concepts/memory-qmd"
source_hash: "b46c3f460cec2570e03ff2e86c5f2dd5792e4fc5b0139274dc0385de876bdd24"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "concepts/memory-qmd.md"
original_doc_path: "concepts/memory-qmd.md"
duplicate_index: 1
---

# QMD memory backend removal
Source: https://docs.openclaw.ai/concepts/memory-qmd

# QMD memory backend removal

The optional QMD memory backend has been removed. Builtin memory is now the only memory engine.

Run `openclaw doctor --fix` to remove retired `memory.backend`, `memory.qmd.*`, and
`memory.search.qmd.*` settings, including agent-scoped variants. Your Markdown memory sources are
indexed by the builtin engine on its next sync. Doctor preserves configured QMD paths and extra
collections in the corresponding `memory.search.extraPaths` setting, including root-relative glob
patterns. QMD indexes, exported session Markdown, downloaded models, and collection metadata are
derived state and do not require migration.

See [Memory](/concepts/memory) for the current architecture and configuration.

---
