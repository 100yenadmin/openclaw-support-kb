---
type: openclaw_doc
title: "Qwen"
source: "https://docs.openclaw.ai/providers/qwen"
source_hash: "adca457a0b8f53f8051b539addf37351c903e2077b0bc52ef3b5aa1f5ca856b5"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/qwen.md"
original_doc_path: "providers/qwen.md"
duplicate_index: 1
---

# Qwen
Source: https://docs.openclaw.ai/providers/qwen

Qwen Cloud is an official external OpenClaw provider plugin with canonical id `qwen`. It targets Qwen Cloud / Alibaba DashScope Standard and Coding Plan endpoints, keeps legacy `modelstudio` ids working as a compatibility alias, and exposes the Qwen Portal token flow as a separate provider, [`qwen-oauth`](/providers/qwen-oauth).

| Property               | Value                                      |
| ---------------------- | ------------------------------------------ |
| Provider               | `qwen`                                     |
| Portal provider        | [`qwen-oauth`](/providers/qwen-oauth)      |
| Preferred env var      | `QWEN_API_KEY`                             |
| Also accepted (compat) | `MODELSTUDIO_API_KEY`, `DASHSCOPE_API_KEY` |
| API style              | OpenAI-compatible                          |

Tip

For `qwen3.6-plus`, use a **Standard (pay-as-you-go)** endpoint. It is not available on the Coding Plan endpoints.

## Install plugin

`qwen` ships as an official external plugin, not bundled with core. Install it and restart Gateway:

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

    **Best for:** pay-as-you-go access through the Standard Model Studio endpoint, including models like `qwen3.6-plus` that are not available on the Coding Plan.


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

    `qwen-oauth` uses the same `QWEN_API_KEY` env var name as the Qwen Cloud
    provider, but stores auth under the `qwen-oauth` provider id when configured
    through OpenClaw onboarding.




## Plan types and endpoints

| Plan                       | Region | Auth choice                | Endpoint                                         |
| -------------------------- | ------ | -------------------------- | ------------------------------------------------ |
| Coding Plan (subscription) | China  | `qwen-api-key-cn`          | `coding.dashscope.aliyuncs.com/v1`               |
| Coding Plan (subscription) | Global | `qwen-api-key`             | `coding-intl.dashscope.aliyuncs.com/v1`          |
| Qwen Portal                | Global | `qwen-oauth`               | `portal.qwen.ai/v1`                              |
| Standard (pay-as-you-go)   | China  | `qwen-standard-api-key-cn` | `dashscope.aliyuncs.com/compatible-mode/v1`      |
| Standard (pay-as-you-go)   | Global | `qwen-standard-api-key`    | `dashscope-intl.aliyuncs.com/compatible-mode/v1` |

The provider auto-selects the endpoint based on your auth choice. Canonical
choices use the `qwen-*` family; `modelstudio-*` remains compatibility-only.
Override with a custom `baseUrl` in config.

Tip

