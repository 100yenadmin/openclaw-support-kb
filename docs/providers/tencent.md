---
type: openclaw_doc
title: "Tencent Cloud (TokenHub)"
source: "https://docs.openclaw.ai/providers/tencent"
source_hash: "adc53c52fa6126d071cb21c1122517f87e2e2bedd3148247c42f66cbe9b66ba9"
doc_path: "providers/tencent.md"
original_doc_path: "providers/tencent.md"
duplicate_index: 1
---

# Tencent Cloud (TokenHub)
Source: https://docs.openclaw.ai/providers/tencent



# Tencent Cloud TokenHub

Tencent Cloud ships as a **bundled provider plugin** in OpenClaw. It gives access to Tencent Hy3 preview through the TokenHub endpoint (`tencent-tokenhub`).

The provider uses an OpenAI-compatible API.

| Property      | Value                                      |
| ------------- | ------------------------------------------ |
| Provider      | `tencent-tokenhub`                         |
| Default model | `tencent-tokenhub/hy3-preview`             |
| Auth          | `TOKENHUB_API_KEY`                         |
| API           | OpenAI-compatible chat completions         |
| Base URL      | `https://tokenhub.tencentmaas.com/v1`      |
| Global URL    | `https://tokenhub-intl.tencentmaas.com/v1` |

## Quick start

<Steps>
  <Step title="Create a TokenHub API key">
    Create an API key in Tencent Cloud TokenHub. If you choose a limited access scope for the key, include **Hy3 preview** in the allowed models.
  </Step>

  <Step title="Run onboarding">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --auth-choice tokenhub-api-key
    ```
  </Step>

  <Step title="Verify the model">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw models list --provider tencent-tokenhub
    ```
  </Step>
</Steps>

## Non-interactive setup

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice tokenhub-api-key \
  --tokenhub-api-key "$TOKENHUB_API_KEY" \
  --skip-health \
  --accept-risk
```

## Built-in catalog

| Model ref                      | Name                   | Input | Context | Max output | Notes                      |
| ------------------------------ | ---------------------- | ----- | ------- | ---------- | -------------------------- |
| `tencent-tokenhub/hy3-preview` | Hy3 preview (TokenHub) | text  | 256,000 | 64,000     | Default; reasoning-enabled |

Hy3 preview is Tencent Hunyuan's large MoE language model for reasoning, long-context instruction following, code, and agent workflows. Tencent's OpenAI-compatible examples use `hy3-preview` as the model id and support standard chat-completions tool calling plus `reasoning_effort`.

<Tip>
  The model id is `hy3-preview`. Do not confuse it with Tencent's `HY-3D-*` models, which are 3D generation APIs and are not the OpenClaw chat model configured by this provider.
</Tip>

## Endpoint override

OpenClaw defaults to Tencent Cloud's `https://tokenhub.tencentmaas.com/v1` endpoint. Tencent also documents an international TokenHub endpoint:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw config set models.providers.tencent-tokenhub.baseUrl "https://tokenhub-intl.tencentmaas.com/v1"
```

Only override the endpoint when your TokenHub account or region requires it.

## Notes

* TokenHub model refs use `tencent-tokenhub/<modelId>`.
* The bundled catalog currently includes `hy3-preview`.
* The plugin marks Hy3 preview as reasoning-capable and streaming-usage capable.
* The plugin ships with tiered Hy3 pricing metadata, so cost estimates are populated without manual pricing overrides.
* Override pricing, context, or endpoint metadata in `models.providers` only when needed.

## Environment note

If the Gateway runs as a daemon (launchd/systemd), make sure `TOKENHUB_API_KEY`
is available to that process (for example, in `~/.openclaw/.env` or via
`env.shellEnv`).

## Related documentation

* [OpenClaw Configuration](/gateway/configuration)
* [Model Providers](/concepts/model-providers)
* [Tencent TokenHub product page](https://cloud.tencent.com/product/tokenhub)
* [Tencent TokenHub text generation](https://cloud.tencent.com/document/product/1823/130079)
* [Tencent TokenHub Cline setup for Hy3 preview](https://cloud.tencent.com/document/product/1823/130932)
* [Tencent Hy3 preview model card](https://huggingface.co/tencent/Hy3-preview)
