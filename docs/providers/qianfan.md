---
type: openclaw_doc
title: "Qianfan"
source: "https://docs.openclaw.ai/providers/qianfan"
source_hash: "d53e9eeff404fa302d972287e96ee304a3082f7f136fb40d60e1f6d75b09c9b4"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/qianfan.md"
original_doc_path: "providers/qianfan.md"
duplicate_index: 1
---

# Qianfan
Source: https://docs.openclaw.ai/providers/qianfan

Qianfan is Baidu's MaaS platform, providing a **unified API** that routes requests to many models behind a single
endpoint and API key. It is OpenAI-compatible, so most OpenAI SDKs work by switching the base URL.

| Property | Value                             |
| -------- | --------------------------------- |
| Provider | `qianfan`                         |
| Auth     | `QIANFAN_API_KEY`                 |
| API      | OpenAI-compatible                 |
| Base URL | `https://qianfan.baidubce.com/v2` |

## Getting started

Steps


Create a Baidu Cloud account

    Sign up or log in at the [Qianfan Console](https://console.bce.baidu.com/qianfan/ais/console/apiKey) and ensure you have Qianfan API access enabled.


Generate an API key

    Create a new application or select an existing one, then generate an API key. The key format is `bce-v3/ALTAK-...`.


Run onboarding

    ```bash
    openclaw onboard --auth-choice qianfan-api-key
    ```


Verify the model is available

    ```bash
    openclaw models list --provider qianfan
    ```


## Built-in catalog

| Model ref                            | Input       | Context | Max output | Reasoning | Notes         |
| ------------------------------------ | ----------- | ------- | ---------- | --------- | ------------- |
| `qianfan/deepseek-v3.2`              | text        | 98,304  | 32,768     | Yes       | Default model |
| `qianfan/ernie-5.0-thinking-preview` | text, image | 119,000 | 64,000     | Yes       | Multimodal    |

Tip

The default bundled model ref is `qianfan/deepseek-v3.2`. You only need to override `models.providers.qianfan` when you need a custom base URL or model metadata.

## Config example

```json5
{
  env: { QIANFAN_API_KEY: "bce-v3/ALTAK-..." },
  agents: {
    defaults: {
      model: { primary: "qianfan/deepseek-v3.2" },
      models: {
        "qianfan/deepseek-v3.2": { alias: "QIANFAN" },
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
            id: "deepseek-v3.2",
            name: "DEEPSEEK V3.2",
            reasoning: true,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 98304,
            maxTokens: 32768,
          },
          {
            id: "ernie-5.0-thinking-preview",
            name: "ERNIE-5.0-Thinking-Preview",
            reasoning: true,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 119000,
            maxTokens: 64000,
          },
        ],
      },
    },
  },
}
```

AccordionGroup


Transport and compatibility

    Qianfan runs through the OpenAI-compatible transport path, not native OpenAI request shaping. This means standard OpenAI SDK features work, but provider-specific parameters may not be forwarded.



Catalog and overrides

    The bundled catalog currently includes `deepseek-v3.2` and `ernie-5.0-thinking-preview`. Add or override `models.providers.qianfan` only when you need a custom base URL or model metadata.


Note

    Model refs use the `qianfan/` prefix (for example `qianfan/deepseek-v3.2`).





Troubleshooting

    - Ensure your API key starts with `bce-v3/ALTAK-` and has Qianfan API access enabled in the Baidu Cloud console.
    - If models are not listed, confirm your account has the Qianfan service activated.
    - The default base URL is `https://qianfan.baidubce.com/v2`. Only change it if you use a custom endpoint or proxy.



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
