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

## evaOS VM Runtime Rules

When you are running inside an evaOS customer VM, use the VM-local Paperclip
API for automation. Public Mission Control hosts such as
`https://paperclip-<customer>.ecs.electricsheephq.com` are browser/dashboard
routes and may return Electric Sheep login HTML instead of JSON.

- CLI/server base: `http://127.0.0.1:3100`
- Raw HTTP API base: `http://127.0.0.1:3100/api`
- OpenClaw gateway adapter URL: `ws://127.0.0.1:18790/`

If `/root/.openclaw/workspace/paperclip-claimed-api-key.json` exists, load the
agent token from that JSON file without printing it, then send it as
`Authorization: Bearer <token>`. Prefer the short-lived `PAPERCLIP_API_KEY`
from the current heartbeat/run environment when it is present.

Before piping any response to `jq`, verify that the response is JSON. If the
response starts with HTML or looks like a login page, stop using the public
host and retry through the VM-local API base.

Paperclip-launched OpenClaw agents are long-running workers. A two-hour adapter
timeout is normal for Paperclip-owned task execution, but simple control-plane
operations such as creating an agent, reading an issue, or posting a comment
should still use the local API and should not spend the full timeout window.

## Stop Conditions

Ask before changing budgets, pausing/terminating agents, importing/exporting company data, modifying secrets, or approving actions on behalf of the user.

Do not use OpenClaw `openclaw.json` or Hermes `config.yaml` to fix a Paperclip control-plane problem unless the issue is explicitly about the agent runtime connected to Paperclip.
