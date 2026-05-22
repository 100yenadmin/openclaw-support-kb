---
name: paperclip-mission-control
description: Use for Paperclip, Mission Control, companies, goals, org charts, agents, tickets, heartbeats, budgets, approvals, dashboard, API, CLI, deploy, adapter, or board-operator questions.
---

# Paperclip Mission Control

Use this skill when an OpenClaw agent is operating Paperclip from outside the
Paperclip runtime. Paperclip already ships its own `paperclip` skill, a
governance-aware `paperclip-create-agent` skill, `paperclipai agent local-cli`
for local Codex/Claude identities, and an OpenClaw invite flow that can install
`~/.openclaw/skills/paperclip/SKILL.md` during join. This skill is the external
operator layer for OpenClaw agents: use it with the Paperclip CLI/API, evaOS
local API rules, and the safety gates below.

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

## External Operator Setup

Prefer the CLI for supported operations because it handles auth context, JSON
output, and command shapes consistently. Use raw HTTP when the CLI does not
cover the needed endpoint, such as `agent-hires`, issue-thread interactions,
some budget operations, OpenClaw invite prompts, or company skill management.

For CLI calls, use the server base without `/api`:

```bash
export PAPERCLIP_API_URL="${PAPERCLIP_API_URL:-http://127.0.0.1:3100}"
paperclipai dashboard get --api-base "$PAPERCLIP_API_URL" --api-key "$PAPERCLIP_API_KEY" --company-id "$PAPERCLIP_COMPANY_ID" --json
```

For raw HTTP calls, use the API base with `/api`:

```bash
export PAPERCLIP_API_BASE="${PAPERCLIP_API_BASE:-${PAPERCLIP_API_URL:-http://127.0.0.1:3100}/api}"
curl -fsS "$PAPERCLIP_API_BASE/health" -H "Accept: application/json"
```

The CLI also accepts `--api-base "$PAPERCLIP_API_URL"` and `--api-key
"$PAPERCLIP_API_KEY"` on client commands. Pass them explicitly if the
environment or profile is not already configured.

If you need a local manual Paperclip identity for Codex/Claude, use:

```bash
paperclipai agent local-cli <agent-id> --company-id <company-id>
```

That creates an agent key, installs Paperclip skills for local Codex/Claude, and
prints `PAPERCLIP_API_URL`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_AGENT_ID`, and
`PAPERCLIP_API_KEY` exports. Do not paste the token into chat, comments, logs,
or issue descriptions. Resolve the agent to a UUID first; do not rely on
shortnames for `local-cli` in the current server.

If `/root/.openclaw/workspace/paperclip-claimed-api-key.json` exists on an
evaOS VM, load its `token` field silently and export it as `PAPERCLIP_API_KEY`.
If that fixed path is missing, look in the active OpenClaw workspace and
`/root/.openclaw/workspace-*/paperclip-claimed-api-key.json`; load an existing
token silently, but do not copy, print, or persist secrets. Prefer a short-lived
`PAPERCLIP_API_KEY` already present in the current environment.

## Resolution Rules

- Resolve names to IDs before mutating. For "Alice", "CEO", or "SEO agent",
  list agents and match exact `name`, `urlKey`, role, or title. Ask if
  ambiguous.
- Resolve issues by identifier or UUID, read the issue before changing it, and
  preserve `projectId`, `goalId`, `parentId`, `billingCode`, and blockers when
  creating follow-up work.
- If an API response is not JSON, stop and fix the base URL before parsing.
  Public Paperclip hosts may return Electric Sheep login HTML.
- For issue mutations from an agent-authenticated run, include
  `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on raw HTTP requests when it exists.
  The current CLI reads `PAPERCLIP_API_KEY` but does not add this header for
  client commands, so use raw HTTP when checkout ownership or run traceability
  matters.

## CLI Quick Reference

```bash
paperclipai agent list --company-id "$PAPERCLIP_COMPANY_ID" --json
paperclipai agent get <agent-id> --json

paperclipai dashboard get --company-id "$PAPERCLIP_COMPANY_ID" --json
paperclipai activity list --company-id "$PAPERCLIP_COMPANY_ID" --agent-id <agent-id> --json

paperclipai issue list --company-id "$PAPERCLIP_COMPANY_ID" --status todo,in_progress,blocked --json
paperclipai issue get <issue-id-or-identifier> --json
paperclipai issue create --company-id "$PAPERCLIP_COMPANY_ID" --title "..." --description "..." --status todo --priority medium --assignee-agent-id <agent-id> --json
paperclipai issue update <issue-id> --assignee-agent-id <agent-id> --status todo --comment "Assigned for next action." --json
paperclipai issue comment <issue-id> --body "..." --json

paperclipai approval list --company-id "$PAPERCLIP_COMPANY_ID" --status pending --json
paperclipai approval get <approval-id> --json
paperclipai approval comment <approval-id> --body "..." --json

paperclipai heartbeat run --agent-id <agent-id> --api-base "$PAPERCLIP_API_URL" --api-key "$PAPERCLIP_API_KEY"
```

