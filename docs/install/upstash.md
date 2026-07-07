---
type: openclaw_doc
title: "Upstash Box"
source: "https://docs.openclaw.ai/install/upstash"
source_hash: "bf009195b9606668b5f071fee293511c56de8288ad955c0059de0da62b7c55af"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/upstash.md"
original_doc_path: "install/upstash.md"
duplicate_index: 1
---

# Upstash Box
Source: https://docs.openclaw.ai/install/upstash

Run a persistent OpenClaw Gateway on Upstash Box, a managed Linux environment
with keep-alive lifecycle support.

Use an SSH tunnel for dashboard access. Do not expose the Gateway port directly
to the public internet.

## Prerequisites

- Upstash account
- Keep-alive Upstash Box
- SSH client on your local machine

## Create a Box

Create a keep-alive Box in the Upstash Console. Note the Box ID (for example
`right-flamingo-14486`) and your Box API key.

Upstash maintains its current OpenClaw Box walkthrough at
[OpenClaw Setup](https://upstash.com/docs/box/guides/openclaw-setup).

## Connect with an SSH tunnel

Forward the OpenClaw dashboard port to your local machine. Use your Box API key
as the SSH password when prompted:

```bash
ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -L 18789:127.0.0.1:18789 <box-id>@us-east-1.box.upstash.com
```

The keepalive options reduce idle tunnel drops during onboarding.

## Install OpenClaw

Inside the Box:

```bash
sudo npm install -g openclaw
```

## Run onboarding

```bash
openclaw onboard --install-daemon
```

Follow the prompts. Copy the dashboard URL and token when onboarding finishes.

## Start the Gateway

Configure the Gateway for the Box network and start it in the background:

```bash
openclaw config set gateway.bind lan
nohup openclaw gateway > gateway.log 2>&1 &
```

With the SSH tunnel active, open the dashboard URL locally:

```text
http://127.0.0.1:18789/#token=<your-token>
```

## Auto-restart

Set this command as the Box init script so the Gateway restarts when the Box
starts:

```bash
nohup openclaw gateway > gateway.log 2>&1 &
```

## Troubleshooting

If SSH freezes during onboarding, reconnect with a clean SSH config and
keepalives:

```bash
ssh -F /dev/null -o ControlMaster=no -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -L 18789:127.0.0.1:18789 <box-id>@us-east-1.box.upstash.com
```

This bypasses stale local `~/.ssh/config` settings and keeps the tunnel active
through idle network periods.

## Related

- [Remote access](/gateway/remote)
- [Gateway security](/gateway/security)
- [Updating OpenClaw](/install/updating)

---
