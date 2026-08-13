---
type: openclaw_doc
title: "Arcee AI"
source: "https://docs.openclaw.ai/providers/arcee"
source_hash: "9a4114877764c71e5a199287ac7143aad0b9fd4137386a348ac416afab74d4fa"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/arcee.md"
original_doc_path: "providers/arcee.md"
duplicate_index: 1
---

# Arcee AI
Source: https://docs.openclaw.ai/providers/arcee

[Arcee AI](https://arcee.ai) provides the Trinity family of mixture-of-experts models through an OpenAI-compatible API. All Trinity models are Apache 2.0 licensed. Arcee is an official OpenClaw plugin, not bundled with core, so it needs an install step before onboarding.

Access Arcee models directly through the Arcee platform or through [OpenRouter](/providers/openrouter).

| Property | Value                                                                                 |
| -------- | ------------------------------------------------------------------------------------- |
| Provider | `arcee`                                                                               |
| Auth     | `ARCEEAI_API_KEY` (direct) or `OPENROUTER_API_KEY` (via OpenRouter)                   |
| API      | OpenAI-compatible                                                                     |
| Base URL | `https://api.arcee.ai/api/v1` (direct) or `https://openrouter.ai/api/v1` (OpenRouter) |

## Install plugin

```bash
openclaw plugins install @openclaw/arcee-provider
openclaw gateway restart
```

## Getting started

Tabs


Direct (Arcee platform)


Steps


Get an API key

        Create an API key at [Arcee AI](https://chat.arcee.ai/).


Run onboarding

        ```bash
        openclaw onboard --auth-choice arceeai-api-key
        ```


Set a default model

        ```json5
        {
          agents: {
            defaults: {
              model: { primary: "arcee/trinity-large-thinking" },
            },
          },
        }
        ```





Via OpenRouter


Steps


Get an API key

        Create an API key at [OpenRouter](https://openrouter.ai/keys).


Run onboarding

        ```bash
        openclaw onboard --auth-choice arceeai-openrouter
        ```


Set a default model

        ```json5
        {
          agents: {
            defaults: {
              model: { primary: "arcee/trinity-large-thinking" },
            },
          },
        }
        ```

        The same model refs work for both direct and OpenRouter setups.





## Non-interactive setup

Tabs


Direct (Arcee platform)

    ```bash
    openclaw onboard --non-interactive --accept-risk --skip-health \
      --mode local \
      --auth-choice arceeai-api-key \
      --arceeai-api-key "$ARCEEAI_API_KEY"
    ```



Via OpenRouter

    ```bash
    openclaw onboard --non-interactive --accept-risk --skip-health \
      --mode local \
      --auth-choice arceeai-openrouter \
      --openrouter-api-key "$OPENROUTER_API_KEY"
    ```


## Direct Arcee catalog

| Model ref                      | Name                   | Input | Context | Max output | Cost (in/out per 1M) | Tools | Notes                                     |
| ------------------------------ | ---------------------- | ----- | ------- | ---------- | -------------------- | ----- | ----------------------------------------- |
| `arcee/trinity-large-thinking` | Trinity Large Thinking | text  | 256K    | 80K        | $0.25 / $0.90        | No    | Default model; extended thinking          |
| `arcee/trinity-large-preview`  | Trinity Large Preview  | text  | 128K    | 16K        | $0.25 / $1.00        | Yes   | General-purpose; 400B params, 13B active  |
| `arcee/trinity-mini`           | Trinity Mini 26B       | text  | 128K    | 80K        | $0.045 / $0.15       | Yes   | Fast and cost-efficient; function calling |

Tip

The onboarding preset sets `arcee/trinity-large-thinking` as the default model.

## OpenRouter catalog

OpenRouter onboarding exposes `arcee/trinity-large-preview` and `arcee/trinity-large-thinking`. OpenClaw keeps those provider-qualified model refs in config and sends OpenRouter's canonical `arcee-ai/*` runtime ids. Trinity Mini is no longer served by OpenRouter; use the direct Arcee API for that model.

## Supported features

| Feature                                       | Supported                                    |
| --------------------------------------------- | -------------------------------------------- |
| Streaming                                     | Yes                                          |
| Tool use / function calling                   | Yes (Trinity Mini, Trinity Large Preview)    |
| Structured output (JSON mode and JSON schema) | Yes                                          |
| Extended thinking                             | Yes (Trinity Large Thinking; tools disabled) |

AccordionGroup


Environment note

    If the Gateway runs as a daemon (launchd/systemd), make sure `ARCEEAI_API_KEY`
    (or `OPENROUTER_API_KEY`) is available to that process, for example in
    `~/.openclaw/.env` or via `env.shellEnv`.



OpenRouter routing

    OpenRouter uses the same `arcee/trinity-large-thinking` OpenClaw model ref.
    OpenClaw routes it with the canonical `arcee-ai/trinity-large-thinking`
    OpenRouter runtime id. See the
    [OpenRouter provider docs](/providers/openrouter) for OpenRouter-specific
    configuration details.


## Related

CardGroup


OpenRouter

    Access Arcee models and many others through a single API key.


Model selection

    Choosing providers, model refs, and failover behavior.

---
