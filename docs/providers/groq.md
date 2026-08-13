---
type: openclaw_doc
title: "Groq"
source: "https://docs.openclaw.ai/providers/groq"
source_hash: "f60e63ac8c2c5e0d2e318e90006a4b7dd6bf9c63207a4be9085cbce0a0698082"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/groq.md"
original_doc_path: "providers/groq.md"
duplicate_index: 1
---

# Groq
Source: https://docs.openclaw.ai/providers/groq

[Groq](https://groq.com) provides ultra-fast inference on open-weight models (Llama, Gemma, Kimi, Qwen, GPT OSS, and more) using custom LPU hardware. The Groq plugin registers both an OpenAI-compatible chat provider and an audio media-understanding provider.

| Property               | Value                                    |
| ---------------------- | ---------------------------------------- |
| Provider id            | `groq`                                   |
| Plugin                 | official external package                |
| Auth env var           | `GROQ_API_KEY`                           |
| API                    | OpenAI-compatible (`openai-completions`) |
| Base URL               | `https://api.groq.com/openai/v1`         |
| Audio transcription    | `whisper-large-v3-turbo` (default)       |
| Suggested chat default | `groq/openai/gpt-oss-120b`               |

## Install plugin

Install the official plugin, then restart Gateway:

```bash
openclaw plugins install @openclaw/groq-provider
openclaw gateway restart
```

## Getting started

Steps


Get an API key

    Create an API key at [console.groq.com/keys](https://console.groq.com/keys).


Set the API key

    ```bash
export GROQ_API_KEY=gsk_...
```


Set a default model

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "groq/openai/gpt-oss-120b" },
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
  env: { vars: { GROQ_API_KEY: "gsk_..." } },
  agents: {
    defaults: {
      model: { primary: "groq/openai/gpt-oss-120b" },
    },
  },
}
```

## Built-in catalog

OpenClaw ships a manifest-backed Groq catalog with both reasoning and non-reasoning entries. Run `openclaw models list --provider groq` to see the static rows for your installed version, or check [console.groq.com/docs/models](https://console.groq.com/docs/models) for Groq's authoritative list.

| Model ref                           | Name               | Reasoning | Input        | Context |
| ----------------------------------- | ------------------ | --------- | ------------ | ------- |
| `groq/openai/gpt-oss-120b`          | GPT OSS 120B       | yes       | text         | 131,072 |
| `groq/openai/gpt-oss-20b`           | GPT OSS 20B        | yes       | text         | 131,072 |
| `groq/openai/gpt-oss-safeguard-20b` | Safety GPT OSS 20B | yes       | text         | 131,072 |
| `groq/qwen/qwen3.6-27b`             | Qwen 3.6 27B       | yes       | text + image | 131,072 |
| `groq/groq/compound`                | Compound           | no        | text         | 131,072 |
| `groq/groq/compound-mini`           | Compound Mini      | no        | text         | 131,072 |

The manifest also retains `groq/llama-3.1-8b-instant` and `groq/llama-3.3-70b-versatile` as hidden deprecated compatibility rows until Groq's August 16, 2026 shutdown. Use `groq/openai/gpt-oss-20b` and `groq/openai/gpt-oss-120b`, respectively, for new configurations.

Tip

  The catalog evolves with each OpenClaw release. `openclaw models list --provider groq` shows the rows known to your installed version; cross-check with [console.groq.com/docs/models](https://console.groq.com/docs/models) for newly-added or deprecated models.

## Reasoning models

Groq reasoning models (`reasoning: true` in the table above) map OpenClaw's shared `/think` levels onto `reasoning_effort` values of `low`, `medium`, or `high`. `/think off` or `/think none` omits `reasoning_effort` from the request rather than sending a disabled value.

See [Thinking modes](/tools/thinking) for the shared `/think` levels and how OpenClaw translates them per provider.

## Audio transcription

Groq's plugin also registers an **audio media-understanding provider** so voice messages can be transcribed through the shared `tools.media.audio` surface.

| Property          | Value                                     |
| ----------------- | ----------------------------------------- |
| Shared model path | `tools.media.models`                      |
| Default base URL  | `https://api.groq.com/openai/v1`          |
| Default model     | `whisper-large-v3-turbo`                  |
| Auto priority     | 20                                        |
| API endpoint      | OpenAI-compatible `/audio/transcriptions` |

To make Groq the default audio backend:

```json5
{
  tools: {
    media: {
      models: [{ provider: "groq", capabilities: ["audio"] }],
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

    OpenClaw accepts any Groq model id at runtime. Use the exact id shown by Groq and prefix it with `groq/`. The static catalog covers the common cases; uncatalogued ids fall through to the default OpenAI-compatible template.

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
