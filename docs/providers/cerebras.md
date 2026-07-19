---
type: openclaw_doc
title: "Cerebras"
source: "https://docs.openclaw.ai/providers/cerebras"
source_hash: "77c6a11a437b95793a8e6cedd4d63b4e186777b8a0a4e974b11d76b906cafc1a"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/cerebras.md"
original_doc_path: "providers/cerebras.md"
duplicate_index: 1
---

# Cerebras
Source: https://docs.openclaw.ai/providers/cerebras

[Cerebras](https://www.cerebras.ai) provides high-speed OpenAI-compatible inference on custom inference hardware. The plugin ships a static two-model catalog (no live discovery).

| Property        | Value                                                     |
| --------------- | --------------------------------------------------------- |
| Provider id     | `cerebras`                                                |
| Plugin          | official external package (`@openclaw/cerebras-provider`) |
| Auth env var    | `CEREBRAS_API_KEY`                                        |
| Onboarding flag | `--auth-choice cerebras-api-key`                          |
| Direct CLI flag | `--cerebras-api-key <key>`                                |
| API             | OpenAI-compatible (`openai-completions`)                  |
| Base URL        | `https://api.cerebras.ai/v1`                              |
| Default model   | `cerebras/zai-glm-4.7`                                    |

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

    Lists both static models. If `CEREBRAS_API_KEY` is unresolved, `openclaw models status --json` reports the missing credential under `auth.unusableProfiles`.



## Non-interactive setup

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice cerebras-api-key \
  --cerebras-api-key "$CEREBRAS_API_KEY"
```

## Built-in catalog

Both models share a 128k context window and 8,192 max output tokens.

| Model ref               | Name         | Reasoning | Notes                                  |
| ----------------------- | ------------ | --------- | -------------------------------------- |
| `cerebras/zai-glm-4.7`  | Z.ai GLM 4.7 | yes       | Default model; preview reasoning model |
| `cerebras/gpt-oss-120b` | GPT OSS 120B | yes       | Production reasoning model             |

## Manual config

Most setups only need the API key. Use explicit `models.providers.cerebras` config to override model metadata or run in `mode: "merge"` against the static catalog:

```json5
{
  env: { CEREBRAS_API_KEY: "csk-..." },
  agents: {
    defaults: {
      model: { primary: "cerebras/zai-glm-4.7" },
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

    Reasoning effort levels for the two reasoning-capable Cerebras models.


Configuration reference

    Agent defaults and model configuration.


Models FAQ

    Auth profiles, switching models, and resolving "no profile" errors.

---
