---
type: openclaw_doc
title: "Synthetic"
source: "https://docs.openclaw.ai/providers/synthetic"
source_hash: "041620e625ee34b00eaf479647e72116b25453365f1a308742911878852891cb"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/synthetic.md"
original_doc_path: "providers/synthetic.md"
duplicate_index: 1
---

# Synthetic
Source: https://docs.openclaw.ai/providers/synthetic

[Synthetic](https://synthetic.new) exposes Anthropic-compatible endpoints.
OpenClaw provides it through the official `@openclaw/synthetic-provider`
plugin and uses the Anthropic Messages API.

| Property | Value                                 |
| -------- | ------------------------------------- |
| Provider | `synthetic`                           |
| Auth     | `SYNTHETIC_API_KEY`                   |
| API      | Anthropic Messages                    |
| Base URL | `https://api.synthetic.new/anthropic` |

## Getting started

Steps


Install the plugin

    ```bash
    openclaw plugins install @openclaw/synthetic-provider
    openclaw gateway restart
    ```


Get an API key

    Get a `SYNTHETIC_API_KEY` from your Synthetic account, or let onboarding
    prompt you for one.


Run onboarding

    ```bash
    openclaw onboard --auth-choice synthetic-api-key
    ```


Verify the default model

    Onboarding sets the default model to:
    ```text
    synthetic/hf:MiniMaxAI/MiniMax-M3
    ```


Warning

OpenClaw's Anthropic client appends `/v1` to the base URL automatically, so use
`https://api.synthetic.new/anthropic` (not `/anthropic/v1`). If Synthetic
changes its base URL, override `models.providers.synthetic.baseUrl`.

## Config example

```json5
{
  env: { vars: { SYNTHETIC_API_KEY: "sk-..." } },
  agents: {
    defaults: {
      model: { primary: "synthetic/hf:MiniMaxAI/MiniMax-M3" },
      models: { "synthetic/hf:MiniMaxAI/MiniMax-M3": { alias: "MiniMax M3" } },
    },
  },
  models: {
    mode: "merge",
    providers: {
      synthetic: {
        baseUrl: "https://api.synthetic.new/anthropic",
        apiKey: "${SYNTHETIC_API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "hf:MiniMaxAI/MiniMax-M3",
            name: "MiniMax M3",
            reasoning: true,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 262144,
            maxTokens: 65536,
          },
        ],
      },
    },
  },
}
```

## Built-in catalog

All Synthetic models use cost `0` (input/output/cache). See Synthetic's
[current model list](https://dev.synthetic.new/docs/api/models) for service availability.

| Model ID                                            | Context window | Max tokens | Reasoning | Input        |
| --------------------------------------------------- | -------------- | ---------- | --------- | ------------ |
| `hf:MiniMaxAI/MiniMax-M3`                           | 262,144        | 65,536     | yes       | text + image |
| `hf:moonshotai/Kimi-K2.7-Code`                      | 262,144        | 8,192      | yes       | text + image |
| `hf:nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4` | 262,144        | 8,192      | yes       | text         |
| `hf:openai/gpt-oss-120b`                            | 131,072        | 8,192      | yes       | text         |
| `hf:Qwen/Qwen3.6-27B`                               | 262,144        | 81,920     | yes       | text + image |
| `hf:zai-org/GLM-4.7-Flash`                          | 196,608        | 131,072    | yes       | text         |
| `hf:zai-org/GLM-5.2`                                | 524,288        | 131,072    | yes       | text         |

Tip

Model refs use the form `synthetic/<modelId>`. Use
`openclaw models list --provider synthetic` to see all models available on your
account.

AccordionGroup


Model allowlist

    If you enable a model allowlist (`agents.defaults.modelPolicy.allow`), add every
    Synthetic model you plan to use. Models not in the allowlist are hidden
    from the agent.



Base URL override

    If Synthetic changes its API endpoint, override the base URL:

    ```json5
    {
      models: {
        providers: {
          synthetic: {
            baseUrl: "https://new-api.synthetic.new/anthropic",
          },
        },
      },
    }
    ```

    OpenClaw still appends `/v1` automatically.



## Related

CardGroup


Model providers

    Provider rules, model refs, and failover behavior.


Configuration reference

    Full config schema including provider settings.


Synthetic

    Synthetic dashboard and API docs.

---
