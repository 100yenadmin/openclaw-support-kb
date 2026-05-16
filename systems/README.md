---
type: customer_kb_source_catalog
title: "Customer KB Source Routing"
source: "kb-sources.json"
source_hash: "72f602bc3c43a0a0b8bb1cadf4fb5b451be48d6acd604a92d9e59799882bb552"
system: "customer-kb"
kb_namespace: "source-router"
---

# Customer KB Source Routing

This repository is installed as the GBrain source `openclaw-support-kb` for backwards compatibility, then divided into logical system namespaces.

- OpenClaw facts live under `docs/`, `releases/`, `runbooks/`, `skills-index/`, `security/`, and `support/`.
- Hermes Agent facts live under `systems/hermes/`.
- Paperclip Mission Control facts live under `systems/paperclip/`.
- Composio integration facts live under `integrations/composio/`.

Agents must identify the target system before using setup, config, repair, or install instructions. When one runtime is fixing another, search the target system first and the acting runtime second.
