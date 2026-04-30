---
type: openclaw_doc
title: "Timezones"
source: "https://docs.openclaw.ai/concepts/timezone"
source_hash: "0b28190af234c5897ae0d0dea5a7096eca09fb5cb0fdf56c2c53af12d63935de"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "concepts/timezone.md"
original_doc_path: "concepts/timezone.md"
duplicate_index: 1
---

# Timezones
Source: https://docs.openclaw.ai/concepts/timezone



OpenClaw standardizes timestamps so the model sees a **single reference time**.

## Message envelopes (local by default)

Inbound messages are wrapped in an envelope like:

```
[Provider ... 2026-01-05 16:26 PST] message text
```

The timestamp in the envelope is **host-local by default**, with minutes precision.

You can override this with:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: {
    defaults: {
      envelopeTimezone: "local", // "utc" | "local" | "user" | IANA timezone
      envelopeTimestamp: "on", // "on" | "off"
      envelopeElapsed: "on", // "on" | "off"
    },
  },
}
```

* `envelopeTimezone: "utc"` uses UTC.
* `envelopeTimezone: "user"` uses `agents.defaults.userTimezone` (falls back to host timezone).
* Use an explicit IANA timezone (e.g., `"Europe/Vienna"`) for a fixed offset.
* `envelopeTimestamp: "off"` removes absolute timestamps from envelope headers.
* `envelopeElapsed: "off"` removes elapsed time suffixes (the `+2m` style).

### Examples

**Local (default):**

```
[Signal Alice +1555 2026-01-18 00:19 PST] hello
```

**Fixed timezone:**

```
[Signal Alice +1555 2026-01-18 06:19 GMT+1] hello
```

**Elapsed time:**

```
[Signal Alice +1555 +2m 2026-01-18T05:19Z] follow-up
```

## Tool payloads (raw provider data + normalized fields)

Tool calls (`channels.discord.readMessages`, `channels.slack.readMessages`, etc.) return **raw provider timestamps**.
We also attach normalized fields for consistency:

* `timestampMs` (UTC epoch milliseconds)
* `timestampUtc` (ISO 8601 UTC string)

Raw provider fields are preserved.

## User timezone for the system prompt

Set `agents.defaults.userTimezone` to tell the model the user's local time zone. If it is
unset, OpenClaw resolves the **host timezone at runtime** (no config write).

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: { defaults: { userTimezone: "America/Chicago" } },
}
```

The system prompt includes:

* `Current Date & Time` section with local time and timezone
* `Time format: 12-hour` or `24-hour`

You can control the prompt format with `agents.defaults.timeFormat` (`auto` | `12` | `24`).

See [Date & Time](/date-time) for the full behavior and examples.

## Related

* [Heartbeat](/gateway/heartbeat) — active hours use timezone for scheduling
* [Cron Jobs](/automation/cron-jobs) — cron expressions use timezone for scheduling
* [Date & Time](/date-time) — full date/time behavior and examples