**Manage keys:** [home.qwencloud.com/api-keys](https://home.qwencloud.com/api-keys) |
**Docs:** [docs.qwencloud.com](https://docs.qwencloud.com/developer-guides/getting-started/introduction)

## Built-in catalog

OpenClaw ships this Qwen static catalog. The catalog is endpoint-aware: Coding
Plan configs omit models that only work on the Standard endpoint.

| Model ref                   | Input       | Context   | Notes                   |
| --------------------------- | ----------- | --------- | ----------------------- |
| `qwen/qwen3.5-plus`         | text, image | 1,000,000 | Default model           |
| `qwen/qwen3.6-plus`         | text, image | 1,000,000 | Standard endpoints only |
| `qwen/qwen3-max-2026-01-23` | text        | 262,144   | Qwen Max line           |
| `qwen/qwen3-coder-next`     | text        | 262,144   | Coding                  |
| `qwen/qwen3-coder-plus`     | text        | 1,000,000 | Coding                  |
| `qwen/MiniMax-M2.5`         | text        | 1,000,000 | Reasoning enabled       |
| `qwen/glm-5`                | text        | 202,752   | GLM                     |
| `qwen/glm-4.7`              | text        | 202,752   | GLM                     |
| `qwen/kimi-k2.5`            | text, image | 262,144   | Moonshot AI via Alibaba |
| `qwen-oauth/qwen3.5-plus`   | text, image | 1,000,000 | Qwen Portal default     |

Note

Availability can still vary by endpoint and billing plan even when a model is
present in the static catalog.

## Thinking controls

`qwen/MiniMax-M2.5` is the only reasoning-enabled model in the built-in
catalog. For reasoning models on the `qwen` family, the provider maps
OpenClaw thinking levels to DashScope's top-level `enable_thinking` request
flag: disabled thinking sends `enable_thinking: false`, any other level sends
`enable_thinking: true`. Custom models can opt into an alternate chat-template
thinking payload by setting `compat.thinkingFormat: "qwen-chat-template"` on
the model entry.

## Multimodal add-ons

The `qwen` plugin exposes multimodal capabilities on the **Standard** DashScope
endpoints only, not the Coding Plan endpoints:

- **Image and video understanding** via `qwen-vl-max-latest`
- **Wan video generation** via `wan2.6-t2v` (default), `wan2.6-i2v`, `wan2.6-r2v`, `wan2.6-r2v-flash`, `wan2.7-r2v`

Media understanding is auto-resolved from the configured Qwen auth; no extra
config is needed. Make sure you are on a Standard (pay-as-you-go) endpoint for
media understanding to work.

To make Qwen the default video provider:

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: { primary: "qwen/wan2.6-t2v" },
    },
  },
}
```

Video-generation limits: 1 output video per request, up to 1 input image
(image-to-video), up to 4 input videos (video-to-video), max 10 seconds
duration. Supports `size`, `aspectRatio`, `resolution`, `audio`, and
`watermark`. Reference image/video inputs require remote http(s) URLs; local
file paths are rejected up front because the DashScope video endpoint does not
accept uploaded local buffers for those references.

Note

See [Video generation](/tools/video-generation) for shared tool parameters, provider selection, and failover behavior.

## Advanced configuration

AccordionGroup


Qwen 3.6 Plus availability

    `qwen3.6-plus` is available on the Standard (pay-as-you-go) endpoints:

    - China: `dashscope.aliyuncs.com/compatible-mode/v1`
    - Global: `dashscope-intl.aliyuncs.com/compatible-mode/v1`

    If the Coding Plan endpoints return an "unsupported model" error for
    `qwen3.6-plus`, switch to Standard (pay-as-you-go) instead of the Coding Plan
    endpoint/key pair.

    OpenClaw's Qwen static catalog does not advertise `qwen3.6-plus` on Coding
    Plan endpoints, but an explicitly configured `qwen/qwen3.6-plus` entry under
    `models.providers.qwen.models` is honored on Coding Plan base URLs, so you
    can opt that model in if Aliyun enables it on your subscription. The
    upstream API still decides whether the call succeeds.




Video generation region routing

    OpenClaw maps the configured Qwen region to the matching DashScope AIGC host
    before submitting a video job:

    - Global/Intl: `https://dashscope-intl.aliyuncs.com`
    - China: `https://dashscope.aliyuncs.com`

    A normal `models.providers.qwen.baseUrl` pointing at either the Coding Plan
    or Standard Qwen hosts still routes video generation to the matching
    regional DashScope video endpoint.




Streaming usage compatibility

    Native Qwen endpoints advertise streaming usage compatibility on the shared
    `openai-completions` transport, so DashScope-compatible custom provider ids
    targeting the same native hosts inherit the same behavior without requiring
    the built-in `qwen` provider id specifically. This applies to both Coding
    Plan and Standard endpoints:

    - `https://coding.dashscope.aliyuncs.com/v1`
    - `https://coding-intl.dashscope.aliyuncs.com/v1`
    - `https://dashscope.aliyuncs.com/compatible-mode/v1`
    - `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`




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


Alibaba Model Studio

    Bundled Wan video generation provider on the same DashScope platform.


Troubleshooting

    General troubleshooting and FAQ.

---
