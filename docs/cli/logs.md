---
type: openclaw_doc
title: "Logs"
source: "https://docs.openclaw.ai/cli/logs"
source_hash: "af2f962c823296363752312c0e5d51b07de35fa9d050066d5ea5c846fe885b92"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "cli/logs.md"
original_doc_path: "cli/logs.md"
duplicate_index: 1
---

# Logs
Source: https://docs.openclaw.ai/cli/logs



# `openclaw logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

* Logging overview: [Logging](/logging)
* Gateway CLI: [gateway](/cli/gateway)

## Options

* `--limit <n>`: maximum number of log lines to return (default `200`)
* `--max-bytes <n>`: maximum bytes to read from the log file (default `250000`)
* `--follow`: follow the log stream
* `--interval <ms>`: polling interval while following (default `1000`)
* `--json`: emit line-delimited JSON events
* `--plain`: plain text output without styled formatting
* `--no-color`: disable ANSI colors
* `--local-time`: render timestamps in your local timezone

## Shared Gateway RPC options

`openclaw logs` also accepts the standard Gateway client flags:

* `--url <url>`: Gateway WebSocket URL
* `--token <token>`: Gateway token
* `--timeout <ms>`: timeout in ms (default `30000`)
* `--expect-final`: wait for a final response when the Gateway call is agent-backed

When you pass `--url`, the CLI does not auto-apply config or environment credentials. Include `--token` explicitly if the target Gateway requires auth.

## Examples

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw logs
openclaw logs --follow
openclaw logs --follow --interval 2000
openclaw logs --limit 500 --max-bytes 500000
openclaw logs --json
openclaw logs --plain
openclaw logs --no-color
openclaw logs --limit 500
openclaw logs --local-time
openclaw logs --follow --local-time
openclaw logs --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
```

## Notes

* Use `--local-time` to render timestamps in your local timezone.
* If the implicit local loopback Gateway asks for pairing, closes during connect, or times out before `logs.tail` answers, `openclaw logs` falls back to the configured Gateway file log automatically. Explicit `--url` targets do not use this fallback.

## Related

* [CLI reference](/cli)
* [Gateway logging](/gateway/logging)
