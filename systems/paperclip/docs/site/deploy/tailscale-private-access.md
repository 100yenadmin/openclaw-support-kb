---
type: paperclip_doc
title: "tailscale-private-access"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/deploy/tailscale-private-access.md"
source_hash: "8d2ed5e28def5b0d94d6eeaaca6c66908f8c5336fbc8ebaa451eb24b4a980771"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/deploy/tailscale-private-access.md"
original_doc_path: "docs/deploy/tailscale-private-access.md"
---

# tailscale-private-access

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/deploy/tailscale-private-access.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/deploy/tailscale-private-access.md

---
title: Tailscale Private Access
summary: Run Paperclip with Tailscale-friendly bind presets and connect from other devices
---

Use this when you want to access Paperclip over Tailscale (or a private LAN/VPN) instead of only `localhost`.

## 1. Start Paperclip in private authenticated mode

```sh
pnpm dev --bind tailnet
```

Recommended behavior:

- `PAPERCLIP_DEPLOYMENT_MODE=authenticated`
- `PAPERCLIP_DEPLOYMENT_EXPOSURE=private`
- `PAPERCLIP_BIND=tailnet`

If you want the old broad private-network behavior instead, use:

```sh
pnpm dev --bind lan
```

Legacy aliases still map to `authenticated/private + bind=lan`:

pnpm dev --authenticated-private
pnpm dev --tailscale-auth
```

## 2. Find your reachable Tailscale address

From the machine running Paperclip:

```sh
tailscale ip -4
```

You can also use your Tailscale MagicDNS hostname (for example `my-macbook.tailnet.ts.net`).

## 3. Open Paperclip from another device

Use the Tailscale IP or MagicDNS host with the Paperclip port:

```txt
http://<tailscale-host-or-ip>:3100
```

Example:

```txt
http://my-macbook.tailnet.ts.net:3100
```

## 4. Allow custom private hostnames when needed

If you access Paperclip with a custom private hostname, add it to the allowlist:

```sh
pnpm exec paperclipai allowed-hostname my-macbook.tailnet.ts.net
```

## 5. Verify the server is reachable

From a remote Tailscale-connected device:

```sh
curl http://<tailscale-host-or-ip>:3100/api/health
```

Expected result:

```json
{"status":"ok"}
```

## Troubleshooting

- Login or redirect errors on a private hostname: add it with `paperclipai allowed-hostname`.
- App only works on `localhost`: make sure you started with `--bind lan` or `--bind tailnet` instead of plain `pnpm dev`.
- Can connect locally but not remotely: verify both devices are on the same Tailscale network and port `3100` is reachable.
