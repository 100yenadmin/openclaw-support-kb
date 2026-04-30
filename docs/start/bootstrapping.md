---
type: openclaw_doc
title: "Agent bootstrapping"
source: "https://docs.openclaw.ai/start/bootstrapping"
source_hash: "49abbaf43df3b067f0a4ef53bdec7cc6e04450aaefddf8458e753f2810ab0d3c"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "start/bootstrapping.md"
original_doc_path: "start/bootstrapping.md"
duplicate_index: 1
---

# Agent bootstrapping
Source: https://docs.openclaw.ai/start/bootstrapping



Bootstrapping is the **first‑run** ritual that prepares an agent workspace and
collects identity details. It happens after onboarding, when the agent starts
for the first time.

## What bootstrapping does

On the first agent run, OpenClaw bootstraps the workspace (default
`~/.openclaw/workspace`):

* Seeds `AGENTS.md`, `BOOTSTRAP.md`, `IDENTITY.md`, `USER.md`.
* Runs a short Q\&A ritual (one question at a time).
* Writes identity + preferences to `IDENTITY.md`, `USER.md`, `SOUL.md`.
* Removes `BOOTSTRAP.md` when finished so it only runs once.

For embedded/local model runs, OpenClaw keeps `BOOTSTRAP.md` out of the
privileged system context. On the primary interactive first run, it still passes
the file contents in the user prompt so models that do not reliably call the
`read` tool can complete the ritual. If the current run cannot safely access the
workspace, the agent gets a limited bootstrap note instead of a generic greeting.

## Skipping bootstrapping

To skip this for a pre-seeded workspace, run `openclaw onboard --skip-bootstrap`.

## Where it runs

Bootstrapping always runs on the **gateway host**. If the macOS app connects to
a remote Gateway, the workspace and bootstrapping files live on that remote
machine.

<Note>
  When the Gateway runs on another machine, edit workspace files on the gateway
  host (for example, `user@gateway-host:~/.openclaw/workspace`).
</Note>

## Related docs

* macOS app onboarding: [Onboarding](/start/onboarding)
* Workspace layout: [Agent workspace](/concepts/agent-workspace)
