---
type: openclaw_doc
title: "Webhooks"
source: "https://docs.openclaw.ai/cli/webhooks"
source_hash: "873cfa6ccba5f3b967f1ccc7e3d18f08172f5bda98f041b200b09d13e691d2a9"
doc_path: "cli/webhooks.md"
original_doc_path: "cli/webhooks.md"
duplicate_index: 1
---

# Webhooks
Source: https://docs.openclaw.ai/cli/webhooks



# `openclaw webhooks`

Webhook helpers and integrations (Gmail Pub/Sub, webhook helpers).

Related:

* Webhooks: [Webhooks](/automation/cron-jobs#webhooks)
* Gmail Pub/Sub: [Gmail Pub/Sub](/automation/cron-jobs#gmail-pubsub-integration)

## Gmail

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw webhooks gmail setup --account you@example.com
openclaw webhooks gmail run
```

### `webhooks gmail setup`

Configure Gmail watch, Pub/Sub, and OpenClaw webhook delivery.

Required:

* `--account <email>`

Options:

* `--project <id>`
* `--topic <name>`
* `--subscription <name>`
* `--label <label>`
* `--hook-url <url>`
* `--hook-token <token>`
* `--push-token <token>`
* `--bind <host>`
* `--port <port>`
* `--path <path>`
* `--include-body`
* `--max-bytes <n>`
* `--renew-minutes <n>`
* `--tailscale <funnel|serve|off>`
* `--tailscale-path <path>`
* `--tailscale-target <target>`
* `--push-endpoint <url>`
* `--json`

Examples:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw webhooks gmail setup --account you@example.com
openclaw webhooks gmail setup --account you@example.com --project my-gcp-project --json
openclaw webhooks gmail setup --account you@example.com --hook-url https://gateway.example.com/hooks/gmail
```

### `webhooks gmail run`

Run `gog watch serve` plus the watch auto-renew loop.

Options:

* `--account <email>`
* `--topic <topic>`
* `--subscription <name>`
* `--label <label>`
* `--hook-url <url>`
* `--hook-token <token>`
* `--push-token <token>`
* `--bind <host>`
* `--port <port>`
* `--path <path>`
* `--include-body`
* `--max-bytes <n>`
* `--renew-minutes <n>`
* `--tailscale <funnel|serve|off>`
* `--tailscale-path <path>`
* `--tailscale-target <target>`

Example:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw webhooks gmail run --account you@example.com
```

See [Gmail Pub/Sub documentation](/automation/cron-jobs#gmail-pubsub-integration) for the end-to-end setup flow and operational details.

## Related

* [CLI reference](/cli)
* [Webhook automation](/automation/webhook)
