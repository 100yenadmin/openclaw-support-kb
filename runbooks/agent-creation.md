---
type: openclaw_runbook
title: "Create Or Configure An OpenClaw Agent"
search_role: "workflow_not_source"
---

# Create Or Configure An OpenClaw Agent

This runbook is a workflow for creating or changing an OpenClaw agent. Search
current docs and schema before changing config.

## Search Contract

```bash
gbrain query "OpenClaw create new agent agents add workspace bind channel skills"
gbrain search "Source: https://docs.openclaw.ai/cli/agents"
gbrain search "Source: https://docs.openclaw.ai/concepts/agent-workspace"
gbrain search "Source: https://docs.openclaw.ai/concepts/multi-agent"
gbrain search "Source: https://docs.openclaw.ai/gateway/config-agents"
gbrain search "Source: https://docs.openclaw.ai/tools/skills-config"
```

## Guided Workflow

1. Ask what the new agent is for: personal assistant, coding, ops, support, home, research, or a specific project.
2. Choose an agent id that is lowercase, short, and not `main`.
3. Choose a workspace path. Default pattern:
   ```bash
   ~/.openclaw/workspace-<agent-id>
   ```
4. Decide whether it needs a channel binding now. If yes, identify the channel and account id from docs/config before binding.
5. Decide identity, auth/model profile, and workspace isolation. Do not assume a new agent should share private workspace files.
6. Decide skill visibility: unrestricted, default inherited, or explicit skill allowlist.
7. Dry-run or inspect config/schema where possible, then create:
   ```bash
   openclaw agents list --bindings
   openclaw agents add <agent-id> --workspace ~/.openclaw/workspace-<agent-id> --non-interactive --json
   openclaw agents bindings --json
   ```
8. If binding to a channel:
   ```bash
   openclaw agents bind --agent <agent-id> --bind <channel[:accountId]> --json
   openclaw agents bindings --agent <agent-id> --json
   ```
9. If identity is requested, create or update `IDENTITY.md`, then:
   ```bash
   openclaw agents set-identity --agent <agent-id> --from-identity --json
   ```
10. Smoke-test with a harmless status/check message in the intended channel.

## Nontechnical User Prompts

- "What should this agent be responsible for?"
- "Should this agent answer in Telegram/Discord/Slack, or only when you choose it?"
- "Should it share the same skills as your main agent, or have a smaller skill set?"
- "Do you want a separate workspace so its memory and files stay organized?"

## Stop Conditions

Stop and ask before deleting agents, reusing a workspace, changing OAuth profiles,
or binding a public/group channel.
