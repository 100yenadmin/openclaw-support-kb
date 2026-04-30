---
type: openclaw_doc
title: "Health"
source: "https://docs.openclaw.ai/cli/health"
source_hash: "36fcff671b25feb12a682a2c3282c51623707bfeebcb3b9b5d0d1eb5da9196d7"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "cli/health.md"
original_doc_path: "cli/health.md"
duplicate_index: 1
---

# Health
Source: https://docs.openclaw.ai/cli/health



# `openclaw health`

Fetch health from the running Gateway.

Options:

* `--json`: machine-readable output
* `--timeout <ms>`: connection timeout in milliseconds (default `10000`)
* `--verbose`: verbose logging
* `--debug`: alias for `--verbose`

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
