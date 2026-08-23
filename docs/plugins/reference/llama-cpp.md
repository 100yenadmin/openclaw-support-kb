---
type: openclaw_doc
title: "Llama Cpp plugin"
source: "https://docs.openclaw.ai/plugins/reference/llama-cpp"
source_hash: "c7e716c3ddce949c28dbfea38d83d1618b3e051a2f724ce63cdb3354c418f39c"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/llama-cpp.md"
original_doc_path: "plugins/reference/llama-cpp.md"
duplicate_index: 1
---

# Llama Cpp plugin
Source: https://docs.openclaw.ai/plugins/reference/llama-cpp

# Llama Cpp plugin

Managed and external llama.cpp servers for GGUF chat and embeddings.

## Distribution

- Package: `@openclaw/llama-cpp-provider`
- Install route: npm; ClawHub

## Surface

providers: `llama-cpp`; contracts: `embeddingProviders`

<!-- openclaw-plugin-reference:manual-start -->

## Default text model

During interactive setup, OpenClaw installs a pinned, verified `llama-server`
and offers Gemma 4 E4B IT Q4_K_M as an approximately 5.0 GB download. The model
offer requires at least 16 GiB of total RAM. Existing cached models are still
detected on smaller machines.

To use another model, set `params.modelPath` to any custom GGUF. Custom models
are not subject to the bundled-download RAM requirement. On machines below the
requirement, you can also run a smaller model through Ollama or LM Studio, or
choose a cloud provider.

<!-- openclaw-plugin-reference:manual-end -->

## Related docs

- [llama-cpp](/plugins/llama-cpp)

---
