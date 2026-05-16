---
type: openclaw_doc
title: "Completion"
source: "https://docs.openclaw.ai/cli/completion"
source_hash: "bff1762ccb5641027d0604af14d27b54d75e1bacb4f968f34ebc2ad4867ce920"
system: "openclaw"
kb_namespace: "openclaw"
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
