---
name: paperclip-mission-control
description: Use for Paperclip, Mission Control, companies, goals, org charts, agents, tickets, heartbeats, budgets, approvals, dashboard, API, CLI, deploy, adapter, or board-operator questions.
---

# Paperclip Mission Control

## Workflow

1. Search Paperclip first:
   ```bash
   gbrain search "Paperclip Mission Control <question or exact error> Local KB namespace: paperclip-mission-control" --source openclaw-support-kb
   gbrain search "Source System: Paperclip Mission Control API CLI dashboard heartbeats budgets" --source openclaw-support-kb
   ```
2. Use `systems/paperclip/` docs as facts. Use OpenClaw or Hermes docs only for the runtime that is acting on Paperclip.
3. Treat Paperclip as the control plane: companies, goals, org charts, tickets, budgets, approvals, heartbeats, and audit logs are Paperclip concepts.
4. For first setup, cite the current Paperclip docs before using the public onboarding command:
   ```bash
   npx paperclipai onboard --yes
   ```
5. For API/deploy issues, search the specific local docs path before changing env, database, or deploy settings:
   ```bash
   gbrain search "Paperclip docs/api <resource or endpoint>" --source openclaw-support-kb
   gbrain search "Paperclip deploy environment variables database" --source openclaw-support-kb
   ```

## Stop Conditions

Ask before changing budgets, pausing/terminating agents, importing/exporting company data, modifying secrets, or approving actions on behalf of the user.

Do not use OpenClaw `openclaw.json` or Hermes `config.yaml` to fix a Paperclip control-plane problem unless the issue is explicitly about the agent runtime connected to Paperclip.
