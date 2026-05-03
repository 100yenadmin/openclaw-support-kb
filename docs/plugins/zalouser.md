---
type: openclaw_doc
title: "Zalo personal plugin"
source: "https://docs.openclaw.ai/plugins/zalouser"
source_hash: "f644352eec5b5438a685bac9c3943f355fedf1b9dfe2eca7c7a318876d31fcb8"
doc_path: "plugins/zalouser.md"
original_doc_path: "plugins/zalouser.md"
duplicate_index: 1
---

# Zalo personal plugin
Source: https://docs.openclaw.ai/plugins/zalouser



# Zalo Personal (plugin)

Zalo Personal support for OpenClaw via a plugin, using native `zca-js` to automate a normal Zalo user account.

<Warning>
  Unofficial automation may lead to account suspension or ban. Use at your own risk.
</Warning>

## Naming

Channel id is `zalouser` to make it explicit this automates a **personal Zalo user account** (unofficial). We keep `zalo` reserved for a potential future official Zalo API integration.

## Where it runs

This plugin runs **inside the Gateway process**.

If you use a remote Gateway, install/configure it on the **machine running the Gateway**, then restart the Gateway.

No external `zca`/`openzca` CLI binary is required.

## Install

### Option A: install from npm

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins install @openclaw/zalouser
```

Use the bare package to follow the current official release tag. Pin an exact
version only when you need a reproducible install.

Restart the Gateway afterwards.

### Option B: install from a local folder (dev)

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
PLUGIN_SRC=./path/to/local/zalouser-plugin
openclaw plugins install "$PLUGIN_SRC"
cd "$PLUGIN_SRC" && pnpm install
```

Restart the Gateway afterwards.

## Config

Channel config lives under `channels.zalouser` (not `plugins.entries.*`):

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  channels: {
    zalouser: {
      enabled: true,
      dmPolicy: "pairing",
    },
  },
}
```

## CLI

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw channels login --channel zalouser
openclaw channels logout --channel zalouser
openclaw channels status --probe
openclaw message send --channel zalouser --target <threadId> --message "Hello from OpenClaw"
openclaw directory peers list --channel zalouser --query "name"
```

## Agent tool

Tool name: `zalouser`

Actions: `send`, `image`, `link`, `friends`, `groups`, `me`, `status`

Channel message actions also support `react` for message reactions.

## Related

* [Building plugins](/plugins/building-plugins)
* [Community plugins](/plugins/community)
