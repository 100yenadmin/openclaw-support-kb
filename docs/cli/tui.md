---
type: openclaw_doc
title: "TUI"
source: "https://docs.openclaw.ai/cli/tui"
source_hash: "e2ba5f31f62a9c4bb26d5928ae6f277d900513605827d4dc7f78946756a47421"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "cli/tui.md"
original_doc_path: "cli/tui.md"
duplicate_index: 1
---

# TUI
Source: https://docs.openclaw.ai/cli/tui



# `openclaw tui`

Open the terminal UI connected to the Gateway, or run it in local embedded
mode.

Related:

* TUI guide: [TUI](/web/tui)

Notes:

* `chat` and `terminal` are aliases for `openclaw tui --local`.
* `--local` cannot be combined with `--url`, `--token`, or `--password`.
* `tui` resolves configured gateway auth SecretRefs for token/password auth when possible (`env`/`file`/`exec` providers).
* When launched from inside a configured agent workspace directory, TUI auto-selects that agent for the session key default (unless `--session` is explicitly `agent:<id>:...`).
* Local mode uses the embedded agent runtime directly. Most local tools work, but Gateway-only features are unavailable.
* Local mode adds `/auth [provider]` inside the TUI command surface.
* Plugin approval gates still apply in local mode. Tools that require approval prompt for a decision in the terminal; nothing is silently auto-approved because the Gateway is not involved.

## Examples

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw chat
openclaw tui --local
openclaw tui
openclaw tui --url ws://127.0.0.1:18789 --token <token>
openclaw tui --session main --deliver
openclaw chat --message "Compare my config to the docs and tell me what to fix"
# when run inside an agent workspace, infers that agent automatically
openclaw tui --session bugfix
```

## Config repair loop

Use local mode when the current config already validates and you want the
embedded agent to inspect it, compare it against the docs, and help repair it
from the same terminal:

If `openclaw config validate` is already failing, use `openclaw configure` or
`openclaw doctor --fix` first. `openclaw chat` does not bypass the invalid-
config guard.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw chat
```

Then inside the TUI:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
!openclaw config file
!openclaw docs gateway auth token secretref
!openclaw config validate
!openclaw doctor
```

Apply targeted fixes with `openclaw config set` or `openclaw configure`, then
rerun `openclaw config validate`. See [TUI](/web/tui) and [Config](/cli/config).

## Related

* [CLI reference](/cli)
* [TUI](/web/tui)
