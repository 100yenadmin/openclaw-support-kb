# Install OpenClaw Support KB For Agents

Use this file when a user points you at this repository and asks you to install
the OpenClaw support knowledge base.

## Goal

Install this repository as a local GBrain source so OpenClaw agents can answer
OpenClaw setup, update, config, Telegram, skill, and support questions from a
fresh local KB before guessing or escalating.

Users do **not** push to this repo. The publisher updates the repo; each user
machine pulls it read-only and syncs it into GBrain.

## Install

Use the official published repo URL:

```bash
export OPENCLAW_SUPPORT_KB_REPO="https://github.com/100yenadmin/openclaw-support-kb.git"
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
npm run setup
```

Setup requires `gbrain`. If `gbrain` is missing, stop and install/fix GBrain.
Use `OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1` only for an explicit degraded
read-only install where the agent must not claim GBrain-indexed results.

What setup does:

1. installs four support skills into `~/.openclaw/skills`
2. writes a managed OpenClaw agent hint block to active workspace `AGENTS.md`
   files, including `~/.openclaw/workspace/AGENTS.md`
3. runs `gbrain sync --repo ~/.gbrain/sources/openclaw-support-kb`
4. runs `gbrain embed --stale`
5. verifies local search returns from the indexed KB

Search verification is deliberately simple for production installs: empty/no
result output fails, unusual source formatting warns, and strict source matching
is only enabled with `OPENCLAW_SUPPORT_KB_STRICT_SEARCH_VERIFY=1`.

If an existing support skill directory is present and was not previously
managed by this KB, setup backs it up before installing the managed copy.

## Verify

```bash
test -f "$HOME/.gbrain/sources/openclaw-support-kb/kb-manifest.json"
test -f "$HOME/.openclaw/skills/openclaw-support-kb/SKILL.md"
gbrain search "Telegram allowFrom groupAllowFrom groups"
gbrain query "How should I safely repair OpenClaw config?"
```

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
npm run setup
```

For beta/prerelease docs:

```bash
OPENCLAW_KB_CHANNEL=beta npm run setup
```

## Support Escalation Policy

Never send support messages without asking the user first. Draft, redact, show
the draft, generate an approval context hash for the exact transport/recipient,
and wait for approval.

Preferred support email path:

```bash
gog gmail send --account <explicit-account> \
  --to support@electricsheephq.com \
  --subject "[OpenClaw Support] <short issue>" \
  --body-file <approved-draft.md>
```

Telegram fallback:

```bash
openclaw message send --channel telegram \
  --target @evaOS_support_bot \
  --message "$(cat <approved-draft.md>)"
```
