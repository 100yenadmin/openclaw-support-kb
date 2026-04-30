---
type: openclaw_doc
title: "Setup"
source: "https://docs.openclaw.ai/cli/setup"
source_hash: "7e604a373560440a45ba3ae0268a87e23d958d5521bd01dc021cc348833bfc41"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "cli/setup.md"
original_doc_path: "cli/setup.md"
duplicate_index: 1
---

# Setup
Source: https://docs.openclaw.ai/cli/setup



# `openclaw setup`

Initialize `~/.openclaw/openclaw.json` and the agent workspace.

Related:

* Getting started: [Getting started](/start/getting-started)
* CLI onboarding: [Onboarding (CLI)](/start/wizard)

## Examples

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw setup
openclaw setup --workspace ~/.openclaw/workspace
openclaw setup --wizard
openclaw setup --wizard --import-from hermes --import-source ~/.hermes
openclaw setup --non-interactive --mode remote --remote-url wss://gateway-host:18789 --remote-token <token>
```

## Options

* `--workspace <dir>`: agent workspace directory (stored as `agents.defaults.workspace`)
* `--wizard`: run onboarding
* `--non-interactive`: run onboarding without prompts
* `--mode <local|remote>`: onboarding mode
* `--import-from <provider>`: migration provider to run during onboarding
* `--import-source <path>`: source agent home for `--import-from`
* `--import-secrets`: import supported secrets during onboarding migration
* `--remote-url <url>`: remote Gateway WebSocket URL
* `--remote-token <token>`: remote Gateway token

To run onboarding via setup:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw setup --wizard
```

Notes:

* Plain `openclaw setup` initializes config + workspace without the full onboarding flow.
* Onboarding auto-runs when any onboarding flags are present (`--wizard`, `--non-interactive`, `--mode`, `--import-from`, `--import-source`, `--import-secrets`, `--remote-url`, `--remote-token`).
* If Hermes state is detected, interactive onboarding can offer migration automatically. Import onboarding requires a fresh setup; use [Migrate](/cli/migrate) for dry-run plans, backups, and overwrite mode outside onboarding.

## Related

* [CLI reference](/cli)
* [Install overview](/install)
