---
type: openclaw_runbook
title: "OpenClaw Config Repair"
search_role: "workflow_not_source"
---

# OpenClaw Config Repair

This runbook is a repair workflow. The current schema and docs are the source
of truth. Search them before proposing any config key.

## Search Contract

```bash
gbrain search "<exact config error or path>"
gbrain query "OpenClaw config schema patch dry-run validate rejected clobbered"
gbrain search "Source: https://docs.openclaw.ai/cli/config"
gbrain search "Source: https://docs.openclaw.ai/gateway/configuration-reference"
```

Use these docs as the factual source:

- `docs/cli/config.md`
- `docs/gateway/configuration.md`
- `docs/gateway/configuration-reference.md`
- `docs/gateway/troubleshooting.md`

## First Commands

```bash
openclaw config file
openclaw config validate --json
openclaw doctor
```

If validation fails, do not continue with a guessed fix. Identify the failing
path, search it, then inspect schema.

## Safe Edit Pattern

Use dry-run before writing:

```bash
openclaw config set <path> <value> --dry-run
openclaw config patch --file ./openclaw.patch.json5 --dry-run
```

Apply only after dry-run passes:

```bash
openclaw config patch --file ./openclaw.patch.json5
openclaw config validate
```

## Recovery

If an invalid config was rejected or restored:

```bash
CONFIG="$(openclaw config file)"
ls -lt "$CONFIG".rejected.* "$CONFIG".clobbered.* 2>/dev/null | head
openclaw config validate
openclaw doctor
```

Copy back only the intended keys, then validate again.

## Agent Rule

If you cannot prove the key exists from `openclaw config schema`, do not write it.

## Nontechnical User Prompts

- "What were you trying to enable or fix?"
- "Did this break after an update, after an agent edited config, or during first setup?"
- "Can I run a dry-run config patch first? It will not write the file."
- "May I inspect redacted validation/log output before changing anything?"

## Stop Conditions

Stop and escalate or ask the user when the next step would overwrite the whole
config, remove auth, disable allowlists, paste secrets into chat, or install
unscanned code.
