---
type: openclaw_doc
title: "WeChat"
source: "https://docs.openclaw.ai/channels/wechat"
source_hash: "92d3c6a3e91c78a6eabc85ea4f1f06e2a13bb324d75b74384fd7b4211e95849e"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "channels/wechat.md"
original_doc_path: "channels/wechat.md"
duplicate_index: 1
---

# WeChat
Source: https://docs.openclaw.ai/channels/wechat



OpenClaw connects to WeChat through Tencent's external
`@tencent-weixin/openclaw-weixin` channel plugin.

Status: external plugin. Direct chats and media are supported. Group chats are not
advertised by the current plugin capability metadata.

## Naming

* **WeChat** is the user-facing name in these docs.
* **Weixin** is the name used by Tencent's package and by the plugin id.
* `openclaw-weixin` is the OpenClaw channel id.
* `@tencent-weixin/openclaw-weixin` is the npm package.

Use `openclaw-weixin` in CLI commands and config paths.

## How it works

The WeChat code does not live in the OpenClaw core repo. OpenClaw provides the
generic channel plugin contract, and the external plugin provides the
WeChat-specific runtime:

1. `openclaw plugins install` installs `@tencent-weixin/openclaw-weixin`.
2. The Gateway discovers the plugin manifest and loads the plugin entrypoint.
3. The plugin registers channel id `openclaw-weixin`.
4. `openclaw channels login --channel openclaw-weixin` starts QR login.
5. The plugin stores account credentials under the OpenClaw state directory.
6. When the Gateway starts, the plugin starts its Weixin monitor for each
   configured account.
7. Inbound WeChat messages are normalized through the channel contract, routed to
   the selected OpenClaw agent, and sent back through the plugin outbound path.

That separation matters: OpenClaw core should stay channel-agnostic. WeChat login,
Tencent iLink API calls, media upload/download, context tokens, and account
monitoring are owned by the external plugin.

## Install

Quick install:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
npx -y @tencent-weixin/openclaw-weixin-cli install
```

Manual install:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins install "@tencent-weixin/openclaw-weixin"
openclaw config set plugins.entries.openclaw-weixin.enabled true
```

Restart the Gateway after install:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw gateway restart
```

## Login

Run QR login on the same machine that runs the Gateway:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw channels login --channel openclaw-weixin
```

Scan the QR code with WeChat on your phone and confirm the login. The plugin saves
the account token locally after a successful scan.

To add another WeChat account, run the same login command again. For multiple
accounts, isolate direct-message sessions by account, channel, and sender:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set session.dmScope per-account-channel-peer
```

## Access control

Direct messages use the normal OpenClaw pairing and allowlist model for channel
plugins.

Approve new senders:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw pairing list openclaw-weixin
openclaw pairing approve openclaw-weixin <CODE>
```

For the full access-control model, see [Pairing](/channels/pairing).

## Compatibility

The plugin checks the host OpenClaw version at startup.

| Plugin line | OpenClaw version        | npm tag  |
| ----------- | ----------------------- | -------- |
| `2.x`       | `>=2026.3.22`           | `latest` |
| `1.x`       | `>=2026.1.0 <2026.3.22` | `legacy` |

If the plugin reports that your OpenClaw version is too old, either update
OpenClaw or install the legacy plugin line:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins install @tencent-weixin/openclaw-weixin@legacy
```

## Sidecar process

The WeChat plugin can run helper work beside the Gateway while it monitors the
Tencent iLink API. In issue #68451, that helper path exposed a bug in OpenClaw's
generic stale-Gateway cleanup: a child process could try to clean up the parent
Gateway process, causing restart loops under process managers such as systemd.

Current OpenClaw startup cleanup excludes the current process and its ancestors,
so a channel helper must not kill the Gateway that launched it. This fix is
generic; it is not a WeChat-specific path in core.

## Troubleshooting

Check install and status:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw plugins list
openclaw channels status --probe
openclaw --version
```

If the channel shows as installed but does not connect, confirm that the plugin is
enabled and restart:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set plugins.entries.openclaw-weixin.enabled true
openclaw gateway restart
```

If the Gateway restarts repeatedly after enabling WeChat, update both OpenClaw and
the plugin:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
npm view @tencent-weixin/openclaw-weixin version
openclaw plugins install "@tencent-weixin/openclaw-weixin" --force
openclaw gateway restart
```

Temporary disable:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set plugins.entries.openclaw-weixin.enabled false
openclaw gateway restart
```

## Related docs

* Channel overview: [Chat Channels](/channels)
* Pairing: [Pairing](/channels/pairing)
* Channel routing: [Channel Routing](/channels/channel-routing)
* Plugin architecture: [Plugin Architecture](/plugins/architecture)
* Channel plugin SDK: [Channel Plugin SDK](/plugins/sdk-channel-plugins)
* External package: [@tencent-weixin/openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin)
