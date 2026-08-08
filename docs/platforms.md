---
type: openclaw_doc
title: "Platforms"
source: "https://docs.openclaw.ai/platforms"
source_hash: "7ae916a0d4f6b1a6d46c08943d28c951ca5eb6109002df89a82a1faf3009efcf"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "platforms.md"
original_doc_path: "platforms.md"
duplicate_index: 1
---

# Platforms
Source: https://docs.openclaw.ai/platforms

OpenClaw core is written in TypeScript. **Node is the required runtime** because
the canonical state store uses `node:sqlite`. Bun remains available for
dependency installation and package scripts; see [Bun](/install/bun).

Companion apps exist for Windows Hub, macOS (menu bar app), and mobile nodes
(iOS/Android). Linux companion apps are planned, but the Gateway is fully
supported today. On Windows, choose Windows Hub for the desktop app, native
PowerShell install for terminal-first use, or WSL2 for the most
Linux-compatible Gateway runtime.

## Choose your OS

- Android: [Android](/platforms/android)
- ChromeOS: [ChromeOS (Crostini)](/platforms/chromeos)
- iOS: [iOS](/platforms/ios)
- Linux: [Linux](/platforms/linux)
- macOS: [macOS](/platforms/macos)
- Windows: [Windows](/platforms/windows)

## VPS and hosting

- VPS hub: [VPS hosting](/vps)
- Azure (Linux VM): [Azure](/install/azure)
- Daytona (cloud sandbox): [Daytona](/install/daytona)
- EasyRunner (Podman + Caddy): [EasyRunner](/platforms/easyrunner)
- exe.dev (VM + HTTPS proxy): [exe.dev](/install/exe-dev)
- Fly.io: [Fly.io](/install/fly)
- GCP (Compute Engine): [GCP](/install/gcp)
- Hetzner (Docker): [Hetzner](/install/hetzner)

## Common links

- Install guide: [Getting Started](/start/getting-started)
- Windows Hub: [Windows](/platforms/windows)
- Gateway runbook: [Gateway](/gateway)
- Gateway configuration: [Configuration](/gateway/configuration)
- Service status: `openclaw gateway status`

## Gateway service install (CLI)

Use one of these (all supported):

- Wizard (recommended): `openclaw onboard --install-daemon`
- Direct: `openclaw gateway install`
- Configure flow: `openclaw configure` → select **Gateway service**
- Repair/migrate: `openclaw doctor` (offers to install or fix the service)

The service target depends on OS:

- macOS: LaunchAgent (`ai.openclaw.gateway`, or `ai.openclaw.<profile>` for a named profile)
- Linux/WSL2: systemd user service (`openclaw-gateway[-<profile>].service`)
- Native Windows: Scheduled Task (`OpenClaw Gateway` or `OpenClaw Gateway (<profile>)`), with a per-user Startup-folder login item fallback if task creation is denied

## Related

- [Install overview](/install)
- [Windows Hub](/platforms/windows)
- [macOS app](/platforms/macos)
- [iOS app](/platforms/ios)

---
