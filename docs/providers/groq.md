---
type: openclaw_doc
title: "Groq"
source: "https://docs.openclaw.ai/providers/groq"
source_hash: "024a319d2c0b730e015a53d68bf355c3baee7faae8c3124cb653ae78117ce161"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "providers/groq.md"
original_doc_path: "providers/groq.md"
duplicate_index: 1
---

# Groq
Source: https://docs.openclaw.ai/providers/groq



[Groq](https://groq.com) provides ultra-fast inference on open-source models
(Llama, Gemma, Mistral, and more) using custom LPU hardware. OpenClaw connects
to Groq through its OpenAI-compatible API.

| Property | Value             |
| -------- | ----------------- |
| Provider | `groq`            |
| Auth     | `GROQ_API_KEY`    |
| API      | OpenAI-compatible |

## Getting started

<Steps>
  <Step title="Get an API key">
    Create an API key at [console.groq.com/keys](https://console.groq.com/keys).
  </Step>

  <Step title="Set the API key">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    export GROQ_API_KEY="gsk_..."
    ```
  </Step>

  <Step title="Set a default model">
    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
    {
      agents: {
        defaults: {
          model: { primary: "groq/llama-3.3-70b-versatile" },
        },
      },
    }
    ```
  </Step>
</Steps>

### Config file example

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
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

Groq's model catalog changes frequently. Run `openclaw models list | grep groq`
to see currently available models, or check
[console.groq.com/docs/models](https://console.groq.com/docs/models).

| Model                       | Notes                              |
| --------------------------- | ---------------------------------- |
| **Llama 3.3 70B Versatile** | General-purpose, large context     |
| **Llama 3.1 8B Instant**    | Fast, lightweight                  |
| **Gemma 2 9B**              | Compact, efficient                 |
| **Mixtral 8x7B**            | MoE architecture, strong reasoning |

<Tip>
  Use `openclaw models list --provider groq` for the most up-to-date list of
  models available on your account.
</Tip>

## Reasoning models

OpenClaw maps its shared `/think` levels to Groq's model-specific
`reasoning_effort` values. For `qwen/qwen3-32b`, disabled thinking sends
`none` and enabled thinking sends `default`. For Groq GPT-OSS reasoning models,
OpenClaw sends `low`, `medium`, or `high`; disabled thinking omits
`reasoning_effort` because those models do not support a disabled value.

## Audio transcription

Groq also provides fast Whisper-based audio transcription. When configured as a
media-understanding provider, OpenClaw uses Groq's `whisper-large-v3-turbo`
model to transcribe voice messages through the shared `tools.media.audio`
surface.

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
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

<AccordionGroup>
  <Accordion title="Audio transcription details">
    | Property           | Value                                     |
    | ------------------ | ----------------------------------------- |
    | Shared config path | `tools.media.audio`                       |
    | Default base URL   | `https://api.groq.com/openai/v1`          |
    | Default model      | `whisper-large-v3-turbo`                  |
    | API endpoint       | OpenAI-compatible `/audio/transcriptions` |
  </Accordion>

  <Accordion title="Environment note">
    If the Gateway runs as a daemon (launchd/systemd), make sure `GROQ_API_KEY` is
    available to that process (for example, in `~/.openclaw/.env` or via
    `env.shellEnv`).

    <Warning>
      Keys set only in your interactive shell are not visible to daemon-managed
      gateway processes. Use `~/.openclaw/.env` or `env.shellEnv` config for
      persistent availability.
    </Warning>
  </Accordion>
</AccordionGroup>

## Related

<CardGroup>
  <Card title="Model selection" href="/concepts/model-providers" icon="layers">
    Choosing providers, model refs, and failover behavior.
  </Card>

  <Card title="Configuration reference" href="/gateway/configuration-reference" icon="gear">
    Full config schema including provider and audio settings.
  </Card>

  <Card title="Groq Console" href="https://console.groq.com" icon="arrow-up-right-from-square">
    Groq dashboard, API docs, and pricing.
  </Card>

  <Card title="Groq model list" href="https://console.groq.com/docs/models" icon="list">
    Official Groq model catalog.
  </Card>
</CardGroup>
