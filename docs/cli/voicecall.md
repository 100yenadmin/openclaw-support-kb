---
type: openclaw_doc
title: "Voicecall"
source: "https://docs.openclaw.ai/cli/voicecall"
source_hash: "61bc57af210c1ec4183a280bc89569e3199b143864346336e03b8cb337708d14"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "cli/voicecall.md"
original_doc_path: "cli/voicecall.md"
duplicate_index: 1
---

# Voicecall
Source: https://docs.openclaw.ai/cli/voicecall



# `openclaw voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

* Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw voicecall setup
openclaw voicecall smoke
openclaw voicecall status --call-id <id>
openclaw voicecall call --to "+15555550123" --message "Hello" --mode notify
openclaw voicecall continue --call-id <id> --message "Any questions?"
openclaw voicecall dtmf --call-id <id> --digits "ww123456#"
openclaw voicecall end --call-id <id>
```

`setup` prints human-readable readiness checks by default. Use `--json` for
scripts:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw voicecall setup --json
```

For external providers (`twilio`, `telnyx`, `plivo`), setup must resolve a public
webhook URL from `publicUrl`, a tunnel, or Tailscale exposure. A loopback/private
serve fallback is rejected because carriers cannot reach it.

`smoke` runs the same readiness checks. It will not place a real phone call
unless both `--to` and `--yes` are present:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw voicecall smoke --to "+15555550123"        # dry run
openclaw voicecall smoke --to "+15555550123" --yes  # live notify call
```

## Exposing webhooks (Tailscale)

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw voicecall expose --mode serve
openclaw voicecall expose --mode funnel
openclaw voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.

## Related

* [CLI reference](/cli)
* [Voice call plugin](/plugins/voice-call)
