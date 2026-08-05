---
type: openclaw_doc
title: "WeCom"
source: "https://docs.openclaw.ai/channels/wecom"
source_hash: "1977e321b383ac01409c2f3dfb87bce49503483d4eb00b53e1ce65a34708c423"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "channels/wecom.md"
original_doc_path: "channels/wecom.md"
duplicate_index: 1
---

# WeCom
Source: https://docs.openclaw.ai/channels/wecom

OpenClaw exposes WeCom through the external
`@wecom/wecom-openclaw-plugin` package maintained by the Tencent WeCom team.
The plugin is listed in OpenClaw's official channel catalog but is not bundled
with the core install.

## Install

```bash
openclaw channels add --channel wecom
openclaw gateway restart
openclaw channels status --channel wecom
```

The OpenClaw catalog installs an exact version of
`@wecom/wecom-openclaw-plugin`.

## Configure

WeCom credentials, connection modes, callback routes, and access-control
behavior belong to the external plugin and can change independently of
OpenClaw. Follow the
[package documentation](https://www.npmjs.com/package/@wecom/wecom-openclaw-plugin)
for the installed release before configuring the channel.

When upgrading the plugin independently, keep using the documentation for the
installed version.

---
