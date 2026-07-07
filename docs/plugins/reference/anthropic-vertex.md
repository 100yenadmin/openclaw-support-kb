---
type: openclaw_doc
title: "Anthropic Vertex plugin"
source: "https://docs.openclaw.ai/plugins/reference/anthropic-vertex"
source_hash: "1d76471dc7b71e4eb4f13bd5c728acbf0ad5c90a29f694ec04d1c165e4992ab7"
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

## Claude Sonnet 5

Use `anthropic-vertex/claude-sonnet-5` with Vertex's `global`, `us`, or `eu`
endpoint. Sonnet 5 defaults to adaptive thinking at `high` effort and supports
`/think off` or the native `/think xhigh|max` levels. OpenClaw publishes its
1,000,000-token context window and 128,000-token output limit automatically.

Catalog pricing follows Vertex's introductory global rate of `$2/$10` per
million input/output tokens through August 31, 2026, then `$3/$15` from
September 1. The `us` and `eu` multi-region endpoints use Vertex's documented
10% premium.

<!-- openclaw-plugin-reference:manual-end -->

---
