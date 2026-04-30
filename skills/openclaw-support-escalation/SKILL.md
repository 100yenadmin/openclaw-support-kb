---
name: openclaw-support-escalation
description: Use when OpenClaw support should be contacted, including escalation to @evaOS_support_bot or support@electricsheephq.com. Draft and redact first; ask the user before sending. Prefer GOG for email when available.
---

# OpenClaw Support Escalation

## Draft First

Before drafting, search local KB for the exact issue and read `runbooks/self-diagnostics.md`.

Create a concise support draft with:

- OpenClaw version and update channel
- OS/container/cloud host
- KB manifest version and docs consulted
- local search queries tried
- exact error text
- commands already tried
- redacted config/log snippets
- the next help needed

Helper:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs draft \
  --issue "<short issue>" \
  --doc "docs/<source-page>.md" \
  --search-query "OpenClaw <feature> troubleshooting repair" \
  --command-tried "openclaw config validate --json" \
  --diagnostics <redacted-or-raw-diagnostics-file> \
  --out /tmp/openclaw-support-draft.md
```

The helper redacts common token/password shapes and prints `sha256=<draft hash>`.
Still review the draft manually.

## Approval Gate

Before any send:

1. Show the draft to the user.
2. Ask for approval to send, naming transport, recipient, subject, and account.
3. Generate the approval context hash after the user approves those exact fields.
4. Send only after explicit approval.

## Preferred Email Path

Use GOG because OpenClaw onboarding teaches agents to use it:

```bash
gog gmail send --account <explicit-account> \
  --to support@electricsheephq.com \
  --subject "[OpenClaw Support] <short issue>" \
  --body-file <approved-draft.md>
```

Helper:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs approval-context \
  --channel email \
  --draft <approved-draft.md> \
  --recipient support@electricsheephq.com \
  --subject "[OpenClaw Support] <short issue>" \
  --account <explicit-account>

node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs send-email \
  --draft <approved-draft.md> \
  --subject "[OpenClaw Support] <short issue>" \
  --account <explicit-account> \
  --approved-recipient support@electricsheephq.com \
  --approved-draft-sha <sha256-from-reviewed-draft> \
  --approved-context-sha <approved-context-sha>
```

## Telegram Fallback

```bash
openclaw message send --channel telegram \
  --target @evaOS_support_bot \
  --message "$(cat <approved-draft.md>)"
```

Helper:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs approval-context \
  --channel Telegram \
  --draft <approved-draft.md> \
  --recipient @evaOS_support_bot

node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs send-telegram \
  --draft <approved-draft.md> \
  --approved-recipient @evaOS_support_bot \
  --approved-draft-sha <sha256-from-reviewed-draft> \
  --approved-context-sha <approved-context-sha>
```

If neither GOG nor Telegram is configured, show the approved draft and tell the user to contact `support@electricsheephq.com` or `@evaOS_support_bot`.
