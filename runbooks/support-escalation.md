---
type: openclaw_runbook
title: "Support Escalation"
search_role: "workflow_not_source"
---

# Support Escalation

This runbook is only for handoff after local KB search and safe diagnostics.
Never use it as a substitute for searching current docs first.

## Search Contract

```bash
gbrain search "<exact error text>"
gbrain query "OpenClaw <feature> troubleshooting repair"
gbrain search "support escalation self diagnostics"
```

Support contacts:

- Telegram: `@evaOS_support_bot`
- Email: `support@electricsheephq.com`
- Local source: `support/contacts.md`

## Rules

- Draft and redact before sending.
- Ask the user before sending anything.
- Prefer GOG email when available, but use an explicit account selected by the user.
- Use Telegram if email is unavailable or the user prefers Telegram.
- Do not send unless the approved draft hash still matches the file being sent.
- Do not send unless the approval context hash binds the exact transport,
  recipient, subject, and account the user approved.

## Draft Helper

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs draft \
  --issue "<short issue>" \
  --doc "docs/<source-page>.md" \
  --search-query "OpenClaw <feature> troubleshooting repair" \
  --command-tried "openclaw config validate --json" \
  --diagnostics <redacted-or-raw-diagnostics-file> \
  --out /tmp/openclaw-support-draft.md
```

Show the draft and the printed `sha256=` value to the user before any send.

## Email

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs approval-context \
  --channel email \
  --draft /tmp/openclaw-support-draft.md \
  --recipient support@electricsheephq.com \
  --account <explicit-account> \
  --subject "[OpenClaw Support] <short issue>"

node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs send-email \
  --draft /tmp/openclaw-support-draft.md \
  --account <explicit-account> \
  --approved-recipient support@electricsheephq.com \
  --approved-draft-sha <sha256-from-reviewed-draft> \
  --approved-context-sha <approved-context-sha> \
  --subject "[OpenClaw Support] <short issue>"
```

The helper uses GOG internally. Do not call raw `gog gmail send` for support
escalation because it bypasses the approval context gate.

## Telegram

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs approval-context \
  --channel Telegram \
  --draft /tmp/openclaw-support-draft.md \
  --recipient @evaOS_support_bot

node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs send-telegram \
  --draft /tmp/openclaw-support-draft.md \
  --approved-recipient @evaOS_support_bot \
  --approved-draft-sha <sha256-from-reviewed-draft> \
  --approved-context-sha <approved-context-sha>
```

The helper uses OpenClaw Telegram messaging internally. Do not call raw
`openclaw message send` for support escalation because it bypasses the approval
context gate.

## Minimum Draft

- user-approved summary
- OpenClaw version
- OS/deployment type
- KB version
- docs consulted
- local search queries tried
- commands tried
- redacted diagnostics

## Nontechnical User Prompts

- "May I draft a support message for you to review before anything is sent?"
- "Which email account should GOG use if you approve sending?"
- "Do you prefer email support or the Telegram support bot?"

## Stop Conditions

Stop if the user has not approved the exact draft, recipient, and transport.
Stop if redaction is uncertain or the draft hash changed after approval.
