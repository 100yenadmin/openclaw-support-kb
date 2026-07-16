---
type: openclaw_doc
title: "Anthropic plugin"
source: "https://docs.openclaw.ai/plugins/reference/anthropic"
source_hash: "be0efc0ef6c42f0b1edfd3685f73ed233367f49d349f6e5f1c33266fa2f8da0b"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/anthropic.md"
original_doc_path: "plugins/reference/anthropic.md"
duplicate_index: 1
---

# Anthropic plugin
Source: https://docs.openclaw.ai/plugins/reference/anthropic

# Anthropic plugin

Anthropic models, Claude CLI, and native Claude session catalog.

## Distribution

- Package: `@openclaw/anthropic-provider`
- Install route: included in OpenClaw

## Surface

providers: `anthropic`; contracts: `mediaUnderstandingProviders`, `usageProviders`

<!-- openclaw-plugin-reference:manual-start -->

node commands: anthropic.claude.sessions.list.v1,
anthropic.claude.sessions.read.v1; contracts: mediaUnderstandingProviders,
usageProviders

<!-- openclaw-plugin-reference:manual-end -->

## Related docs

- [anthropic](/providers/anthropic)

---
