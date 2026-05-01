---
type: openclaw_doc
title: "Proxy"
source: "https://docs.openclaw.ai/cli/proxy"
source_hash: "93906f2539f7d3f124e21322d75fe2a2d8da1ec4179a33f7c7053a694633857a"
doc_path: "cli/proxy.md"
original_doc_path: "cli/proxy.md"
duplicate_index: 1
---

# Proxy
Source: https://docs.openclaw.ai/cli/proxy



# `openclaw proxy`

Validate operator-managed proxy routing, or run the local explicit debug proxy
and inspect captured traffic.

Use `validate` to preflight an operator-managed forward proxy before enabling
OpenClaw proxy routing. The other commands are debugging tools for
transport-level investigation: they can start a local proxy, run a child command
with capture enabled, list capture sessions, query common traffic patterns, read
captured blobs, and purge local capture data.

## Commands

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw proxy start [--host <host>] [--port <port>]
openclaw proxy run [--host <host>] [--port <port>] -- <cmd...>
openclaw proxy validate [--json] [--proxy-url <url>] [--allowed-url <url>] [--denied-url <url>] [--timeout-ms <ms>]
openclaw proxy coverage
openclaw proxy sessions [--limit <count>]
openclaw proxy query --preset <name> [--session <id>]
openclaw proxy blob --id <blobId>
openclaw proxy purge
```

## Validate

`openclaw proxy validate` checks the effective operator-managed proxy URL from
`--proxy-url`, config, or `OPENCLAW_PROXY_URL`. It reports a config problem when
no proxy is enabled and configured; use `--proxy-url` for a one-off preflight
before changing config. By default it verifies that a public destination succeeds
through the proxy and that the proxy cannot reach a temporary loopback canary.
Custom denied destinations are fail-closed: HTTP responses and ambiguous
transport failures both fail unless you can verify a deployment-specific denial
signal separately.

Options:

* `--json`: print machine-readable JSON.
* `--proxy-url <url>`: validate this proxy URL instead of config or env.
* `--allowed-url <url>`: add a destination expected to succeed through the proxy. Repeat to check multiple destinations.
* `--denied-url <url>`: add a destination expected to be blocked by the proxy. Repeat to check multiple destinations.
* `--timeout-ms <ms>`: per-request timeout in milliseconds.

See [Network Proxy](/security/network-proxy) for deployment guidance and denial
semantics.

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
* `validate` exits with code 1 when proxy config or destination checks fail.
* Captures are local debugging data; use `openclaw proxy purge` when finished.

## Related

* [CLI reference](/cli)
* [Network Proxy](/security/network-proxy)
* [Trusted proxy auth](/gateway/trusted-proxy-auth)
