# OpenClaw Support KB

Local-first OpenClaw support knowledge base and GBrain skillpack.

This repo turns the public OpenClaw docs, release notes, safe support runbooks,
skill/integration discovery guidance, and escalation contacts into a searchable
local GBrain source. Cortex/GitHub should publish updates; every agent machine
keeps a local copy so support answers do not depend on a live cloud lookup.

## Agent Install

Point the agent at this repo and tell it:

```text
Follow INSTALL_FOR_AGENTS.md in this repository. Install the OpenClaw Support KB
into GBrain and verify local search works.
```

The canonical install location is:

```bash
~/.gbrain/sources/openclaw-support-kb
```

Users do not push this repo. The publisher updates it; user machines pull it
read-only and sync it into local GBrain.

The install script trusts the official repo URL by default. Development forks
must be pinned with `OPENCLAW_SUPPORT_KB_PINNED_REF` and explicitly allowed.
The official published repo is `100yenadmin/openclaw-support-kb`; upstream
OpenClaw release/docs data still comes from `openclaw/openclaw`.

## Build

```bash
npm run build
```

The builder fetches:

- `https://docs.openclaw.ai/llms-full.txt`
- `https://api.github.com/repos/openclaw/openclaw/releases`
- `https://raw.githubusercontent.com/VoltAgent/awesome-openclaw-skills/main/README.md`
- `https://raw.githubusercontent.com/snyk/agent-scan/main/README.md`
- `https://composio.dev/claw`

It writes source-preserving docs/release Markdown, source-indexed policy
summaries, and `kb-manifest.json`.
Run `npm run check:manifest` after local edits to confirm the manifest still
matches the indexed artifact.

Skill discovery is intentionally layered: local VoltAgent snapshot, current
OpenClaw/ClawHub search, Snyk scan attestation before skill install, and
Composio as an MCP/OAuth integration path for SaaS workflows.

Builds refuse to replace arbitrary directories. The default managed target is
`~/.gbrain/sources/openclaw-support-kb`; non-default build targets need the
`.openclaw-support-kb-source` marker or `--force-managed-target`.

## Install On An Agent Machine

```bash
npm run setup
```

`setup` installs the four OpenClaw support skills into `~/.openclaw/skills`,
writes an agent hint block to active OpenClaw workspace `AGENTS.md` files, and
syncs this source into GBrain. Override skills destination with
`OPENCLAW_SKILLS_DIR`.

`sync:local` builds the KB into `~/.gbrain/sources/openclaw-support-kb`, then
runs:

```bash
gbrain sync --repo ~/.gbrain/sources/openclaw-support-kb && gbrain embed --stale
```

If `gbrain` is not installed, setup fails unless
`OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1` is explicitly set for a degraded
read-only install. A normal install also runs a verification search after
embedding. The verification runs two searches: one for this KB's manifest and
one for the Telegram docs. It fails on empty/no-result searches or missing
expected markers. Use `OPENCLAW_SUPPORT_KB_LOOSE_SEARCH_VERIFY=1` only if a
known-good GBrain version formats search output too tersely for marker checks.

The installed skills assume helper scripts are available from:

```bash
~/.gbrain/sources/openclaw-support-kb/scripts/
```

## Channels

The default channel is `stable`. Use `OPENCLAW_KB_CHANNEL=beta` on prerelease
OpenClaw installs.

## Support Escalation

Agents must draft and ask before sending support escalations. The helper binds
the approved draft, recipient, subject, transport, and account before sending.
Email uses GOG:

```bash
gog gmail send --account <explicit-account> \
  --to support@electricsheephq.com \
  --subject "[OpenClaw Support] <short issue>" \
  --body-file <approved-draft.md>
```

Telegram uses OpenClaw:

```bash
openclaw message send --channel telegram \
  --target @evaOS_support_bot \
  --message "$(cat <approved-draft.md>)"
```

## CI

`.github/workflows/update-kb.yml` rebuilds weekly, on OpenClaw release events,
and on hourly release/docs freshness checks.
