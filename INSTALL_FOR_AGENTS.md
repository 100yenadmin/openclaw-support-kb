---
type: openclaw_install_guide
title: "Install OpenClaw Support KB For Agents"
search_role: "installer"
---

# Install OpenClaw Support KB For Agents

Use this file when a user points you at this repository and asks you to install
the OpenClaw support knowledge base.

## Goal

Install this repository as a local GBrain source so OpenClaw agents can answer
OpenClaw setup, update, config, Telegram, skill, and support questions from a
fresh local KB before guessing or escalating.

Users do **not** push to this repo. The publisher updates the repo; each user
machine pulls it read-only and syncs it into GBrain.

This repo is **not** an npm package and does not install a global command.
`package.json` only provides local aliases after this repo is cloned and the
agent has changed into the repo directory. Prefer the explicit
`node scripts/...` commands below.

## Install

Use the official published repo URL:

```bash
export OPENCLAW_SUPPORT_KB_REPO="https://github.com/electricsheephq/openclaw-support-kb.git"
export OPENCLAW_SUPPORT_KB_DIR="$HOME/.gbrain/sources/openclaw-support-kb"
```

For a development fork, require a pinned immutable ref:

```bash
export OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO=1
export OPENCLAW_SUPPORT_KB_PINNED_REF="<40-character-commit-sha>"
```

Clone or update the repo in the canonical GBrain source location:

```bash
if [ -d "$OPENCLAW_SUPPORT_KB_DIR/.git" ]; then
  git -C "$OPENCLAW_SUPPORT_KB_DIR" pull --ff-only
else
  git clone "$OPENCLAW_SUPPORT_KB_REPO" "$OPENCLAW_SUPPORT_KB_DIR"
fi
```

Run setup:

```bash
cd "$OPENCLAW_SUPPORT_KB_DIR"
node scripts/update-client.mjs
```

Equivalent local alias from this repo directory: `npm run setup`.

Setup requires `gbrain`. The installer checks `PATH`, `GBRAIN_BIN`, and common
local locations such as `~/gbrain/bin/gbrain`. If `gbrain` is missing, stop and
install/fix GBrain. Use `OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1` only for an
explicit degraded read-only install where the agent must not claim
GBrain-indexed results.

If the discovered GBrain is older than `kb-manifest.json` requires, setup still
installs the OpenClaw support skills but stops before indexing. Run the printed
upgrade command, usually:

```bash
gbrain upgrade
```

If `~/gbrain` is a source checkout but `~/gbrain/bin/gbrain --version` is old,
rebuild or reinstall that checkout so the binary matches the checkout version.

What setup does:

1. installs four support skills into `~/.openclaw/skills`
2. writes a managed OpenClaw agent hint block to active workspace `AGENTS.md`
   files, including `~/.openclaw/workspace/AGENTS.md`
3. registers `openclaw-support-kb` as a federated GBrain source at
   `~/.gbrain/sources/openclaw-support-kb` when the installed GBrain supports
   named sources, and recreates that source if its registered path points at an
   old `.pre-git-*` backup
4. runs `gbrain sync --repo ~/.gbrain/sources/openclaw-support-kb --source openclaw-support-kb`
   when supported, otherwise legacy `gbrain sync --repo ~/.gbrain/sources/openclaw-support-kb`
5. runs `gbrain embed --stale`
6. verifies local search returns from the indexed KB

Search verification runs two checks: one for this KB's manifest and one for the
Telegram docs. Empty/no-result output or missing expected markers fails. Use
`OPENCLAW_SUPPORT_KB_LOOSE_SEARCH_VERIFY=1` only if a known-good GBrain version
formats search output too tersely for marker checks.

GBrain does not re-embed the whole KB on every update. It syncs from git commit
state, imports changed/deleted files, and `gbrain embed --stale` only fills
chunks missing embeddings. If `status.mjs` reports legacy pre-git backups under
the GBrain sources directory, move them to the archive folder with:

```bash
node "$HOME/.gbrain/sources/openclaw-support-kb/scripts/repair-index.mjs"
```

