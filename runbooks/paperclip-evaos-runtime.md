# Paperclip on evaOS VMs

Paperclip runs as Mission Control on each evaOS VM. On these VMs, the public
`paperclip-<customer>.ecs.electricsheephq.com` host is for authenticated human
browser access through the Electric Sheep dashboard/proxy. It is not the right
API base for agents running on the same VM.

## VM-Local API Bases

Use these bases from inside the VM:

- CLI/server base: `http://127.0.0.1:3100`
- Raw HTTP API base: `http://127.0.0.1:3100/api`
- OpenClaw gateway adapter URL: `ws://127.0.0.1:18790/`

Do not point VM-local automation at the public Mission Control host. If an
agent sends `curl ... | jq` to the public host, the response may be Electric
Sheep login HTML instead of JSON, which causes parse errors and wastes a full
run window.

## Agent API Tokens

During Paperclip heartbeats, prefer the run-scoped `PAPERCLIP_API_KEY` value
from the environment. If a persistent claimed agent key exists at
`/root/.openclaw/workspace/paperclip-claimed-api-key.json`, agents may read the
`token` field from that JSON file without printing it and use it as a bearer
token.

Never paste the token into logs, comments, tickets, or chat output.

## JSON Guard

Before piping a response to `jq`, check the HTTP status and content type. If the
body begins with HTML or looks like a login page, switch to the VM-local API
base before retrying.

Example shape:

```bash
API_BASE="${PAPERCLIP_API_BASE:-http://127.0.0.1:3100/api}"
response="$(curl -fsS -H "Authorization: Bearer ${PAPERCLIP_API_KEY}" \
  "${API_BASE}/agents/me" \
  -H "Accept: application/json")" || {
  echo "Paperclip API request failed; check API base and token." >&2
  exit 1
}

printf '%s' "${response}" | node -e '
let s="";
process.stdin.on("data", d => s += d);
process.stdin.on("end", () => {
  try {
    JSON.parse(s);
    process.stdout.write(s);
  } catch {
    console.error("Paperclip response was not JSON; use the VM-local API base.");
    process.exit(1);
  }
});
'
```

## Timeout Policy

Paperclip-launched OpenClaw agents can run for hours. The evaOS default for
OpenClaw gateway adapters is:

- `timeoutSec`: `7200`
- `waitTimeoutMs`: `7200000`

This is a Paperclip adapter wait window, not a signal that every task should
take two hours. Simple control-plane operations such as creating an agent,
reading an issue, or posting a comment should normally complete quickly through
the VM-local API.

When a run times out near the adapter limit, inspect the run log before
increasing the timeout. Repeated `jq` parse errors or public-host API calls are
configuration/instruction bugs, not a need for a longer wait window.

## Mission Control Agent Creation Contract

Paperclip/Mission Control may use the customer's `main` OpenClaw agent for
CEO/orchestrator work, but it must never use the customer's primary
`agent:main:main` OpenClaw session. The safe pattern is:

- OpenClaw agent id: `main`
- Paperclip session lane: issue-scoped
- Paperclip API base: VM-local
- gateway URL: VM-local
- persisted gateway auth: `adapterConfig.headers.x-openclaw-token`

OpenClaw is the default supported Paperclip backend on evaOS right now. Do not
use Hermes for Paperclip child provisioning until Paperclip has a dedicated
Hermes adapter/provisioner with its own auth and workspace provisioning
contract.

Canonical CEO/orchestrator config:

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

This request shape is valid for same-gateway child creation after the
Paperclip server-side inheritance fix is deployed. The authenticated
`openclaw_gateway` parent supplies the VM-local gateway auth contract; the
child receives its own device key and should persist
`headers.x-openclaw-token` after create/hire even if the request body omitted
the secret. Do not use this minimal create shape from an unauthenticated
caller; it depends on inherited OpenClaw gateway auth and the evaOS provisioner
to create the child OpenClaw agent/workspace and claimed API key path.

