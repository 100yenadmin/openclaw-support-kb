---
name: openclaw-skill-discovery
description: Use when the user wants to find, evaluate, install, update, or improve OpenClaw skills or small-business integrations. Search the local VoltAgent skills snapshot, ClawHub/OpenClaw skill search, and Composio integration path; pin candidate sources and run Snyk agent-scan before skill install.
---

# OpenClaw Skill Discovery

## Workflow

1. Search the local VoltAgent skills snapshot:
   ```bash
   gbrain search "<skill need> awesome openclaw skills"
   gbrain query "OpenClaw skills install configure security scanner <skill need>"
   ```
2. Search current OpenClaw/ClawHub docs and the native registry path:
   ```bash
   gbrain search "Source: https://docs.openclaw.ai/tools/clawhub"
   gbrain search "Source: https://docs.openclaw.ai/cli/skills"
   openclaw skills search "<task or app>" --limit 10 --json
   openclaw skills info <candidate-slug> --json
   ```
3. If the task is for a SaaS app or chief-of-staff workflow, search the Composio integration guide:
   ```bash
   gbrain search "Source: https://composio.dev/claw"
   gbrain query "Composio OpenClaw <app or workflow>"
   ```
4. Read `runbooks/skill-discovery.md` for the install workflow.
5. Prefer bundled/native skills first, then verified ClawHub/OpenClaw sources, then the VoltAgent snapshot as discovery metadata.
6. Choose the install path:
   - ClawHub-native install: use the current `openclaw skills install` docs after reviewing `openclaw skills info`, ClawHub scan status, publisher/version, and user approval.
   - Manual scanned artifact: fetch candidate skill code to a temporary directory at a pinned commit/ref, scan it, then install that exact folder.
7. For manual scanned artifacts, scan before installing:
   ```bash
   SNYK_AGENT_SCAN_SPEC=snyk-agent-scan@0.5.0 \
     node ~/.gbrain/sources/openclaw-support-kb/scripts/scan-skill.mjs \
       <candidate-skill-path> \
       --expected-sha <pinned-candidate-sha>
   ```
8. Keep the generated attestation. Install only if `passed: true` and the attested candidate hash matches the pinned artifact.
9. If the scan fails or `SNYK_TOKEN` is missing, do not auto-install. Ask the user for explicit approval after explaining the risk.

## Install Targets

- Global OpenClaw skills: `~/.openclaw/skills/`
- Workspace skills: `<workspace>/skills/`

Workspace skills take precedence. Use global skills for general user capabilities, workspace skills for project-specific behavior.

## Composio Integration Path

Use Composio when the user wants to connect an external app and no safer local
skill already covers the workflow. Do not scan Composio itself as an OpenClaw
skill unless you are installing a downloaded skill folder; treat Composio as an
MCP/OAuth integration and follow current OpenClaw MCP docs instead.

Before adding anything:

- Ask which app/account the user wants to connect.
- Prefer read-only or draft-only scopes where possible.
- Use `openclaw mcp list` and `openclaw mcp show composio --json` before changes.
- Validate config after changes.

## Do Not

- Install arbitrary personal repo skills without scanner results and approval.
- Trust a registry description as an audit.
- Install a different commit than the one scanned.
- Install without a passing attestation for the exact artifact.
- Skip security review for skills that can read private data or send messages.
- Add Composio or another MCP integration without user approval and current MCP docs.