If an existing support skill directory is present and was not previously
managed by this KB, setup backs it up before installing the managed copy.

## Enable Automatic Updates

Client machines should not rely on a person remembering to re-run setup. After
the first successful setup, install the managed local fallback:

```bash
cd "$OPENCLAW_SUPPORT_KB_DIR"
node scripts/install-auto-update.mjs --mode crontab --run-now
```

This appends or replaces only the managed
`openclaw-support-kb:auto-update` crontab block. It preserves unrelated crontab
entries and logs to `~/.gbrain/logs/openclaw-support-kb-update.log`. The script
defaults to `--mode print`; crontab mutation requires explicit
`--mode crontab`.

For environments where the fleet/control panel owns scheduling, print the exact
managed command instead:

```bash
cd "$OPENCLAW_SUPPORT_KB_DIR"
node scripts/install-auto-update.mjs --mode print
```

Fleet/control-panel immediate refresh command:

Register the full `Fleet/control-panel immediate update command:` printed by
`node scripts/install-auto-update.mjs --mode print`. Do not replace it with a
bare `node .../run-client-update.mjs` call: the printed command includes the
`OPENCLAW_SUPPORT_KB_DIR`, `OPENCLAW_SUPPORT_KB_REPO`, `OPENCLAW_KB_CHANNEL`,
and `PATH` prefixes needed to find local installs such as
`~/gbrain/bin/gbrain`.

Best production posture is both:

1. fleet/control-panel calls `run-client-update.mjs` on KB publish or OpenClaw
   release events for near-immediate freshness
2. local cron fallback runs the same command daily at a stable per-host time so
   missed fleet events heal themselves without noisy polling

The runner uses a lock so duplicate fleet and cron updates do not overlap. It
writes the last result to
`~/.gbrain/state/openclaw-support-kb-update.json`.

## Verify

```bash
test -f "$HOME/.gbrain/sources/openclaw-support-kb/kb-manifest.json"
test -f "$HOME/.openclaw/skills/openclaw-support-kb/SKILL.md"
node "$HOME/.gbrain/sources/openclaw-support-kb/scripts/status.mjs"
gbrain sources list
gbrain search "Telegram allowFrom groupAllowFrom groups"
gbrain query "How should I safely repair OpenClaw config?"
```

Use `node "$HOME/.gbrain/sources/openclaw-support-kb/scripts/status.mjs" --json`
for fleet or agent health checks. It reports whether the source checkout is git
managed, whether the four skills are installed, whether GBrain is new enough,
whether the `openclaw-support-kb` named source has pages and points at the
current checkout, whether old pre-git backups remain under GBrain sources, and
whether an import checkpoint is stale or an update is currently running.

If `gbrain sources list` reports `Unknown command: sources`, continue with the
two search/query checks. That means this machine has an older GBrain without
named-source management; the installer uses legacy repo sync on those builds.

The agent should now use these installed skills automatically for OpenClaw
support/config/setup questions:

- `openclaw-support-kb`
- `openclaw-config-repair`
- `openclaw-skill-discovery`
- `openclaw-support-escalation`

## Update Later

```bash
cd "$HOME/.gbrain/sources/openclaw-support-kb"
git pull --ff-only
node scripts/update-client.mjs
```

Preferred automated update entrypoint:

```bash
node "$HOME/.gbrain/sources/openclaw-support-kb/scripts/run-client-update.mjs" --reason manual
```

For beta/prerelease docs:

```bash
OPENCLAW_KB_CHANNEL=beta node scripts/update-client.mjs
```

## Support Escalation Policy

Never send support messages without asking the user first. Draft, redact, show
the draft, generate an approval context hash for the exact transport/recipient,
and wait for approval.

Send only through `scripts/support-escalation.mjs`. The helper uses GOG for
approved email escalation to `support@electricsheephq.com` and OpenClaw
Telegram messaging for approved fallback to `@evaOS_support_bot`; agents should
not call raw transport commands directly for support escalation.
