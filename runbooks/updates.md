---
type: openclaw_runbook
title: "OpenClaw Updates And KB Freshness"
search_role: "workflow_not_source"
---

# OpenClaw Updates And KB Freshness

This runbook separates two jobs: updating the user's OpenClaw install and
refreshing this local support KB. Do not substitute one for the other.

## Search Contract

```bash
gbrain search "OpenClaw releases stable beta prerelease update"
gbrain search "Source: https://docs.openclaw.ai/cli/update"
gbrain search "Source: https://docs.openclaw.ai/install/updating"
```

## Refresh KB

```bash
OPENCLAW_KB_CHANNEL=stable npm run sync:local
```

For beta:

```bash
OPENCLAW_KB_CHANNEL=beta npm run sync:local
```

## Verify Local Index

```bash
cat ~/.gbrain/sources/openclaw-support-kb/kb-manifest.json
gbrain search "OpenClaw Telegram allowFrom groupAllowFrom"
```

If `gbrain` is missing, the Markdown source can still be searched with `rg`.

## Update OpenClaw Install

Use the current update docs and release index as source, then guide the user
through a reversible check first:

```bash
openclaw --version
openclaw update status
openclaw update --dry-run
```

After the user approves the update path from the docs:

```bash
openclaw update
openclaw doctor
openclaw status
openclaw logs --tail 100
```

For nontechnical users, explain whether this is a stable update, beta update,
or only a KB refresh before running any command that changes OpenClaw.

## Decide Stable vs Beta

Use `stable` unless:

- `openclaw --version` includes beta/prerelease markers
- the user explicitly opted into beta/prerelease docs
- the issue is about a feature only present in a beta release

## Nontechnical User Prompts

- "Do you want to update OpenClaw itself, refresh the support KB, or both?"
- "Are you on stable or did you opt into beta/prerelease builds?"
- "May I run the dry-run update check before changing anything?"

## Update Trigger Policy

- Weekly rebuild catches docs edits.
- OpenClaw release webhook rebuilds after stable or beta releases.
- Hourly release polling catches missed webhooks.
- Hourly docs hash checks catch non-release documentation changes.

## Stop Conditions

Stop before changing channels, auth, or config as part of an update unless the
current update docs explicitly require it and the user approves the change.
