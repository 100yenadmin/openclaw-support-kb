---
type: openclaw_doc
title: "Health checks (macOS)"
source: "https://docs.openclaw.ai/platforms/mac/health"
source_hash: "942e432e54626f93ad127bc3d732ac4bf1c7bdd62e2a9c299a50f614ebb343c0"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "platforms/mac/health.md"
original_doc_path: "platforms/mac/health.md"
duplicate_index: 1
---

# Health checks (macOS)
Source: https://docs.openclaw.ai/platforms/mac/health



# Health Checks on macOS

How to see whether the linked channel is healthy from the menu bar app.

## Menu bar

* Status dot now reflects Baileys health:
  * Green: linked + socket opened recently.
  * Orange: connecting/retrying.
  * Red: logged out or probe failed.
* Secondary line reads "linked · auth 12m" or shows the failure reason.
* "Run Health Check" menu item triggers an on-demand probe.

## Settings

* General tab gains a Health card showing: linked auth age, session-store path/count, last check time, last error/status code, and buttons for Run Health Check / Reveal Logs.
* Uses a cached snapshot so the UI loads instantly and falls back gracefully when offline.
* **Channels tab** surfaces channel status + controls for WhatsApp/Telegram (login QR, logout, probe, last disconnect/error).

## How the probe works

* App runs `openclaw health --json` via `ShellExecutor` every \~60s and on demand. The probe loads creds and reports status without sending messages.
* Cache the last good snapshot and the last error separately to avoid flicker; show the timestamp of each.

## When in doubt

* You can still use the CLI flow in [Gateway health](/gateway/health) (`openclaw status`, `openclaw status --deep`, `openclaw health --json`) and tail `/tmp/openclaw/openclaw-*.log` for `web-heartbeat` / `web-reconnect`.

## Related

* [Gateway health](/gateway/health)
* [macOS app](/platforms/macos)
