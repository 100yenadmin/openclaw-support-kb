---
type: openclaw_doc
title: "Uninstall"
source: "https://docs.openclaw.ai/cli/uninstall"
source_hash: "6937544e3da8086459b13c9d7561b3ceefb20ac73df08b571204205aa1b468ff"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/uninstall.md"
original_doc_path: "cli/uninstall.md"
duplicate_index: 1
---

# Uninstall
Source: https://docs.openclaw.ai/cli/uninstall

# `openclaw uninstall`

Uninstall the Gateway service and/or local data. The CLI itself is not
removed; uninstall it via npm/pnpm separately.

## Options

| Flag                | Default | Description                                          |
| ------------------- | ------- | ---------------------------------------------------- |
| `--service`         | `false` | Remove the Gateway service.                          |
| `--state`           | `false` | Remove state and config.                             |
| `--workspace`       | `false` | Remove workspace directories.                        |
| `--app`             | `false` | Remove the macOS app.                                |
| `--all`             | `false` | Shorthand for `--service --state --workspace --app`. |
| `--yes`             | `false` | Skip confirmation prompts.                           |
| `--non-interactive` | `false` | Disable prompts; requires `--yes`.                   |
| `--dry-run`         | `false` | Print planned actions without removing files.        |

With no scope flags, an interactive multiselect prompts for which components
to remove (defaults to service, state, workspace preselected).

## Examples

```bash
openclaw backup create
openclaw uninstall
openclaw uninstall --service --yes --non-interactive
openclaw uninstall --state --workspace --yes --non-interactive
openclaw uninstall --all --yes
openclaw uninstall --dry-run
```

## Notes

- Run `openclaw backup create` first for a restorable snapshot before removing
  state or workspaces.
- `--state` preserves configured workspace directories unless `--workspace` is
  also selected.

## Related

- [CLI reference](/cli)
- [Uninstall](/install/uninstall)

---
