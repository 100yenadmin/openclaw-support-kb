---
name: openclaw-config-repair
description: Use when a user or agent needs to inspect, change, repair, validate, or troubleshoot OpenClaw config, openclaw.json, channel config, SecretRefs, plugins.entries config, or startup failures caused by invalid config.
---

# OpenClaw Config Repair

## Safe Path

Use this skill only for OpenClaw config. If the target is Hermes Agent or Paperclip Mission Control, switch to `customer-kb-router` and the matching target skill.

1. Inspect the active file:
   ```bash
   openclaw config file
   openclaw config validate --json
   ```
2. Search local KB for the exact path/error:
```bash
gbrain search "OpenClaw <config path or error>" --source openclaw-support-kb
gbrain search "OpenClaw config schema patch dry-run validate rejected clobbered <intent>" --source openclaw-support-kb
```
3. Read `runbooks/config-repair.md` for the workflow, then inspect schema before proposing a key:
   ```bash
   openclaw config schema > /tmp/openclaw.schema.json
   ```
4. Prefer narrow CLI edits:
   ```bash
   openclaw config set <path> <value> --dry-run
   openclaw config patch --file <patch.json5> --dry-run
   ```
5. Only apply after dry-run succeeds:
   ```bash
   openclaw config patch --file <patch.json5>
   openclaw config validate
   ```

## Guardrails

- Runbook text is not schema. Schema and current docs win.
- Never replace the whole config unless the user explicitly asks and a backup exists.
- Never put API keys or bot tokens into support drafts; redact them.
- Prefer env vars and SecretRefs where docs say the surface supports them.
- If `plugins.entries.<id>.config` fails validation, compare the live plugin manifest schema against the config block before changing unrelated settings.
- If invalid direct edits triggered recovery, inspect `.rejected.*` or `.clobbered.*` beside the active config and copy back only intended keys.

## Escalate When

- Schema validation passes but runtime still fails.
- The config mentions a plugin schema/version mismatch.
- The user cannot identify the intended channel/account.
- The agent would need to guess a missing token, user ID, group ID, or endpoint.
