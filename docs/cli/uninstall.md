---
type: openclaw_doc
title: "Uninstall"
source: "https://docs.openclaw.ai/cli/uninstall"
source_hash: "7c97ad7e01e8255945612e3fa62d8a7d917c32616266bc8a0fce3185267c7353"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "cli/uninstall.md"
original_doc_path: "cli/uninstall.md"
duplicate_index: 1
---

# Uninstall
Source: https://docs.openclaw.ai/cli/uninstall



# `openclaw uninstall`

Uninstall the gateway service + local data (CLI remains).

Options:

* `--service`: remove the gateway service
* `--state`: remove state and config
* `--workspace`: remove workspace directories
* `--app`: remove the macOS app
* `--all`: remove service, state, workspace, and app
* `--yes`: skip confirmation prompts
* `--non-interactive`: disable prompts; requires `--yes`
* `--dry-run`: print actions without removing files

Examples:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw backup create
openclaw uninstall
openclaw uninstall --service --yes --non-interactive
openclaw uninstall --state --workspace --yes --non-interactive
openclaw uninstall --all --yes
openclaw uninstall --dry-run
```

Notes:

* Run `openclaw backup create` first if you want a restorable snapshot before removing state or workspaces.
* `--all` is shorthand for removing service, state, workspace, and app together.
* `--non-interactive` requires `--yes`.

## Related

* [CLI reference](/cli)
* [Uninstall](/install/uninstall)