## Playbook: Company Status Check

For "check Paperclip", "how is the company doing", or "give me CEO feedback":

1. Establish API base, token, and company id.
2. Read `paperclipai dashboard get --company-id ... --json`.
3. Read pending approvals with `paperclipai approval list --status pending`.
4. Read active/blocked work with `paperclipai issue list --status todo,in_progress,in_review,blocked`.
5. Read recent activity with `paperclipai activity list --company-id ... --json`.
6. Summarize health, blocked work, stale work, budget utilization, pending
   approvals, and recommended next actions.

Do not change anything during a status check unless the user explicitly asks
for an action.

## Playbook: Agent Lookup And Current Work

For "what is Alice doing" or "check on the CEO":

1. `paperclipai agent list --company-id "$PAPERCLIP_COMPANY_ID" --json`.
2. Resolve the requested person/role to one agent id. Ask on ambiguity.
3. `paperclipai agent get <agent-id> --json`.
4. `paperclipai issue list --company-id "$PAPERCLIP_COMPANY_ID" --assignee-agent-id <agent-id> --status todo,in_progress,in_review,blocked --json`.
5. `paperclipai activity list --company-id "$PAPERCLIP_COMPANY_ID" --agent-id <agent-id> --json`.

Return status, budget/spend, assigned issues, current blockers, recent comments,
and whether a wake or reassignment is warranted.

## Playbook: Create Or Assign Issue

Before filing or assigning work, resolve company, assignee, issue title,
priority, desired status, and whether it belongs under a project, goal, or
parent issue. Use first-class fields, not just prose.

Create assigned work:

```bash
paperclipai issue create --company-id "$PAPERCLIP_COMPANY_ID" \
  --title "SEO audit for pricing pages" \
  --description "..." \
  --status todo \
  --priority medium \
  --assignee-agent-id <agent-id> \
  --project-id <project-id> \
  --goal-id <goal-id> \
  --json
```

Assign or reassign existing work:

```bash
paperclipai issue update <issue-id> \
  --assignee-agent-id <agent-id> \
  --status todo \
  --comment "Assigned to <name> for the next action." \
  --json
```

If a task is actively checked out, do not steal it unless the acting identity has
manager/board authority and the user explicitly asked for intervention.

## Playbook: Issue Comments And Feedback

For feedback, prefer a comment over a status update unless the requested action
is specifically to move the issue. Resolve and read the issue first, then:

```bash
paperclipai issue comment <issue-id> --body "## Feedback

- Please tighten the SEO title recommendations.
- Keep the implementation plan under the existing project.
" --json
```

`@AgentName` mentions can wake agents and spend budget. Use structured mentions
or direct assignment only when the user intends to wake someone.

## Playbook: CEO Delegation And Hiring Requests

For "have the CEO make another agent" or "set up an SEO team", prefer CEO
delegation over direct creation:

1. Resolve the CEO agent.
2. Create an issue assigned to the CEO with the desired business outcome, budget
   envelope, reporting line, and constraints.
3. Ask for a staged plan first when the request implies multiple hires or a new
   department.
4. Wake the CEO only if the user wants immediate action.

For an SEO team, stage the request as a plan such as "SEO Lead first; then
Technical SEO and Content SEO only after the lead's plan is approved." Avoid
unbounded team creation.

Only use the direct hire API when the user explicitly asks for a direct hire
request or the CEO/board workflow requires it:

```bash
curl -fsS -X POST "$PAPERCLIP_API_BASE/companies/$PAPERCLIP_COMPANY_ID/agent-hires" \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"SEO Lead","role":"general","title":"SEO Lead","reportsTo":"<manager-agent-id>","capabilities":"Owns SEO strategy, audits, keyword plan, and delegation.","budgetMonthlyCents":5000,"runtimeConfig":{"heartbeat":{"enabled":false,"wakeOnDemand":true}}}'
```

Do not use generic approval create (`paperclipai approval create` or a raw
`hire_agent` approval) as a substitute for `/agent-hires`. It bypasses the hire
workflow and can leave no pending agent row for the board to approve. For
confirmed direct-hire requests, call `POST
/api/companies/:companyId/agent-hires`, then verify the returned
`approval.status` is `pending` when board approval is required.

Hiring, direct agent creation, permission expansion, and budget increases are
board-only unless the current identity has explicit delegated permission. If the
response creates an approval, report the approval id and leave it pending.

## Playbook: Approvals And Plan Confirmations

First classify the pending item:

- Company approval: use `paperclipai approval list/get/comment`.
- Issue-thread plan confirmation or interaction: read the issue, comments, plan
  document, and interactions through raw HTTP.

