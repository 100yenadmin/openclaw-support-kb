---
type: openclaw_doc
title: "Skills (macOS)"
source: "https://docs.openclaw.ai/platforms/mac/skills"
source_hash: "c9bcd945665537acdaacf82bec1c3853490b0b682ff690b78c26ac756133835f"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "platforms/mac/skills.md"
original_doc_path: "platforms/mac/skills.md"
duplicate_index: 1
---

# Skills (macOS)
Source: https://docs.openclaw.ai/platforms/mac/skills



The macOS app surfaces OpenClaw skills via the gateway; it does not parse skills locally.

## Data source

* `skills.status` (gateway) returns all skills plus eligibility and missing requirements
  (including allowlist blocks for bundled skills).
* Requirements are derived from `metadata.openclaw.requires` in each `SKILL.md`.

## Install actions

* `metadata.openclaw.install` defines install options (brew/node/go/uv).
* The app calls `skills.install` to run installers on the gateway host.
* Built-in dangerous-code `critical` findings block `skills.install` by default; suspicious findings still warn only. The dangerous override exists on the gateway request, but the default app flow stays fail-closed.
* If every install option is `download`, the gateway surfaces all download
  choices.
* Otherwise, the gateway picks one preferred installer using the current
  install preferences and host binaries: Homebrew first when
  `skills.install.preferBrew` is enabled and `brew` exists, then `uv`, then the
  configured node manager from `skills.install.nodeManager`, then later
  fallbacks like `go` or `download`.
* Node install labels reflect the configured node manager, including `yarn`.

## Env/API keys

* The app stores keys in `~/.openclaw/openclaw.json` under `skills.entries.<skillKey>`.
* `skills.update` patches `enabled`, `apiKey`, and `env`.

## Remote mode

* Install + config updates happen on the gateway host (not the local Mac).

## Related

* [Skills](/tools/skills)
* [macOS app](/platforms/macos)
