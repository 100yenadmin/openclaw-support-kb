---
type: openclaw_doc
title: "Typing indicators"
source: "https://docs.openclaw.ai/concepts/typing-indicators"
source_hash: "609b9bae0c625ecb37c72c4706182caedf8a184d0dbea42c80b58215d34b9733"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "concepts/typing-indicators.md"
original_doc_path: "concepts/typing-indicators.md"
duplicate_index: 1
---

# Typing indicators
Source: https://docs.openclaw.ai/concepts/typing-indicators

Typing indicators are sent to the chat channel while a run is active. Use `agents.defaults.typingMode` to control **when** typing starts and `typingIntervalSeconds` to control **how often** it refreshes (keepalive cadence, default 6 seconds).

## Defaults

When `agents.defaults.typingMode` is **unset**:

- **Direct chats**: typing starts immediately once the model loop begins.
- **Group chats with a mention**: typing starts immediately.
- **Group chats without a mention**: typing starts when the admitted run has user-visible activity, such as harness execution activity or message text.
- **Heartbeat runs**: typing starts when the heartbeat run begins, if the resolved heartbeat target is a typing-capable chat and typing is not disabled.

## Modes

Set `agents.defaults.typingMode` to one of:

- `never` - no typing indicator, ever.
- `instant` - start typing **as soon as the model loop begins**, even if the run later returns only the silent reply token.
- `thinking` - start typing on the **first reasoning delta**, or on active harness execution after the turn is accepted.
- `message` - start typing on the **first user-visible reply activity**, such as active harness execution or a non-silent text delta. Silent reply tokens such as `NO_REPLY` do not count as text activity.

Order of "how early it fires": `never` -> `message`/`thinking` -> `instant`.

## Configuration

Set the agent-level default:

```json5
{
  agents: {
    defaults: {
      typingMode: "thinking",
      typingIntervalSeconds: 6,
    },
  },
}
```

Override mode or cadence per session:

```json5
{
  session: {
    typingMode: "message",
    typingIntervalSeconds: 4,
  },
}
```

## Notes

- `message` mode does not start from silent reply tokens, but active execution can still show typing before any assistant text is available.
- `thinking` still reacts to streamed reasoning (`reasoningLevel: "stream"`), and can also start from active execution before reasoning deltas arrive.
- Heartbeat typing is a liveness signal for the resolved delivery target. It starts at heartbeat run start instead of following `message` or `thinking` stream timing. Set `typingMode: "never"` to disable it.
- Heartbeats do not show typing when the heartbeat target is `"none"`, when the target cannot be resolved, when chat delivery is disabled for the heartbeat, or when the channel does not support typing.
- `typingIntervalSeconds` controls the **refresh cadence**, not the start time. Default: 6 seconds.

## Related

CardGroup


Presence

    How the Gateway tracks connected clients and surfaces them in the macOS Instances tab.


Streaming and chunking

    Outbound streaming behavior, chunk boundaries, and channel-specific delivery.

---
