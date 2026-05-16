---
type: openclaw_doc
title: "Health"
source: "https://docs.openclaw.ai/cli/health"
source_hash: "b7e1c91e719423d589b6a1cb001b27ff09da105b515ad27cbff0ccf74ef7e802"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/health.md"
original_doc_path: "cli/health.md"
duplicate_index: 1
---

# Health
Source: https://docs.openclaw.ai/cli/health



# `openclaw health`

Fetch health from the running Gateway.

## Options

| Flag             | Default | Description                                                        |
| ---------------- | ------- | ------------------------------------------------------------------ |
| `--json`         | `false` | Print machine-readable JSON instead of text.                       |
| `--timeout <ms>` | `10000` | Connection timeout in milliseconds.                                |
| `--verbose`      | `false` | Verbose logging. Forces a live probe and expands per-agent output. |
| `--debug`        | `false` | Alias for `--verbose`.                                             |

Examples:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw health
openclaw health --json
openclaw health --timeout 2500
openclaw health --verbose
openclaw health --debug
```

Notes:

* Default `openclaw health` asks the running gateway for its health snapshot. When the
  gateway already has a fresh cached snapshot, it can return that cached payload and
  refresh in the background.
* `--verbose` forces a live probe, prints gateway connection details, and expands the
  human-readable output across all configured accounts and agents.
* Output includes per-agent session stores when multiple agents are configured.

## Related

* [CLI reference](/cli)
* [Gateway health](/gateway/health)
