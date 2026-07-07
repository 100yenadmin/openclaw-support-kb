---
type: openclaw_doc
title: "Railway"
source: "https://docs.openclaw.ai/install/railway"
source_hash: "0f7f4a6effc96781fe34880af6dd66ffaf48b9eee2971f5b7ec339ea6f31ec33"
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
    - `OPENCLAW_STATE_DIR=/data/.openclaw` (recommended)
    - `OPENCLAW_WORKSPACE_DIR=/data/workspace` (recommended)



Enable public networking

  Under **Public Networking**, enable **HTTP Proxy** for the service on port `8080`.


Connect

    Find your public URL in **Railway -> your service -> Settings -> Domains** -- either a generated domain (often `https://<something>.up.railway.app`) or your attached custom domain.

    Open `https://<your-railway-domain>/openclaw` and connect using the configured shared secret. The template uses `OPENCLAW_GATEWAY_TOKEN` by default; if you replace it with password auth, use that password instead.



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
```

This creates a portable backup archive with OpenClaw state plus any configured workspace. See [Backup](/cli/backup) for details.

## Next steps

- Set up messaging channels: [Channels](/channels)
- Configure the Gateway: [Gateway configuration](/gateway/configuration)
- Keep OpenClaw up to date: [Updating](/install/updating)

---
