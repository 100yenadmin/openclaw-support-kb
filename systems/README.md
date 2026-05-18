---
type: customer_kb_source_catalog
title: "Customer KB Source Routing"
source: "kb-sources.json"
source_hash: "1eeef0fa225fc8e84756e3e16d0b2fcd39edb6d354896b9530e622e2ad546139"
system: "customer-kb"
kb_namespace: "source-router"
---

# Customer KB Source Routing

This repository is installed as the GBrain source `openclaw-support-kb` for backwards compatibility, then divided into logical system namespaces.

- OpenClaw facts live under `docs/`, `releases/`, `runbooks/`, `skills/`, `skills-index/`, `security/`, and `support/`.
- Hermes Agent facts live under `systems/hermes/`.
- Paperclip Mission Control facts live under `systems/paperclip/`.
- Composio integration facts live under `integrations/composio/`.

Agents must identify the target system before using setup, config, repair, or install instructions. When one runtime is fixing another, search the target system first and the acting runtime second.
