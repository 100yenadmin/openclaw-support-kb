---
type: openclaw_runbook
title: "Explain OpenClaw System"
search_role: "workflow_not_source"
---

# Explain OpenClaw System

This runbook helps an agent explain OpenClaw to a nontechnical user. Do not
answer from this runbook alone; search the current docs and cite them.

## Search Contract

```bash
gbrain search "OpenClaw architecture Gateway agent runtime channels workspace simple explanation" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/concepts/architecture" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/concepts/agent" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/concepts/agent-workspace" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/channels/index" --source openclaw-support-kb
```

## Explanation Shape

Use this order for nontechnical users:

1. One sentence: OpenClaw is a local gateway that lets the user talk to agents from chat apps.
2. The Gateway: one long-running process owns channels and keeps state.
3. Channels: Telegram/WhatsApp/Discord/etc. are doors into the same gateway.
4. Agent runtime: the assistant runs with a workspace, tools, skills, and sessions.
5. Config/state split: `openclaw.json` controls behavior; credentials/sessions live under `~/.openclaw`; workspace files guide the agent.
6. Safety: pairing/allowlists decide who can talk to the bot; config changes should be validated.
7. Next step: ask what they want to set up or fix.

## Nontechnical User Prompts

- "Do you want the short version or the setup-focused version?"
- "Are you trying to use OpenClaw from Telegram, WhatsApp, the browser, or another channel?"
- "Do you want me to explain the pieces, or walk you through your next setup step?"

## Validation

After explaining, offer one concrete action:

```bash
openclaw status
openclaw doctor
openclaw config validate
```

## Stop Conditions

Stop explaining and switch to the matching setup/repair runbook when the user
asks to change config, connect a channel, create an agent, or send support.
