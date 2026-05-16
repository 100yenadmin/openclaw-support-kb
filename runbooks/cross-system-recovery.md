---
type: customer_kb_runbook
title: "Cross-System Recovery"
search_role: "workflow_not_source"
---

# Cross-System Recovery

Use this when OpenClaw, Hermes, or Paperclip needs to diagnose another system.
It is a workflow, not a factual source.

## Search Contract

```bash
# Target: OpenClaw
gbrain search "OpenClaw <exact error or config key> Source: https://docs.openclaw.ai" --source openclaw-support-kb

# Target: Hermes Agent
gbrain search "Hermes Agent <exact error or config key> Local KB namespace: hermes-agent" --source openclaw-support-kb

# Target: Paperclip Mission Control
gbrain search "Paperclip Mission Control <exact error or resource> Local KB namespace: paperclip-mission-control" --source openclaw-support-kb
```

Use exactly one target search block first. Then search the actor runtime only
for safe execution mechanics, for example:

```bash
gbrain search "<actor runtime> run command approval workspace" --source openclaw-support-kb
```

## Workflow

1. Write down the target system and actor runtime in the notes before acting.
2. Search target docs first using only the target's namespace/source marker. The target docs decide valid config, commands, IDs, and recovery steps.
3. Search actor docs second only for how the actor safely runs commands, asks approval, or sends messages.
4. Run read-only diagnostics before mutation.
5. Use the target's safest edit path:
   - OpenClaw: schema, dry-run patch, validate.
   - Hermes: Hermes docs, `~/.hermes/config.yaml`, gateway/config diagnostics.
   - Paperclip: Paperclip API/CLI/deploy docs, approvals, budgets, and database/env surfaces.
6. Explain to nontechnical users what will be read and what will be changed before running writes.

## Nontechnical User Prompts

- "I can use one agent to inspect the other, but I need to confirm which system is the broken target."
- "May I run read-only status and config validation first?"
- "This next step writes config. Do you approve that exact change?"

## Failure Routing

- Target docs missing: refresh the KB, then search source URLs directly.
- Actor cannot run commands: use the actor runtime docs and ask for another access path.
- Config schema rejects the change: stop and cite the rejection instead of forcing a manual edit.

## Stop Conditions

Stop before guessing keys, disabling auth, changing budgets, sending support,
or replacing full configs/databases.
