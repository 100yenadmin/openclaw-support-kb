---
type: openclaw_doc
title: "Clickclack plugin"
source: "https://docs.openclaw.ai/plugins/reference/clickclack"
source_hash: "e4e0e6289c6467324343bfef820385c1a2042aae1a2f4888fb714dd28d7bc12d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/clickclack.md"
original_doc_path: "plugins/reference/clickclack.md"
duplicate_index: 1
---

# Clickclack plugin
Source: https://docs.openclaw.ai/plugins/reference/clickclack

# Clickclack plugin

Adds the Clickclack channel surface for sending and receiving OpenClaw messages.

## Distribution

- Package: `@openclaw/clickclack`
- Install route: npm; ClawHub: `clawhub:@openclaw/clickclack`

## Surface

channels: `clickclack`; contracts: `tools`

<!-- openclaw-plugin-reference:manual-start -->

The plugin can optionally create a lifecycle-synchronized ClickClack channel
for each OpenClaw session. Managed discussion channels use a same-agent side
session for observation and relay, while the attached main session receives a
pull-only `discussion` tool. See [ClickClack session discussions](/channels/clickclack#session-discussions)
for configuration and session-tool visibility requirements.

<!-- openclaw-plugin-reference:manual-end -->

## Related docs

- [clickclack](/channels/clickclack)

---
