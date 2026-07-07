---
type: openclaw_doc
title: "NVIDIA"
source: "https://docs.openclaw.ai/providers/nvidia"
source_hash: "53c29ec9af4a611c539e98c324277d5a5b2c04deb44de1e9901612df578583de"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/nvidia.md"
original_doc_path: "providers/nvidia.md"
duplicate_index: 1
---

# NVIDIA
Source: https://docs.openclaw.ai/providers/nvidia

NVIDIA serves open models for free through an OpenAI-compatible API at
`https://integrate.api.nvidia.com/v1`, authenticated with an API key from
[build.nvidia.com](https://build.nvidia.com/settings/api-keys). OpenClaw
defaults the NVIDIA provider to Nemotron 3 Ultra, NVIDIA's 550B total / 55B
active reasoning model for long-context agentic work.

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
    openclaw models set nvidia/nvidia/nemotron-3-ultra-550b-a55b
    ```


For non-interactive setup, pass the key directly:

```bash
openclaw onboard --auth-choice nvidia-api-key --nvidia-api-key "nvapi-..."
```

Warning

`--nvidia-api-key` lands the key in shell history and `ps` output. Prefer the
`NVIDIA_API_KEY` environment variable when possible.

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
      model: { primary: "nvidia/nvidia/nemotron-3-ultra-550b-a55b" },
    },
  },
}
```

## Featured catalog

When an NVIDIA API key is configured, setup and model-selection paths fetch
NVIDIA's public featured-model catalog from
`https://assets.ngc.nvidia.com/products/api-catalog/featured-models.json` and
cache the result for 24 hours (first 32 entries, imported as free text-input
rows). New featured models from build.nvidia.com therefore appear in setup and
model-selection surfaces without waiting for an OpenClaw release. When the
live feed is available, the first returned model is the preselected option
during NVIDIA setup.

The fetch uses a fixed HTTPS host policy for `assets.ngc.nvidia.com`. If no
NVIDIA API key is configured, or if the feed is unavailable or malformed,
OpenClaw falls back to the bundled catalog and bundled default below.

## Nemotron 3 Ultra

Nemotron 3 Ultra is the default NVIDIA model in OpenClaw. NVIDIA's build page for
[`nvidia/nemotron-3-ultra-550b-a55b`](https://build.nvidia.com/nvidia/nemotron-3-ultra-550b-a55b)
lists it as an available free endpoint with a 1M-token context specification.
The bundled catalog records a 16,384-token max output to match NVIDIA's current
OpenAI-compatible sample request for the hosted endpoint.

The bundled Ultra row sends
`chat_template_kwargs: { enable_thinking: false, force_nonempty_content: true }`
by default so normal chat output stays in the visible answer instead of
exposing reasoning text.

Use Ultra for the highest-capability NVIDIA default. Keep Super selected when
you want the smaller Nemotron 3 option, or choose one of the third-party models
hosted in NVIDIA's catalog when their context, latency, or behavior fits better.

## Bundled fallback catalog

| Model ref                                  | Name                         | Context   | Max output | Notes                                    |
| ------------------------------------------ | ---------------------------- | --------- | ---------- | ---------------------------------------- |
| `nvidia/nvidia/nemotron-3-ultra-550b-a55b` | NVIDIA Nemotron 3 Ultra 550B | 1,000,000 | 16,384     | Default                                  |
| `nvidia/nvidia/nemotron-3-super-120b-a12b` | NVIDIA Nemotron 3 Super 120B | 1,048,576 | 8,192      |                                          |
| `nvidia/moonshotai/kimi-k2.5`              | Kimi K2.5                    | 262,144   | 8,192      |                                          |
| `nvidia/minimaxai/minimax-m2.7`            | Minimax M2.7                 | 196,608   | 8,192      |                                          |
| `nvidia/z-ai/glm-5.1`                      | GLM 5.1                      | 202,752   | 8,192      |                                          |
| `nvidia/minimaxai/minimax-m2.5`            | MiniMax M2.5                 | 196,608   | 8,192      | Deprecated; use `minimaxai/minimax-m2.7` |
| `nvidia/z-ai/glm5`                         | GLM-5                        | 202,752   | 8,192      | Deprecated; use `z-ai/glm-5.1`           |

## Advanced configuration

AccordionGroup


Auto-enable behavior

    The provider auto-enables when the `NVIDIA_API_KEY` environment variable is
    set or a key was stored during onboarding. No explicit provider config is
    required beyond the key.



Catalog and pricing

    OpenClaw prefers NVIDIA's public featured-model catalog when NVIDIA auth is
    configured and caches it for 24 hours. The bundled fallback catalog is static
    and keeps deprecated shipped refs for upgrade compatibility. Costs default
    to `0` in source since NVIDIA currently offers free API access for the
    listed models.



OpenAI-compatible endpoint

    OpenClaw talks to NVIDIA with the `openai-completions` adapter against the
    standard `/v1` chat completions route. Any OpenAI-compatible tooling should
    work out of the box with the NVIDIA base URL.



Nemotron 3 Ultra reasoning params

    NVIDIA's Ultra sample request uses `chat_template_kwargs.enable_thinking`
    and `reasoning_budget` for reasoning output. OpenClaw's bundled Ultra row
    disables template thinking by default for normal chat use. If you need to
    opt into NVIDIA reasoning output or force other NVIDIA-specific request
    fields, set per-model params and keep provider-specific overrides scoped to
    the NVIDIA model:

    ```json5
    {
      agents: {
        defaults: {
          models: {
            "nvidia/nvidia/nemotron-3-ultra-550b-a55b": {
              params: {
                chat_template_kwargs: { enable_thinking: true },
                extra_body: { reasoning_budget: 16384 },
              },
            },
          },
        },
      },
    }
    ```

    `params.chat_template_kwargs` merges into any `chat_template_kwargs`
    already on the request instead of replacing the whole object.
    `params.extra_body` is the final OpenAI-compatible request-body override
    and overwrites colliding payload keys, so use it only for fields NVIDIA
    documents for the selected endpoint.




Slow custom provider responses

    Some NVIDIA-hosted custom models can take longer than the default ~120s
    model idle watchdog before they emit a first response chunk. For custom
    NVIDIA provider entries, raise the provider timeout instead of the whole
    agent runtime timeout; `timeoutSeconds` covers provider HTTP requests and
    raises the idle/stream watchdog ceiling for that provider:

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
