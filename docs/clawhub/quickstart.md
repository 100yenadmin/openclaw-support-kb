---
type: openclaw_doc
title: "Quickstart"
source: "https://docs.openclaw.ai/clawhub/quickstart"
source_hash: "53834717bba78d5d4d986422fac3124a8064a8d2293039b22d53c19f4fe42b9d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "clawhub/quickstart.md"
original_doc_path: "clawhub/quickstart.md"
duplicate_index: 1
---

# Quickstart
Source: https://docs.openclaw.ai/clawhub/quickstart



# Quickstart

ClawHub is a registry for OpenClaw skills and plugins.

Use OpenClaw when you are installing things into OpenClaw. Use the `clawhub` CLI
when you are signing in, publishing, managing your own listings, or using
registry-specific workflows.

## Find and install a skill

Search from OpenClaw:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw skills search "calendar"
```

Install a skill:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw skills install <skill-slug>
```

Update installed skills:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw skills update --all
```

OpenClaw records where the skill came from so later updates can continue to
resolve through ClawHub.

## Find and install a plugin

Search from OpenClaw:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins search "calendar"
```

Install a ClawHub-hosted plugin with an explicit ClawHub source:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins install clawhub:<package>
```

Update installed plugins:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins update --all
```

Use the `clawhub:` prefix when you want OpenClaw to resolve the package through
ClawHub rather than npm or another source.

## Sign in for publishing

Install the ClawHub CLI:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
npm i -g clawhub
# or
pnpm add -g clawhub
```

Sign in with GitHub:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub login
clawhub whoami
```

Headless environments can use an API token from the ClawHub web UI:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub login --token clh_...
```

## Publish a skill

A skill is a folder with a required `SKILL.md` file and optional supporting
files.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub skill publish ./my-skill \
  --slug my-skill \
  --name "My Skill" \
  --version 1.0.0 \
  --changelog "Initial release"
```

Before publishing, check the metadata in `SKILL.md`. Declare required
environment variables, tools, and permissions so users can understand what the
skill needs before they install it. See [Skill format](/clawhub/skill-format).

## Publish a plugin

Publish a plugin from a local folder, a GitHub repo, a GitHub ref, or an
existing archive:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub package publish <source> --family code-plugin --dry-run
clawhub package publish <source> --family code-plugin
```

Use `--dry-run` first to preview the resolved package metadata, compatibility
fields, source attribution, and upload plan without publishing.

Code plugins must include OpenClaw compatibility metadata in `package.json`,
including `openclaw.compat.pluginApi` and `openclaw.build.openclawVersion`.

## Sync skills you maintain

`sync` scans skill folders and publishes new or changed skills that are not
already synchronized.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub sync --all --dry-run
clawhub sync --all
```

When you are signed in, `sync` may also send a minimal install snapshot for
aggregate install counts. See [Telemetry](/clawhub/telemetry) for what is reported
and how to opt out.

## Inspect before installing

Before installing, use the ClawHub web page or CLI detail commands to inspect
metadata, source links, versions, changelogs, and scan status:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub inspect <skill-slug>
clawhub package inspect <package>
```

Public listings show the latest scan state. Releases that are held or blocked by
moderation may be hidden from search and install surfaces until resolved.
