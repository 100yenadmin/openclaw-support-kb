---
type: openclaw_doc
title: "Date and time"
source: "https://docs.openclaw.ai/date-time"
source_hash: "9ee90fe55b19cfee3961a9a045f9be8634ecc1d949482c9c43fcec1eb213f09d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "date-time.md"
original_doc_path: "date-time.md"
duplicate_index: 1
---

# Date and time
Source: https://docs.openclaw.ai/date-time

OpenClaw uses the configured **user timezone** for message envelopes, system events, and
the system prompt. When `agents.defaults.userTimezone` is unset, those surfaces use the
host timezone. Provider timestamps are preserved so tools keep their native semantics.
When the agent needs the exact current time and `session_status` is available, it runs that tool.

## Message envelopes (local by default)

Inbound messages are wrapped with a weekday plus second-precision timestamp:

```
[WhatsApp +1555 Mon 2026-01-05 16:26:34 PST] message text
```

Envelope timestamps use `agents.defaults.userTimezone` when configured, otherwise the
host timezone. Absolute timestamps and elapsed-time suffixes are built in.

### Examples

**Local (default):**

```
[WhatsApp +1555 Sun 2026-01-18 00:19:42 PST] hello
```

**User timezone:**

```
[WhatsApp +1555 Sun 2026-01-18 00:19:42 CST] hello
```

**Elapsed time:**

```
[WhatsApp +1555 +30s Sun 2026-01-18 00:20:12 CST] follow-up
```

## System prompt: temporal context

The system prompt includes a volatile **Temporal Context** section with the local calendar date
and time zone, but no live clock:

```
Current date: 2026-01-05
Time zone: America/Chicago
```

The zone is `agents.defaults.userTimezone` when configured, otherwise the host timezone.
The section lives below the prompt-cache boundary, so date rollover and timezone changes do not
invalidate the stable prefix. When available, `session_status` remains the source for exact current time.

## System event lines (local by default)

Queued system events inserted into agent context use `agents.defaults.userTimezone` when
configured, otherwise the host timezone.

```
System: [2026-01-12 12:19:17 PST] Model switched.
```

### Configure user timezone

```json5
{
  agents: {
    defaults: {
      userTimezone: "America/Chicago",
    },
  },
}
```

- `userTimezone` sets the user-local timezone for message envelopes, system events,
  and prompt context.
- Use an IANA timezone such as `America/Chicago`, `Europe/Vienna`, or `Asia/Tokyo`.

## Time format detection

Rendered clock values follow the operating system and locale preference. OpenClaw
detects 12-hour or 24-hour display on macOS and Windows, then falls back to locale
formatting. The detected value is cached per process.

## Tool payloads + connectors (raw provider time + normalized fields)

Channel tools return **provider-native timestamps** and add normalized fields for consistency:

- `timestampMs`: epoch milliseconds (UTC)
- `timestampUtc`: ISO 8601 UTC string

Raw provider fields are preserved so nothing is lost.

- Discord: UTC ISO timestamps
- Slack: epoch-like strings from the API
- Telegram/WhatsApp: provider-specific numeric/ISO timestamps

If you need local time, convert it downstream using the known timezone.

## Related docs

- [System Prompt](/concepts/system-prompt)
- [Timezones](/concepts/timezone)
- [Messages](/concepts/messages)

---
