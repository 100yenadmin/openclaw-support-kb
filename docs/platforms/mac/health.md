---
type: openclaw_doc
title: "Health checks (macOS)"
source: "https://docs.openclaw.ai/platforms/mac/health"
source_hash: "09c80f1c2269819fc15f47d04e05d4cb9358dd6cbca0dacdec7b6910e0356c72"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "platforms/mac/health.md"
original_doc_path: "platforms/mac/health.md"
duplicate_index: 1
---

# Health checks (macOS)
Source: https://docs.openclaw.ai/platforms/mac/health

# Health checks on macOS

How to read the linked-channel health state from the menu bar app.

## Menu bar

Status dot:

- Green: linked + probe healthy.
- Orange: linked but a channel probe reports degraded/not connected.
- Red: not linked yet.

The secondary line reads "linked · auth 12m" or shows the failure reason.
"Run Health Check Now" in the menu triggers an on-demand probe.

## Settings

- General tab shows a Health card: status dot, summary line (link state +
  auth age), and an optional failure detail line, with **Retry now** and
  **Open logs** buttons.
- **Channels tab** surfaces per-channel status and controls (login QR,
  logout, probe, last disconnect/error) for WhatsApp and Telegram.

## How the probe works

The app calls the Gateway's `health` RPC over its existing WebSocket
connection (not a CLI shell-out) every ~60s and on demand. The RPC loads
creds and reports status without sending messages. The app caches the last
good snapshot and the last error separately so the UI loads instantly and
does not flicker while offline.

## When in doubt

Use the CLI flow in [Gateway health](/gateway/health) (`openclaw status`,
`openclaw status --deep`, `openclaw health --json`) and tail
`/tmp/openclaw/openclaw-*.log`, filtering for `web-heartbeat` / `web-reconnect`.

## Related

- [Gateway health](/gateway/health)
- [macOS app](/platforms/macos)

---
