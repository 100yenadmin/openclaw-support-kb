---
type: openclaw_doc
title: "NVIDIA"
source: "https://docs.openclaw.ai/providers/nvidia"
source_hash: "c59a7f2c466555b1affba468bc0966fe7e46a833f2840ca566da47654d7ab651"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/nvidia.md"
original_doc_path: "providers/nvidia.md"
duplicate_index: 1
---

# NVIDIA
Source: https://docs.openclaw.ai/providers/nvidia

NVIDIA provides an OpenAI-compatible API at `https://integrate.api.nvidia.com/v1` for
open models for free. Authenticate with an API key from
[build.nvidia.com](https://build.nvidia.com/settings/api-keys).

## Getting started

Steps


Get your API key

    Create an API key at [build.nvidia.com](https://build.nvidia.com/settings/api-keys).


Export the key and run onboarding

    ```bash
    export NVIDIA_API_KEY="nvapi-..."
    openclaw onboard --auth-choice nvidia-api-key
    ```


Set an NVIDIA model

    ```bash
    openclaw models set nvidia/nvidia/nemotron-3-super-120b-a12b
    ```


Warning

If you pass `--nvidia-api-key` instead of the env var, the value lands in shell
history and `ps` output. Prefer the `NVIDIA_API_KEY` environment variable when
possible.

For non-interactive setup, you can also pass the key directly:

```bash
openclaw onboard --auth-choice nvidia-api-key --nvidia-api-key "nvapi-..."
```

## Config example

```json5
{
  env: { NVIDIA_API_KEY: "nvapi-..." },
  models: {
    providers: {
      nvidia: {
        baseUrl: "https://integrate.api.nvidia.com/v1",
        api: "openai-completions",
      },
    },
  },
  agents: {
    defaults: {
      model: { primary: "nvidia/nvidia/nemotron-3-super-120b-a12b" },
    },
  },
}
```

## Built-in catalog

| Model ref                                  | Name                         | Context | Max output |
| ------------------------------------------ | ---------------------------- | ------- | ---------- |
| `nvidia/nvidia/nemotron-3-super-120b-a12b` | NVIDIA Nemotron 3 Super 120B | 262,144 | 8,192      |
| `nvidia/moonshotai/kimi-k2.5`              | Kimi K2.5                    | 262,144 | 8,192      |
| `nvidia/minimaxai/minimax-m2.5`            | Minimax M2.5                 | 196,608 | 8,192      |
| `nvidia/z-ai/glm5`                         | GLM 5                        | 202,752 | 8,192      |

## Advanced configuration

AccordionGroup


Auto-enable behavior

    The provider auto-enables when the `NVIDIA_API_KEY` environment variable is set.
    No explicit provider config is required beyond the key.



Catalog and pricing

    The bundled catalog is static. Costs default to `0` in source since NVIDIA
    currently offers free API access for the listed models.



OpenAI-compatible endpoint

    NVIDIA uses the standard `/v1` completions endpoint. Any OpenAI-compatible
    tooling should work out of the box with the NVIDIA base URL.



Slow custom provider responses

    Some NVIDIA-hosted custom models can take longer than the default model idle
    watchdog before they emit a first response chunk. For custom NVIDIA provider
    entries, raise the provider timeout instead of raising the whole agent
    runtime timeout:

    ```json5
    {
      models: {
        providers: {
          "custom-integrate-api-nvidia-com": {
            baseUrl: "https://integrate.api.nvidia.com/v1",
            api: "openai-completions",
            apiKey: "NVIDIA_API_KEY",
            timeoutSeconds: 300,
          },
        },
      },
      agents: {
        defaults: {
          models: {
            "custom-integrate-api-nvidia-com/meta/llama-3.1-70b-instruct": {
              params: { thinking: "off" },
            },
          },
        },
      },
    }
    ```



Tip

NVIDIA models are currently free to use. Check
[build.nvidia.com](https://build.nvidia.com/) for the latest availability and
rate-limit details.

## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full config reference for agents, models, and providers.

---
