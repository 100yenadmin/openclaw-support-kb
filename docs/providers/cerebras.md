---
type: openclaw_doc
title: "Cerebras"
source: "https://docs.openclaw.ai/providers/cerebras"
source_hash: "16792a6f23d1b08a969fdf8bbcb2e3770b2629ffe04cfefb80167e2759a92a48"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/cerebras.md"
original_doc_path: "providers/cerebras.md"
duplicate_index: 1
---

# Cerebras
Source: https://docs.openclaw.ai/providers/cerebras

[Cerebras](https://www.cerebras.ai) provides high-speed OpenAI-compatible inference on custom inference hardware. The plugin ships a static three-model catalog (no live discovery).

| Property        | Value                                                     |
| --------------- | --------------------------------------------------------- |
| Provider id     | `cerebras`                                                |
| Plugin          | official external package (`@openclaw/cerebras-provider`) |
| Auth env var    | `CEREBRAS_API_KEY`                                        |
| Onboarding flag | `--auth-choice cerebras-api-key`                          |
| Direct CLI flag | `--cerebras-api-key <key>`                                |
| API             | OpenAI-compatible (`openai-completions`)                  |
| Base URL        | `https://api.cerebras.ai/v1`                              |
| Default model   | `cerebras/gemma-4-31b`                                    |

## Install plugin

```bash
openclaw plugins install @openclaw/cerebras-provider
openclaw gateway restart
```

## Getting started

Steps


Get an API key

    Create an API key in the [Cerebras Cloud Console](https://cloud.cerebras.ai).


Run onboarding


CodeGroup

```bash Onboarding
openclaw onboard --auth-choice cerebras-api-key
```

```bash Direct flag
openclaw onboard --non-interactive \
  --auth-choice cerebras-api-key \
  --cerebras-api-key "$CEREBRAS_API_KEY"
```

```bash Env only
export CEREBRAS_API_KEY=csk-...
```





Verify models are available

    ```bash
    openclaw models list --provider cerebras
    ```

    Lists all three static models. If `CEREBRAS_API_KEY` is unresolved, `openclaw models status --json` reports the missing credential under `auth.unusableProfiles`.



## Non-interactive setup

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice cerebras-api-key \
  --cerebras-api-key "$CEREBRAS_API_KEY"
```

## Built-in catalog

All three models have a 131,072-token context window and a 40,960-token max output.

| Model ref               | Name         | Reasoning | Notes                                     |
| ----------------------- | ------------ | --------- | ----------------------------------------- |
| `cerebras/zai-glm-4.7`  | Z.ai GLM 4.7 | yes       | Scheduled for deprecation August 17, 2026 |
| `cerebras/gpt-oss-120b` | GPT OSS 120B | yes       | Production reasoning model                |
| `cerebras/gemma-4-31b`  | Gemma 4 31B  | yes       | Default; preview; text-and-image input    |

Fresh onboarding follows Cerebras's current [Gemma 4 recommendation](https://www.cerebras.ai/blog/gemma-4-on-cerebras-the-fastest-inference-is-now-multimodal). Cerebras describes Gemma 4 31B as its reference medium-size model for equal-or-higher intelligence than GPT OSS, with multimodal agentic support. It is a public-preview model and may change or be discontinued on shorter notice than the production GPT OSS endpoint; existing OpenClaw configurations keep their selected model.

## Manual config

Most setups only need the API key. Use explicit `models.providers.cerebras` config to override model metadata or run in `mode: "merge"` against the static catalog:

```json5
{
  env: { CEREBRAS_API_KEY: "csk-..." },
  agents: {
    defaults: {
      model: { primary: "cerebras/gemma-4-31b" },
    },
  },
  models: {
    mode: "merge",
    providers: {
      cerebras: {
        baseUrl: "https://api.cerebras.ai/v1",
        apiKey: "${CEREBRAS_API_KEY}",
        api: "openai-completions",
        models: [
          { id: "zai-glm-4.7", name: "Z.ai GLM 4.7" },
          { id: "gpt-oss-120b", name: "GPT OSS 120B" },
          { id: "gemma-4-31b", name: "Gemma 4 31B" },
        ],
      },
    },
  },
}
```

Note

If the Gateway runs as a daemon (launchd, systemd, Docker), make sure `CEREBRAS_API_KEY` is available to that process — for example in `~/.openclaw/.env` or through `env.shellEnv`. A key exported only in an interactive shell will not help a managed service unless the env is imported separately.

## Related

CardGroup


Model providers

    Choosing providers, model refs, and failover behavior.


Thinking modes

    Reasoning effort levels for the Cerebras models.


Configuration reference

    Agent defaults and model configuration.


Models FAQ

    Auth profiles, switching models, and resolving "no profile" errors.

---
