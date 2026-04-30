---
type: openclaw_doc
title: "Docker VM runtime"
source: "https://docs.openclaw.ai/install/docker-vm-runtime"
source_hash: "5eda1601cec85cc6a9ca76719f07634a0eb36b1dbafc0f673988f02ba1fe1202"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "install/docker-vm-runtime.md"
original_doc_path: "install/docker-vm-runtime.md"
duplicate_index: 1
---

# Docker VM runtime
Source: https://docs.openclaw.ai/install/docker-vm-runtime



Shared runtime steps for VM-based Docker installs such as GCP, Hetzner, and similar VPS providers.

## Bake required binaries into the image

Installing binaries inside a running container is a trap.
Anything installed at runtime will be lost on restart.

All external binaries required by skills must be installed at image build time.

The examples below show three common binaries only:

* `gog` (from `gogcli`) for Gmail access
* `goplaces` for Google Places
* `wacli` for WhatsApp

These are examples, not a complete list.
You may install as many binaries as needed using the same pattern.

If you add new skills later that depend on additional binaries, you must:

1. Update the Dockerfile
2. Rebuild the image
3. Restart the containers

**Example Dockerfile**

```dockerfile theme={"theme":{"light":"min-light","dark":"min-dark"}}
FROM node:24-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Example binary 1: Gmail CLI (gogcli — installs as `gog`)
# Copy the current Linux asset URL from https://github.com/steipete/gogcli/releases
RUN curl -L https://github.com/steipete/gogcli/releases/latest/download/gogcli_linux_amd64.tar.gz \
  | tar -xzO gog > /usr/local/bin/gog; \
  chmod +x /usr/local/bin/gog

# Example binary 2: Google Places CLI
# Copy the current Linux asset URL from https://github.com/steipete/goplaces/releases
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_linux_amd64.tar.gz \
  | tar -xzO goplaces > /usr/local/bin/goplaces; \
  chmod +x /usr/local/bin/goplaces

# Example binary 3: WhatsApp CLI
# Copy the current Linux asset URL from https://github.com/steipete/wacli/releases
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli-linux-amd64.tar.gz \
  | tar -xzO wacli > /usr/local/bin/wacli; \
  chmod +x /usr/local/bin/wacli

# Add more binaries below using the same pattern

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

<Note>
  The URLs above are examples. For ARM-based VMs, choose the `arm64` assets. For reproducible builds, pin versioned release URLs.
</Note>

## Build and launch

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
docker compose build
docker compose up -d openclaw-gateway
```

If build fails with `Killed` or `exit code 137` during `pnpm install --frozen-lockfile`, the VM is out of memory.
Use a larger machine class before retrying.

Verify binaries:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
docker compose exec openclaw-gateway which gog
docker compose exec openclaw-gateway which goplaces
docker compose exec openclaw-gateway which wacli
```

Expected output:

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

Verify Gateway:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
docker compose logs -f openclaw-gateway
```

Expected output:

```
[gateway] listening on ws://0.0.0.0:18789
```

## What persists where

OpenClaw runs in Docker, but Docker is not the source of truth.
All long-lived state must survive restarts, rebuilds, and reboots.

| Component           | Location                                 | Persistence mechanism  | Notes                                                         |
| ------------------- | ---------------------------------------- | ---------------------- | ------------------------------------------------------------- |
| Gateway config      | `/home/node/.openclaw/`                  | Host volume mount      | Includes `openclaw.json`, `.env`                              |
| Model auth profiles | `/home/node/.openclaw/agents/`           | Host volume mount      | `agents/<agentId>/agent/auth-profiles.json` (OAuth, API keys) |
| Skill configs       | `/home/node/.openclaw/skills/`           | Host volume mount      | Skill-level state                                             |
| Agent workspace     | `/home/node/.openclaw/workspace/`        | Host volume mount      | Code and agent artifacts                                      |
| WhatsApp session    | `/home/node/.openclaw/`                  | Host volume mount      | Preserves QR login                                            |
| Gmail keyring       | `/home/node/.openclaw/`                  | Host volume + password | Requires `GOG_KEYRING_PASSWORD`                               |
| Plugin runtime deps | `/var/lib/openclaw/plugin-runtime-deps/` | Docker named volume    | Generated bundled plugin deps and runtime mirrors             |
| External binaries   | `/usr/local/bin/`                        | Docker image           | Must be baked at build time                                   |
| Node runtime        | Container filesystem                     | Docker image           | Rebuilt every image build                                     |
| OS packages         | Container filesystem                     | Docker image           | Do not install at runtime                                     |
| Docker container    | Ephemeral                                | Restartable            | Safe to destroy                                               |

## Updates

To update OpenClaw on the VM:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
git pull
docker compose build
docker compose up -d
```

## Related

* [Docker](/install/docker)
* [Podman](/install/podman)
* [ClawDock](/install/clawdock)
