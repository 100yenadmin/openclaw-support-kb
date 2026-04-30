---
type: openclaw_doc
title: "Northflank"
source: "https://docs.openclaw.ai/install/northflank"
source_hash: "6689f483695e3ffd3e33764e61b3b00d18f9bf7cea90905d6e713598093b7fbd"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "install/northflank.md"
original_doc_path: "install/northflank.md"
duplicate_index: 1
---

# Northflank
Source: https://docs.openclaw.ai/install/northflank



# Northflank

Deploy OpenClaw on Northflank with a one-click template and access it through the web Control UI.
This is the easiest "no terminal on the server" path: Northflank runs the Gateway for you.

## How to get started

1. Click [Deploy OpenClaw](https://northflank.com/stacks/deploy-openclaw) to open the template.
2. Create an [account on Northflank](https://app.northflank.com/signup) if you don't already have one.
3. Click **Deploy OpenClaw now**.
4. Set the required environment variable: `OPENCLAW_GATEWAY_TOKEN` (use a strong random value).
5. Click **Deploy stack** to build and run the OpenClaw template.
6. Wait for the deployment to complete, then click **View resources**.
7. Open the OpenClaw service.
8. Open the public OpenClaw URL at `/openclaw` and connect using the configured shared secret. This template uses `OPENCLAW_GATEWAY_TOKEN` by default; if you replace it with password auth, use that password instead.

## What you get

* Hosted OpenClaw Gateway + Control UI
* Persistent storage via Northflank Volume (`/data`) so `openclaw.json`,
  per-agent `auth-profiles.json`, channel/provider state, sessions, and
  workspace survive redeploys

## Connect a channel

Use the Control UI at `/openclaw` or run `openclaw onboard` via SSH for channel setup instructions:

* [Telegram](/channels/telegram) (fastest — just a bot token)
* [Discord](/channels/discord)
* [All channels](/channels)

## Next steps

* Set up messaging channels: [Channels](/channels)
* Configure the Gateway: [Gateway configuration](/gateway/configuration)
* Keep OpenClaw up to date: [Updating](/install/updating)
