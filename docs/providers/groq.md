---
type: openclaw_doc
title: "Groq"
source: "https://docs.openclaw.ai/providers/groq"
source_hash: "5cc73d3d030162329b82cc082045459342b08d44aeeaa3223019749c2b623cdb"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/groq.md"
original_doc_path: "providers/groq.md"
duplicate_index: 1
---

# Groq
Source: https://docs.openclaw.ai/providers/groq

[Groq](https://groq.com) provides ultra-fast inference on open-weight models (Llama, Gemma, Kimi, Qwen, GPT OSS, and more) using custom LPU hardware. OpenClaw includes a bundled Groq plugin that registers both an OpenAI-compatible chat provider and an audio media-understanding provider.

| Property               | Value                                    |
| ---------------------- | ---------------------------------------- |
| Provider id            | `groq`                                   |
| Plugin                 | bundled, `enabledByDefault: true`        |
| Auth env var           | `GROQ_API_KEY`                           |
| Onboarding flag        | `--auth-choice groq-api-key`             |
| API                    | OpenAI-compatible (`openai-completions`) |
| Base URL               | `https://api.groq.com/openai/v1`         |
| Audio transcription    | `whisper-large-v3-turbo` (default)       |
| Suggested chat default | `groq/llama-3.3-70b-versatile`           |

## Getting started

Steps


Get an API key

    Create an API key at [console.groq.com/keys](https://console.groq.com/keys).


Set the API key


CodeGroup

```bash Onboarding
openclaw onboard --auth-choice groq-api-key
```

```bash Env only
export GROQ_API_KEY=gsk_...
```





Set a default model

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "groq/llama-3.3-70b-versatile" },
        },
      },
    }
    ```


Verify the catalog is reachable

    ```bash
    openclaw models list --provider groq
    ```


### Config file example

```json5
{
  env: { GROQ_API_KEY: "gsk_..." },
  agents: {
    defaults: {
      model: { primary: "groq/llama-3.3-70b-versatile" },
    },
  },
}
```

## Built-in catalog

OpenClaw ships a manifest-backed Groq catalog with both reasoning and non-reasoning entries. Run `openclaw models list --provider groq` to see the bundled rows for your installed version, or check [console.groq.com/docs/models](https://console.groq.com/docs/models) for Groq's authoritative list.

| Model ref                                        | Name                    | Reasoning | Input        | Context |
| ------------------------------------------------ | ----------------------- | --------- | ------------ | ------- |
| `groq/llama-3.3-70b-versatile`                   | Llama 3.3 70B Versatile | no        | text         | 131,072 |
| `groq/llama-3.1-8b-instant`                      | Llama 3.1 8B Instant    | no        | text         | 131,072 |
| `groq/meta-llama/llama-4-scout-17b-16e-instruct` | Llama 4 Scout 17B       | no        | text + image | 131,072 |
| `groq/openai/gpt-oss-120b`                       | GPT OSS 120B            | yes       | text         | 131,072 |
| `groq/openai/gpt-oss-20b`                        | GPT OSS 20B             | yes       | text         | 131,072 |
| `groq/openai/gpt-oss-safeguard-20b`              | Safety GPT OSS 20B      | yes       | text         | 131,072 |
| `groq/qwen/qwen3-32b`                            | Qwen3 32B               | yes       | text         | 131,072 |
| `groq/groq/compound`                             | Compound                | yes       | text         | 131,072 |
| `groq/groq/compound-mini`                        | Compound Mini           | yes       | text         | 131,072 |

Tip

  The catalog evolves with each OpenClaw release. `openclaw models list --provider groq` shows the rows known to your installed version; cross-check with [console.groq.com/docs/models](https://console.groq.com/docs/models) for newly-added or deprecated models.

## Reasoning models

OpenClaw maps its shared `/think` levels to Groq's model-specific `reasoning_effort` values:

- For `qwen/qwen3-32b`, disabled thinking sends `none` and enabled thinking sends `default`.
- For Groq GPT OSS reasoning models (`openai/gpt-oss-*`), OpenClaw sends `low`, `medium`, or `high` based on `/think` level. Disabled thinking omits `reasoning_effort` because those models do not support a disabled value.
- DeepSeek R1 Distill, Qwen QwQ, and Compound use Groq's native reasoning surface; `/think` controls visibility but the model always reasons.

See [Thinking modes](/tools/thinking) for the shared `/think` levels and how OpenClaw translates them per provider.

## Audio transcription

Groq's bundled plugin also registers an **audio media-understanding provider** so voice messages can be transcribed through the shared `tools.media.audio` surface.

| Property           | Value                                     |
| ------------------ | ----------------------------------------- |
| Shared config path | `tools.media.audio`                       |
| Default base URL   | `https://api.groq.com/openai/v1`          |
| Default model      | `whisper-large-v3-turbo`                  |
| Auto priority      | 20                                        |
| API endpoint       | OpenAI-compatible `/audio/transcriptions` |

To make Groq the default audio backend:

```json5
{
  tools: {
    media: {
      audio: {
        models: [{ provider: "groq" }],
      },
    },
  },
}
```

AccordionGroup


Environment availability for the daemon

    If the Gateway runs as a managed service (launchd, systemd, Docker), `GROQ_API_KEY` must be visible to that process — not just to your interactive shell.


Warning

      A key exported only in an interactive shell will not help a launchd or systemd daemon unless that environment is imported there too. Set the key in `~/.openclaw/.env` or via `env.shellEnv` to make it readable from the gateway process.





Custom Groq model ids

    OpenClaw accepts any Groq model id at runtime. Use the exact id shown by Groq and prefix it with `groq/`. The bundled catalog covers the common cases; uncatalogued ids fall through to the default OpenAI-compatible template.

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "groq/<your-model-id>" },
        },
      },
    }
    ```



## Related

CardGroup


Model providers

    Choosing providers, model refs, and failover behavior.


Thinking modes

    Reasoning effort levels and provider-policy interaction.


Configuration reference

    Full config schema including provider and audio settings.


Groq Console

    Groq dashboard, API docs, and pricing.

---
