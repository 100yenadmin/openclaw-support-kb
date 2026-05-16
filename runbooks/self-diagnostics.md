---
type: openclaw_runbook
title: "Self Diagnostics Before Support"
search_role: "workflow_not_source"
---

# Self Diagnostics Before Support

Before escalating, the agent should gather safe, redacted facts:

## Search Contract

Search the exact failure before drafting support:

```bash
gbrain search "OpenClaw <exact error text>" --source openclaw-support-kb
gbrain search "OpenClaw <channel or feature> troubleshooting <symptom>" --source openclaw-support-kb
```

Use current docs pages and the KB manifest as source context.

## First Commands

```bash
openclaw --version
openclaw status
openclaw doctor
openclaw config validate --json
openclaw logs --tail 200
cat ~/.gbrain/sources/openclaw-support-kb/kb-manifest.json
node ~/.gbrain/sources/openclaw-support-kb/scripts/status.mjs
```

Redact tokens, passwords, bot tokens, bearer headers, OAuth values, and private
user content before showing or sending diagnostics.

If status reports old `openclaw-support-kb.pre-git-*` directories under
`~/.gbrain/sources`, move them to the archive with:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/repair-index.mjs
```

Do not cite search results or filesystem paths from those backup directories.

If the issue is channel setup, include:

- channel name and account id
- whether the user is in DM, group, or topic/thread
- exact allowlist/config path being changed
- docs consulted

If the issue is config, include:

- failing config path
- dry-run output
- validation output
- whether `.rejected.*` or `.clobbered.*` exists

## Stop Conditions

Escalate instead of continuing if the next step would require guessing a secret,
overwriting a whole config file, disabling auth, or installing unscanned code.

## Nontechnical User Prompts

- "May I run read-only diagnostics and redact anything sensitive before sharing?"
- "What were you trying to do when it broke?"
- "Did this start after an update, a config change, or a new channel setup?"
