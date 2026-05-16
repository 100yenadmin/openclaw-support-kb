---
type: paperclip_doc
title: "overview"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/deploy/overview.md"
source_hash: "6f96a6e0f4c7faa6cabbba569c06afebc43e2420d9b4b6b8b179c5aaae7f31d0"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/deploy/overview.md"
original_doc_path: "docs/deploy/overview.md"
---

# overview

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/deploy/overview.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/deploy/overview.md

---
title: Deployment Overview
summary: Deployment modes at a glance
---

Paperclip supports three deployment configurations, from zero-friction local to internet-facing production.

## Deployment Modes

| Mode | Auth | Best For |
|------|------|----------|
| `local_trusted` | No login required | Single-operator local machine |
| `authenticated` + `private` | Login required | Private network (Tailscale, VPN, LAN) |
| `authenticated` + `public` | Login required | Internet-facing cloud deployment |

## Quick Comparison

### Local Trusted (Default)

- Loopback-only host binding (localhost)
- No human login flow
- Fastest local startup
- Best for: solo development and experimentation

### Authenticated + Private

- Login required via Better Auth
- Binds to all interfaces for network access
- Auto base URL mode (lower friction)
- Best for: team access over Tailscale or local network

### Authenticated + Public

- Login required
- Explicit public URL required
- Stricter security checks
- Best for: cloud hosting, internet-facing deployment

## Choosing a Mode

- **Just trying Paperclip?** Use `local_trusted` (the default)
- **Sharing with a team on private network?** Use `authenticated` + `private`
- **Deploying to the cloud?** Use `authenticated` + `public` — see [AWS ECS Fargate guide](aws-ecs.md)

Set the mode during onboarding:

```sh
pnpm paperclipai onboard
```

Or update it later:

```sh
pnpm paperclipai configure --section server
```
