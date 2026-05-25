---
type: openclaw_doc
title: "Z.AI"
source: "https://docs.openclaw.ai/providers/zai"
source_hash: "21ef77e0303cae1382d094ea8e1dcd742b0520dd2c627359c8e041a811eab331"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/zai.md"
original_doc_path: "providers/zai.md"
duplicate_index: 1
---

# Z.AI
Source: https://docs.openclaw.ai/providers/zai

Z.AI is the API platform for **GLM** models. It provides REST APIs for GLM and
uses API keys for authentication. Create your API key in the Z.AI console.
OpenClaw uses the `zai` provider with a Z.AI API key.

| Property | Value                                        |
| -------- | -------------------------------------------- |
| Provider | `zai`                                        |
| Auth     | `ZAI_API_KEY` (legacy alias: `Z_AI_API_KEY`) |
| API      | Z.AI Chat Completions (Bearer auth)          |

## GLM models

GLM is a model family, not a separate provider. In OpenClaw, GLM models use
refs such as `zai/glm-5.1`: provider `zai`, model id `glm-5.1`.

## Getting started

Tabs


Auto-detect endpoint

    **Best for:** most users. OpenClaw probes supported Z.AI endpoints with your API key and applies the correct base URL automatically.


Steps


Run onboarding

        ```bash
        openclaw onboard --auth-choice zai-api-key
        ```


Verify the model is listed

        ```bash
        openclaw models list --all --provider zai
        ```






Explicit regional endpoint

    **Best for:** users who want to force a specific Coding Plan or general API surface.


Steps


Pick the right onboarding choice

        ```bash
        # Coding Plan Global (recommended for Coding Plan users)
        openclaw onboard --auth-choice zai-coding-global

        # Coding Plan CN (China region)
        openclaw onboard --auth-choice zai-coding-cn

        # General API
        openclaw onboard --auth-choice zai-global

        # General API CN (China region)
        openclaw onboard --auth-choice zai-cn
        ```


Verify the model is listed

        ```bash
        openclaw models list --all --provider zai
        ```





## Config example

Tip

`zai-api-key` lets OpenClaw detect the matching Z.AI endpoint from the key and
apply the correct base URL automatically. Use the explicit regional choices when
you want to force a specific Coding Plan or general API surface.

```json5
{
  env: { ZAI_API_KEY: "sk-..." },
  models: {
    providers: {
      zai: {
        // Example value. Onboarding writes the matching baseUrl for your endpoint.
        baseUrl: "https://api.z.ai/api/paas/v4",
      },
    },
  },
  agents: { defaults: { model: { primary: "zai/glm-5.1" } } },
}
```

## Built-in catalog

OpenClaw ships the bundled `zai` provider catalog in the plugin manifest, so read-only
listing can show known GLM rows without loading provider runtime:

```bash
openclaw models list --all --provider zai
```

The manifest-backed catalog currently includes:

| Model ref            | Notes         |
| -------------------- | ------------- |
| `zai/glm-5.1`        | Default model |
| `zai/glm-5`          |               |
| `zai/glm-5-turbo`    |               |
| `zai/glm-5v-turbo`   |               |
| `zai/glm-4.7`        |               |
| `zai/glm-4.7-flash`  |               |
| `zai/glm-4.7-flashx` |               |
| `zai/glm-4.6`        |               |
| `zai/glm-4.6v`       |               |
| `zai/glm-4.5`        |               |
| `zai/glm-4.5-air`    |               |
| `zai/glm-4.5-flash`  |               |
| `zai/glm-4.5v`       |               |

Tip

GLM models are available as `zai/<model>` (example: `zai/glm-5`).

Note

The default bundled model ref is `zai/glm-5.1`. GLM versions and availability
can change; run `openclaw models list --all --provider zai` to see the catalog
known to your installed version.

## Advanced configuration

AccordionGroup


Forward-resolving unknown GLM-5 models

    Unknown `glm-5*` ids still forward-resolve on the bundled provider path by
    synthesizing provider-owned metadata from the `glm-4.7` template when the id
    matches the current GLM-5 family shape.



Tool-call streaming

    `tool_stream` is enabled by default for Z.AI tool-call streaming. To disable it:

    ```json5
    {
      agents: {
        defaults: {
          models: {
            "zai/<model>": {
              params: { tool_stream: false },
            },
          },
        },
      },
    }
    ```




Thinking and preserved thinking

    Z.AI thinking follows OpenClaw's `/think` controls. With thinking off,
    OpenClaw sends `thinking: { type: "disabled" }` to avoid responses that
    spend the output budget on `reasoning_content` before visible text.

    Preserved thinking is opt-in because Z.AI requires the full historical
    `reasoning_content` to be replayed, which increases prompt tokens. Enable it
    per model:

    ```json5
    {
      agents: {
        defaults: {
          models: {
            "zai/glm-5.1": {
              params: { preserveThinking: true },
            },
          },
        },
      },
    }
    ```

    When enabled and thinking is on, OpenClaw sends
    `thinking: { type: "enabled", clear_thinking: false }` and replays prior
    `reasoning_content` for the same OpenAI-compatible transcript.

    Advanced users can still override the exact provider payload with
    `params.extra_body.thinking`.




Image understanding

    The bundled Z.AI plugin registers image understanding.

    | Property      | Value       |
    | ------------- | ----------- |
    | Model         | `glm-4.6v`  |

    Image understanding is auto-resolved from the configured Z.AI auth — no
    additional config is needed.




Auth details

    - Z.AI uses Bearer auth with your API key.
    - The `zai-api-key` onboarding choice auto-detects the matching Z.AI endpoint by probing supported endpoints with your key.
    - Use the explicit regional choices (`zai-coding-global`, `zai-coding-cn`, `zai-global`, `zai-cn`) when you want to force a specific API surface.
    - The legacy env var `Z_AI_API_KEY` is still accepted; OpenClaw copies it to `ZAI_API_KEY` at startup if `ZAI_API_KEY` is unset.



## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full OpenClaw config schema, including provider and model settings.

---
