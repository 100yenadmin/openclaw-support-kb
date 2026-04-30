---
type: openclaw_doc
title: "Peekaboo bridge"
source: "https://docs.openclaw.ai/platforms/mac/peekaboo"
source_hash: "e7a69410c87a5c631e1e06eb3e66baf42c8b56c6a1c0051f9dab64d1a0f6d186"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "platforms/mac/peekaboo.md"
original_doc_path: "platforms/mac/peekaboo.md"
duplicate_index: 1
---

# Peekaboo bridge
Source: https://docs.openclaw.ai/platforms/mac/peekaboo



OpenClaw can host **PeekabooBridge** as a local, permission‑aware UI automation
broker. This lets the `peekaboo` CLI drive UI automation while reusing the
macOS app’s TCC permissions.

## What this is (and is not)

* **Host**: OpenClaw\.app can act as a PeekabooBridge host.
* **Client**: use the `peekaboo` CLI (no separate `openclaw ui ...` surface).
* **UI**: visual overlays stay in Peekaboo.app; OpenClaw is a thin broker host.

## Relationship to Computer Use

OpenClaw has three desktop-control paths, and they intentionally stay separate:

* **PeekabooBridge host**: OpenClaw\.app can host the local PeekabooBridge socket.
  The `peekaboo` CLI remains the client and uses OpenClaw\.app's macOS
  permissions for Peekaboo automation primitives such as screenshots, clicks,
  menus, dialogs, Dock actions, and window management.
* **Codex Computer Use**: the bundled `codex` plugin prepares Codex app-server,
  verifies that Codex's `computer-use` MCP server is available, and then lets
  Codex own native desktop-control tool calls during Codex-mode turns. OpenClaw
  does not proxy those actions through PeekabooBridge.
* **Direct `cua-driver` MCP**: OpenClaw can register TryCua's upstream
  `cua-driver mcp` server as a normal MCP server. That gives agents the CUA
  driver's own schemas and pid/window/element-index workflow without routing
  through the Codex marketplace or the PeekabooBridge socket.

Use Peekaboo when you want the broad macOS automation surface and OpenClaw\.app's
permission-aware bridge host. Use Codex Computer Use when a Codex-mode agent
should rely on Codex's native computer-use plugin. Use direct `cua-driver mcp`
when you want the CUA driver exposed to any OpenClaw-managed runtime as a normal
MCP server.

## Enable the bridge

In the macOS app:

* Settings → **Enable Peekaboo Bridge**

When enabled, OpenClaw starts a local UNIX socket server. If disabled, the host
is stopped and `peekaboo` will fall back to other available hosts.

## Client discovery order

Peekaboo clients typically try hosts in this order:

1. Peekaboo.app (full UX)
2. Claude.app (if installed)
3. OpenClaw\.app (thin broker)

Use `peekaboo bridge status --verbose` to see which host is active and which
socket path is in use. You can override with:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
export PEEKABOO_BRIDGE_SOCKET=/path/to/bridge.sock
```

## Security & permissions

* The bridge validates **caller code signatures**; an allowlist of TeamIDs is
  enforced (Peekaboo host TeamID + OpenClaw app TeamID).
* Requests time out after \~10 seconds.
* If required permissions are missing, the bridge returns a clear error message
  rather than launching System Settings.

## Snapshot behavior (automation)

Snapshots are stored in memory and expire automatically after a short window.
If you need longer retention, re‑capture from the client.

## Troubleshooting

* If `peekaboo` reports “bridge client is not authorized”, ensure the client is
  properly signed or run the host with `PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1`
  in **debug** mode only.
* If no hosts are found, open one of the host apps (Peekaboo.app or OpenClaw\.app)
  and confirm permissions are granted.

## Related

* [macOS app](/platforms/macos)
* [macOS permissions](/platforms/mac/permissions)
