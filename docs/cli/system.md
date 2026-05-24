---
type: openclaw_doc
title: "System"
source: "https://docs.openclaw.ai/cli/system"
source_hash: "db17e2f2a020d291b8f7fc87336726bf2acb93fb537e448b72b6db057dad6caf"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/system.md"
original_doc_path: "cli/system.md"
duplicate_index: 1
---

# System
Source: https://docs.openclaw.ai/cli/system

# `openclaw system`

System-level helpers for the Gateway: enqueue system events, control heartbeats,
and view presence.

All `system` subcommands use Gateway RPC and accept the shared client flags:

- `--url <url>`
- `--token <token>`
- `--timeout <ms>`
- `--expect-final`

## Common commands

```bash
openclaw system event --text "Check for urgent follow-ups" --mode now
openclaw system event --text "Check for urgent follow-ups" --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
openclaw system heartbeat enable
openclaw system heartbeat last
openclaw system presence
```

## `system event`

Enqueue a system event on the **main** session by default. The next heartbeat
will inject it as a `System:` line in the prompt. Use `--mode now` to trigger
the heartbeat immediately; `next-heartbeat` waits for the next scheduled tick.

Pass `--session-key` to target a specific session (for example to relay an
async-task completion back to the channel that started it).

> **Timing exception with `--session-key`:** when `--session-key` is supplied,
> `--mode next-heartbeat` collapses to an immediate targeted wake instead of
> waiting for the next scheduled tick. Targeted wakes use heartbeat intent
> `immediate` so they bypass the runner's not-due gate that would otherwise
> defer (and effectively drop) an `event`-intent wake. If you want delayed
> delivery, omit `--session-key` so the event lands on the main session and
> rides the next regular heartbeat.

Flags:

- `--text <text>`: required system event text.
- `--mode <mode>`: `now` or `next-heartbeat` (default).
- `--session-key <sessionKey>`: optional; target a specific agent session
  instead of the agent's main session. Keys that do not belong to the
  resolved agent fall back to the agent's main session.
- `--json`: machine-readable output.
- `--url`, `--token`, `--timeout`, `--expect-final`: shared Gateway RPC flags.

## `system heartbeat last|enable|disable`

Heartbeat controls:

- `last`: show the last heartbeat event.
- `enable`: turn heartbeats back on (use this if they were disabled).
- `disable`: pause heartbeats.

Flags:

- `--json`: machine-readable output.
- `--url`, `--token`, `--timeout`, `--expect-final`: shared Gateway RPC flags.

## `system presence`

List the current system presence entries the Gateway knows about (nodes,
instances, and similar status lines).

Flags:

- `--json`: machine-readable output.
- `--url`, `--token`, `--timeout`, `--expect-final`: shared Gateway RPC flags.

## Notes

- Requires a running Gateway reachable by your current config (local or remote).
- System events are ephemeral and not persisted across restarts.

## Related

- [CLI reference](/cli)

---
