---
type: openclaw_doc
title: "Typing indicators"
source: "https://docs.openclaw.ai/concepts/typing-indicators"
source_hash: "60650f11f704b0ee06083bf1726b3e9d1fbb5c928a131f2766645aa7a8811e16"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "concepts/typing-indicators.md"
original_doc_path: "concepts/typing-indicators.md"
duplicate_index: 1
---

# Typing indicators
Source: https://docs.openclaw.ai/concepts/typing-indicators



Typing indicators are sent to the chat channel while a run is active. Use
`agents.defaults.typingMode` to control **when** typing starts and `typingIntervalSeconds`
to control **how often** it refreshes.

## Defaults

When `agents.defaults.typingMode` is **unset**, OpenClaw keeps the legacy behavior:

* **Direct chats**: typing starts immediately once the model loop begins.
* **Group chats with a mention**: typing starts immediately.
* **Group chats without a mention**: typing starts only when message text begins streaming.
* **Heartbeat runs**: typing starts when the heartbeat run begins if the
  resolved heartbeat target is a typing-capable chat and typing is not disabled.

## Modes

Set `agents.defaults.typingMode` to one of:

* `never` — no typing indicator, ever.
* `instant` — start typing **as soon as the model loop begins**, even if the run
  later returns only the silent reply token.
* `thinking` — start typing on the **first reasoning delta** (requires
  `reasoningLevel: "stream"` for the run).
* `message` — start typing on the **first non-silent text delta** (ignores
  the `NO_REPLY` silent token).

Order of “how early it fires”:
`never` → `message` → `thinking` → `instant`

## Configuration

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agent: {
    typingMode: "thinking",
    typingIntervalSeconds: 6,
  },
}
```

You can override mode or cadence per session:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  session: {
    typingMode: "message",
    typingIntervalSeconds: 4,
  },
}
```

## Notes

* `message` mode won’t show typing for silent-only replies when the whole
  payload is the exact silent token (for example `NO_REPLY` / `no_reply`,
  matched case-insensitively).
* `thinking` only fires if the run streams reasoning (`reasoningLevel: "stream"`).
  If the model doesn’t emit reasoning deltas, typing won’t start.
* Heartbeat typing is a liveness signal for the resolved delivery target. It
  starts at heartbeat run start instead of following `message` or `thinking`
  stream timing. Set `typingMode: "never"` to disable it.
* Heartbeats do not show typing when `target: "none"`, when the target cannot
  be resolved, when chat delivery is disabled for the heartbeat, or when the
  channel does not support typing.
* `typingIntervalSeconds` controls the **refresh cadence**, not the start time.
  The default is 6 seconds.

## Related

* [Presence](/concepts/presence)
* [Streaming and chunking](/concepts/streaming)
