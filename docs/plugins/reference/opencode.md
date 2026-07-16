---
type: openclaw_doc
title: "OpenCode plugin"
source: "https://docs.openclaw.ai/plugins/reference/opencode"
source_hash: "b3f0a4cb4d2f3a1999f6fe2868e9d93b702168f1c9517fb9121969aa0bfddb73"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/opencode.md"
original_doc_path: "plugins/reference/opencode.md"
duplicate_index: 1
---

# OpenCode plugin
Source: https://docs.openclaw.ai/plugins/reference/opencode

# OpenCode plugin

Adds OpenCode model provider support to OpenClaw.

## Distribution

- Package: `@openclaw/opencode-provider`
- Install route: included in OpenClaw

## Surface

providers: `opencode`; contracts: `mediaUnderstandingProviders`

<!-- openclaw-plugin-reference:manual-start -->

## Native sessions

OpenClaw auto-detects the `opencode` CLI on the Gateway and paired nodes. Stored
sessions then appear in the **OpenCode** sessions-sidebar group, with read-only
transcript browsing through the official `opencode --pure db ... --format json`
and `opencode --pure export` commands. The restricted environment and `--pure`
mode prevent catalog browsing from loading project plugins or inheriting unrelated
Gateway credentials.

Turn **OpenCode Session Catalog** off under **Config > Plugins > OpenCode** to
disable discovery. It is enabled by default.

<!-- openclaw-plugin-reference:manual-end -->

## Related docs

- [opencode](/providers/opencode)

---
