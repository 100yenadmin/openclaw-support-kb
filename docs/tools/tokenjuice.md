---
type: openclaw_doc
title: "Tokenjuice"
source: "https://docs.openclaw.ai/tools/tokenjuice"
source_hash: "62ed21cfcb9367ba06dfc0dab4700fb6634858b8afb7efb93a23901831c187ae"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "tools/tokenjuice.md"
original_doc_path: "tools/tokenjuice.md"
duplicate_index: 1
---

# Tokenjuice
Source: https://docs.openclaw.ai/tools/tokenjuice



`tokenjuice` is an optional bundled plugin that compacts noisy `exec` and `bash`
tool results after the command has already run.

It changes the returned `tool_result`, not the command itself. Tokenjuice does
not rewrite shell input, rerun commands, or change exit codes.

Today this applies to PI embedded runs and OpenClaw dynamic tools in the Codex
app-server harness. Tokenjuice hooks OpenClaw's tool-result middleware and
trims the output before it goes back into the active harness session.

## Enable the plugin

Fast path:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set plugins.entries.tokenjuice.enabled true
```

Equivalent:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins enable tokenjuice
```

OpenClaw already ships the plugin. There is no separate `plugins install`
or `tokenjuice install openclaw` step.

If you prefer editing config directly:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  plugins: {
    entries: {
      tokenjuice: {
        enabled: true,
      },
    },
  },
}
```

## What tokenjuice changes

* Compacts noisy `exec` and `bash` results before they are fed back into the session.
* Keeps the original command execution untouched.
* Preserves exact file-content reads and other commands that tokenjuice should leave raw.
* Stays opt-in: disable the plugin if you want verbatim output everywhere.

## Verify it is working

1. Enable the plugin.
2. Start a session that can call `exec`.
3. Run a noisy command such as `git status`.
4. Check that the returned tool result is shorter and more structured than the raw shell output.

## Disable the plugin

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set plugins.entries.tokenjuice.enabled false
```

Or:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins disable tokenjuice
```

## Related

* [Exec tool](/tools/exec)
* [Thinking levels](/tools/thinking)
* [Context engine](/concepts/context-engine)
