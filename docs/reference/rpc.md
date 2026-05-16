---
type: openclaw_doc
title: "RPC adapters"
source: "https://docs.openclaw.ai/reference/rpc"
source_hash: "e6555bba4a4d9920e4213a9024bf2303f3bda5fddd566918dff47c05299bff65"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/rpc.md"
original_doc_path: "reference/rpc.md"
duplicate_index: 1
---

# RPC adapters
Source: https://docs.openclaw.ai/reference/rpc



OpenClaw integrates external CLIs via JSON-RPC. Two patterns are used today.

## Pattern A: HTTP daemon (signal-cli)

* `signal-cli` runs as a daemon with JSON-RPC over HTTP.
* Event stream is SSE (`/api/v1/events`).
* Health probe: `/api/v1/check`.
* OpenClaw owns lifecycle when `channels.signal.autoStart=true`.

See [Signal](/channels/signal) for setup and endpoints.

## Pattern B: stdio child process (imsg)

* OpenClaw spawns `imsg rpc` as a child process for [iMessage](/channels/imessage).
* JSON-RPC is line-delimited over stdin/stdout (one JSON object per line).
* No TCP port, no daemon required.

Core methods used:

* `watch.subscribe` → notifications (`method: "message"`)
* `watch.unsubscribe`
* `send`
* `chats.list` (probe/diagnostics)

See [iMessage](/channels/imessage) for legacy setup and addressing (`chat_id` preferred).

## Adapter guidelines

* Gateway owns the process (start/stop tied to provider lifecycle).
* Keep RPC clients resilient: timeouts, restart on exit.
* Prefer stable IDs (e.g., `chat_id`) over display strings.

## Related

* [Gateway protocol](/gateway/protocol)
