---
type: openclaw_doc
title: "ClawHub"
source: "https://docs.openclaw.ai/clawhub/index"
source_hash: "ff5bca33237e1a98cd00bdb1a3005a9b4608093eed71eb10d5485e45d6a04707"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "clawhub/index.md"
original_doc_path: "clawhub/index.md"
duplicate_index: 1
---

# ClawHub
Source: https://docs.openclaw.ai/clawhub/index



# ClawHub

ClawHub is the public registry for OpenClaw skills and plugins.

* Use native `openclaw` commands to search, install, and update skills and to install plugins from ClawHub.
* Use the separate `clawhub` CLI for registry auth, publishing, delete/undelete, and sync workflows.

Site: [clawhub.ai](https://clawhub.ai)

## Quick start

Search and install skills with OpenClaw:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw skills search "calendar"
openclaw skills install <skill-slug>
openclaw skills update --all
```

Search and install plugins with OpenClaw:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins search "calendar"
openclaw plugins install clawhub:<package>
openclaw plugins update --all
```

Install the ClawHub CLI when you want registry-authenticated workflows such as
publish, sync, or delete/undelete:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
npm i -g clawhub
# or
pnpm add -g clawhub
```

## What ClawHub hosts

| Surface        | What it stores                                               | Typical command                              |
| -------------- | ------------------------------------------------------------ | -------------------------------------------- |
| Skills         | Versioned text bundles with `SKILL.md` plus supporting files | `openclaw skills install <slug>`             |
| Code plugins   | OpenClaw plugin packages with compatibility metadata         | `openclaw plugins install clawhub:<package>` |
| Bundle plugins | Packaged plugin bundles for OpenClaw distribution            | `clawhub package publish <source>`           |
| Souls          | `SOUL.md` bundles shown on onlycrabs.ai                      | Web and API publish flows                    |

ClawHub tracks semver versions, tags such as `latest`, changelogs, files,
downloads, stars, and security scan summaries. Public pages show current registry
state so users can inspect a skill or plugin before installing it.

## Native OpenClaw flows

Native OpenClaw commands install into the active OpenClaw workspace and persist
source metadata so later update commands can stay on ClawHub.

Use `clawhub:<package>` when a plugin install should resolve through ClawHub.
Bare npm-safe plugin specs may resolve through npm during launch cutovers, and
`npm:<package>` stays npm-only when a source must be explicit.

Plugin installs validate advertised `pluginApi` and `minGatewayVersion`
compatibility before archive install runs. When a package version publishes a
ClawPack artifact, OpenClaw prefers the exact uploaded npm-pack `.tgz`, verifies
the ClawHub digest header and downloaded bytes, and records artifact metadata for
later updates.

## ClawHub CLI

The ClawHub CLI is for registry-authenticated work:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub login
clawhub whoami
clawhub search "postgres backups"
clawhub skill publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0
clawhub package explore --family code-plugin
clawhub package inspect episodic-claw
clawhub package publish your-org/your-plugin --dry-run
clawhub package publish your-org/your-plugin
clawhub sync --all
```

The CLI also has skill install/update commands for direct registry workflows:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub install <slug>
clawhub update <slug>
clawhub update --all
clawhub list
```

Those commands install skills into `./skills` under the current working directory
and record installed versions in `.clawhub/lock.json`.

## Publishing

Publish skills from a local folder containing `SKILL.md`:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub skill publish <path>
```

Common publish options:

* `--slug <slug>`: skill slug.
* `--name <name>`: display name.
* `--version <version>`: semver version.
* `--changelog <text>`: changelog text.
* `--tags <tags>`: comma-separated tags, defaulting to `latest`.

Publish plugins from a local folder, `owner/repo`, `owner/repo@ref`, or a GitHub
URL:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub package publish <source>
```

Use `--dry-run` to build the exact publish plan without uploading, and `--json`
for CI-friendly output.

Code plugins must include the required OpenClaw compatibility metadata in
`package.json`, including `openclaw.compat.pluginApi` and
`openclaw.build.openclawVersion`. See [CLI](/clawhub/cli) for the full command
reference and [Skill format](/clawhub/skill-format) for skill metadata.

## Security and moderation

ClawHub is open by default: anyone can upload, but publishing requires a GitHub
account old enough to pass the upload gate. Public detail pages summarize the
latest scan state before install or download.

ClawHub runs automated checks on published skills and plugin releases. Scan-held
or blocked releases may disappear from public catalog and install surfaces while
remaining visible to their owner in `/dashboard`.

Signed-in users can report skills and packages. Moderators can review reports,
hide or restore content, and ban abusive accounts. See
[Security Audits](/clawhub/security-audits),
[Moderation and Account Safety](/clawhub/moderation), and
[Acceptable usage](/clawhub/acceptable-usage) for policy and enforcement details.

## Telemetry and environment

When you run `clawhub sync` while logged in, the CLI sends a minimal snapshot so
ClawHub can compute install counts. Disable this with:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
export CLAWHUB_DISABLE_TELEMETRY=1
```

Useful environment overrides:

| Variable                      | Effect                                            |
| ----------------------------- | ------------------------------------------------- |
| `CLAWHUB_SITE`                | Override the site URL used for browser login.     |
| `CLAWHUB_REGISTRY`            | Override the registry API URL.                    |
| `CLAWHUB_CONFIG_PATH`         | Override where the CLI stores token/config state. |
| `CLAWHUB_WORKDIR`             | Override the default working directory.           |
| `CLAWHUB_DISABLE_TELEMETRY=1` | Disable telemetry on `sync`.                      |

See [Telemetry](/clawhub/telemetry), [HTTP API](/clawhub/http-api), and
[Troubleshooting](/clawhub/troubleshooting) for deeper reference material.
