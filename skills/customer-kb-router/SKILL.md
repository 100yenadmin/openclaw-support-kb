---
name: customer-kb-router
description: Use when a customer question may involve OpenClaw, Hermes Agent, Paperclip Mission Control, Composio integrations, cross-agent repair, system setup, config, messaging, or support and the target system must be identified before answering.
---

# Customer KB Router

## Routing Rule

Identify the target system before giving commands or config advice. If the user says "the agent", "bot", "gateway", "config", "Telegram", or "dashboard" without naming the system, ask one short clarifying question or run read-only discovery first.

## Source Contracts

Search local GBrain with the target system marker:

```bash
gbrain search "OpenClaw <question or exact error> Source: https://docs.openclaw.ai" --source openclaw-support-kb
gbrain search "Hermes Agent <question or exact error> Local KB namespace: hermes-agent" --source openclaw-support-kb
gbrain search "Paperclip Mission Control <question or exact error> Local KB namespace: paperclip-mission-control" --source openclaw-support-kb
gbrain search "Composio <app or workflow> Source: https://docs.composio.dev" --source openclaw-support-kb
```

If `--source` is unsupported, rerun the same search without it and reject stale `.pre-git-` citations.

## System Map

| Target | Config/data surface | Commands/docs to prefer |
| --- | --- | --- |
| OpenClaw | `openclaw.json`, `~/.openclaw`, workspace `AGENTS.md` | `openclaw ...`, `docs/`, `runbooks/` |
| Hermes Agent | `~/.hermes/config.yaml`, `~/.hermes/.env`, `~/.hermes/skills` | `hermes ...`, `systems/hermes/` |
| Paperclip Mission Control | Paperclip database, env/deploy config, companies, agents, tickets | `systems/paperclip/`, Paperclip CLI/API docs |
| Composio | Integration/MCP/OAuth app connection | `integrations/composio/`, OpenClaw MCP docs |

## Cross-System Work

When one runtime is fixing another, search the broken target first and the acting runtime second:

- Hermes fixing OpenClaw: OpenClaw docs/runbooks first, Hermes docs only for how Hermes should run the repair.
- OpenClaw fixing Hermes: Hermes docs first, OpenClaw docs only for messaging/tool execution constraints.
- Either runtime handling Paperclip: Paperclip docs first, runtime docs only for the executor.

## Stop Conditions

Stop before applying config when the cited docs are for a different system, the target system is ambiguous, or the next step would replace a config file instead of making a validated narrow change.
