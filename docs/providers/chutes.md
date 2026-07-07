---
type: openclaw_doc
title: "Chutes"
source: "https://docs.openclaw.ai/providers/chutes"
source_hash: "ffbf3be0522189fe1526e86f95c7c8cb1fd5264d552091c956a4547c44fa3312"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/chutes.md"
original_doc_path: "providers/chutes.md"
duplicate_index: 1
---

# Chutes
Source: https://docs.openclaw.ai/providers/chutes

[Chutes](https://chutes.ai) exposes open-source model catalogs through an
OpenAI-compatible API. OpenClaw supports both browser OAuth and API-key auth.

| Property         | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| Provider         | `chutes`                                                |
| Plugin           | official external package (`@openclaw/chutes-provider`) |
| API              | OpenAI-compatible                                       |
| Base URL         | `https://llm.chutes.ai/v1`                              |
| Auth             | OAuth or API key (see below)                            |
| Runtime env vars | `CHUTES_API_KEY`, `CHUTES_OAUTH_TOKEN`                  |

`CHUTES_OAUTH_TOKEN` supplies an already-obtained OAuth access token directly
(for example in CI), bypassing the interactive browser flow below.

## Install plugin

```bash
openclaw plugins install @openclaw/chutes-provider
openclaw gateway restart
```

## Getting started

Both paths set the default model to `chutes/zai-org/GLM-4.7-TEE` and register
the Chutes catalog.

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




API key


Steps


Get an API key

        Create a key at
        [chutes.ai/settings/api-keys](https://chutes.ai/settings/api-keys).


Run the API key onboarding flow

        ```bash
        openclaw onboard --auth-choice chutes-api-key
        ```




## Discovery behavior

When Chutes auth is available, OpenClaw queries `GET /v1/models` with that
credential and uses the discovered models, cached for 5 minutes per
credential. On an expired/unauthorized key (HTTP 401), OpenClaw retries once
without credentials. If discovery still returns no rows, fails, or returns any
other non-2xx status, it falls back to the bundled static catalog (both API-key
and OAuth discovery use this same path). If discovery fails at startup, the
static catalog is used automatically.

## Default aliases

OpenClaw registers three convenience aliases for the Chutes catalog:

| Alias           | Target model                                          |
| --------------- | ----------------------------------------------------- |
| `chutes-fast`   | `chutes/zai-org/GLM-4.7-FP8`                          |
| `chutes-pro`    | `chutes/deepseek-ai/DeepSeek-V3.2-TEE`                |
| `chutes-vision` | `chutes/chutesai/Mistral-Small-3.2-24B-Instruct-2506` |

## Built-in starter catalog

The bundled fallback catalog has 47 models. A representative sample of current refs:

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

Run `openclaw models list --all --provider chutes` for the full list.

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

    Customize the OAuth flow with optional environment variables:

    | Variable | Purpose |
    | -------- | ------- |
    | `CHUTES_CLIENT_ID` | OAuth client id (prompted if unset) |
    | `CHUTES_CLIENT_SECRET` | OAuth client secret |
    | `CHUTES_OAUTH_REDIRECT_URI` | Redirect URI (default `http://127.0.0.1:1456/oauth-callback`) |
    | `CHUTES_OAUTH_SCOPES` | Space-separated scopes (default `openid profile chutes:invoke`) |

    See the [Chutes OAuth docs](https://chutes.ai/docs/sign-in-with-chutes/overview)
    for redirect-app requirements and help.




Notes

    - Chutes models are registered as `chutes/<model-id>`.
    - Chutes does not report token usage while streaming (`supportsUsageInStreaming: false`); usage totals still show once the stream completes.



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
