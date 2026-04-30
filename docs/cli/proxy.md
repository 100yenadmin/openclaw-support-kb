---
type: openclaw_doc
title: "Proxy"
source: "https://docs.openclaw.ai/cli/proxy"
source_hash: "955332a07135d9d1146d71f8ddcab25303ef4d0ba5db514599ffd8628a5c2e35"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "cli/proxy.md"
original_doc_path: "cli/proxy.md"
duplicate_index: 1
---

# Proxy
Source: https://docs.openclaw.ai/cli/proxy



# `openclaw proxy`

Run the local explicit debug proxy and inspect captured traffic.

This is a debugging command for transport-level investigation. It can start a
local proxy, run a child command with capture enabled, list capture sessions,
query common traffic patterns, read captured blobs, and purge local capture
data.

## Commands

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw proxy start [--host <host>] [--port <port>]
openclaw proxy run [--host <host>] [--port <port>] -- <cmd...>
openclaw proxy coverage
openclaw proxy sessions [--limit <count>]
openclaw proxy query --preset <name> [--session <id>]
openclaw proxy blob --id <blobId>
openclaw proxy purge
```

## Query presets

`openclaw proxy query --preset <name>` accepts:

* `double-sends`
* `retry-storms`
* `cache-busting`
* `ws-duplicate-frames`
* `missing-ack`
* `error-bursts`

## Notes

* `start` defaults to `127.0.0.1` unless `--host` is set.
* `run` starts a local debug proxy and then runs the command after `--`.
* Captures are local debugging data; use `openclaw proxy purge` when finished.

## Related

* [CLI reference](/cli)
* [Trusted proxy auth](/gateway/trusted-proxy-auth)
