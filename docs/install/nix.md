---
type: openclaw_doc
title: "Nix"
source: "https://docs.openclaw.ai/install/nix"
source_hash: "52f7558113751a142e8fc8cf2d8c7af12df357e769a1fa8c7c4c7a1ef4e522d4"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/nix.md"
original_doc_path: "install/nix.md"
duplicate_index: 1
---

# Nix
Source: https://docs.openclaw.ai/install/nix

Install OpenClaw declaratively with **[nix-openclaw](https://github.com/openclaw/nix-openclaw)** - the first-party, batteries-included Home Manager module.

Info

The [nix-openclaw](https://github.com/openclaw/nix-openclaw) repo is the source of truth for Nix installation. This page is a quick overview.

## What you get

- Gateway + macOS app + tools (whisper, spotify, cameras) -- all pinned
- Launchd service that survives reboots
- Plugin system with declarative config
- Instant rollback: `home-manager switch --rollback`

## Quick start

Steps


Install Determinate Nix

    If Nix is not already installed, follow the [Determinate Nix installer](https://github.com/DeterminateSystems/nix-installer) instructions.


Create a local flake

    Use the agent-first template from the nix-openclaw repo:
    ```bash
    mkdir -p ~/code/openclaw-local
    # Copy templates/agent-first/flake.nix from the nix-openclaw repo
    ```


Configure secrets

    Set up your messaging bot token and model provider API key. Plain files at `~/.secrets/` work fine.


Fill in template placeholders and switch

    ```bash
    home-manager switch
    ```


Verify

    Confirm the launchd service is running and your bot responds to messages.


See the [nix-openclaw README](https://github.com/openclaw/nix-openclaw) for full module options and examples.

## Nix-mode runtime behavior

When `OPENCLAW_NIX_MODE=1` is set (automatic with nix-openclaw), OpenClaw enters a deterministic mode for Nix-managed installs. Other Nix packages can set the same mode; nix-openclaw is the first-party reference.

You can also set it manually:

```bash
export OPENCLAW_NIX_MODE=1
```

On macOS, the GUI app does not automatically inherit shell environment variables. Enable Nix mode via defaults instead:

```bash
defaults write ai.openclaw.mac openclaw.nixMode -bool true
```

### What changes in Nix mode

- Auto-install and self-mutation flows are disabled
- `openclaw.json` is treated as immutable. Startup-derived defaults stay runtime-only, and config writers such as setup, onboarding, mutating `openclaw update`, plugin install/update/uninstall/enable, `doctor --fix`, `doctor --generate-gateway-token`, and `openclaw config set` refuse to edit the file.
- Agents should edit the Nix source instead. For nix-openclaw, use the agent-first [Quick Start](https://github.com/openclaw/nix-openclaw#quick-start) and set config under `programs.openclaw.config` or `instances.<name>.config`.
- Missing dependencies surface Nix-specific remediation messages
- UI surfaces a read-only Nix mode banner

### Config and state paths

OpenClaw reads JSON5 config from `OPENCLAW_CONFIG_PATH` and stores mutable data in `OPENCLAW_STATE_DIR`. When running under Nix, set these explicitly to Nix-managed locations so runtime state and config stay out of the immutable store.

| Variable               | Default                                 |
| ---------------------- | --------------------------------------- |
| `OPENCLAW_HOME`        | `HOME` / `USERPROFILE` / `os.homedir()` |
| `OPENCLAW_STATE_DIR`   | `~/.openclaw`                           |
| `OPENCLAW_CONFIG_PATH` | `$OPENCLAW_STATE_DIR/openclaw.json`     |

### Service PATH discovery

The launchd/systemd gateway service auto-discovers Nix-profile binaries so
plugins and tools that shell out to `nix`-installed executables work without
manual PATH setup:

- When `NIX_PROFILES` is set, every entry is added to the service PATH in
  right-to-left precedence (matches Nix shell precedence - rightmost wins).
- When `NIX_PROFILES` is unset, `~/.nix-profile/bin` is added as a fallback.

This applies to both macOS launchd and Linux systemd service environments.

## Related

CardGroup


nix-openclaw

    Source-of-truth Home Manager module and full setup guide.


Setup wizard

    Non-Nix CLI setup walkthrough.


Docker

    Containerized setup as a non-Nix alternative.


Updating

    Updating Home Manager-managed installs alongside the package.

---
