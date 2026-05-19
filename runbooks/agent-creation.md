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
gbrain search "OpenClaw create new agent agents add workspace bind channel skills" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/cli/agents" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/concepts/agent-workspace" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/concepts/multi-agent" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/gateway/config-agents" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/tools/skills-config" --source openclaw-support-kb
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

## Mission Control / Paperclip Agents

Use the Paperclip evaOS runtime runbook before creating or changing Mission
Control agents:

```bash
gbrain search "Paperclip on evaOS VMs Mission Control Agent Creation Contract" --source openclaw-support-kb
```

The normal OpenClaw rule is still to choose a lowercase agent id that is not
`main`. The exception is a Paperclip CEO/orchestrator agent: it may target
OpenClaw `adapterConfig.agentId=main` so it can share the customer's main Eva
context, but it must use `sessionKeyStrategy=issue` and must not set
`sessionKey=main`. Paperclip must never route work into `agent:main:main`,
which is the customer's primary OpenClaw main chat session.

For dedicated Mission Control workers, create or confirm the OpenClaw agent id
first, then point Paperclip at that stable id:

```bash
openclaw agents list --bindings
openclaw agents add atlas --workspace ~/.openclaw/workspace-atlas --non-interactive --json
sudo /root/evaos-golden/scripts/paperclip-agent-routing-audit.sh --dry-run --map Argyle=atlas
```

For a CEO/orchestrator Paperclip agent that should use the main Eva context:

```bash
sudo /root/evaos-golden/scripts/paperclip-agent-routing-audit.sh --dry-run --map Aurelius=main
```

Paperclip display names may be renamed later; OpenClaw agent ids are the stable
routing targets. After every Paperclip agent create/rename/manual adapter edit,
run the routing audit before assigning real work.

## Nontechnical User Prompts

- "What should this agent be responsible for?"
- "Should this agent answer in Telegram/Discord/Slack, or only when you choose it?"
- "Should it share the same skills as your main agent, or have a smaller skill set?"
- "Do you want a separate workspace so its memory and files stay organized?"

## Stop Conditions

Stop and ask before deleting agents, reusing a workspace, changing OAuth profiles,
or binding a public/group channel.
