---
type: openclaw_doc
title: "OpenCode plugin"
source: "https://docs.openclaw.ai/plugins/reference/opencode"
source_hash: "fec8bb8cf21cd40b3db5d56c1c629daf9e78dd7cc6260bb8075e1dde58bce51d"
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
