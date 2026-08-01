---
type: openclaw_doc
title: "OpenCode plugin"
source: "https://docs.openclaw.ai/plugins/reference/opencode"
source_hash: "7367da350e3cb01b64b8f7d5dcdd58f8be2291c021bb8d565b2e699f7baf9d49"
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
- Install route: npm; ClawHub: `clawhub:@openclaw/opencode-provider`

## Surface

providers: `opencode`; contracts: `mediaUnderstandingProviders`

<!-- openclaw-plugin-reference:manual-start -->

## Native sessions

OpenClaw auto-detects the `opencode` CLI on the Gateway and paired nodes. Stored
sessions then appear in the **OpenCode** sessions-sidebar group, with transcript
browsing through the official `opencode --pure db ... --format json` and
`opencode --pure export` commands. Local rows also offer **Continue**, which
creates an OpenClaw session whose first turn resumes the native OpenCode session
through ACP. OpenCode retains the full server-side model context, and the catalog
viewer continues to show that history. OpenClaw also imports the recent native
history into the adopted session transcript. Very long transcripts import only
their most recent 200 items using a 512 KiB serialized-item budget. Paired-node
rows remain view-only.

The restricted environment and `--pure` mode prevent catalog browsing from
loading project plugins or inheriting unrelated Gateway credentials.

Turn **OpenCode Session Catalog** off under **Config > Plugins > OpenCode** to
disable discovery. It is enabled by default.

<!-- openclaw-plugin-reference:manual-end -->

## Related docs

- [opencode](/providers/opencode)

---
