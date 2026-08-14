---
type: paperclip_doc
title: "Set defaults"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/cli/overview.md"
source_hash: "4a08bc4afd64e2abf322dd0edf3cf3019ea516b662a3edc0acae2dedc408525a"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/cli/overview.md"
original_doc_path: "docs/cli/overview.md"
---

# Set defaults

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/cli/overview.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/cli/overview.md

---
title: CLI Overview
summary: CLI installation and setup
---

The Paperclip CLI handles instance setup, diagnostics, and control-plane operations.

## Usage

```sh
pnpm paperclipai --help
```

## Global Options

All commands support:

| Flag | Description |
|------|-------------|
| `--data-dir <path>` | Local Paperclip data root (isolates from `~/.paperclip`) |
| `--api-base <url>` | API base URL |
| `--api-key <token>` | API authentication token |
| `--context <path>` | Context file path |
| `--profile <name>` | Context profile name |
| `--json` | Output as JSON |

Company-scoped commands also accept `--company-id <id>`.

For clean local instances, pass `--data-dir` on the command you run:

```sh
pnpm paperclipai run --data-dir ./tmp/paperclip-dev
```

## Context Profiles

Store defaults to avoid repeating flags:

```sh
# Set defaults
pnpm exec paperclipai context set --api-base http://localhost:3100 --company-id <id>

# View current context
pnpm paperclipai context show

# List profiles
pnpm paperclipai context list

# Switch profile
pnpm paperclipai context use default
```

To avoid storing secrets in context, use an env var:

```sh
pnpm exec paperclipai context set --api-key-env-var-name PAPERCLIP_API_KEY
export PAPERCLIP_API_KEY=...
```

Secret operations are available under `paperclipai secrets`:

```sh
pnpm exec paperclipai secrets declarations --company-id <company-id> --kind secret
pnpm exec paperclipai secrets create --company-id <company-id> --name anthropic-api-key --value-env ANTHROPIC_API_KEY
pnpm exec paperclipai secrets link --company-id <company-id> --name prod-stripe-key --provider aws_secrets_manager --external-ref <provider-ref>
pnpm exec paperclipai secrets doctor --company-id <company-id>
pnpm exec paperclipai secrets migrate-inline-env --company-id <company-id> --apply
```

Context is stored at `~/.paperclip/context.json`.

## Command Categories

The CLI has two categories:

1. **[Setup commands](/cli/setup-commands)** — instance bootstrap, diagnostics, configuration
2. **[Control-plane commands](/cli/control-plane-commands)** — issues, agents, approvals, activity
