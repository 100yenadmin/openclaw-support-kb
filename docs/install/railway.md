---
type: openclaw_doc
title: "Railway"
source: "https://docs.openclaw.ai/install/railway"
source_hash: "706f8079eb21460e43f5278fe7b83328bcad64d75ecc6b0b5d62aae39f4ba197"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/railway.md"
original_doc_path: "install/railway.md"
duplicate_index: 1
---

# Railway
Source: https://docs.openclaw.ai/install/railway

Deploy OpenClaw on Railway with a one-click template and access it through the web Control UI. This is the easiest "no terminal on the server" path: Railway runs the Gateway for you.

## One-click deploy

<a href="https://railway.com/deploy/clawdbot-railway-template" target="_blank" rel="noreferrer">
  Deploy on Railway
</a>

Steps


Deploy the template

    Click **Deploy on Railway** above.


Add a volume

  Attach a volume mounted at `/data` (required for persistent state).


Set variables

    Set the required **Variables** on the service:

    - `OPENCLAW_GATEWAY_PORT=8080` (required -- must match the port in Public Networking)
    - `OPENCLAW_GATEWAY_TOKEN` (required; treat as an admin secret)
    - `OPENCLAW_STATE_DIR=/data/.openclaw` (required for persistent state)
    - `OPENCLAW_WORKSPACE_DIR=/data/workspace` (required for a persistent workspace)



Enable public networking

  Under **Public Networking**, enable **HTTP Proxy** for the service on port `8080`.


Connect

    Find your public URL in **Railway -> your service -> Settings -> Domains** -- either a generated domain (often `https://<something>.up.railway.app`) or your attached custom domain.

    Open `https://<your-railway-domain>/openclaw` and connect using the configured shared secret. The template uses `OPENCLAW_GATEWAY_TOKEN` by default; if you replace it with password auth, use that password instead.



From the Railway shell, run the read-only deployment preflight:

```bash
openclaw doctor --json
```

## What you get

- Hosted OpenClaw Gateway + Control UI
- Persistent storage via the Railway Volume (`/data`), so `openclaw.json`, per-agent `auth-profiles.json`, channel/provider state, sessions, and workspace survive redeploys

## Connect a channel

Use the Control UI at `/openclaw` or run `openclaw onboard` via Railway's shell for channel setup instructions:

- [Discord](/channels/discord)
- [Telegram](/channels/telegram) (fastest -- just a bot token)
- [All channels](/channels)

## Backups and migration

Export your state, config, auth profiles, and workspace:

```bash
openclaw backup create
openclaw backup restore <archive.tar.gz> --target <fresh-directory>
```

Restore verifies and extracts into a fresh staging directory; activation is a
separate offline step. See [Restore a full archive](/install/backups#restore-a-full-archive)
for the rollback warnings and activation sequence.

## Next steps

- Set up messaging channels: [Channels](/channels)
- Configure the Gateway: [Gateway configuration](/gateway/configuration)
- Keep OpenClaw up to date: [Updating](/install/updating)

---