Approving, rejecting, requesting revision, or accepting a plan is board-only.
Before acting, show the payload, linked issues, requester, risks, and exact
decision note, then require explicit user confirmation.

Use comments freely for discussion:

```bash
paperclipai approval comment <approval-id> --body "Please add budget, reporting line, and success criteria before approval." --json
```

Use `paperclipai approval approve`, `reject`, or `request-revision` only after
confirmation from the user or a board-authorized policy.

## Playbook: Wake Agent

Before waking an agent, resolve the agent, check status, budget, and whether a
run is already queued/running. Do not wake paused, terminated, pending-approval,
or over-budget agents unless the user explicitly confirms the reason.

```bash
paperclipai heartbeat run --agent-id <agent-id> \
  --api-base "$PAPERCLIP_API_URL" \
  --api-key "$PAPERCLIP_API_KEY"
```

If the goal is to wake an agent about a specific issue, comment or assign the
issue first so the wake has context.

## Playbook: Runaway Agent Triage

For "stop", "pause", "delete", or "runaway":

1. Inspect agent status, current run/activity, assigned issue, and budget.
2. Prefer a pause over termination.
3. Ask for explicit confirmation before pause/resume/terminate.
4. Record an issue comment or approval note explaining why action was taken.

Raw HTTP controls:

```bash
curl -fsS -X POST "$PAPERCLIP_API_BASE/agents/<agent-id>/pause" -H "Authorization: Bearer $PAPERCLIP_API_KEY"
curl -fsS -X POST "$PAPERCLIP_API_BASE/agents/<agent-id>/resume" -H "Authorization: Bearer $PAPERCLIP_API_KEY"
curl -fsS -X POST "$PAPERCLIP_API_BASE/agents/<agent-id>/terminate" -H "Authorization: Bearer $PAPERCLIP_API_KEY"
```

Termination is irreversible in normal operations. Treat delete/terminate as
board-only and human-confirmed.

## Playbook: Budgets

For budget questions, first read costs and budget state:

```bash
curl -fsS "$PAPERCLIP_API_BASE/companies/$PAPERCLIP_COMPANY_ID/costs/summary" -H "Authorization: Bearer $PAPERCLIP_API_KEY"
curl -fsS "$PAPERCLIP_API_BASE/companies/$PAPERCLIP_COMPANY_ID/budgets/overview" -H "Authorization: Bearer $PAPERCLIP_API_KEY"
```

For budget changes, ask whether the target is company or agent, show current
spend and budget, convert dollars to cents, and require explicit confirmation.

```bash
curl -fsS -X PATCH "$PAPERCLIP_API_BASE/companies/$PAPERCLIP_COMPANY_ID/budgets" \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"budgetMonthlyCents":5000}'

curl -fsS -X PATCH "$PAPERCLIP_API_BASE/agents/<agent-id>/budgets" \
  -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"budgetMonthlyCents":2000}'
```

Budget patch routes are board-only. Do not assume an agent-delegated policy can
change company or agent budgets through these endpoints.

## evaOS VM Runtime Rules

When you are running inside an evaOS customer VM, use the VM-local Paperclip
API for automation. Public Mission Control hosts such as
`https://paperclip-<customer>.ecs.electricsheephq.com` are browser/dashboard
routes and may return Electric Sheep login HTML instead of JSON.

- CLI/server base: `http://127.0.0.1:3100`
- Raw HTTP API base: `http://127.0.0.1:3100/api`
- evaOS OpenClaw gateway adapter URL: `ws://127.0.0.1:18790/`
- Same-gateway OpenClaw child agents must persist a gateway auth header:
  `adapterConfig.headers.x-openclaw-token`.
- Same-gateway OpenClaw child agents must also have a real OpenClaw
  agent/workspace, a matching `adapterConfig.agentId`, and a per-workspace
  `adapterConfig.claimedApiKeyPath`.
- OpenClaw is the default supported backend for Paperclip child provisioning
  on evaOS. Do not create Hermes-backed Paperclip children for this flow until
  a Hermes-specific adapter/provisioner exists.

Stock Paperclip/local OpenClaw examples may use `ws://127.0.0.1:18789`. On
evaOS, trust the support-control `paperclip-runtime-config` target state before
changing an existing `openclaw_gateway` adapter URL.

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

Ask before changing budgets, pausing/resuming/terminating agents, importing or
exporting company data, modifying secrets, approving/rejecting/requesting
revision on approvals, accepting plan confirmations, creating agents directly,
submitting `agent-hires`, or expanding permissions.

Never bypass required board approval. Never let an agent approve its own hire,
strategy, budget increase, or permission expansion.

Do not use OpenClaw `openclaw.json` or Hermes `config.yaml` to fix a Paperclip control-plane problem unless the issue is explicitly about the agent runtime connected to Paperclip.
