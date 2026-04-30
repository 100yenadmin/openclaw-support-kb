---
type: openclaw_doc
title: "Gateway lock"
source: "https://docs.openclaw.ai/gateway/gateway-lock"
source_hash: "71d4ef1d0a73e24f46585340b365d0a728755751c62e0d822438ce17663de6cd"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "gateway/gateway-lock.md"
original_doc_path: "gateway/gateway-lock.md"
duplicate_index: 1
---

# Gateway lock
Source: https://docs.openclaw.ai/gateway/gateway-lock



## Why

* Ensure only one gateway instance runs per base port on the same host; additional gateways must use isolated profiles and unique ports.
* Survive crashes/SIGKILL without leaving stale lock files.
* Fail fast with a clear error when the control port is already occupied.

## Mechanism

* The gateway first acquires a per-config lock file under the state lock directory and probes the configured port for an existing listener.
* If the recorded lock owner is gone, the port is free, or the lock is stale, startup reclaims the lock and continues.
* The gateway then binds the HTTP/WebSocket listener (default `ws://127.0.0.1:18789`) using an exclusive TCP listener.
* If the bind fails with `EADDRINUSE`, startup throws `GatewayLockError("another gateway instance is already listening on ws://127.0.0.1:<port>")`.
* On shutdown the gateway closes the HTTP/WebSocket server and removes the lock file.

## Error surface

* If another process holds the port, startup throws `GatewayLockError("another gateway instance is already listening on ws://127.0.0.1:<port>")`.
* Other bind failures surface as `GatewayLockError("failed to bind gateway socket on ws://127.0.0.1:<port>: …")`.

## Operational notes

* If the port is occupied by *another* process, the error is the same; free the port or choose another with `openclaw gateway --port <port>`.
* Under a service supervisor, a new gateway process that sees an existing healthy `/healthz` responder exits successfully and leaves that process in control. If the existing process never becomes healthy, retries are bounded and startup fails with a clear lock error instead of looping forever.
* The macOS app still maintains its own lightweight PID guard before spawning the gateway; the runtime lock is enforced by the lock file plus HTTP/WebSocket bind.

## Related

* [Multiple Gateways](/gateway/multiple-gateways) — running multiple instances with unique ports
* [Troubleshooting](/gateway/troubleshooting) — diagnosing `EADDRINUSE` and port conflicts
