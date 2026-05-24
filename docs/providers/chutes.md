---
type: openclaw_doc
title: "Chutes"
source: "https://docs.openclaw.ai/providers/chutes"
source_hash: "75840772eceb80b80b3b000a5e033d2b5401d8f5f86266314ba47e96fefcff10"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/chutes.md"
original_doc_path: "providers/chutes.md"
duplicate_index: 1
---

# Chutes
Source: https://docs.openclaw.ai/providers/chutes

[Chutes](https://chutes.ai) exposes open-source model catalogs through an
OpenAI-compatible API. OpenClaw supports both browser OAuth and direct API-key
auth for the bundled `chutes` provider.

| Property | Value                        |
| -------- | ---------------------------- |
| Provider | `chutes`                     |
| API      | OpenAI-compatible            |
| Base URL | `https://llm.chutes.ai/v1`   |
| Auth     | OAuth or API key (see below) |

## Getting started

Tabs


OAuth


Steps


Run the OAuth onboarding flow

        ```bash
        openclaw onboard --auth-choice chutes
        ```
        OpenClaw launches the browser flow locally, or shows a URL + redirect-paste
        flow on remote/headless hosts. OAuth tokens auto-refresh through OpenClaw auth
        profiles.


Verify the default model

        After onboarding, the default model is set to
        `chutes/zai-org/GLM-4.7-TEE` and the bundled Chutes catalog is
        registered.




API key


Steps


Get an API key

        Create a key at
        [chutes.ai/settings/api-keys](https://chutes.ai/settings/api-keys).


Run the API key onboarding flow

        ```bash
        openclaw onboard --auth-choice chutes-api-key
        ```


Verify the default model

        After onboarding, the default model is set to
        `chutes/zai-org/GLM-4.7-TEE` and the bundled Chutes catalog is
        registered.




Note

Both auth paths register the bundled Chutes catalog and set the default model to
`chutes/zai-org/GLM-4.7-TEE`. Runtime environment variables: `CHUTES_API_KEY`,
`CHUTES_OAUTH_TOKEN`.

## Discovery behavior

When Chutes auth is available, OpenClaw queries the Chutes catalog with that
credential and uses the discovered models. If discovery fails, OpenClaw falls
back to a bundled static catalog so onboarding and startup still work.

## Default aliases

OpenClaw registers three convenience aliases for the bundled Chutes catalog:

| Alias           | Target model                                          |
| --------------- | ----------------------------------------------------- |
| `chutes-fast`   | `chutes/zai-org/GLM-4.7-FP8`                          |
| `chutes-pro`    | `chutes/deepseek-ai/DeepSeek-V3.2-TEE`                |
| `chutes-vision` | `chutes/chutesai/Mistral-Small-3.2-24B-Instruct-2506` |

## Built-in starter catalog

The bundled fallback catalog includes current Chutes refs:

| Model ref                                             |
| ----------------------------------------------------- |
| `chutes/zai-org/GLM-4.7-TEE`                          |
| `chutes/zai-org/GLM-5-TEE`                            |
| `chutes/deepseek-ai/DeepSeek-V3.2-TEE`                |
| `chutes/deepseek-ai/DeepSeek-R1-0528-TEE`             |
| `chutes/moonshotai/Kimi-K2.5-TEE`                     |
| `chutes/chutesai/Mistral-Small-3.2-24B-Instruct-2506` |
| `chutes/Qwen/Qwen3-Coder-Next-TEE`                    |
| `chutes/openai/gpt-oss-120b-TEE`                      |

## Config example

```json5
{
  agents: {
    defaults: {
      model: { primary: "chutes/zai-org/GLM-4.7-TEE" },
      models: {
        "chutes/zai-org/GLM-4.7-TEE": { alias: "Chutes GLM 4.7" },
        "chutes/deepseek-ai/DeepSeek-V3.2-TEE": { alias: "Chutes DeepSeek V3.2" },
      },
    },
  },
}
```

AccordionGroup


OAuth overrides

    You can customize the OAuth flow with optional environment variables:

    | Variable | Purpose |
    | -------- | ------- |
    | `CHUTES_CLIENT_ID` | Custom OAuth client ID |
    | `CHUTES_CLIENT_SECRET` | Custom OAuth client secret |
    | `CHUTES_OAUTH_REDIRECT_URI` | Custom redirect URI |
    | `CHUTES_OAUTH_SCOPES` | Custom OAuth scopes |

    See the [Chutes OAuth docs](https://chutes.ai/docs/sign-in-with-chutes/overview)
    for redirect-app requirements and help.




Notes

    - API-key and OAuth discovery both use the same `chutes` provider id.
    - Chutes models are registered as `chutes/<model-id>`.
    - If discovery fails at startup, the bundled static catalog is used automatically.



## Related

CardGroup


Model selection

    Provider rules, model refs, and failover behavior.


Configuration reference

    Full config schema including provider settings.


Chutes

    Chutes dashboard and API docs.


Chutes API keys

    Create and manage Chutes API keys.

---
