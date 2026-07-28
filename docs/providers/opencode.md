---
type: openclaw_doc
title: "OpenCode"
source: "https://docs.openclaw.ai/providers/opencode"
source_hash: "5835adc6802ce4f16d158b284b58848e8a11afa1e774429dc70e429989ab4a33"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/opencode.md"
original_doc_path: "providers/opencode.md"
duplicate_index: 1
---

# OpenCode
Source: https://docs.openclaw.ai/providers/opencode

OpenCode exposes two hosted catalogs in OpenClaw:

| Catalog | Prefix            | Runtime provider |
| ------- | ----------------- | ---------------- |
| **Zen** | `opencode/...`    | `opencode`       |
| **Go**  | `opencode-go/...` | `opencode-go`    |

Both catalogs share one OpenCode API key (`OPENCODE_API_KEY`, alias
`OPENCODE_ZEN_API_KEY`). OpenClaw keeps the runtime provider ids split so
upstream per-model routing stays correct, but onboarding and docs treat them as
one OpenCode setup.

## Getting started

Tabs


Zen catalog

    **Best for:** the curated OpenCode multi-model proxy (Claude, GPT, Gemini, GLM,
    DeepSeek, Kimi, MiniMax, Qwen).


Steps


Run onboarding

        ```bash
        openclaw onboard --auth-choice opencode-zen
        ```

        Or pass the key directly:

        ```bash
        openclaw onboard --opencode-zen-api-key "$OPENCODE_API_KEY"
        ```


Set a Zen model as the default

        ```bash
        openclaw config set agents.defaults.model.primary "opencode/gpt-5.6-sol"
        ```


Verify models are available

        ```bash
        openclaw models list --provider opencode
        ```






Go catalog

    **Best for:** the OpenCode-hosted Kimi, GLM, MiniMax, Qwen, and DeepSeek lineup.


Steps


Run onboarding

        ```bash
        openclaw onboard --auth-choice opencode-go
        ```

        Or pass the key directly:

        ```bash
        openclaw onboard --opencode-go-api-key "$OPENCODE_API_KEY"
        ```


Set a Go model as the default

        ```bash
        openclaw config set agents.defaults.model.primary "opencode-go/kimi-k2.6"
        ```


Verify models are available

        ```bash
        openclaw models list --provider opencode-go
        ```





## Config example

```json5
{
  env: { OPENCODE_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "opencode/gpt-5.6-sol" } } },
}
```

## Built-in catalogs

### Zen

| Property         | Value                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Runtime provider | `opencode`                                                                                        |
| Example models   | `opencode/gpt-5.6-sol`, `opencode/gemini-3.6-flash`, `opencode/minimax-m3`, `opencode/big-pickle` |

Run `openclaw models list --provider opencode` for the full current list, which
also includes the currently promoted free-tier rows `opencode/big-pickle`,
`opencode/deepseek-v4-flash-free`, `opencode/laguna-s-2.1-free`,
`opencode/ling-3.0-flash-free`, `opencode/mimo-v2.5-free`,
`opencode/nemotron-3-ultra-free`, and `opencode/north-mini-code-free`.

### Go

| Property         | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Runtime provider | `opencode-go`                                                            |
| Example models   | `opencode-go/kimi-k2.6`, `opencode-go/glm-5`, `opencode-go/minimax-m2.5` |

See [OpenCode Go](/providers/opencode-go) for the full Go model table.

## Advanced configuration

AccordionGroup


API key aliases

    `OPENCODE_ZEN_API_KEY` is also accepted as an alias for `OPENCODE_API_KEY`.



Shared credentials

    Entering one OpenCode key during setup stores credentials for both runtime
    providers. You do not need to onboard each catalog separately.



Getting an API key

    Create an OpenCode account and generate an API key at
    [opencode.ai/auth](https://opencode.ai/auth). Billing and catalog
    availability are managed from the OpenCode dashboard.



Gemini replay behavior

    Gemini-backed OpenCode refs stay on the proxy-Gemini path, so OpenClaw keeps
    Gemini thought-signature sanitation there without enabling native Gemini
    replay validation or bootstrap rewrites.



Non-Gemini replay behavior

    Non-Gemini OpenCode refs keep the minimal OpenAI-compatible replay policy.


## Related

CardGroup


OpenCode Go

    Full Go catalog reference.


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full config reference for agents, models, and providers.

---
