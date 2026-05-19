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
