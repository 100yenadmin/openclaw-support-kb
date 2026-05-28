---
type: openclaw_doc
title: "Channel inbound API"
source: "https://docs.openclaw.ai/plugins/sdk-channel-inbound"
source_hash: "3fcd50d6e4c233f6bf90d03c3b2b758150df92d0233378414272df214d2f4715"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/sdk-channel-inbound.md"
original_doc_path: "plugins/sdk-channel-inbound.md"
duplicate_index: 1
---

# Channel inbound API
Source: https://docs.openclaw.ai/plugins/sdk-channel-inbound

Channel plugins should model receive paths with inbound and message nouns:

```text
platform event -> inbound facts/context -> agent reply -> message delivery
```

Use `openclaw/plugin-sdk/channel-inbound` for inbound event normalization,
formatting, roots, and orchestration. Use
`openclaw/plugin-sdk/channel-outbound` for native
send, receipt, durable delivery, and live preview behavior.

## Core Helpers

```ts

  buildChannelInboundEventContext,
  runChannelInboundEvent,
  dispatchChannelInboundReply,
} from "openclaw/plugin-sdk/channel-inbound";
```

- `buildChannelInboundEventContext(...)`: project normalized channel facts into
  the prompt/session context.
- `runChannelInboundEvent(...)`: run ingest, classify, preflight, resolve,
  record, dispatch, and finalize for one inbound platform event.
- `dispatchChannelInboundReply(...)`: record and dispatch an already assembled
  inbound reply with a delivery adapter.

The injected plugin runtime exposes the same high-level helpers under
`runtime.channel.inbound.*` for bundled/native channels that already receive the
runtime object.

```ts
await runtime.channel.inbound.run({
  channel: "demo",
  accountId,
  raw: platformEvent,
  adapter: {
    ingest: normalizePlatformEvent,
    resolveTurn: resolveInboundReply,
  },
});
```

Compatibility dispatchers should assemble `dispatchChannelInboundReply(...)`
inputs and keep platform delivery in the delivery adapter. New send paths should
prefer message adapters and durable message helpers.

## Migration

The old `runtime.channel.turn.*` runtime aliases were removed. Use:

- `runtime.channel.inbound.run(...)` for raw inbound events.
- `runtime.channel.inbound.dispatchReply(...)` for assembled reply contexts.
- `runtime.channel.inbound.buildContext(...)` for inbound context payloads.
- `runtime.channel.inbound.runPreparedReply(...)` only for channel-owned prepared
  dispatch paths that already assemble their own dispatch closure.

New plugin code should not introduce `turn`-named channel APIs. Keep model or
agent turn vocabulary inside agent/provider code; channel plugins use inbound,
message, delivery, and reply terms.

---
