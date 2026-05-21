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
2. Use `systems/paperclip/` docs as facts. Use OpenClaw docs for the
   supported evaOS Paperclip runtime. Do not use Hermes for Paperclip child
   provisioning until Paperclip has a dedicated Hermes adapter/provisioner.
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
- Same-gateway OpenClaw child agents must also have a real OpenClaw
  agent/workspace, a matching `adapterConfig.agentId`, and a per-workspace
  `adapterConfig.claimedApiKeyPath`.
- OpenClaw is the default supported backend for Paperclip child provisioning
  on evaOS. Do not create Hermes-backed Paperclip children for this flow until
  a Hermes-specific adapter/provisioner exists.

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
contract from the parent, issues a fresh child device key, derives a child
OpenClaw `agentId` when omitted, and writes a child-specific claim path. The
persisted child config must have `headers.x-openclaw-token` and a non-main
`agentId` after creation even when the create request omitted the secret.
Do not copy this minimal request shape into an unauthenticated context; it is
only safe when the creating parent already has valid OpenClaw gateway auth and
Paperclip can run the evaOS provisioner.

Post-deploy safety net: until the deployed Paperclip version on that VM is
confirmed to include the evaOS same-gateway provisioner, or whenever you are
repairing agents created by older builds, run the support-control runtime
audit/repair after creating same-gateway children:

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
id and claim file must exist before the worker is expected to run:

```json
{
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "agentId": "<openclaw-agent-id>",
    "claimedApiKeyPath": "~/.openclaw/workspace-<openclaw-agent-id>/paperclip-claimed-api-key.json",
    "sessionKeyStrategy": "issue",
    "paperclipApiUrl": "http://127.0.0.1:3100",
    "url": "ws://127.0.0.1:18790/",
    "timeoutSec": 7200,
    "waitTimeoutMs": 7200000
  }
}
```

Until the auto-provisioning build is deployed, manually create the matching
OpenClaw identity and save the worker's Paperclip API key in that workspace:

```bash
openclaw agents add <openclaw-agent-id> \
  --workspace /root/.openclaw/workspace-<openclaw-agent-id> \
  --model openai/gpt-5.5 \
  --non-interactive \
  --json

# Save the child agent claim response as:
# /root/.openclaw/workspace-<openclaw-agent-id>/paperclip-claimed-api-key.json
# chmod 600 that file; never print the token.
```

For evaOS OpenClaw Gateway agents, keep `runtimeConfig.heartbeat.maxConcurrentRuns`
and `runtimeConfig.heartbeat.gatewayMaxConcurrentRuns` at `1` unless a human
explicitly raises the shared gateway capacity. Paperclip's older default was a
per-agent limit of `20`, which can overwhelm a single local OpenClaw gateway
when a CEO creates many child agents at once.

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
- `openclaw_gateway` worker agents pointed at `main` when they should have a
  dedicated OpenClaw `agentId`
- `openclaw_gateway` worker agents loading the main workspace claim file
- any config that sends Paperclip work into `agent:main:main`
- public Paperclip browser hosts as the VM-local API base

## Stop Conditions

Ask before changing budgets, pausing/terminating agents, importing/exporting company data, modifying secrets, or approving actions on behalf of the user.

Do not use OpenClaw `openclaw.json` or Hermes `config.yaml` to fix a Paperclip control-plane problem unless the issue is explicitly about the agent runtime connected to Paperclip.
