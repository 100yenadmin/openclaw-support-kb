---
type: openclaw_doc
title: "OpenCode"
source: "https://docs.openclaw.ai/providers/opencode"
source_hash: "41361fdd5d1b28ce24a29608deea41db36c5e9eb3ac6b79ddf9d2c30e7b38e0a"
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

Both catalogs use the same OpenCode API key. OpenClaw keeps the runtime provider ids
split so upstream per-model routing stays correct, but onboarding and docs treat them
as one OpenCode setup.

## Getting started

Tabs


Zen catalog

    **Best for:** the curated OpenCode multi-model proxy (Claude, GPT, Gemini).


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
        openclaw config set agents.defaults.model.primary "opencode/claude-opus-4-6"
        ```


Verify models are available

        ```bash
        openclaw models list --provider opencode
        ```






Go catalog

    **Best for:** the OpenCode-hosted Kimi, GLM, and MiniMax lineup.


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
  agents: { defaults: { model: { primary: "opencode/claude-opus-4-6" } } },
}
```

## Built-in catalogs

### Zen

| Property         | Value                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| Runtime provider | `opencode`                                                              |
| Example models   | `opencode/claude-opus-4-6`, `opencode/gpt-5.5`, `opencode/gemini-3-pro` |

### Go

| Property         | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Runtime provider | `opencode-go`                                                            |
| Example models   | `opencode-go/kimi-k2.6`, `opencode-go/glm-5`, `opencode-go/minimax-m2.5` |

## Advanced configuration

AccordionGroup


API key aliases

    `OPENCODE_ZEN_API_KEY` is also supported as an alias for `OPENCODE_API_KEY`.



Shared credentials

    Entering one OpenCode key during setup stores credentials for both runtime
    providers. You do not need to onboard each catalog separately.



Billing and dashboard

    You sign in to OpenCode, add billing details, and copy your API key. Billing
    and catalog availability are managed from the OpenCode dashboard.



Gemini replay behavior

    Gemini-backed OpenCode refs stay on the proxy-Gemini path, so OpenClaw keeps
    Gemini thought-signature sanitation there without enabling native Gemini
    replay validation or bootstrap rewrites.



Non-Gemini replay behavior

    Non-Gemini OpenCode refs keep the minimal OpenAI-compatible replay policy.


Tip

Entering one OpenCode key during setup stores credentials for both the Zen and
Go runtime providers, so you only need to onboard once.

## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full config reference for agents, models, and providers.

---
