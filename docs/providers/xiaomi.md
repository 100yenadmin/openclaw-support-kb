---
type: openclaw_doc
title: "Xiaomi MiMo"
source: "https://docs.openclaw.ai/providers/xiaomi"
source_hash: "6ae00a55832971a6d07ae10f98ec6b55019cfbfa46d15eb10f332eb54c7b161c"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/xiaomi.md"
original_doc_path: "providers/xiaomi.md"
duplicate_index: 1
---

# Xiaomi MiMo
Source: https://docs.openclaw.ai/providers/xiaomi

Xiaomi MiMo is the API platform for **MiMo** models. OpenClaw includes a bundled `xiaomi` plugin that registers both an OpenAI-compatible chat provider and a speech (TTS) provider against the same `XIAOMI_API_KEY`.

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| Provider id     | `xiaomi`                                 |
| Plugin          | bundled, `enabledByDefault: true`        |
| Auth env var    | `XIAOMI_API_KEY`                         |
| Onboarding flag | `--auth-choice xiaomi-api-key`           |
| Direct CLI flag | `--xiaomi-api-key <key>`                 |
| Contracts       | chat completions + `speechProviders`     |
| API             | OpenAI-compatible (`openai-completions`) |
| Base URL        | `https://api.xiaomimimo.com/v1`          |
| Default model   | `xiaomi/mimo-v2-flash`                   |
| TTS default     | `mimo-v2.5-tts`, voice `mimo_default`    |

## Getting started

Steps


Get an API key

    Create an API key in the [Xiaomi MiMo console](https://platform.xiaomimimo.com/#/console/api-keys).


Run onboarding

    ```bash
    openclaw onboard --auth-choice xiaomi-api-key
    ```

    Or pass the key directly:

    ```bash
    openclaw onboard --auth-choice xiaomi-api-key --xiaomi-api-key "$XIAOMI_API_KEY"
    ```



Verify the model is available

    ```bash
    openclaw models list --provider xiaomi
    ```


## Built-in catalog

| Model ref              | Input       | Context   | Max output | Reasoning | Notes         |
| ---------------------- | ----------- | --------- | ---------- | --------- | ------------- |
| `xiaomi/mimo-v2-flash` | text        | 262,144   | 8,192      | No        | Default model |
| `xiaomi/mimo-v2-pro`   | text        | 1,048,576 | 32,000     | Yes       | Large context |
| `xiaomi/mimo-v2-omni`  | text, image | 262,144   | 32,000     | Yes       | Multimodal    |

Tip

The default model ref is `xiaomi/mimo-v2-flash`. The provider is injected automatically when `XIAOMI_API_KEY` is set or an auth profile exists.

## Text-to-speech

The bundled `xiaomi` plugin also registers Xiaomi MiMo as a speech provider for
`messages.tts`. It calls Xiaomi's chat-completions TTS contract with the text as
an `assistant` message and optional style guidance as a `user` message.

| Property | Value                                    |
| -------- | ---------------------------------------- |
| TTS id   | `xiaomi` (`mimo` alias)                  |
| Auth     | `XIAOMI_API_KEY`                         |
| API      | `POST /v1/chat/completions` with `audio` |
| Default  | `mimo-v2.5-tts`, voice `mimo_default`    |
| Output   | MP3 by default; WAV when configured      |

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "xiaomi",
      providers: {
        xiaomi: {
          apiKey: "xiaomi_api_key",
          model: "mimo-v2.5-tts",
          voice: "mimo_default",
          format: "mp3",
          style: "Bright, natural, conversational tone.",
        },
      },
    },
  },
}
```

Supported built-in voices include `mimo_default`, `default_zh`, `default_en`,
`Mia`, `Chloe`, `Milo`, and `Dean`. `mimo-v2-tts` is supported for older MiMo
TTS accounts; the default uses the current MiMo-V2.5 TTS model. For voice-note
targets such as Feishu and Telegram, OpenClaw transcodes Xiaomi output to 48kHz
Opus with `ffmpeg` before delivery.

## Config example

```json5
{
  env: { XIAOMI_API_KEY: "your-key" },
  agents: { defaults: { model: { primary: "xiaomi/mimo-v2-flash" } } },
  models: {
    mode: "merge",
    providers: {
      xiaomi: {
        baseUrl: "https://api.xiaomimimo.com/v1",
        api: "openai-completions",
        apiKey: "XIAOMI_API_KEY",
        models: [
          {
            id: "mimo-v2-flash",
            name: "Xiaomi MiMo V2 Flash",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 262144,
            maxTokens: 8192,
          },
          {
            id: "mimo-v2-pro",
            name: "Xiaomi MiMo V2 Pro",
            reasoning: true,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 1048576,
            maxTokens: 32000,
          },
          {
            id: "mimo-v2-omni",
            name: "Xiaomi MiMo V2 Omni",
            reasoning: true,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 262144,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
}
```

AccordionGroup


Auto-injection behavior

    The `xiaomi` provider is injected automatically when `XIAOMI_API_KEY` is set in your environment or an auth profile exists. You do not need to manually configure the provider unless you want to override model metadata or the base URL.



Model details

    - **mimo-v2-flash** — lightweight and fast, ideal for general-purpose text tasks. No reasoning support.
    - **mimo-v2-pro** — supports reasoning with a 1M token context window for long-document workloads.
    - **mimo-v2-omni** — reasoning-enabled multimodal model that accepts both text and image inputs.


Note

    All models use the `xiaomi/` prefix (for example `xiaomi/mimo-v2-pro`).





Troubleshooting

    - If models do not appear, confirm `XIAOMI_API_KEY` is set and valid.
    - When the Gateway runs as a daemon, ensure the key is available to that process (for example in `~/.openclaw/.env` or via `env.shellEnv`).


Warning

    Keys set only in your interactive shell are not visible to daemon-managed gateway processes. Use `~/.openclaw/.env` or `env.shellEnv` config for persistent availability.




## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full OpenClaw configuration reference.


Xiaomi MiMo console

    Xiaomi MiMo dashboard and API key management.

---
