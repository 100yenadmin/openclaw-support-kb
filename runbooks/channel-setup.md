---
type: openclaw_runbook
title: "Generic Channel Setup"
search_role: "workflow_not_source"
---

# Generic Channel Setup

Use this workflow for any chat channel before falling into a channel-specific
runbook. Search current channel docs first.

## Search Contract

```bash
gbrain query "OpenClaw channel setup <channel> pairing allowlist group policy troubleshooting"
gbrain search "Source: https://docs.openclaw.ai/channels/index"
gbrain search "Source: https://docs.openclaw.ai/channels/<channel>"
gbrain search "Source: https://docs.openclaw.ai/channels/troubleshooting"
gbrain search "Source: https://docs.openclaw.ai/channels/pairing"
```

## Guided Workflow

1. Identify the channel: Telegram, WhatsApp, Discord, Slack, Signal, Google Chat, BlueBubbles, or another supported channel.
2. Search that channel doc and read its quick setup, access control, and troubleshooting sections.
3. Ask whether the user wants DMs, groups/channels, or both.
4. Gather only the identifiers the docs require: token/env var, account id, user id, group/channel id, webhook URL, or QR pairing state.
5. Prefer CLI/config helpers and dry-run validation:
   ```bash
   openclaw config validate --json
   openclaw channels status --probe
   openclaw doctor
   ```
6. If access is blocked, check pairing and allowlists before changing model/provider settings.
7. Verify by sending/receiving one test message.

## Nontechnical User Prompts

- "Which app do you want to use to talk to OpenClaw?"
- "Will this be private messages only, group chat only, or both?"
- "Do you already have the bot/token/login ready, or should I walk you through that part?"
- "Can I run a read-only status/probe check now?"

## Channel Routing

If a specific agent should handle a specific channel/account, chain into
`agent-creation.md` and search `openclaw agents bind`.

## Failure Routing

- Authentication failure: search the channel-specific docs for token/login setup.
- Messages not received: check pairing, allowlists, account id, and group/thread ids before changing config.
- Wrong agent responds: search `openclaw agents bind` and verify channel/account bindings.
- Gateway unhealthy: run `openclaw doctor` and `openclaw logs --tail 200` before continuing.
