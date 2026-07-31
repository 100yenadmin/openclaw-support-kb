---
type: openclaw_doc
title: "Skills (macOS)"
source: "https://docs.openclaw.ai/platforms/mac/skills"
source_hash: "49b00e6f41311a783cc2130782b4f6cdc7c7136670789f264d966bbd0baa07a4"
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

- `skills.status` (gateway) returns all skills plus eligibility and missing requirements, including allowlist blocks for bundled skills.
- Requirements come from `metadata.openclaw.requires` in each `SKILL.md`.

## Install actions

- `metadata.openclaw.install` defines install options (brew/node/go/uv/download).
- The app calls `skills.install` to run installers on the gateway host.
- Operator-owned `security.installPolicy` (`enabled`, `targets`, `exec`) can block gateway-backed skill installs before installer metadata runs. Built-in dangerous-code scanning (used for plugin installs) is not wired into the skill install flow.
- If every install option is `download`, the gateway surfaces all download choices.
- Otherwise the gateway picks one preferred installer using current install preferences (`skills.install.preferBrew`, `skills.install.nodeManager`) and host binaries: Homebrew first when `preferBrew` is enabled and `brew` is present, then `uv`, then the configured node manager, then Homebrew again if available (even without `preferBrew`), then `go`, then `download`.
- Node install labels reflect the configured node manager, including `yarn`.

## Env/API keys

- The app stores keys in `~/.openclaw/openclaw.json` under `skills.entries.<skillKey>`.
- `skills.update` patches `enabled`, `apiKey`, and `env`.

## Remote mode

- Install and config updates happen on the gateway host, not the local Mac.
- When skill files, config, Mac-node connectivity, its catalog, or its executable
  inventory changes, the gateway emits `skills.changed` after invalidating its
  authoritative snapshot. An open Skills pane then refetches `skills.status`,
  including changes that finish while an earlier request is still in flight.

## Related

- [Skills](/tools/skills)
- [macOS app](/platforms/macos)

---
