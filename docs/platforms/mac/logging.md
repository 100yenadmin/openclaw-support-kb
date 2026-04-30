---
type: openclaw_doc
title: "macOS logging"
source: "https://docs.openclaw.ai/platforms/mac/logging"
source_hash: "aa96b433ec5302aa827f04dec98b82a61a23988b4f30544dcd4aded541adcb3e"
doc_path: "platforms/mac/logging.md"
original_doc_path: "platforms/mac/logging.md"
duplicate_index: 1
---

# macOS logging
Source: https://docs.openclaw.ai/platforms/mac/logging



# Logging (macOS)

## Rolling diagnostics file log (Debug pane)

OpenClaw routes macOS app logs through swift-log (unified logging by default) and can write a local, rotating file log to disk when you need a durable capture.

* Verbosity: **Debug pane → Logs → App logging → Verbosity**
* Enable: **Debug pane → Logs → App logging → “Write rolling diagnostics log (JSONL)”**
* Location: `~/Library/Logs/OpenClaw/diagnostics.jsonl` (rotates automatically; old files are suffixed with `.1`, `.2`, …)
* Clear: **Debug pane → Logs → App logging → “Clear”**

Notes:

* This is **off by default**. Enable only while actively debugging.
* Treat the file as sensitive; don’t share it without review.

## Unified logging private data on macOS

Unified logging redacts most payloads unless a subsystem opts into `privacy -off`. Per Peter's write-up on macOS [logging privacy shenanigans](https://steipete.me/posts/2025/logging-privacy-shenanigans) (2025) this is controlled by a plist in `/Library/Preferences/Logging/Subsystems/` keyed by the subsystem name. Only new log entries pick up the flag, so enable it before reproducing an issue.

## Enable for OpenClaw (`ai.openclaw`)

* Write the plist to a temp file first, then install it atomically as root:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
cat <<'EOF' >/tmp/ai.openclaw.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>DEFAULT-OPTIONS</key>
    <dict>
        <key>Enable-Private-Data</key>
        <true/>
    </dict>
</dict>
</plist>
EOF
sudo install -m 644 -o root -g wheel /tmp/ai.openclaw.plist /Library/Preferences/Logging/Subsystems/ai.openclaw.plist
```

* No reboot is required; logd notices the file quickly, but only new log lines will include private payloads.
* View the richer output with the existing helper, e.g. `./scripts/clawlog.sh --category WebChat --last 5m`.

## Disable after debugging

* Remove the override: `sudo rm /Library/Preferences/Logging/Subsystems/ai.openclaw.plist`.
* Optionally run `sudo log config --reload` to force logd to drop the override immediately.
* Remember this surface can include phone numbers and message bodies; keep the plist in place only while you actively need the extra detail.

## Related

* [macOS app](/platforms/macos)
* [Gateway logging](/gateway/logging)
