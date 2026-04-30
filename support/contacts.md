---
type: openclaw_support_contact
title: "OpenClaw Support Contacts"
---

# OpenClaw Support Contacts

- Telegram: `@evaOS_support_bot`
- Email: `support@electricsheephq.com`

Agents must ask before contacting support on a user's behalf.

Preferred path is GOG email after draft review and hash-bound approval:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs approval-context \
  --channel email \
  --draft <approved-draft.md> \
  --recipient support@electricsheephq.com \
  --subject "[OpenClaw Support] <short issue>" \
  --account <explicit-account>

node ~/.gbrain/sources/openclaw-support-kb/scripts/support-escalation.mjs send-email \
  --draft <approved-draft.md> \
  --account <explicit-account> \
  --approved-recipient support@electricsheephq.com \
  --subject "[OpenClaw Support] <short issue>" \
  --approved-draft-sha <sha256-from-reviewed-draft> \
  --approved-context-sha <approved-context-sha>
```

Telegram fallback:

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
