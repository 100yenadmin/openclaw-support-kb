# OpenClaw Support KB Agent Protocol

This repo is public/customer-safe. Use it to keep OpenClaw customer agents
grounded in current docs before they edit config or escalate support.

## Read Order

1. If installing this repo, read `INSTALL_FOR_AGENTS.md` first.
2. Confirm the local source exists at `~/.gbrain/sources/openclaw-support-kb`
   and read `kb-manifest.json`.
3. Search local GBrain for the user's exact question/error/config key.
4. `skills/RESOLVER.md`
5. The matching skill under `skills/*/SKILL.md`
6. Relevant runbook under `runbooks/` as workflow only.
7. The runbook's Search Contract, then re-check the cited docs pages.

## Operating Rules

- Search the local KB before answering OpenClaw setup, update, channel,
  config, skill, or troubleshooting questions.
- Runbooks are workflow prompts, not factual source. Use docs pages for facts
  and cite source URLs or local source paths.
- The canonical local source path is `~/.gbrain/sources/openclaw-support-kb`.
- Users do not push to this repo; they pull the published repo and sync it into
  local GBrain.
- Prefer docs and runbooks over memory.
- Prefer `openclaw config set`, `openclaw config patch --dry-run`, and
  `openclaw config validate` over hand-editing `openclaw.json`.
- Ask before sending anything to support; send only through
  `scripts/support-escalation.mjs` after hash-bound approval.
- Use GOG for email escalation through the support helper when available.
- Scan community skills with `scripts/scan-skill.mjs`; do not run raw
  `snyk-agent-scan` for install approval.
