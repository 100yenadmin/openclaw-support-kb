---
type: openclaw_doc
title: "Remote gateway setup"
source: "https://docs.openclaw.ai/gateway/remote-gateway-readme"
source_hash: "37baa7a5e7c574340d05fc154913a8cfa9efd8b26a78ea85cd64a111bf8bd689"
generated_at: "2026-04-30T12:26:35.225Z"
doc_path: "gateway/remote-gateway-readme.md"
original_doc_path: "gateway/remote-gateway-readme.md"
duplicate_index: 1
---

# Remote gateway setup
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme



> This content has been merged into [Remote Access](/gateway/remote#macos-persistent-ssh-tunnel-via-launchagent). See that page for the current guide.

# Running OpenClaw\.app with a Remote Gateway

OpenClaw\.app uses SSH tunneling to connect to a remote gateway. This guide shows you how to set it up.

## Overview

```mermaid theme={"theme":{"light":"min-light","dark":"min-dark"}}
flowchart TB
    subgraph Client["Client Machine"]
        direction TB
        A["OpenClaw.app"]
        B["ws://127.0.0.1:18789\n(local port)"]
        T["SSH Tunnel"]

        A --> B
        B --> T
    end
    subgraph Remote["Remote Machine"]
        direction TB
        C["Gateway WebSocket"]
        D["ws://127.0.0.1:18789"]

        C --> D
    end
    T --> C
```

## Quick setup

### Step 1: Add SSH Config

Edit `~/.ssh/config` and add:

```ssh theme={"theme":{"light":"min-light","dark":"min-dark"}}
Host remote-gateway
    HostName <REMOTE_IP>          # e.g., 172.27.187.184
    User <REMOTE_USER>            # e.g., jefferson
    LocalForward 18789 127.0.0.1:18789
    IdentityFile ~/.ssh/id_rsa
```

Replace `<REMOTE_IP>` and `<REMOTE_USER>` with your values.

### Step 2: Copy SSH Key

Copy your public key to the remote machine (enter password once):

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
ssh-copy-id -i ~/.ssh/id_rsa <REMOTE_USER>@<REMOTE_IP>
```

### Step 3: Configure Remote Gateway Auth

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set gateway.remote.token "<your-token>"
```

Use `gateway.remote.password` instead if your remote gateway uses password auth.
`OPENCLAW_GATEWAY_TOKEN` is still valid as a shell-level override, but the durable
remote-client setup is `gateway.remote.token` / `gateway.remote.password`.

### Step 4: Start SSH Tunnel

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
ssh -N remote-gateway &
```

### Step 5: Restart OpenClaw\.app

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Quit OpenClaw.app (⌘Q), then reopen:
open /path/to/OpenClaw.app
```

The app will now connect to the remote gateway through the SSH tunnel.

***

## Auto-Start Tunnel on Login

To have the SSH tunnel start automatically when you log in, create a Launch Agent.

### Create the PLIST file

Save this as `~/Library/LaunchAgents/ai.openclaw.ssh-tunnel.plist`:

```xml theme={"theme":{"light":"min-light","dark":"min-dark"}}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.openclaw.ssh-tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/ssh</string>
        <string>-N</string>
        <string>remote-gateway</string>
    </array>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

### Load the Launch Agent

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.ssh-tunnel.plist
```

The tunnel will now:

* Start automatically when you log in
* Restart if it crashes
* Keep running in the background

Legacy note: remove any leftover `com.openclaw.ssh-tunnel` LaunchAgent if present.

***

## Troubleshooting

**Check if tunnel is running:**

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
ps aux | grep "ssh -N remote-gateway" | grep -v grep
lsof -i :18789
```

**Restart the tunnel:**

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
launchctl kickstart -k gui/$UID/ai.openclaw.ssh-tunnel
```

**Stop the tunnel:**

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
launchctl bootout gui/$UID/ai.openclaw.ssh-tunnel
```

***

## How it works

| Component                            | What It Does                                                 |
| ------------------------------------ | ------------------------------------------------------------ |
| `LocalForward 18789 127.0.0.1:18789` | Forwards local port 18789 to remote port 18789               |
| `ssh -N`                             | SSH without executing remote commands (just port forwarding) |
| `KeepAlive`                          | Automatically restarts tunnel if it crashes                  |
| `RunAtLoad`                          | Starts tunnel when the agent loads                           |

OpenClaw\.app connects to `ws://127.0.0.1:18789` on your client machine. The SSH tunnel forwards that connection to port 18789 on the remote machine where the Gateway is running.

## Related

* [Remote access](/gateway/remote)
* [Tailscale](/gateway/tailscale)
