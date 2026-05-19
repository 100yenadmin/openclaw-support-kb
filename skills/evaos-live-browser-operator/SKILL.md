---
name: evaos-live-browser-operator
description: Use for evaOS Live Browser, KasmVNC, VNC, visible Chromium, CDP, screenshots, authenticated browser handoff, Arbostar UI, WPForms production lead tests, or browser-based customer tool operation.
---

# evaOS Live Browser Operator

## Purpose

Use the visible evaOS Live Browser when an agent needs to work in the same
browser a human can watch. KasmVNC is for human viewing, login handoff, rescue,
and visual verification. Agent actions should use localhost-only CDP,
Playwright/OpenClaw browser tools, or `evaos-browser-control` so the same
visible Chromium session stays controllable and inspectable.

## First Checks

Run read-only status before interacting with production systems:

```bash
evaos-live-browser status
evaos-browser-control status --json
systemctl is-active evaos-live-browser evaos-proxy openclaw-gateway || true
```

If CDP is not reachable, start the browser and re-check:

```bash
evaos-live-browser start
evaos-browser-control status --json
```

CDP must stay local to the VM:

```bash
evaos-browser-control cdp-url
# Expected: http://127.0.0.1:9223
```

Never expose `127.0.0.1:9223` through a public proxy, tunnel, dashboard route,
or user-facing URL.

## Normal Operation

Open or attach to the visible browser:

```bash
evaos-browser-control open-url "https://example.com"
evaos-browser-control pages --json
```

Capture evidence into the customer artifact area:

```bash
run_id="browser-evidence-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "/root/agent-files/downloads/browser-runs/${run_id}"
evaos-browser-control screenshot \
  --out "/root/agent-files/downloads/browser-runs/${run_id}/screenshot.png"
```

Use VNC only when the human needs to watch, complete a login, or rescue a UI
state. Do not ask for credentials in chat. Ask the human to log in through the
Live Browser tab, then resume with CDP/browser tools after they confirm.

When finished, stop the visible browser cleanly and verify the controller status.
Artifacts remain under `/root/agent-files/downloads/browser-runs` after the
session stops.

```bash
evaos-live-browser stop
evaos-live-browser status
```

## Production Safety

Arbostar, WPForms, and other customer production systems are read-only by
default. Exact same-turn human approval is required before any action that
submits, creates, updates, assigns, approves, deletes, dispatches, exports, or
sends an external message.

For a production form or CRM test, get all of this before submitting:

- explicit approval text for exactly one submission or mutation;
- who has been warned not to treat the test as a real lead/task;
- the exact test name, phone, email, address, and note values;
- whether to stop before submit or submit once.

Without that approval, inspect fields, capture screenshots, and report the
pending action instead of clicking the final submit/save/approve button.

## Evidence Report

Every browser operation report should include:

- customer and target app;
- URL or route, redacted if it contains secrets;
- whether the browser was already logged in or needed human handoff;
- screenshot/artifact path under `/root/agent-files/downloads/browser-runs`;
- read-only actions taken;
- exact approval text if a mutation was performed;
- record IDs or confirmation text observed;
- blockers such as login required, VNC closed, CDP unreachable, or site error.

## Troubleshooting

```bash
evaos-browser-control diagnose
evaos-browser-control logs
journalctl -u evaos-live-browser -u evaos-proxy --since '-30 min' --no-pager
```

If the browser is wedged:

```bash
evaos-browser-control reset-profile
evaos-live-browser start
```

Resetting the profile clears the transient browser session. Use it only when
the browser is stuck, logged into the wrong customer context, or explicitly
being prepared for a clean handoff.
