---
type: openclaw_doc
title: "Qwen"
source: "https://docs.openclaw.ai/providers/qwen"
source_hash: "da7991008ac455b8da33d52521b5486e31b0f12765dacd6d8f4d8aadc7c1bead"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/qwen.md"
original_doc_path: "providers/qwen.md"
duplicate_index: 1
---

# Qwen
Source: https://docs.openclaw.ai/providers/qwen

OpenClaw now treats Qwen as a first-class provider plugin with canonical id
`qwen`. The provider plugin targets the Qwen Cloud / Alibaba DashScope and
Coding Plan endpoints, keeps legacy `modelstudio` ids working as a compatibility
alias, and also exposes the Qwen Portal token flow as provider `qwen-oauth`.

- Provider: `qwen`
- Portal provider: [`qwen-oauth`](/providers/qwen-oauth)
- Preferred env var: `QWEN_API_KEY`
- Also accepted for compatibility: `MODELSTUDIO_API_KEY`, `DASHSCOPE_API_KEY`
- API style: OpenAI-compatible

Tip

If you want `qwen3.6-plus`, prefer the **Standard (pay-as-you-go)** endpoint.
Coding Plan support can lag behind the public catalog.

## Install plugin

Install the official plugin, then restart Gateway:

```bash
openclaw plugins install @openclaw/qwen-provider
openclaw gateway restart
```

## Getting started

Choose your plan type and follow the setup steps.

Tabs


Coding Plan (subscription)

    **Best for:** subscription-based access through the Qwen Coding Plan.


Steps


