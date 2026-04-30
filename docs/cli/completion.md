---
type: openclaw_doc
title: "Completion"
source: "https://docs.openclaw.ai/cli/completion"
source_hash: "6dec0501db2354dc73941184174183a52c7e0a937e61782cb94e385dc0cf4f7a"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "cli/completion.md"
original_doc_path: "cli/completion.md"
duplicate_index: 1
---

# Completion
Source: https://docs.openclaw.ai/cli/completion



# `openclaw completion`

Generate shell completion scripts and optionally install them into your shell profile.

## Usage

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw completion
openclaw completion --shell zsh
openclaw completion --install
openclaw completion --shell fish --install
openclaw completion --write-state
openclaw completion --shell bash --write-state
```

## Options

* `-s, --shell <shell>`: shell target (`zsh`, `bash`, `powershell`, `fish`; default: `zsh`)
* `-i, --install`: install completion by adding a source line to your shell profile
* `--write-state`: write completion script(s) to `$OPENCLAW_STATE_DIR/completions` without printing to stdout
* `-y, --yes`: skip install confirmation prompts

## Notes

* `--install` writes a small "OpenClaw Completion" block into your shell profile and points it at the cached script.
* Without `--install` or `--write-state`, the command prints the script to stdout.
* Completion generation eagerly loads command trees so nested subcommands are included.

## Related

* [CLI reference](/cli)
