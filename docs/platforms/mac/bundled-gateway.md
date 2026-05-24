---
type: openclaw_doc
title: "Gateway on macOS"
source: "https://docs.openclaw.ai/platforms/mac/bundled-gateway"
source_hash: "c96d635ef5069b57030f391139209f61ab6d9bc9376e5b9da31b01582a9027f2"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "platforms/mac/bundled-gateway.md"
original_doc_path: "platforms/mac/bundled-gateway.md"
duplicate_index: 1
---

# Gateway on macOS
Source: https://docs.openclaw.ai/platforms/mac/bundled-gateway

OpenClaw.app no longer bundles Node/Bun or the Gateway runtime. The macOS app
expects an **external** `openclaw` CLI install, does not spawn the Gateway as a
child process, and manages a per-user launchd service to keep the Gateway
running (or attaches to an existing local Gateway if one is already running).

## Install the CLI (required for local mode)

Node 24 is the default runtime on the Mac. Node 22 LTS, currently `22.19+`, still works for compatibility. Then install `openclaw` globally:

```bash
npm install -g openclaw@<version>
```

The macOS app's **Install CLI** button runs the same global install flow the app
uses internally: it prefers npm first, then pnpm, then bun if that is the only
detected package manager. Node remains the recommended Gateway runtime.

## Launchd (Gateway as LaunchAgent)

Label:

- `ai.openclaw.gateway` (or `ai.openclaw.<profile>`; legacy `com.openclaw.*` may remain)

Plist location (per-user):

- `~/Library/LaunchAgents/ai.openclaw.gateway.plist`
  (or `~/Library/LaunchAgents/ai.openclaw.<profile>.plist`)

Manager:

- The macOS app owns LaunchAgent install/update in Local mode.
- The CLI can also install it: `openclaw gateway install`.

Behavior:

- "OpenClaw Active" enables/disables the LaunchAgent.
- App quit does **not** stop the gateway (launchd keeps it alive).
- If a Gateway is already running on the configured port, the app attaches to
  it instead of starting a new one.

Logging:

- launchd stdout: `~/Library/Logs/openclaw/gateway.log` (profiles use `gateway-<profile>.log`)
- launchd stderr: suppressed

## Version compatibility

The macOS app checks the gateway version against its own version. If they're
incompatible, update the global CLI to match the app version.

## Smoke check

```bash
openclaw --version

OPENCLAW_SKIP_CHANNELS=1 \
OPENCLAW_SKIP_CANVAS_HOST=1 \
openclaw gateway --port 18999 --bind loopback
```

Then:

```bash
openclaw gateway call health --url ws://127.0.0.1:18999 --timeout 3000
```

## Related

- [macOS app](/platforms/macos)
- [Gateway runbook](/gateway)

---
