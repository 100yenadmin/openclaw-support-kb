---
type: openclaw_doc
title: "System"
source: "https://docs.openclaw.ai/cli/system"
source_hash: "df0015fb4072d5fa3ca75d7df8eeb28b6ed5ab2e97b01572d00c42a0f81757ae"
generated_at: "2026-04-30T12:08:08.028Z"
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

* `--url <url>`
* `--token <token>`
* `--timeout <ms>`
* `--expect-final`

## Common commands

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw system event --text "Check for urgent follow-ups" --mode now
openclaw system event --text "Check for urgent follow-ups" --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
openclaw system heartbeat enable
openclaw system heartbeat last
openclaw system presence
```

## `system event`

Enqueue a system event on the **main** session. The next heartbeat will inject
it as a `System:` line in the prompt. Use `--mode now` to trigger the heartbeat
immediately; `next-heartbeat` waits for the next scheduled tick.

Flags:

* `--text <text>`: required system event text.
* `--mode <mode>`: `now` or `next-heartbeat` (default).
* `--json`: machine-readable output.
* `--url`, `--token`, `--timeout`, `--expect-final`: shared Gateway RPC flags.

## `system heartbeat last|enable|disable`

Heartbeat controls:

* `last`: show the last heartbeat event.
* `enable`: turn heartbeats back on (use this if they were disabled).
* `disable`: pause heartbeats.

Flags:

* `--json`: machine-readable output.
* `--url`, `--token`, `--timeout`, `--expect-final`: shared Gateway RPC flags.

## `system presence`

List the current system presence entries the Gateway knows about (nodes,
instances, and similar status lines).

Flags:

* `--json`: machine-readable output.
* `--url`, `--token`, `--timeout`, `--expect-final`: shared Gateway RPC flags.

## Notes

* Requires a running Gateway reachable by your current config (local or remote).
* System events are ephemeral and not persisted across restarts.

## Related

* [CLI reference](/cli)
