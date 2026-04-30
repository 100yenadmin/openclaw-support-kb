---
type: openclaw_doc
title: "Reactions"
source: "https://docs.openclaw.ai/tools/reactions"
source_hash: "1486d30e391042b3986a9fc859a4bec4699027e404c27d044746f0f22aa6c86b"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "tools/reactions.md"
original_doc_path: "tools/reactions.md"
duplicate_index: 1
---

# Reactions
Source: https://docs.openclaw.ai/tools/reactions



The agent can add and remove emoji reactions on messages using the `message`
tool with the `react` action. Reaction behavior varies by channel and transport.

## How it works

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "action": "react",
  "messageId": "msg-123",
  "emoji": "thumbsup"
}
```

* `emoji` is required when adding a reaction.
* Set `emoji` to an empty string (`""`) to remove the bot's reaction(s).
* Set `remove: true` to remove a specific emoji (requires non-empty `emoji`).

## Channel behavior

<AccordionGroup>
  <Accordion title="Discord and Slack">
    * Empty `emoji` removes all of the bot's reactions on the message.
    * `remove: true` removes just the specified emoji.
  </Accordion>

  <Accordion title="Google Chat">
    * Empty `emoji` removes the app's reactions on the message.
    * `remove: true` removes just the specified emoji.
  </Accordion>

  <Accordion title="Telegram">
    * Empty `emoji` removes the bot's reactions.
    * `remove: true` also removes reactions but still requires a non-empty `emoji` for tool validation.
  </Accordion>

  <Accordion title="WhatsApp">
    * Empty `emoji` removes the bot reaction.
    * `remove: true` maps to empty emoji internally (still requires `emoji` in the tool call).
  </Accordion>

  <Accordion title="Zalo Personal (zalouser)">
    * Requires non-empty `emoji`.
    * `remove: true` removes that specific emoji reaction.
  </Accordion>

  <Accordion title="Feishu/Lark">
    * Use the `feishu_reaction` tool with actions `add`, `remove`, and `list`.
    * Add/remove requires `emoji_type`; remove also requires `reaction_id`.
  </Accordion>

  <Accordion title="Signal">
    * Inbound reaction notifications are controlled by `channels.signal.reactionNotifications`: `"off"` disables them, `"own"` (default) emits events when users react to bot messages, and `"all"` emits events for all reactions.
  </Accordion>
</AccordionGroup>

## Reaction level

Per-channel `reactionLevel` config controls how broadly the agent uses reactions. Values are typically `off`, `ack`, `minimal`, or `extensive`.

* [Telegram reactionLevel](/channels/telegram#reaction-notifications) — `channels.telegram.reactionLevel`
* [WhatsApp reactionLevel](/channels/whatsapp#reaction-level) — `channels.whatsapp.reactionLevel`

Set `reactionLevel` on individual channels to tune how actively the agent reacts to messages on each platform.

## Related

* [Agent Send](/tools/agent-send) — the `message` tool that includes `react`
* [Channels](/channels) — channel-specific configuration
