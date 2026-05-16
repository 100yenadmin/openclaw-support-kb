---
type: openclaw_runbook
title: "Skill Discovery And Safe Install"
search_role: "workflow_not_source"
---

# Skill Discovery And Safe Install

This runbook is a workflow. The local VoltAgent skills snapshot, OpenClaw
ClawHub docs, security guide, and Composio docs/toolkit catalog are discovery
sources. Do not install from a registry description alone.

## Search Contract

```bash
gbrain search "OpenClaw skills <task user wants> awesome openclaw skills" --source openclaw-support-kb
gbrain search "Source: https://github.com/VoltAgent/awesome-openclaw-skills" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/clawhub/index" --source openclaw-support-kb
gbrain search "Source: https://docs.openclaw.ai/cli/skills" --source openclaw-support-kb
gbrain search "Source: https://github.com/snyk/agent-scan" --source openclaw-support-kb
gbrain search "Source: https://composio.dev/toolkits" --source openclaw-support-kb
gbrain search "Source: https://docs.composio.dev/docs/tools-and-toolkits.md" --source openclaw-support-kb
gbrain search "Source: https://docs.composio.dev/docs/native-tools-vs-mcp.md" --source openclaw-support-kb
```

Sources to cite:

- https://github.com/VoltAgent/awesome-openclaw-skills
- `docs/clawhub/index.md`
- `docs/clawhub/cli.md`
- `docs/cli/skills.md`
- https://github.com/snyk/agent-scan
- `integrations/composio/guide.md`
- `integrations/composio/toolkits.md`
- `integrations/composio/docs/tools-and-toolkits.md`

## Workflow

1. Translate the user's request into jobs-to-be-done, apps involved, and permission risk.
2. Search the local VoltAgent snapshot:
   ```bash
   rg -i "<task>|<app>|<workflow>" ~/.gbrain/sources/openclaw-support-kb/skills-index/awesome-openclaw-skills.md
   ```
3. Search ClawHub through OpenClaw's native command when available:
   ```bash
   openclaw skills search "<task or app>" --limit 10 --json
   openclaw skills info <candidate-slug> --json
   ```
4. If no good skill exists, or the user needs a SaaS app action, evaluate Composio as an integration option:
```bash
gbrain search "Composio toolkit MCP OAuth <app or workflow>" --source openclaw-support-kb
gbrain search "Source: https://composio.dev/toolkits <app>" --source openclaw-support-kb
openclaw mcp list
openclaw mcp show composio --json
```
5. Rank candidates with this order:
   - bundled/native OpenClaw skill already visible to the agent
   - verified or official ClawHub/OpenClaw skill
   - VoltAgent snapshot candidate with source/pinned commit
   - Composio MCP integration for supported external apps
   - browser automation only when the user prefers it or no scoped integration exists
6. Choose the install path:
   - ClawHub-native: use `openclaw skills install <slug> --version <version>` only after reviewing `openclaw skills info`, ClawHub scan status, publisher, version, and user approval.
   - Manual scanned artifact: fetch the candidate to a temporary directory at a pinned commit or immutable archive, then scan and install the exact scanned folder manually.
7. For manual scanned artifacts, scan it:
   ```bash
   SNYK_AGENT_SCAN_SPEC=snyk-agent-scan@0.5.0 \
     node ~/.gbrain/sources/openclaw-support-kb/scripts/scan-skill.mjs \
       <candidate-skill-path> \
       --expected-sha <pinned-candidate-sha>
   ```
8. Read the generated attestation and confirm `passed: true`.
9. Install only the scanned artifact whose hash matches the attestation. Do not then run a separate registry install of a different artifact.
10. After install, verify visibility:
    ```bash
    openclaw skills list --agent <agent-id> --json
    openclaw skills check --agent <agent-id> --json
    ```

## Composio Path

Use Composio when it is the least risky way to connect a user's business app.
Do not treat it as a skill folder unless you are actually installing a
downloaded OpenClaw skill.

Before adding Composio:

- ask which app and account the user wants to connect
- search `integrations/composio/toolkits.md` and `integrations/composio/docs/`
- explain the current Composio auth/MCP shape from the local docs
- do not paste OAuth tokens or add auth headers manually
- use current OpenClaw MCP docs and validate config afterward
- require separate approval for write/send actions such as email, CRM updates,
  invoice creation, or customer messages

## Scanner Missing

If `SNYK_TOKEN` is missing or the scanner fails, do not auto-install. Explain
the risk and ask for explicit manual approval.

## High-Risk Skills

Treat skills as high risk when they:

- read private files, emails, calendars, or chats
- send messages or post publicly
- install binaries or run shell commands
- manage credentials, wallets, payments, or cloud infrastructure

## Nontechnical User Prompts

- "What do you want the skill to help you do?"
- "Which app or business workflow are you trying to automate?"
- "Is this for all agents, or only one workspace?"
- "May I scan the candidate skill before installing it?"
- "This skill can access private data or send messages. Do you still want it installed?"
- "Would you rather connect the app through a scoped integration like Composio, or keep using the browser?"

## Stop Conditions

Stop before installing if the candidate cannot be pinned, the attestation is
missing or failed, the requested install target is unclear, or the skill asks
for unrelated credentials or config changes.

Stop before adding an MCP/Composio integration if the user has not approved the
app/account, requested scopes, and whether the agent may write or send.