Get your API key

        Create or copy an API key from [home.qwencloud.com/api-keys](https://home.qwencloud.com/api-keys).


Run onboarding

        For the **Global** endpoint:

        ```bash
        openclaw onboard --auth-choice qwen-api-key
        ```

        For the **China** endpoint:

        ```bash
        openclaw onboard --auth-choice qwen-api-key-cn
        ```


Set a default model

        ```json5
        {
          agents: {
            defaults: {
              model: { primary: "qwen/qwen3.5-plus" },
            },
          },
        }
        ```


Verify the model is available

        ```bash
        openclaw models list --provider qwen
        ```




Note

    Legacy `modelstudio-*` auth-choice ids and `modelstudio/...` model refs still
    work as compatibility aliases, but new setup flows should prefer the canonical
    `qwen-*` auth-choice ids and `qwen/...` model refs. If you define an exact
    custom `models.providers.modelstudio` entry with another `api` value, that
    custom provider owns `modelstudio/...` refs instead of the Qwen compatibility
    alias.





Standard (pay-as-you-go)

    **Best for:** pay-as-you-go access through the Standard Model Studio endpoint, including models like `qwen3.6-plus` that may not be available on the Coding Plan.


Steps


Get your API key

        Create or copy an API key from [home.qwencloud.com/api-keys](https://home.qwencloud.com/api-keys).


Run onboarding

        For the **Global** endpoint:

        ```bash
        openclaw onboard --auth-choice qwen-standard-api-key
        ```

        For the **China** endpoint:

        ```bash
        openclaw onboard --auth-choice qwen-standard-api-key-cn
        ```


Set a default model

        ```json5
        {
          agents: {
            defaults: {
              model: { primary: "qwen/qwen3.5-plus" },
            },
          },
        }
        ```


Verify the model is available

        ```bash
        openclaw models list --provider qwen
        ```




Note

    Legacy `modelstudio-*` auth-choice ids and `modelstudio/...` model refs still
    work as compatibility aliases, but new setup flows should prefer the canonical
    `qwen-*` auth-choice ids and `qwen/...` model refs. If you define an exact
    custom `models.providers.modelstudio` entry with another `api` value, that
    custom provider owns `modelstudio/...` refs instead of the Qwen compatibility
    alias.





Qwen OAuth / Portal

    **Best for:** a Qwen Portal token against `https://portal.qwen.ai/v1`.

    See [Qwen OAuth / Portal](/providers/qwen-oauth) for the dedicated provider
    page and migration notes.


Steps


Provide your portal token

        ```bash
        openclaw onboard --auth-choice qwen-oauth
        ```


Set a default model

        ```json5
        {
          agents: {
            defaults: {
              model: { primary: "qwen-oauth/qwen3.5-plus" },
            },
          },
        }
        ```


Verify the model is available

        ```bash
        openclaw models list --provider qwen-oauth
        ```




Note

    `qwen-oauth` uses the same `QWEN_API_KEY` env var name as the DashScope
    provider, but stores auth under the `qwen-oauth` provider id when configured
    through OpenClaw onboarding.




## Plan types and endpoints

| Plan                       | Region | Auth choice                | Endpoint                                         |
| -------------------------- | ------ | -------------------------- | ------------------------------------------------ |
| Standard (pay-as-you-go)   | China  | `qwen-standard-api-key-cn` | `dashscope.aliyuncs.com/compatible-mode/v1`      |
| Standard (pay-as-you-go)   | Global | `qwen-standard-api-key`    | `dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| Coding Plan (subscription) | China  | `qwen-api-key-cn`          | `coding.dashscope.aliyuncs.com/v1`               |
| Coding Plan (subscription) | Global | `qwen-api-key`             | `coding-intl.dashscope.aliyuncs.com/v1`          |
| Qwen Portal                | Global | `qwen-oauth`               | `portal.qwen.ai/v1`                              |

The provider auto-selects the endpoint based on your auth choice. Canonical
choices use the `qwen-*` family; `modelstudio-*` remains compatibility-only.
You can override with a custom `baseUrl` in config.

Tip

**Manage keys:** [home.qwencloud.com/api-keys](https://home.qwencloud.com/api-keys) |
**Docs:** [docs.qwencloud.com](https://docs.qwencloud.com/developer-guides/getting-started/introduction)

## Built-in catalog

OpenClaw currently ships this Qwen static catalog. The configured catalog is
endpoint-aware: Coding Plan configs omit models that are only known to work on
the Standard endpoint.

| Model ref                   | Input       | Context   | Notes                                              |
| --------------------------- | ----------- | --------- | -------------------------------------------------- |
| `qwen/qwen3.5-plus`         | text, image | 1,000,000 | Default model                                      |
| `qwen/qwen3.6-plus`         | text, image | 1,000,000 | Prefer Standard endpoints when you need this model |
| `qwen/qwen3-max-2026-01-23` | text        | 262,144   | Qwen Max line                                      |
| `qwen/qwen3-coder-next`     | text        | 262,144   | Coding                                             |
| `qwen/qwen3-coder-plus`     | text        | 1,000,000 | Coding                                             |
| `qwen/MiniMax-M2.5`         | text        | 1,000,000 | Reasoning enabled                                  |
| `qwen/glm-5`                | text        | 202,752   | GLM                                                |
| `qwen/glm-4.7`              | text        | 202,752   | GLM                                                |
| `qwen/kimi-k2.5`            | text, image | 262,144   | Moonshot AI via Alibaba                            |
| `qwen-oauth/qwen3.5-plus`   | text, image | 1,000,000 | Qwen Portal default                                |

Note

Availability can still vary by endpoint and billing plan even when a model is
present in the static catalog.

## Thinking Controls

For reasoning-enabled Qwen Cloud models, the provider maps OpenClaw
thinking levels to DashScope's top-level `enable_thinking` request flag. Disabled
thinking sends `enable_thinking: false`; other thinking levels send
`enable_thinking: true`.

## Multimodal add-ons

The `qwen` plugin also exposes multimodal capabilities on the **Standard**
DashScope endpoints (not the Coding Plan endpoints):

- **Video understanding** via `qwen-vl-max-latest`
- **Wan video generation** via `wan2.6-t2v` (default), `wan2.6-i2v`, `wan2.6-r2v`, `wan2.6-r2v-flash`, `wan2.7-r2v`

To use Qwen as the default video provider:

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: { primary: "qwen/wan2.6-t2v" },
    },
  },
}
```

Note

See [Video Generation](/tools/video-generation) for shared tool parameters, provider selection, and failover behavior.

## Advanced configuration

AccordionGroup


Image and video understanding

    The Qwen plugin registers media understanding for images and video
    on the **Standard** DashScope endpoints (not the Coding Plan endpoints).

    | Property      | Value                 |
    | ------------- | --------------------- |
    | Model         | `qwen-vl-max-latest`  |
    | Supported input | Images, video       |

    Media understanding is auto-resolved from the configured Qwen auth — no
    additional config is needed. Ensure you are using a Standard (pay-as-you-go)
    endpoint for media understanding support.




Qwen 3.6 Plus availability

    `qwen3.6-plus` is available on the Standard (pay-as-you-go) Model Studio
    endpoints:

    - China: `dashscope.aliyuncs.com/compatible-mode/v1`
    - Global: `dashscope-intl.aliyuncs.com/compatible-mode/v1`

    If the Coding Plan endpoints return an "unsupported model" error for
    `qwen3.6-plus`, switch to Standard (pay-as-you-go) instead of the Coding Plan
    endpoint/key pair.

    OpenClaw's Qwen static catalog does not advertise `qwen3.6-plus` on Coding
    Plan endpoints, but explicitly configured `qwen/qwen3.6-plus` entries under
    `models.providers.qwen.models` are honored on Coding Plan baseUrls so you
    can opt that model in if Aliyun enables it on your subscription. The
    upstream API still decides whether the call succeeds.




Capability plan

    The `qwen` plugin is being positioned as the vendor home for the full Qwen
    Cloud surface, not just coding/text models.

    - **Text/chat models:** available through the plugin
    - **Tool calling, structured output, thinking:** inherited from the OpenAI-compatible transport
    - **Image generation:** planned at the provider-plugin layer
    - **Image/video understanding:** available through the plugin on the Standard endpoint
    - **Speech/audio:** planned at the provider-plugin layer
    - **Memory embeddings/reranking:** planned through the embedding adapter surface
    - **Video generation:** available through the plugin through the shared video-generation capability




Video generation details

    For video generation, OpenClaw maps the configured Qwen region to the matching
    DashScope AIGC host before submitting the job:

    - Global/Intl: `https://dashscope-intl.aliyuncs.com`
    - China: `https://dashscope.aliyuncs.com`

    That means a normal `models.providers.qwen.baseUrl` pointing at either the
    Coding Plan or Standard Qwen hosts still keeps video generation on the correct
    regional DashScope video endpoint.

    Current Qwen video-generation limits:

    - Up to **1** output video per request
    - Up to **1** input image
    - Up to **4** input videos
    - Up to **10 seconds** duration
    - Supports `size`, `aspectRatio`, `resolution`, `audio`, and `watermark`
    - Reference image/video mode currently requires **remote http(s) URLs**. Local
      file paths are rejected up front because the DashScope video endpoint does not
      accept uploaded local buffers for those references.




Streaming usage compatibility

    Native Model Studio endpoints advertise streaming usage compatibility on the
    shared `openai-completions` transport. OpenClaw keys that off endpoint
    capabilities now, so DashScope-compatible custom provider ids targeting the
    same native hosts inherit the same streaming-usage behavior instead of
    requiring the built-in `qwen` provider id specifically.

    Native-streaming usage compatibility applies to both the Coding Plan hosts and
    the Standard DashScope-compatible hosts:

    - `https://coding.dashscope.aliyuncs.com/v1`
    - `https://coding-intl.dashscope.aliyuncs.com/v1`
    - `https://dashscope.aliyuncs.com/compatible-mode/v1`
    - `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`




Multimodal endpoint regions

    Multimodal surfaces (video understanding and Wan video generation) use the
    **Standard** DashScope endpoints, not the Coding Plan endpoints:

    - Global/Intl Standard base URL: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
    - China Standard base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`




Environment and daemon setup

    If the Gateway runs as a daemon (launchd/systemd), make sure `QWEN_API_KEY` is
    available to that process (for example, in `~/.openclaw/.env` or via
    `env.shellEnv`).


## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Video generation

    Shared video tool parameters and provider selection.


Alibaba (ModelStudio)

    Legacy ModelStudio provider and migration notes.


Troubleshooting

    General troubleshooting and FAQ.

---
