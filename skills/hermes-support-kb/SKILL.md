---
name: hermes-support-kb
description: Use for Hermes Agent setup, gateway, Telegram/messaging, config.yaml, skills, memory, sessions, MCP, cron, provider, update, or troubleshooting questions. Search the local Hermes namespace before using OpenClaw or Paperclip docs.
---

# Hermes Support KB

## Workflow

1. Search the Hermes namespace first:
   ```bash
   gbrain search "Hermes Agent <question or exact error> Local KB namespace: hermes-agent" --source openclaw-support-kb
   gbrain search "Source: https://hermes-agent.nousresearch.com/docs <command or config key>" --source openclaw-support-kb
   ```
2. Use `systems/hermes/` pages as facts. Use OpenClaw docs only when OpenClaw is the executor or channel into Hermes.
3. For config questions, remember Hermes uses `~/.hermes/config.yaml`, `~/.hermes/.env`, and `~/.hermes/skills/`. Do not edit `openclaw.json` for a Hermes-only issue.
4. Prefer read-only diagnostics before edits:
   ```bash
   hermes doctor
   hermes gateway status
   hermes config check
   ```
5. For gateway or messaging repair, search the exact platform doc and use Hermes commands from the current docs:
   ```bash
   gbrain search "Hermes Agent Telegram gateway setup status restart" --source openclaw-support-kb
   hermes gateway setup
   hermes gateway restart
   ```

## Answer Rules

- Cite Hermes docs/source pages for Hermes facts.
- Ask before changing provider credentials, gateway auth, skills, memory providers, or cron jobs.
- Do not apply OpenClaw Telegram fields such as `allowFrom` or `groupAllowFrom` to Hermes unless Hermes docs for the current version contain matching fields.
- If Hermes is being used to fix OpenClaw, chain into `cross-system-recovery` and `openclaw-config-repair`.
