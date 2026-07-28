---
type: openclaw_doc
title: "Qianfan"
source: "https://docs.openclaw.ai/providers/qianfan"
source_hash: "86a3a5a148f3166f5f00a0ce136f976ab017a6930cee3c2e9ed06092e53ef691"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/qianfan.md"
original_doc_path: "providers/qianfan.md"
duplicate_index: 1
---

# Qianfan
Source: https://docs.openclaw.ai/providers/qianfan

Qianfan is Baidu's MaaS platform: a unified, OpenAI-compatible API that routes requests to many models behind a single endpoint and API key. OpenClaw ships it as the official external plugin `@openclaw/qianfan-provider`.

| Property      | Value                                    |
| ------------- | ---------------------------------------- |
| Provider      | `qianfan`                                |
| Auth          | `QIANFAN_API_KEY`                        |
| API           | OpenAI-compatible (`openai-completions`) |
| Base URL      | `https://qianfan.baidubce.com/v2`        |
| Default model | `qianfan/deepseek-v4-pro`                |

## Install plugin

Install the official plugin, then restart Gateway:

```bash
openclaw plugins install @openclaw/qianfan-provider
openclaw gateway restart
```

## Getting started

Steps


Create a Baidu Cloud account

    Sign up or log in at the [Qianfan Console](https://console.bce.baidu.com/qianfan/ais/console/apiKey) and ensure you have Qianfan API access enabled.


Generate an API key

    Create a new application or select an existing one, then generate an API key. Baidu Cloud keys use the `bce-v3/ALTAK-...` format.


Run onboarding

    ```bash
    openclaw onboard --auth-choice qianfan-api-key
    ```

    Non-interactive runs read the key from `--qianfan-api-key <key>` or
    `QIANFAN_API_KEY`. Onboarding writes the provider config, adds the
    `QIANFAN` alias for the default model, and sets `qianfan/deepseek-v4-pro`
    as the default model when none is configured.



Verify the model is available

    ```bash
    openclaw models list --provider qianfan
    ```


## Built-in catalog

| Model ref                            | Input       | Context   | Max output | Reasoning | Notes                                                                      |
| ------------------------------------ | ----------- | --------- | ---------- | --------- | -------------------------------------------------------------------------- |
| `qianfan/deepseek-v4-pro`            | text        | 1,000,000 | 393,216    | Yes       | Current DeepSeek flagship                                                  |
| `qianfan/ernie-5.1`                  | text        | 128,000   | 65,536     | No        | Latest ERNIE text flagship                                                 |
| `qianfan/ernie-5.0`                  | text, image | 128,000   | 65,536     | Yes       | Current multimodal and thinking model                                      |
| `qianfan/deepseek-v3.2`              | text        | 128,000   | 32,768     | No        | Deprecated onboarding compatibility default; replaced by `deepseek-v4-pro` |
| `qianfan/ernie-5.0-thinking-preview` | text, image | 128,000   | 65,536     | Yes       | Deprecated alias; replaced by `ernie-5.0`                                  |

The catalog is static; there is no live model discovery.

Tip

You only need to override `models.providers.qianfan` when you need a custom base URL or model metadata.

## Config example

This example explicitly selects the current DeepSeek flagship instead of the onboarding compatibility default.

```json5
{
  env: { QIANFAN_API_KEY: "bce-v3/ALTAK-..." },
  agents: {
    defaults: {
      model: { primary: "qianfan/deepseek-v4-pro" },
      models: {
        "qianfan/deepseek-v4-pro": { alias: "QIANFAN" },
      },
    },
  },
  models: {
    providers: {
      qianfan: {
        baseUrl: "https://qianfan.baidubce.com/v2",
        api: "openai-completions",
        models: [
          {
            id: "deepseek-v4-pro",
            name: "DeepSeek V4 Pro",
            reasoning: true,
            input: ["text"],
            cost: {
              input: 1.771957,
              output: 3.543915,
              cacheRead: 0.147663,
              cacheWrite: 0,
            },
            contextWindow: 1000000,
            maxTokens: 393216,
          },
        ],
      },
    },
  },
}
```

Note

Model refs use the `qianfan/` prefix (for example `qianfan/deepseek-v4-pro`).

AccordionGroup


Transport and compatibility

    Qianfan runs through the OpenAI-compatible transport path, not native OpenAI request shaping. Standard OpenAI SDK features work, but provider-specific parameters may not be forwarded.



Troubleshooting

    - Ensure your API key starts with `bce-v3/ALTAK-` and has Qianfan API access enabled in the Baidu Cloud console.
    - If models are not listed, confirm your account has the Qianfan service activated.
    - Only change the base URL if you use a custom endpoint or proxy.



## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full OpenClaw configuration reference.


Agent setup

    Configuring agent defaults and model assignments.


Qianfan API docs

    Official Qianfan API documentation.

---
