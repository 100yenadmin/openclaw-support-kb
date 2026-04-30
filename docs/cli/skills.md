---
type: openclaw_doc
title: "Skills"
source: "https://docs.openclaw.ai/cli/skills"
source_hash: "4f5a29ff8ba3978e97061d2e899f6a273512c975e917c5e454a15ec2246c40f0"
doc_path: "cli/skills.md"
original_doc_path: "cli/skills.md"
duplicate_index: 1
---

# Skills
Source: https://docs.openclaw.ai/cli/skills



# `openclaw skills`

Inspect local skills and install/update skills from ClawHub.

Related:

* Skills system: [Skills](/tools/skills)
* Skills config: [Skills config](/tools/skills-config)
* ClawHub installs: [ClawHub](/tools/clawhub)

## Commands

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw skills search "calendar"
openclaw skills search --limit 20 --json
openclaw skills install <slug>
openclaw skills install <slug> --version <version>
openclaw skills install <slug> --force
openclaw skills install <slug> --agent <id>
openclaw skills update <slug>
openclaw skills update --all
openclaw skills update --all --agent <id>
openclaw skills list
openclaw skills list --eligible
openclaw skills list --json
openclaw skills list --verbose
openclaw skills list --agent <id>
openclaw skills info <name>
openclaw skills info <name> --json
openclaw skills info <name> --agent <id>
openclaw skills check
openclaw skills check --json
openclaw skills check --agent <id>
```

`search`/`install`/`update` use ClawHub directly and install into the active
workspace `skills/` directory. `list`/`info`/`check` still inspect the local
skills visible to the current workspace and config. Workspace-backed commands
resolve the target workspace from `--agent <id>`, then the current working
directory when it is inside a configured agent workspace, then the default
agent.

This CLI `install` command downloads skill folders from ClawHub. Gateway-backed
skill dependency installs triggered from onboarding or Skills settings use the
separate `skills.install` request path instead.

Notes:

* `search [query...]` accepts an optional query; omit it to browse the default
  ClawHub search feed.
* `search --limit <n>` caps returned results.
* `install --force` overwrites an existing workspace skill folder for the same
  slug.
* `--agent <id>` targets one configured agent workspace and overrides current
  working directory inference.
* `update --all` only updates tracked ClawHub installs in the active workspace.
* `list` is the default action when no subcommand is provided.
* `list`, `info`, and `check` write their rendered output to stdout. With
  `--json`, that means the machine-readable payload stays on stdout for pipes
  and scripts.

## Related

* [CLI reference](/cli)
* [Skills](/tools/skills)
