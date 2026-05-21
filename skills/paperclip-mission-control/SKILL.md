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
- Same-gateway OpenClaw child agents must persist a gateway auth header:
  `adapterConfig.headers.x-openclaw-token`.

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

## Creating Mission Control Agents On evaOS

Mission Control agents may use the customer's `main` OpenClaw agent for
CEO/orchestrator work, but they must never use the customer's primary
`agent:main:main` OpenClaw session. The product contract is: share the main
agent's context when useful, isolate the work into Paperclip-owned issue
sessions.

Canonical CEO/orchestrator adapter config:

```json
{
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "agentId": "main",
    "sessionKeyStrategy": "issue",
    "paperclipApiUrl": "http://127.0.0.1:3100",
    "url": "ws://127.0.0.1:18790/",
    "timeoutSec": 7200,
    "waitTimeoutMs": 7200000
  }
}
```

This request shape relies on the Paperclip same-gateway inheritance fix: when
an authenticated `openclaw_gateway` parent creates or hires an
`openclaw_gateway` child, Paperclip fills in the VM-local gateway URL/auth
contract from the parent and issues a fresh child device key. The persisted
child config must have `headers.x-openclaw-token` after creation even when the
create request omitted the secret.

Until that Paperclip server fix is deployed on the VM, or whenever you are
repairing agents created by older builds, run the support-control runtime
audit/repair after creating the child:

```bash
evaos-support paperclip-runtime-config \
  --targets <customer_id> \
  --run-id paperclip-runtime-YYYYMMDD

evaos-support paperclip-runtime-config \
  --targets <customer_id> \
  --apply \
  --approval-id <support-approval-or-issue-id> \
  --run-id paperclip-runtime-YYYYMMDD
```

The audit output must show header keys, not raw token values. If an
`openclaw_gateway` child has no canonical `x-openclaw-token` header, treat it
as adapter drift before waking that agent.

Do not set `sessionKey`. Do not set `payloadTemplate.agentId` for new agents;
`adapterConfig.agentId` is the authoritative OpenClaw target.

Dedicated worker agents use the same adapter defaults, but the OpenClaw agent
id must be created or confirmed first:

```json
{
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "agentId": "<openclaw-agent-id>",
    "sessionKeyStrategy": "issue",
    "paperclipApiUrl": "http://127.0.0.1:3100",
    "url": "ws://127.0.0.1:18790/",
    "timeoutSec": 7200,
    "waitTimeoutMs": 7200000
  }
}
```

Paperclip display names may change. OpenClaw agent ids are stable routing
targets and do not change unless the OpenClaw agent is intentionally recreated.
After creating or renaming a Mission Control agent, run a routing audit:

```bash
sudo /root/evaos-golden/scripts/paperclip-agent-routing-audit.sh --dry-run \
  --map Aurelius=main

# Dedicated worker example:
sudo /root/evaos-golden/scripts/paperclip-agent-routing-audit.sh --dry-run \
  --map Argyle=atlas
```

From support-control, use the customer-scoped guard:

```bash
evaos-support paperclip-routing-audit \
  --targets <customer_id> \
  --customer-map <customer_id>:<PaperclipName>=<openclaw-agent-id> \
  --run-id paperclip-routing-YYYYMMDD
```

Forbidden adapter shapes:

- `sessionKeyStrategy=fixed`
- `sessionKey=main`
- `openclaw_gateway` agents persisted without `headers.x-openclaw-token`
- any config that sends Paperclip work into `agent:main:main`
- public Paperclip browser hosts as the VM-local API base

## Stop Conditions

Ask before changing budgets, pausing/terminating agents, importing/exporting company data, modifying secrets, or approving actions on behalf of the user.

Do not use OpenClaw `openclaw.json` or Hermes `config.yaml` to fix a Paperclip control-plane problem unless the issue is explicitly about the agent runtime connected to Paperclip.
