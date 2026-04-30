---
type: openclaw_doc
title: "macOS dev setup"
source: "https://docs.openclaw.ai/platforms/mac/dev-setup"
source_hash: "f565b3cc61a9ef7faf99aae2d628adeec47cfadc6d447f5f011c205922d0dd56"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "platforms/mac/dev-setup.md"
original_doc_path: "platforms/mac/dev-setup.md"
duplicate_index: 1
---

# macOS dev setup
Source: https://docs.openclaw.ai/platforms/mac/dev-setup



# macOS developer setup

Build and run the OpenClaw macOS application from source.

## Prerequisites

Before building the app, ensure you have the following installed:

1. **Xcode 26.2+**: Required for Swift development.
2. **Node.js 24 & pnpm**: Recommended for the gateway, CLI, and packaging scripts. Node 22 LTS, currently `22.14+`, remains supported for compatibility.

## 1. Install Dependencies

Install the project-wide dependencies:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
pnpm install
```

## 2. Build and Package the App

To build the macOS app and package it into `dist/OpenClaw.app`, run:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
./scripts/package-mac-app.sh
```

If you don't have an Apple Developer ID certificate, the script will automatically use **ad-hoc signing** (`-`).

For dev run modes, signing flags, and Team ID troubleshooting, see the macOS app README:
[https://github.com/openclaw/openclaw/blob/main/apps/macos/README.md](https://github.com/openclaw/openclaw/blob/main/apps/macos/README.md)

> **Note**: Ad-hoc signed apps may trigger security prompts. If the app crashes immediately with "Abort trap 6", see the [Troubleshooting](#troubleshooting) section.

## 3. Install the CLI

The macOS app expects a global `openclaw` CLI install to manage background tasks.

**To install it (recommended):**

1. Open the OpenClaw app.
2. Go to the **General** settings tab.
3. Click **"Install CLI"**.

Alternatively, install it manually:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
npm install -g openclaw@<version>
```

`pnpm add -g openclaw@<version>` and `bun add -g openclaw@<version>` also work.
For the Gateway runtime, Node remains the recommended path.

## Troubleshooting

### Build fails: toolchain or SDK mismatch

The macOS app build expects the latest macOS SDK and Swift 6.2 toolchain.

**System dependencies (required):**

* **Latest macOS version available in Software Update** (required by Xcode 26.2 SDKs)
* **Xcode 26.2** (Swift 6.2 toolchain)

**Checks:**

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
xcodebuild -version
xcrun swift --version
```

If versions don’t match, update macOS/Xcode and re-run the build.

### App crashes on permission grant

If the app crashes when you try to allow **Speech Recognition** or **Microphone** access, it may be due to a corrupted TCC cache or signature mismatch.

**Fix:**

1. Reset the TCC permissions:

   ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
   tccutil reset All ai.openclaw.mac.debug
   ```

2. If that fails, change the `BUNDLE_ID` temporarily in [`scripts/package-mac-app.sh`](https://github.com/openclaw/openclaw/blob/main/scripts/package-mac-app.sh) to force a "clean slate" from macOS.

### Gateway "Starting..." indefinitely

If the gateway status stays on "Starting...", check if a zombie process is holding the port:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw gateway status
openclaw gateway stop

# If you're not using a LaunchAgent (dev mode / manual runs), find the listener:
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

If a manual run is holding the port, stop that process (Ctrl+C). As a last resort, kill the PID you found above.

## Related

* [macOS app](/platforms/macos)
* [Install overview](/install)
