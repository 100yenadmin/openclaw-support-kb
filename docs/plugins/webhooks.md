---
type: openclaw_doc
title: "Webhooks plugin"
source: "https://docs.openclaw.ai/plugins/webhooks"
source_hash: "fb2ab1d03da0e880dbda1c71256256d73c9d13bfcf7dd140f6a48bbe97d9f683"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "plugins/webhooks.md"
original_doc_path: "plugins/webhooks.md"
duplicate_index: 1
---

# Webhooks plugin
Source: https://docs.openclaw.ai/plugins/webhooks



# Webhooks (plugin)

The Webhooks plugin adds authenticated HTTP routes that bind external
automation to OpenClaw TaskFlows.

Use it when you want a trusted system such as Zapier, n8n, a CI job, or an
internal service to create and drive managed TaskFlows without writing a custom
plugin first.

## Where it runs

The Webhooks plugin runs inside the Gateway process.

If your Gateway runs on another machine, install and configure the plugin on
that Gateway host, then restart the Gateway.

## Configure routes

Set config under `plugins.entries.webhooks.config`:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  plugins: {
    entries: {
      webhooks: {
        enabled: true,
        config: {
          routes: {
            zapier: {
              path: "/plugins/webhooks/zapier",
              sessionKey: "agent:main:main",
              secret: {
                source: "env",
                provider: "default",
                id: "OPENCLAW_WEBHOOK_SECRET",
              },
              controllerId: "webhooks/zapier",
              description: "Zapier TaskFlow bridge",
            },
          },
        },
      },
    },
  },
}
```

Route fields:

* `enabled`: optional, defaults to `true`
* `path`: optional, defaults to `/plugins/webhooks/<routeId>`
* `sessionKey`: required session that owns the bound TaskFlows
* `secret`: required shared secret or SecretRef
* `controllerId`: optional controller id for created managed flows
* `description`: optional operator note

Supported `secret` inputs:

* Plain string
* SecretRef with `source: "env" | "file" | "exec"`

If a secret-backed route cannot resolve its secret at startup, the plugin skips
that route and logs a warning instead of exposing a broken endpoint.

## Security model

Each route is trusted to act with the TaskFlow authority of its configured
`sessionKey`.

This means the route can inspect and mutate TaskFlows owned by that session, so
you should:

* Use a strong unique secret per route
* Prefer secret references over inline plaintext secrets
* Bind routes to the narrowest session that fits the workflow
* Expose only the specific webhook path you need

The plugin applies:

* Shared-secret authentication
* Request body size and timeout guards
* Fixed-window rate limiting
* In-flight request limiting
* Owner-bound TaskFlow access through `api.runtime.tasks.managedFlows.bindSession(...)`

## Request format

Send `POST` requests with:

* `Content-Type: application/json`
* `Authorization: Bearer <secret>` or `x-openclaw-webhook-secret: <secret>`

Example:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
curl -X POST https://gateway.example.com/plugins/webhooks/zapier \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_SHARED_SECRET' \
  -d '{"action":"create_flow","goal":"Review inbound queue"}'
```

## Supported actions

The plugin currently accepts these JSON `action` values:

* `create_flow`
* `get_flow`
* `list_flows`
* `find_latest_flow`
* `resolve_flow`
* `get_task_summary`
* `set_waiting`
* `resume_flow`
* `finish_flow`
* `fail_flow`
* `request_cancel`
* `cancel_flow`
* `run_task`

### `create_flow`

Creates a managed TaskFlow for the route's bound session.

Example:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "action": "create_flow",
  "goal": "Review inbound queue",
  "status": "queued",
  "notifyPolicy": "done_only"
}
```

### `run_task`

Creates a managed child task inside an existing managed TaskFlow.

Allowed runtimes are:

* `subagent`
* `acp`

Example:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "action": "run_task",
  "flowId": "flow_123",
  "runtime": "acp",
  "childSessionKey": "agent:main:acp:worker",
  "task": "Inspect the next message batch"
}
```

## Response shape

Successful responses return:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "ok": true,
  "routeId": "zapier",
  "result": {}
}
```

Rejected requests return:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "ok": false,
  "routeId": "zapier",
  "code": "not_found",
  "error": "TaskFlow not found.",
  "result": {}
}
```

The plugin intentionally scrubs owner/session metadata from webhook responses.

## Related docs

* [Plugin runtime SDK](/plugins/sdk-runtime)
* [Hooks and webhooks overview](/automation/hooks)
* [CLI webhooks](/cli/webhooks)
