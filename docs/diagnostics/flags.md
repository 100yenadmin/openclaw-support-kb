---
type: openclaw_doc
title: "Diagnostics flags"
source: "https://docs.openclaw.ai/diagnostics/flags"
source_hash: "65fac505cad7700d2cf591084cf206cce6ca8748dd53e764852b79810cefcd71"
doc_path: "diagnostics/flags.md"
original_doc_path: "diagnostics/flags.md"
duplicate_index: 1
---

# Diagnostics flags
Source: https://docs.openclaw.ai/diagnostics/flags



Diagnostics flags let you enable targeted debug logs without turning on verbose logging everywhere. Flags are opt-in and have no effect unless a subsystem checks them.

## How it works

* Flags are strings (case-insensitive).
* You can enable flags in config or via an env override.
* Wildcards are supported:
  * `telegram.*` matches `telegram.http`
  * `*` enables all flags

## Enable via config

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "diagnostics": {
    "flags": ["telegram.http"]
  }
}
```

Multiple flags:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "diagnostics": {
    "flags": ["telegram.http", "gateway.*"]
  }
}
```

Restart the gateway after changing flags.

## Env override (one-off)

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
OPENCLAW_DIAGNOSTICS=telegram.http,telegram.payload
```

Disable all flags:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
OPENCLAW_DIAGNOSTICS=0
```

## Timeline artifacts

The `timeline` flag writes structured startup and runtime timing events for
external QA harnesses:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
OPENCLAW_DIAGNOSTICS=timeline \
OPENCLAW_DIAGNOSTICS_TIMELINE_PATH=/tmp/openclaw-timeline.jsonl \
openclaw gateway run
```

You can also enable it in config:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "diagnostics": {
    "flags": ["timeline"]
  }
}
```

The timeline file path still comes from
`OPENCLAW_DIAGNOSTICS_TIMELINE_PATH`. When `timeline` is enabled only from
config, the earliest config-loading spans are not emitted because OpenClaw has
not read config yet; subsequent startup spans use the config flag.

`OPENCLAW_DIAGNOSTICS=1`, `OPENCLAW_DIAGNOSTICS=all`, and
`OPENCLAW_DIAGNOSTICS=*` also enable the timeline because they enable every
diagnostics flag. Prefer `timeline` when you only want the JSONL timing
artifact.

Timeline records use the `openclaw.diagnostics.v1` envelope. Events can include
process ids, phase names, span names, durations, plugin ids, dependency counts,
event-loop delay samples, provider operation names, child-process exit state,
and startup error names/messages. Treat timeline files as local diagnostics
artifacts; review them before sharing outside your machine.

## Where logs go

Flags emit logs into the standard diagnostics log file. By default:

```
/tmp/openclaw/openclaw-YYYY-MM-DD.log
```

If you set `logging.file`, use that path instead. Logs are JSONL (one JSON object per line). Redaction still applies based on `logging.redactSensitive`.

## Extract logs

Pick the latest log file:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
ls -t /tmp/openclaw/openclaw-*.log | head -n 1
```

Filter for Telegram HTTP diagnostics:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
rg "telegram http error" /tmp/openclaw/openclaw-*.log
```

Or tail while reproducing:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
tail -f /tmp/openclaw/openclaw-$(date +%F).log | rg "telegram http error"
```

For remote gateways, you can also use `openclaw logs --follow` (see [/cli/logs](/cli/logs)).

## Notes

* If `logging.level` is set higher than `warn`, these logs may be suppressed. Default `info` is fine.
* Flags are safe to leave enabled; they only affect log volume for the specific subsystem.
* Use [/logging](/logging) to change log destinations, levels, and redaction.

## Related

* [Gateway diagnostics](/gateway/diagnostics)
* [Gateway troubleshooting](/gateway/troubleshooting)
