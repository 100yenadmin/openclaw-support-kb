---
type: openclaw_doc
title: "Reactions"
source: "https://docs.openclaw.ai/tools/reactions"
source_hash: "1ca85bc1534bc7dca12f2e80357a3836f1a16c6e9d36f8f2e7b7d1d9732b606c"
system: "openclaw"
kb_namespace: "openclaw"
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
* On channels that support status reactions, `trackToolCalls: true` on a
  reaction lets the runtime use that reacted message for subsequent tool
  progress reactions during the same turn.

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
    * WhatsApp has one bot reaction slot per message; status reaction updates replace that slot rather than stacking multiple emoji.
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

  <Accordion title="iMessage">
    * Outbound reactions are iMessage tapbacks (`love`, `like`, `dislike`, `laugh`, `emphasize`, and `question`).
    * Inbound tapback notifications are controlled by `channels.imessage.reactionNotifications`: `"off"` disables them, `"own"` (default) emits events when users react to bot-authored messages, and `"all"` emits events for all tapbacks from authorized senders.
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
