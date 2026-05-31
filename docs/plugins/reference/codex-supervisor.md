---
type: openclaw_doc
title: "Codex Supervisor plugin"
source: "https://docs.openclaw.ai/plugins/reference/codex-supervisor"
source_hash: "49a846bf032946d3ce930f10cdffc86b6da692e76f0af7c42616919d079929a9"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/codex-supervisor.md"
original_doc_path: "plugins/reference/codex-supervisor.md"
duplicate_index: 1
---

# Codex Supervisor plugin
Source: https://docs.openclaw.ai/plugins/reference/codex-supervisor

# Codex Supervisor plugin

Supervise Codex app-server sessions from OpenClaw.

## Distribution

- Package: `@openclaw/codex-supervisor`
- Install route: included in OpenClaw

## Surface

contracts: tools

<!-- openclaw-plugin-reference:manual-start -->

## Session Listing

`codex_sessions_list` defaults to loaded Codex sessions only. Set `include_stored` to include stored history; the plugin uses Codex app-server's state-DB-only listing path and caps stored results at 200 by default. Pass `max_stored_sessions` to lower or raise that cap, up to 1000.

<!-- openclaw-plugin-reference:manual-end -->

---