Post-deploy safety net: do not rely on a Paperclip version string alone until
Mission Control exposes a stable feature flag for this behavior. For now,
treat the support-control dry-run as the deployment and drift gate after
creating same-gateway children: if the dry-run reports
`changedAgents=0`, `driftAgents=0`, and `checkedAgents` greater than zero, skip
apply. If it reports drift on `headers.x-openclaw-token`,
`runtimeConfig.heartbeat.maxConcurrentRuns`, or
`runtimeConfig.heartbeat.gatewayMaxConcurrentRuns`, run the apply step before
waking the new agent.

Run this audit for older Paperclip builds, agents created before the fix, manual
edits, or any same-gateway child whose create/hire behavior is uncertain:

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

`<customer_id>` is the support-control target identifier from inventory, such
as `jackie-david`, `eric-wilder`, or the customer/node UUID used by the support
run. `<support-approval-or-issue-id>` is the internal approval record for the
mutation, for example a support ticket, GitHub issue, or chat-scoped approval id
such as `chat-YYYYMMDD-paperclip-runtime-repair`.

Healthy dry-run output should be sanitized and look like this:

```json
{
  "changedAgents": 0,
  "driftAgents": 0,
  "checkedAgents": 2,
  "agents": [
    {
      "name": "Jane",
      "adapterType": "openclaw_gateway",
      "hasHeaders": true,
      "headerKeys": ["x-openclaw-token"],
      "runtime": {
        "heartbeat": {
          "maxConcurrentRuns": 1,
          "gatewayMaxConcurrentRuns": 1
        }
      }
    }
  ]
}
```

Drift output should name fields and redacted token metadata only:

```json
{
  "changedAgents": 1,
  "driftAgents": 1,
  "checkedAgents": 2,
  "driftKeys": [
    "headers.x-openclaw-token",
    "runtimeConfig.heartbeat.maxConcurrentRuns",
    "runtimeConfig.heartbeat.gatewayMaxConcurrentRuns"
  ],
  "authHeaderRepair": {
    "gatewayTokenAvailable": true,
    "tokenLength": 44,
    "tokenSha256Prefix": "abc123..."
  }
}
```

Audit output must list header keys and redacted token metadata only. Do not
print or paste raw gateway tokens into runbooks, issue comments, or chat.

There should be no `sessionKey` and no `payloadTemplate.agentId` for new
Mission Control agents. `adapterConfig.agentId` is the routing source of truth.

Dedicated worker config is the same except `adapterConfig.agentId` points at a
stable OpenClaw agent id that already exists, for example `atlas`:

```json
{
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "agentId": "atlas",
    "claimedApiKeyPath": "~/.openclaw/workspace-atlas/paperclip-claimed-api-key.json",
    "sessionKeyStrategy": "issue",
    "paperclipApiUrl": "http://127.0.0.1:3100",
    "url": "ws://127.0.0.1:18790/",
    "timeoutSec": 7200,
    "waitTimeoutMs": 7200000
  }
}
```

Renaming a Paperclip display name does not rename the OpenClaw agent id. If
Paperclip shows `Argyle` but the OpenClaw worker is `atlas`, preserve that
mapping explicitly.

Post-create or post-rename audit:

```bash
sudo /root/evaos-golden/scripts/paperclip-agent-routing-audit.sh --dry-run \
  --map Aurelius=main

sudo /root/evaos-golden/scripts/paperclip-agent-routing-audit.sh --dry-run \
  --map Argyle=atlas
```

From support-control:

```bash
evaos-support paperclip-routing-audit \
  --targets <customer_id> \
  --customer-map <customer_id>:<PaperclipName>=<openclaw-agent-id> \
  --run-id paperclip-routing-YYYYMMDD
```

Apply only after the dry-run shows the expected changes:

```bash
evaos-support paperclip-routing-audit \
  --targets <customer_id> \
  --customer-map <customer_id>:<PaperclipName>=<openclaw-agent-id> \
  --apply \
  --approval-id <support-approval-or-issue-id>
```

Do not approve any config that uses `sessionKeyStrategy=fixed` with
`sessionKey=main`. That shape routes work into `agent:main:main` and can hijack
the customer's normal OpenClaw main chat.

Do not wake an `openclaw_gateway` Paperclip child that is missing canonical
`headers.x-openclaw-token`; repair it first with `paperclip-runtime-config`.
