---
type: openclaw_doc
title: "Reset"
source: "https://docs.openclaw.ai/cli/reset"
source_hash: "979a1215eb233e680c4fab76420a8a80a5258de004a771934774c5ca91f608ed"
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

Options:

* `--scope <scope>`: `config`, `config+creds+sessions`, or `full`
* `--yes`: skip confirmation prompts
* `--non-interactive`: disable prompts; requires `--scope` and `--yes`
* `--dry-run`: print actions without removing files

Examples:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw backup create
openclaw reset
openclaw reset --dry-run
openclaw reset --scope config --yes --non-interactive
openclaw reset --scope config+creds+sessions --yes --non-interactive
openclaw reset --scope full --yes --non-interactive
```

Notes:

* Run `openclaw backup create` first if you want a restorable snapshot before removing local state.
* If you omit `--scope`, `openclaw reset` uses an interactive prompt to choose what to remove.
* `--non-interactive` is only valid when both `--scope` and `--yes` are set.

## Related

* [CLI reference](/cli)
