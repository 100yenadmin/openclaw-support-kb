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
gbrain search "<exact error text>"
gbrain query "OpenClaw <channel or feature> troubleshooting <symptom>"
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
```

Redact tokens, passwords, bot tokens, bearer headers, OAuth values, and private
user content before showing or sending diagnostics.

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
