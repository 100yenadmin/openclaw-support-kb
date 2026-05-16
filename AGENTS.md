---
type: customer_kb_agent_protocol
title: "Customer Support KB Agent Protocol"
search_role: "agent_protocol"
---

# Customer Support KB Agent Protocol

This repo is public/customer-safe. Use it to keep customer agents grounded in
current OpenClaw, Hermes Agent, Paperclip Mission Control, Composio, and support
docs before they edit config or escalate support.

## Read Order

1. If installing this repo, read `INSTALL_FOR_AGENTS.md` first.
2. Confirm the local source exists at `~/.gbrain/sources/openclaw-support-kb`
   and the GBrain source id is `openclaw-support-kb`, then read
   `kb-manifest.json` and `kb-sources.json`.
3. Identify the target system: OpenClaw, Hermes Agent, Paperclip Mission
   Control, Composio, or support escalation.
4. Search local GBrain for the target system plus the user's exact
   question/error/config key.
5. `skills/RESOLVER.md`
6. The matching skill under `skills/*/SKILL.md`
7. Relevant runbook under `runbooks/` as workflow only.
8. The runbook's Search Contract, then re-check the cited docs pages.

## Operating Rules

- Search the local KB before answering OpenClaw, Hermes, Paperclip, Composio,
  setup, update, channel, config, skill, or troubleshooting questions.
- Do not mix config instructions across systems. OpenClaw uses `openclaw.json`;
  Hermes uses `~/.hermes/config.yaml` and `~/.hermes/.env`; Paperclip is the
  Mission Control/control-plane surface for companies, agents, tickets,
  heartbeats, budgets, approvals, API, deploy, and dashboard.
- Runbooks are workflow prompts, not factual source. Use docs pages for facts
  and cite source URLs or local source paths.
- The canonical local source path is `~/.gbrain/sources/openclaw-support-kb`.
- The canonical GBrain source id is `openclaw-support-kb`; it should be
  registered as a federated source when the installed GBrain supports named
  sources. Older GBrain builds use legacy `gbrain sync --repo` fallback.
- Users do not push to this repo; they pull the published repo and sync it into
  local GBrain.
- Keep client installs fresh through `scripts/run-client-update.mjs`; fleet
  control may call it on release, and local cron should call it as a fallback.
- Prefer docs and runbooks over memory.
- For cross-system recovery, target-system docs decide what is valid; the acting
  runtime docs only explain how that runtime should execute the repair.
- Prefer `openclaw config set`, `openclaw config patch --dry-run`, and
  `openclaw config validate` over hand-editing `openclaw.json`.
- Ask before sending anything to support; send only through
  `scripts/support-escalation.mjs` after hash-bound approval.
- Use GOG for email escalation through the support helper when available.
- Scan community skills with `scripts/scan-skill.mjs`; do not run raw
  `snyk-agent-scan` for install approval.
