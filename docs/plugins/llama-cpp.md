---
type: openclaw_doc
title: "llama.cpp Provider"
source: "https://docs.openclaw.ai/plugins/llama-cpp"
source_hash: "b86941366cca974da82d476f44da075665f6d2c790a26b48df3f2ac7b490f259"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/llama-cpp.md"
original_doc_path: "plugins/llama-cpp.md"
duplicate_index: 1
---

# llama.cpp Provider
Source: https://docs.openclaw.ai/plugins/llama-cpp

`llama-cpp` is the official external provider plugin for local GGUF embeddings.
It owns the `node-llama-cpp` runtime dependency used by
`memorySearch.provider: "local"`.

Install it before using local memory embeddings:

```bash
openclaw plugins install @openclaw/llama-cpp-provider
```

The main `openclaw` npm package does not include `node-llama-cpp`. Keeping the
native dependency in this plugin prevents normal OpenClaw npm updates from
deleting a manually installed runtime inside the OpenClaw package directory.

## Configuration

Set the memory search provider to `local`:

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "local",
        local: {
          modelPath: "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf",
        },
      },
    },
  },
}
```

The default model is `embeddinggemma-300m-qat-Q8_0.gguf`. You can also point
`local.modelPath` at a local `.gguf` file.

## Native Runtime

Use Node 24 for the smoothest native install path. Source checkouts using pnpm
may need to approve and rebuild the native dependency:

```bash
pnpm approve-builds
pnpm rebuild node-llama-cpp
```

For lower-friction local embeddings, use a local service provider such as
Ollama or LM Studio instead.

---
