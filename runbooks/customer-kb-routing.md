---
type: customer_kb_runbook
title: "Customer KB Source Routing"
search_role: "workflow_not_source"
---

# Customer KB Source Routing

This runbook prevents cross-agent data confusion. It is workflow only; search
the target system docs before answering.

## Search Contract

```bash
gbrain search "OpenClaw <question> Source: https://docs.openclaw.ai" --source openclaw-support-kb
gbrain search "Hermes Agent <question> Local KB namespace: hermes-agent" --source openclaw-support-kb
gbrain search "Paperclip Mission Control <question> Local KB namespace: paperclip-mission-control" --source openclaw-support-kb
gbrain search "Composio <app or workflow> Source: https://docs.composio.dev" --source openclaw-support-kb
cat ~/.gbrain/sources/openclaw-support-kb/kb-sources.json
```

## Workflow

1. Classify the target: OpenClaw, Hermes Agent, Paperclip Mission Control, Composio, or support escalation.
2. If ambiguous, ask one clarifying question before suggesting config keys.
3. Search the target namespace with exact error text, command names, and config paths.
4. Read the matching skill:
   - `customer-kb-router`
   - `openclaw-support-kb`
   - `hermes-support-kb`
   - `paperclip-mission-control`
   - `cross-system-recovery`
5. Cite target docs/source pages, not only this runbook.
6. If one runtime is fixing another, switch to `cross-system-recovery.md`.

## Nontechnical User Prompts

- "Which part is broken: OpenClaw, Hermes, or Paperclip/Mission Control?"
- "Are you asking me to fix the agent runtime, the chat channel, or the dashboard/control plane?"
- "Can I run read-only checks first so I do not touch the wrong config?"

## Stop Conditions

Stop before config edits if the search result is from another system, the user
cannot identify the target, or the next step would overwrite a config file.
