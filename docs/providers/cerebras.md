---
type: openclaw_doc
title: "Cerebras"
source: "https://docs.openclaw.ai/providers/cerebras"
source_hash: "840b07cf3ba988d954f5f63313105ba2cc8e51aac02b00029c28b3572f6d1a97"
doc_path: "providers/cerebras.md"
original_doc_path: "providers/cerebras.md"
duplicate_index: 1
---

# Cerebras
Source: https://docs.openclaw.ai/providers/cerebras



[Cerebras](https://www.cerebras.ai) provides high-speed OpenAI-compatible inference.

| Property | Value                        |
| -------- | ---------------------------- |
| Provider | `cerebras`                   |
| Auth     | `CEREBRAS_API_KEY`           |
| API      | OpenAI-compatible            |
| Base URL | `https://api.cerebras.ai/v1` |

## Getting Started

<Steps>
  <Step title="Get an API key">
    Create an API key in the [Cerebras Cloud Console](https://cloud.cerebras.ai).
  </Step>

  <Step title="Run onboarding">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --auth-choice cerebras-api-key
    ```
  </Step>

  <Step title="Verify models are available">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw models list --provider cerebras
    ```
  </Step>
</Steps>

### Non-Interactive Setup

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice cerebras-api-key \
  --cerebras-api-key "$CEREBRAS_API_KEY"
```

## Built-In Catalog

OpenClaw ships a static Cerebras catalog for the public OpenAI-compatible endpoint:

| Model ref                                 | Name                 | Notes                                  |
| ----------------------------------------- | -------------------- | -------------------------------------- |
| `cerebras/zai-glm-4.7`                    | Z.ai GLM 4.7         | Default model; preview reasoning model |
| `cerebras/gpt-oss-120b`                   | GPT OSS 120B         | Production reasoning model             |
| `cerebras/qwen-3-235b-a22b-instruct-2507` | Qwen 3 235B Instruct | Preview non-reasoning model            |
| `cerebras/llama3.1-8b`                    | Llama 3.1 8B         | Production speed-focused model         |

<Warning>
  Cerebras marks `zai-glm-4.7` and `qwen-3-235b-a22b-instruct-2507` as preview models, and `llama3.1-8b` / `qwen-3-235b-a22b-instruct-2507` are documented for deprecation on May 27, 2026. Check Cerebras' supported-models page before relying on them for production.
</Warning>

## Manual Config

The bundled plugin usually means you only need the API key. Use explicit
`models.providers.cerebras` config when you want to override model metadata:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  env: { CEREBRAS_API_KEY: "sk-..." },
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

<Note>
  If the Gateway runs as a daemon (launchd/systemd), make sure `CEREBRAS_API_KEY`
  is available to that process, for example in `~/.openclaw/.env` or through
  `env.shellEnv`.
</Note>
