---
type: openclaw_doc
title: "Channel inbound API"
source: "https://docs.openclaw.ai/plugins/sdk-channel-inbound"
source_hash: "d73048c282177040df4b598fb73116b435ddd7e7f93270d18ee5002090983b86"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/sdk-channel-inbound.md"
original_doc_path: "plugins/sdk-channel-inbound.md"
duplicate_index: 1
---

# Channel inbound API
Source: https://docs.openclaw.ai/plugins/sdk-channel-inbound

Channel receive paths follow one flow:

```text
platform event -> inbound facts/context -> agent reply -> message delivery
```

Use `openclaw/plugin-sdk/channel-inbound` for inbound event normalization,
formatting, roots, and orchestration. Use
`openclaw/plugin-sdk/channel-outbound` for native send, receipt, durable
delivery, and live preview behavior.

## Core helpers

```ts

  buildChannelInboundEventContext,
  runChannelInboundEvent,
  dispatchChannelInboundReply,
} from "openclaw/plugin-sdk/channel-inbound";
```

- `buildChannelInboundEventContext(...)`: projects normalized channel facts
  into the prompt/session context. Pass channel-owned sender/chat metadata
  through `channelContext`, which plugin hooks see as `ctx.channelContext`.
  Augment `PluginHookChannelSenderContext` or `PluginHookChannelChatContext`
  from this subpath for channel-specific fields.
- `runChannelInboundEvent(...)`: runs ingest, classify, preflight, resolve,
  record, dispatch, and finalize for one inbound platform event.
- `dispatchChannelInboundReply(...)`: records and dispatches an already
  assembled inbound reply with a delivery adapter.

For media-only inbound events, keep the message body and command text empty and
pass one `ChannelInboundMediaInput` fact per native attachment. When an ambient
history line or another text-only carrier must describe those facts, use
`formatMediaPlaceholderText(media)`. It classifies each fact from `kind`, MIME
type, then path or URL extension; undownloaded native attachments should still
contribute one type-only fact each. Do not use the formatter to synthesize the
primary inbound body.

Bundled/native channels that already receive the injected plugin runtime
object can call the same helpers under `runtime.channel.inbound.*` instead of
importing this subpath directly:

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

Assemble `dispatchChannelInboundReply(...)` inputs for compatibility
dispatchers that keep platform delivery in the delivery adapter. New send
paths should use message adapters and durable message helpers from
`channel-outbound` instead.

## Migration

`runtime.channel.turn.*` runtime aliases were removed. Use:

- `runtime.channel.inbound.run(...)` for raw inbound events.
- `runtime.channel.inbound.dispatchReply(...)` for assembled reply contexts.
- `runtime.channel.inbound.buildContext(...)` for inbound context payloads.
- `runtime.channel.inbound.runPreparedReply(...)`, deprecated, only for
  channel-owned prepared dispatch paths that already assemble their own
  dispatch closure.

New plugin code should not introduce `turn`-named channel APIs. Keep model or
agent turn vocabulary inside agent/provider code; channel plugins use inbound,
message, delivery, and reply terms.

---
