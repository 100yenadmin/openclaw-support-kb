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

The canonical GBrain source id is:

```bash
openclaw-support-kb
```

Users do not push this repo. The publisher updates it; user machines pull it
read-only and sync it into local GBrain.

The install script trusts the official repo URL by default. Development forks
must be pinned with `OPENCLAW_SUPPORT_KB_PINNED_REF` and explicitly allowed.
The official published repo is `100yenadmin/openclaw-support-kb`; upstream
OpenClaw release/docs data still comes from `openclaw/openclaw`.

This repo is not published as an npm package. `package.json` is only a local
script runner for agents/CI after they have already cloned this repo and changed
into the repo directory. The explicit `node scripts/...` commands below are the
canonical commands; `npm run ...` aliases are just convenience wrappers.

## Build

```bash
node scripts/build-kb.mjs
```

Local alias from this repo directory: `npm run build`.

The builder fetches:

- `https://docs.openclaw.ai/llms-full.txt`
- `https://api.github.com/repos/openclaw/openclaw/releases`
- `https://raw.githubusercontent.com/VoltAgent/awesome-openclaw-skills/main/README.md`
- `https://raw.githubusercontent.com/snyk/agent-scan/main/README.md`
- `https://docs.composio.dev/llms.txt`
- `https://docs.composio.dev/llms-full.txt`
- `https://composio.dev/toolkits`

It writes source-preserving docs/release Markdown, source-indexed policy
summaries, and `kb-manifest.json`.
Run `node scripts/check-manifest.mjs` after local edits to confirm the manifest still
matches the indexed artifact.

Skill discovery is intentionally layered: local VoltAgent snapshot, current
OpenClaw/ClawHub search, Snyk scan attestation before skill install, and local
Composio docs/toolkit catalog snapshots for approved SaaS workflows.

Builds refuse to replace arbitrary directories. The default managed target is
`~/.gbrain/sources/openclaw-support-kb`; non-default build targets need the
`.openclaw-support-kb-source` marker or `--force-managed-target`.

## Install On An Agent Machine

```bash
node scripts/update-client.mjs
```

Local alias from this repo directory: `npm run setup`.

Setup installs the four OpenClaw support skills into `~/.openclaw/skills`, writes
an agent hint block to active OpenClaw workspace `AGENTS.md` files, and syncs
this source into GBrain. Override skills destination with `OPENCLAW_SKILLS_DIR`.
When setup runs outside the canonical source directory, it keeps
`~/.gbrain/sources/openclaw-support-kb` as a git checkout of the published repo
instead of generating a non-git directory that GBrain cannot sync.

`sync:local` builds the KB into `~/.gbrain/sources/openclaw-support-kb`,
registers the federated GBrain source `openclaw-support-kb` when the installed
GBrain supports named sources, then runs:

```bash
gbrain sync --repo ~/.gbrain/sources/openclaw-support-kb --source openclaw-support-kb && \
  gbrain embed --stale
```

If the discovered GBrain satisfies `kb-manifest.json` `minGbrainVersion` but
lacks named-source commands, `ensureGbrainSource()` falls back to:

```bash
gbrain sync --repo ~/.gbrain/sources/openclaw-support-kb && gbrain embed --stale
```

GBrain versions older than `minGbrainVersion` stop before indexing instead of
using the legacy fallback. If `gbrain` is not installed, setup fails unless
`OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1` is explicitly set for a degraded
read-only install. The installer checks `PATH`, `GBRAIN_BIN`, and common local
locations such as `~/gbrain/bin/gbrain`. If the discovered GBrain is older than
`kb-manifest.json` requires, skills are still installed but indexing stops with
an explicit `gbrain upgrade` hint. A normal install also runs a verification
search after embedding. The verification runs two searches: one for this KB's
manifest and one for the Telegram docs. It fails on empty/no-result searches or
missing expected markers. Use `OPENCLAW_SUPPORT_KB_LOOSE_SEARCH_VERIFY=1` only
if a known-good GBrain version formats search output too tersely for marker checks.

The installed skills assume helper scripts are available from:

```bash
~/.gbrain/sources/openclaw-support-kb/scripts/
```

## Automatic Updates

Install a managed local cron fallback after setup:

```bash
node scripts/install-auto-update.mjs --mode crontab --run-now
```

The installer appends or replaces only the managed
`openclaw-support-kb:auto-update` crontab block. It does not replace unrelated
crontab entries. Running without `--mode crontab` prints the managed block and
fleet command without changing the machine. The scheduled command runs:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/run-client-update.mjs --reason cron
```

`run-client-update.mjs` is also the fleet/control-panel entrypoint. To reduce
freshness lag, register the full `Fleet/control-panel immediate update command:`
printed by `node scripts/install-auto-update.mjs --mode print`; that command
preserves the `OPENCLAW_SUPPORT_KB_*`, `OPENCLAW_KB_CHANNEL`, and `PATH`
prefixes needed on customer machines.

The runner is lock-protected, pulls the published repo with `git pull --ff-only`,
runs `scripts/update-client.mjs`, syncs the named GBrain source when available
or legacy repo sync otherwise, embeds stale chunks, verifies search, and writes
status JSON to
`~/.gbrain/state/openclaw-support-kb-update.json`.

Check install health at any time:

```bash
node ~/.gbrain/sources/openclaw-support-kb/scripts/status.mjs
node ~/.gbrain/sources/openclaw-support-kb/scripts/status.mjs --json
```

The status command checks the source checkout, manifest, installed skills,
GBrain version, named-source page count, stale import checkpoints, local update
lock, search verification, and cron registration. It exits 0 only when the KB is
healthy or an update is clearly running.

```mermaid
flowchart TD
  A["GitHub publisher updates 100yenadmin/openclaw-support-kb"] --> B["Fleet/control panel calls run-client-update"]
  A --> C["Local cron fallback calls run-client-update"]
  B --> D["Client pulls repo with git pull --ff-only"]
  C --> D
  D --> E["update-client installs skills and AGENTS hints"]
  E --> F["Register/federate GBrain source openclaw-support-kb"]
  F --> G["gbrain sync --repo ... (--source when supported)"]
  G --> H["gbrain embed --stale"]
  H --> I["Verification searches + status JSON"]
```

## Channels

The default channel is `stable`. Use `OPENCLAW_KB_CHANNEL=beta` on prerelease
OpenClaw installs.

## Support Escalation

Agents must draft and ask before sending support escalations. The helper binds
the approved draft, recipient, subject, transport, and account before sending.
Use `scripts/support-escalation.mjs`; do not call raw GOG or raw Telegram send
commands directly for support escalation. The helper uses GOG for email when
available and OpenClaw Telegram messaging for `@evaOS_support_bot` fallback.

## CI

`.github/workflows/update-kb.yml` rebuilds weekly, on OpenClaw release events,
and on hourly release/docs freshness checks.
