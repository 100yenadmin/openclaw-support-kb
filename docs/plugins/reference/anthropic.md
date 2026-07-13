---
type: openclaw_doc
title: "Anthropic plugin"
source: "https://docs.openclaw.ai/plugins/reference/anthropic"
source_hash: "3a41c1cb71d6d7b660ddb7c1a81430b0979ccf8443608f2bf5f02e3c95e6e2e9"
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

providers: anthropic; contracts: mediaUnderstandingProviders, usageProviders

<!-- openclaw-plugin-reference:manual-start -->

node commands: anthropic.claude.sessions.list.v1,
anthropic.claude.sessions.read.v1; contracts: mediaUnderstandingProviders,
usageProviders

<!-- openclaw-plugin-reference:manual-end -->

## Related docs

- [anthropic](/providers/anthropic)

---
