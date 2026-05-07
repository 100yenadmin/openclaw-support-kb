---
type: openclaw_doc
title: "Setup"
source: "https://docs.openclaw.ai/cli/setup"
source_hash: "66b68b4f1d9dff99fd97d45a1970ea3a9dfb95bc47283c151b91ccfbc760ced4"
doc_path: "cli/setup.md"
original_doc_path: "cli/setup.md"
duplicate_index: 1
---

# Setup
Source: https://docs.openclaw.ai/cli/setup



# `openclaw setup`

Initialize `~/.openclaw/openclaw.json` and the agent workspace.

<Note>
  `openclaw setup` is for mutable config installs. In Nix mode (`OPENCLAW_NIX_MODE=1`), OpenClaw refuses setup writes because the config file is managed by Nix. Agents should use the first-party [nix-openclaw Quick Start](https://github.com/openclaw/nix-openclaw#quick-start) or the equivalent source config for another Nix package.
</Note>

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
* After plain setup, run `openclaw configure` to choose models, channels, Gateway, plugins, skills, or health checks.
* Onboarding auto-runs when any onboarding flags are present (`--wizard`, `--non-interactive`, `--mode`, `--import-from`, `--import-source`, `--import-secrets`, `--remote-url`, `--remote-token`).
* If Hermes state is detected, interactive onboarding can offer migration automatically. Import onboarding requires a fresh setup; use [Migrate](/cli/migrate) for dry-run plans, backups, and overwrite mode outside onboarding.

## Related

* [CLI reference](/cli)
* [Install overview](/install)
