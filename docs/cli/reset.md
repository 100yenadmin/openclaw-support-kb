---
type: openclaw_doc
title: "Reset"
source: "https://docs.openclaw.ai/cli/reset"
source_hash: "2d155b2ed7c7bb632f904e2709bcaa8b510f208c376ad3d4019976cf84236cbe"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/reset.md"
original_doc_path: "cli/reset.md"
duplicate_index: 1
---

# Reset
Source: https://docs.openclaw.ai/cli/reset

# `openclaw reset`

Reset local config/state (keeps the CLI installed).

```bash
openclaw reset
openclaw reset --dry-run
openclaw reset --scope config --yes --non-interactive
openclaw reset --scope config+creds+sessions --yes --non-interactive
openclaw reset --scope full --yes --non-interactive
```

## Options

- `--scope <scope>`: `config`, `config+creds+sessions`, or `full`
- `--yes`: skip confirmation prompts
- `--non-interactive`: disable prompts; requires `--scope` and `--yes`
- `--dry-run`: print actions without removing files

## Scopes

| Scope                   | Removes                                                                     | Stops gateway first |
| ----------------------- | --------------------------------------------------------------------------- | ------------------- |
| `config`                | config file only                                                            | no                  |
| `config+creds+sessions` | config file, OAuth/credentials dir, per-agent session directories           | yes                 |
| `full`                  | state dir (including the shared SQLite database) plus workspace directories | yes                 |

`config+creds+sessions` and `full` stop a running managed gateway service before deleting state.

## Notes

- Run `openclaw backup create` first for a restorable snapshot before removing local state.
- Before removing the state directory, `full` requires exclusive state ownership. If an unmanaged or externally supervised Gateway is still running, reset refuses and asks you to stop it first.
- Workspace setup state and attestations are rows in the shared SQLite database, so `full` removes them with the state directory; there are no current attestation sidecar files to remove separately.
- Without `--scope`, `openclaw reset` prompts interactively for the scope to remove.
- `--non-interactive` is only valid when both `--scope` and `--yes` are set.
- `config+creds+sessions` and `full` print `Next: openclaw onboard --install-daemon` when done.

## Related

- [CLI reference](/cli)

---
