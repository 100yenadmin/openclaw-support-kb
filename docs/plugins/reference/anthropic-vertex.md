---
type: openclaw_doc
title: "Anthropic Vertex plugin"
source: "https://docs.openclaw.ai/plugins/reference/anthropic-vertex"
source_hash: "cbcaea63c16821f78ad57d67c77ce3aee732a27858aef97058f232aaa2678ebc"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/anthropic-vertex.md"
original_doc_path: "plugins/reference/anthropic-vertex.md"
duplicate_index: 1
---

# Anthropic Vertex plugin
Source: https://docs.openclaw.ai/plugins/reference/anthropic-vertex

# Anthropic Vertex plugin

OpenClaw Anthropic Vertex provider plugin for Claude models on Google Vertex AI.

## Distribution

- Package: `@openclaw/anthropic-vertex-provider`
- Install route: npm; ClawHub

## Surface

providers: anthropic-vertex

<!-- openclaw-plugin-reference:manual-start -->

## Claude Fable 5

Use `anthropic-vertex/claude-fable-5` where the model is available in your Google Cloud region.
Fable 5 always uses adaptive thinking and defaults to `high` effort. `/think off` and
`/think minimal` use `low` effort because the model does not support disabling thinking.

<!-- openclaw-plugin-reference:manual-end -->

---
