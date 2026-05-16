---
type: openclaw_doc
title: "Platforms"
source: "https://docs.openclaw.ai/platforms/index"
source_hash: "d85afeb19083de678266854bb06bc9a0f3c3b6e1ab17cc458fe2eebfa05ef153"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "platforms/index.md"
original_doc_path: "platforms/index.md"
duplicate_index: 1
---

# Platforms
Source: https://docs.openclaw.ai/platforms/index



OpenClaw core is written in TypeScript. **Node is the recommended runtime**.
Bun is not recommended for the Gateway — known issues with WhatsApp and
Telegram channels; see [Bun (experimental)](/install/bun) for details.

Companion apps exist for macOS (menu bar app) and mobile nodes (iOS/Android). Windows and
Linux companion apps are planned, but the Gateway is fully supported today.
Native companion apps for Windows are also planned; the Gateway is recommended via WSL2.

## Choose your OS

* macOS: [macOS](/platforms/macos)
* iOS: [iOS](/platforms/ios)
* Android: [Android](/platforms/android)
* Windows: [Windows](/platforms/windows)
* Linux: [Linux](/platforms/linux)

## VPS and hosting

* VPS hub: [VPS hosting](/vps)
* Fly.io: [Fly.io](/install/fly)
* Hetzner (Docker): [Hetzner](/install/hetzner)
* GCP (Compute Engine): [GCP](/install/gcp)
* Azure (Linux VM): [Azure](/install/azure)
* exe.dev (VM + HTTPS proxy): [exe.dev](/install/exe-dev)

## Common links

* Install guide: [Getting Started](/start/getting-started)
* Gateway runbook: [Gateway](/gateway)
* Gateway configuration: [Configuration](/gateway/configuration)
* Service status: `openclaw gateway status`

## Gateway service install (CLI)

Use one of these (all supported):

* Wizard (recommended): `openclaw onboard --install-daemon`
* Direct: `openclaw gateway install`
* Configure flow: `openclaw configure` → select **Gateway service**
* Repair/migrate: `openclaw doctor` (offers to install or fix the service)

The service target depends on OS:

* macOS: LaunchAgent (`ai.openclaw.gateway` or `ai.openclaw.<profile>`; legacy `com.openclaw.*`)
* Linux/WSL2: systemd user service (`openclaw-gateway[-<profile>].service`)
* Native Windows: Scheduled Task (`OpenClaw Gateway` or `OpenClaw Gateway (<profile>)`), with a per-user Startup-folder login item fallback if task creation is denied

## Related

* [Install overview](/install)
* [macOS app](/platforms/macos)
* [iOS app](/platforms/ios)
