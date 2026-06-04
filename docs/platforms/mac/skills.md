---
type: openclaw_doc
title: "Skills (macOS)"
source: "https://docs.openclaw.ai/platforms/mac/skills"
source_hash: "e86ab84beea7d89b7a1e4eca7f5410f33bd129f6d8d43406f71e3bb1228b458d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "platforms/mac/skills.md"
original_doc_path: "platforms/mac/skills.md"
duplicate_index: 1
---

# Skills (macOS)
Source: https://docs.openclaw.ai/platforms/mac/skills

The macOS app surfaces OpenClaw skills via the gateway; it does not parse skills locally.

## Data source

- `skills.status` (gateway) returns all skills plus eligibility and missing requirements
  (including allowlist blocks for bundled skills).
- Requirements are derived from `metadata.openclaw.requires` in each `SKILL.md`.

## Install actions

- `metadata.openclaw.install` defines install options (brew/node/go/uv).
- The app calls `skills.install` to run installers on the gateway host.
- Operator-owned `security.installPolicy` can block gateway-backed skill
  installs before installer metadata runs. Install-time built-in dangerous-code
  blocking is not part of the skill install flow.
- If every install option is `download`, the gateway surfaces all download
  choices.
- Otherwise, the gateway picks one preferred installer using the current
  install preferences and host binaries: Homebrew first when
  `skills.install.preferBrew` is enabled and `brew` exists, then `uv`, then the
  configured node manager from `skills.install.nodeManager`, then later
  fallbacks like `go` or `download`.
- Node install labels reflect the configured node manager, including `yarn`.

## Env/API keys

- The app stores keys in `~/.openclaw/openclaw.json` under `skills.entries.<skillKey>`.
- `skills.update` patches `enabled`, `apiKey`, and `env`.

## Remote mode

- Install + config updates happen on the gateway host (not the local Mac).

## Related

- [Skills](/tools/skills)
- [macOS app](/platforms/macos)

---
