---
type: openclaw_doc
title: "Together AI"
source: "https://docs.openclaw.ai/providers/together"
source_hash: "9991728cb188a1683fa144be60f3a85fb5083d9085b58a1ab044361d69bbb65a"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/together.md"
original_doc_path: "providers/together.md"
duplicate_index: 1
---

# Together AI
Source: https://docs.openclaw.ai/providers/together

[Together AI](https://together.ai) provides access to leading open-source
models including Llama, DeepSeek, Kimi, and more through a unified API.

| Property | Value                         |
| -------- | ----------------------------- |
| Provider | `together`                    |
| Auth     | `TOGETHER_API_KEY`            |
| API      | OpenAI-compatible             |
| Base URL | `https://api.together.xyz/v1` |

## Getting started

Steps


Get an API key

    Create an API key at
    [api.together.ai/settings/api-keys](https://api.together.ai/settings/api-keys).


Run onboarding

    ```bash
    openclaw onboard --auth-choice together-api-key
    ```


Set a default model

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "together/moonshotai/Kimi-K2.5" },
        },
      },
    }
    ```


### Non-interactive example

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice together-api-key \
  --together-api-key "$TOGETHER_API_KEY"
```

Note

The onboarding preset sets `together/moonshotai/Kimi-K2.5` as the default
model.

## Built-in catalog

OpenClaw ships this bundled Together catalog:

| Model ref                                                    | Name                                   | Input       | Context    | Notes                            |
| ------------------------------------------------------------ | -------------------------------------- | ----------- | ---------- | -------------------------------- |
| `together/moonshotai/Kimi-K2.5`                              | Kimi K2.5                              | text, image | 262,144    | Default model; reasoning enabled |
| `together/zai-org/GLM-4.7`                                   | GLM 4.7 Fp8                            | text        | 202,752    | General-purpose text model       |
| `together/meta-llama/Llama-3.3-70B-Instruct-Turbo`           | Llama 3.3 70B Instruct Turbo           | text        | 131,072    | Fast instruction model           |
| `together/meta-llama/Llama-4-Scout-17B-16E-Instruct`         | Llama 4 Scout 17B 16E Instruct         | text, image | 10,000,000 | Multimodal                       |
| `together/meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8` | Llama 4 Maverick 17B 128E Instruct FP8 | text, image | 20,000,000 | Multimodal                       |
| `together/deepseek-ai/DeepSeek-V3.1`                         | DeepSeek V3.1                          | text        | 131,072    | General text model               |
| `together/deepseek-ai/DeepSeek-R1`                           | DeepSeek R1                            | text        | 131,072    | Reasoning model                  |
| `together/moonshotai/Kimi-K2-Instruct-0905`                  | Kimi K2-Instruct 0905                  | text        | 262,144    | Secondary Kimi text model        |

## Video generation

The bundled `together` plugin also registers video generation through the
shared `video_generate` tool.

| Property             | Value                                 |
| -------------------- | ------------------------------------- |
| Default video model  | `together/Wan-AI/Wan2.2-T2V-A14B`     |
| Modes                | text-to-video, single-image reference |
| Supported parameters | `aspectRatio`, `resolution`           |

To use Together as the default video provider:

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: {
        primary: "together/Wan-AI/Wan2.2-T2V-A14B",
      },
    },
  },
}
```

Tip

See [Video Generation](/tools/video-generation) for the shared tool parameters,
provider selection, and failover behavior.

AccordionGroup


Environment note

    If the Gateway runs as a daemon (launchd/systemd), make sure
    `TOGETHER_API_KEY` is available to that process (for example, in
    `~/.openclaw/.env` or via `env.shellEnv`).


Warning

    Keys set only in your interactive shell are not visible to daemon-managed
    gateway processes. Use `~/.openclaw/.env` or `env.shellEnv` config for
    persistent availability.





Troubleshooting

    - Verify your key works: `openclaw models list --provider together`
    - If models are not appearing, confirm the API key is set in the correct
      environment for your Gateway process.
    - Model refs use the form `together/<model-id>`.



## Related

CardGroup


Model selection

    Provider rules, model refs, and failover behavior.


Video generation

    Shared video generation tool parameters and provider selection.


Configuration reference

    Full config schema including provider settings.


Together AI

    Together AI dashboard, API docs, and pricing.

---
