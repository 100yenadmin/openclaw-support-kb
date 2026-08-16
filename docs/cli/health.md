---
type: openclaw_doc
title: "Health"
source: "https://docs.openclaw.ai/cli/health"
source_hash: "41cdf18d52ab1ccfd6a36015000f62c51e5305760d354f303b5623a3df1436f4"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/health.md"
original_doc_path: "cli/health.md"
duplicate_index: 1
---

# Health
Source: https://docs.openclaw.ai/cli/health

# `openclaw health`

Fetch a health snapshot from the running Gateway over WebSocket RPC (no direct channel sockets from the CLI).

## Options

| Flag             | Default | Description                                                                       |
| ---------------- | ------- | --------------------------------------------------------------------------------- |
| `--json`         | `false` | Print machine-readable JSON instead of text.                                      |
| `--timeout <ms>` | `10000` | Connection timeout in milliseconds.                                               |
| `--verbose`      | `false` | Forces a live probe and expands output across all configured accounts and agents. |
| `--debug`        | `false` | Alias for `--verbose`.                                                            |

Examples:

```bash
openclaw health
openclaw health --json
openclaw health --timeout 2500
openclaw health --verbose
openclaw health --debug
```

## Behavior

- Without `--verbose`, the Gateway can return a cached snapshot (fresh for up to 60 seconds and unchanged from live channel runtime state) and refresh it in the background for the next caller.
- `--verbose` forces a live probe (per-channel account probes), prints Gateway connection details, and expands human-readable output across all configured accounts and agents instead of just the default agent.
- `--json` always returns the full snapshot: channels, per-account probes, plugin load state, context-engine quarantine state, model-pricing cache state, event-loop health, delivery-queue warnings, and per-agent session stores.
- Top-level `ok: true` means the health RPC succeeded and the Gateway produced a snapshot. Queue warnings do not change it to `false`.
- When outbound or session deliveries, or inbound channel events, are dead-lettered, text output reports their counts and oldest failure age. Inbound counts are grouped by channel account; inspect or recover individual events with [`openclaw channels dead-letters`](/cli/channels#inbound-dead-letters).
- Optional `deliveryQueues.ingressPressure` summarizes durable inbound lanes that may be blocking later events. It is grouped by channel account and never exposes event, lane, payload, error, owner, token, session, or target identifiers. See [Gateway health](/gateway/health#queue-warnings) for the exact qualification and counting semantics.

## Related

- [CLI reference](/cli)
- [`openclaw status`](/cli/status) — local diagnosis and channel probes without a full health snapshot
- [Gateway health](/gateway/health)

---
