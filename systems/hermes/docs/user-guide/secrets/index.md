---
type: hermes_doc
title: "user-guide/secrets/index.md"
source: "https://hermes-agent.nousresearch.com/docs/user-guide/secrets"
source_hash: "bc8f4bf70af580d000c1a0d3333f0a6c3b344286ae2eae0bdedfed5eeab57a22"
system: "hermes"
kb_namespace: "hermes-agent"
doc_path: "user-guide/secrets/index.md"
original_doc_path: "user-guide/secrets/index.md"
duplicate_index: 1
---

# user-guide/secrets/index.md

Source System: Hermes Agent
Local KB namespace: hermes-agent
Source: https://hermes-agent.nousresearch.com/docs/user-guide/secrets


# Secrets

Hermes can pull API keys from external secret managers at process startup instead of storing them in `~/.hermes/.env`. The bootstrap token for the secret manager lives in `.env`; every other provider key (OpenAI, Anthropic, OpenRouter, etc.) can stay in the manager and rotate centrally.

Supported:

- [Bitwarden Secrets Manager](./bitwarden) — `bws` CLI, lazy-installed, free tier works.

More backends (Vault, AWS Secrets Manager, 1Password CLI) are easy to add behind the same interface — the lift is one module in `agent/secret_sources/` and one CLI handler. File a request if you have a specific one in mind.

---
