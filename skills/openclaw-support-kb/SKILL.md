---
name: openclaw-support-kb
description: Use for OpenClaw setup, channel configuration, update, runtime, troubleshooting, and support questions. Search the local GBrain OpenClaw support KB first and answer with citations instead of guessing.
---

# OpenClaw Support KB

## Workflow

1. Search local GBrain first:
```bash
gbrain search "OpenClaw <user question> Source: https://docs.openclaw.ai" --source openclaw-support-kb
gbrain search "OpenClaw <exact error or config key> Source: https://docs.openclaw.ai" --source openclaw-support-kb
```
2. If the user may mean Hermes Agent or Paperclip Mission Control, chain into `customer-kb-router` before giving commands.
3. If a runbook appears, treat it as a workflow only. Run its Search Contract before answering.
4. Ignore any result or filesystem path containing `.pre-git-`, `archive/openclaw-support-kb`, or another backup-looking support KB copy. Run `node ~/.gbrain/sources/openclaw-support-kb/scripts/status.mjs` and retry exact source URL searches if that appears.
5. Use `docs/` pages as factual source, `runbooks/` as process, and `releases/` for version context.
6. Cite source URLs from `docs/` whenever possible. Cite a runbook only for workflow choices.
7. If the question touches config, chain into `openclaw-config-repair`.
8. If local results are missing or stale, run:
   ```bash
   openclaw docs "<query>"
   ```
9. If the user still needs help, chain into `openclaw-support-escalation`.

## Scenario Routing

- "How does OpenClaw work?" -> `runbooks/system-explainer.md`
- "Create a new agent" -> `runbooks/agent-creation.md`
- "Set up Telegram" -> `runbooks/telegram-setup.md`
- "Set up another channel" -> `runbooks/channel-setup.md`
- "Config broke / openclaw.json" -> `openclaw-config-repair`
- "Agent is slow, broken, not responding, missing tools, degraded, or not as smart" -> `file-bug-report` and `runbooks/file-bug-report.md`
- "Find/install a skill" -> `openclaw-skill-discovery`
- "Contact support" -> `openclaw-support-escalation`
- "Hermes, Paperclip, Mission Control, or unclear system" -> `customer-kb-router`

## Answer Rules

- Do not invent OpenClaw config keys or channel settings.
- Do not apply OpenClaw config guidance to Hermes `~/.hermes/config.yaml` or Paperclip control-plane settings.
- Mention uncertainty clearly when the KB does not contain a fact.
- Do not cite stale support KB backups. Citations should come from current `docs/`, `runbooks/`, `releases/`, `integrations/`, `security/`, or source URLs.
- Prefer short, actionable steps the customer can run locally.
- For nontechnical users, explain each command before running it and avoid dumping full configs unless necessary.
- For Telegram, always distinguish bot token, human Telegram user ID, group chat ID, `allowFrom`, `groupAllowFrom`, and `groups`.
- For updates, distinguish stable and beta/prerelease behavior.

## Local KB Paths

- Default source: `~/.gbrain/sources/openclaw-support-kb`
- Manifest: `~/.gbrain/sources/openclaw-support-kb/kb-manifest.json`
- Refresh:
  ```bash
  node ~/.gbrain/sources/openclaw-support-kb/scripts/run-client-update.mjs --reason manual
  node ~/.gbrain/sources/openclaw-support-kb/scripts/status.mjs
  ```
