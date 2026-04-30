---
type: openclaw_runbook
title: "Telegram Setup And Repair"
search_role: "workflow_not_source"
---

# Telegram Setup And Repair

This runbook is a workflow. Do not answer from it alone. First search the local
KB for current Telegram docs and cite those docs in the final answer.

## Search Contract

Run:

```bash
gbrain query "OpenClaw Telegram setup BotFather dmPolicy pairing groups allowFrom groupAllowFrom"
gbrain search "Source: https://docs.openclaw.ai/channels/telegram"
gbrain search "Telegram troubleshooting getMe returned 401 setMyCommands BOT_COMMANDS_TOO_MUCH"
```

Use these docs as the factual source:

- `docs/channels/telegram.md`
- `docs/channels/pairing.md`
- `docs/channels/troubleshooting.md`
- `docs/cli/config.md`

## Guided Workflow

1. Ask the user whether they want Telegram DMs only, groups, or both.
2. Ask whether they already created a BotFather bot token. If not, walk them through BotFather, but do not ask them to paste the token into chat unless necessary.
3. Prefer the documented durable CLI channel-add path when the current docs expose it:
   ```bash
   openclaw channels add --channel telegram --token <secret-or-secretref>
   openclaw channels status --channel telegram --probe
   ```
4. If the install uses daemon environment variables or SecretRef instead, persist the token where the daemon reads it. Do not rely on `export TELEGRAM_BOT_TOKEN=...` in a temporary shell unless the gateway is started from that same shell.
5. Verify any config field with `openclaw config schema` before writing it.
6. For DMs, decide between pairing and explicit allowlist. For nontechnical users, pairing is the default path.
7. For groups, gather the group chat ID and the human sender user ID separately. Never treat a negative group chat ID as a user allowlist entry.
8. Apply config changes with dry-run first:
   ```bash
   openclaw config patch --file ./telegram.patch.json5 --dry-run
   openclaw config patch --file ./telegram.patch.json5
   openclaw config validate
   ```
9. Start or restart the gateway and verify:
   ```bash
   openclaw status
   openclaw channels status --probe
   openclaw pairing list telegram
   openclaw logs --tail 200
   ```

## Nontechnical User Prompts

- "Do you want the bot in private DMs, a group, or both?"
- "Do you already have a BotFather token, or should I walk you through creating one?"
- "Please DM your bot once so I can help find your numeric user ID from logs."
- "If this is a group, please send one message in the group so I can help find the group chat ID."

## Failure Routing

- Token/auth failures: search `getMe returned 401`.
- Group silence: search `privacy mode requireMention groups groupAllowFrom`.
- Pairing confusion: search `DM pairing group authorization`.
- Command menu failures: search `setMyCommands BOT_COMMANDS_TOO_MUCH`.
