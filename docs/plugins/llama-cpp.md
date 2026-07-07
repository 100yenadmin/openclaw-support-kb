---
type: openclaw_doc
title: "llama.cpp Provider"
source: "https://docs.openclaw.ai/plugins/llama-cpp"
source_hash: "f55c32cc3bf51b6cdc519dd10920d478faebf35e4ba44b1eea12eecae6716378"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/llama-cpp.md"
original_doc_path: "plugins/llama-cpp.md"
duplicate_index: 1
---

# llama.cpp Provider
Source: https://docs.openclaw.ai/plugins/llama-cpp

`llama-cpp` is the official external provider plugin for local GGUF
embeddings. It registers embedding provider id `local` and owns the
`node-llama-cpp` runtime dependency used by `memorySearch.provider: "local"`.

Install it before using local memory embeddings:

```bash
openclaw plugins install @openclaw/llama-cpp-provider
```

The main `openclaw` npm package does not include `node-llama-cpp`. Keeping the
native dependency in this plugin prevents normal OpenClaw npm updates from
deleting a manually installed runtime inside the OpenClaw package directory.

## Configuration

Set `memorySearch.provider` to `local`:

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

`local.modelPath` defaults to the `hf:` URI shown above (`embeddinggemma-300m-qat-Q8_0.gguf`).
Point it at a different `hf:` URI or a local `.gguf` file to use another
model. `local.modelCacheDir` overrides where downloaded models are cached
(default: `~/.node-llama-cpp/models`), and `local.contextSize` accepts an
integer or `"auto"`.

## Native Runtime

Use Node 24 for the smoothest native install path. Source checkouts using
pnpm may need to approve and rebuild the native dependency:

```bash
pnpm approve-builds
pnpm rebuild node-llama-cpp
```

## Troubleshooting

If `node-llama-cpp` is missing or fails to load, OpenClaw reports the failure
with:

1. Install the plugin: `openclaw plugins install @openclaw/llama-cpp-provider`.
2. Use Node 24 for native installs/updates.
3. From a pnpm source checkout: `pnpm approve-builds`, then `pnpm rebuild node-llama-cpp`.

For lower-friction local embeddings without the native build step, set
`memorySearch.provider` to a remote embedding provider such as `lmstudio`,
`ollama`, `openai`, or `voyage` instead.

---
