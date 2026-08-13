---
type: openclaw_doc
title: "Text-to-speech"
source: "https://docs.openclaw.ai/tools/tts"
source_hash: "826b6eba4979985ff92fb64a0e09e6ba1f984f86fb01558021e790340c823748"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/tts.md"
original_doc_path: "tools/tts.md"
duplicate_index: 1
---

# Text-to-speech
Source: https://docs.openclaw.ai/tools/tts

OpenClaw converts outbound replies into audio across **14 speech providers**:
native voice messages on Feishu, Matrix, Telegram, and WhatsApp; audio
attachments everywhere else; and PCM/Ulaw streams for telephony and Talk.

TTS is the speech-output half of Talk's `stt-tts` mode (`talk.speak` calls this
same synthesis path). Provider-native `realtime` Talk sessions synthesize
speech inside the realtime provider instead; `transcription` sessions never
synthesize an assistant voice reply.

## Quick start

Steps


Pick a provider

    OpenAI and ElevenLabs are the most reliable hosted options. Microsoft and
    Local CLI work without an API key. See the [provider matrix](#supported-providers)
    for the full list.


Set the API key

    Export the env var for your provider (for example `OPENAI_API_KEY`,
    `ELEVENLABS_API_KEY`). Microsoft and Local CLI need no key.


Enable in config

    Set `tts.auto: "always"` and `tts.provider`:

    ```json5
    {
      tts: {
        auto: "always",
        provider: "elevenlabs",
      },
    }
    ```



Try it in chat

    `/tts status` shows the current state. `/tts audio Hello from OpenClaw`
    sends a one-off audio reply.


Note

Auto-TTS is **off** by default. When `tts.provider` is unset,
OpenClaw picks the first configured provider in registry auto-select order.
The built-in `tts` agent tool is explicit-intent only: ordinary chat stays
text unless the user asks for audio, uses `/tts`, or enables Auto-TTS/directive
speech.

## Supported providers

| Provider          | Auth                                                                                                             | Notes                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Azure Speech**  | `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` (also `AZURE_SPEECH_API_KEY`, `SPEECH_KEY`, `SPEECH_REGION`)          | Native Ogg/Opus voice-note output and telephony.                                            |
| **DeepInfra**     | `DEEPINFRA_API_KEY`                                                                                              | OpenAI-compatible TTS. Defaults to `hexgrad/Kokoro-82M`.                                    |
| **ElevenLabs**    | `ELEVENLABS_API_KEY` or `XI_API_KEY`                                                                             | Voice cloning, multilingual, deterministic via `seed`; streamed for Discord voice playback. |
| **Fish Audio**    | `FISH_API_KEY` or `FISH_AUDIO_API_KEY`                                                                           | S2.1 hosted TTS, expressive tags, voice discovery, streaming, and telephony.                |
| **Google Gemini** | `GEMINI_API_KEY` or `GOOGLE_API_KEY`                                                                             | Gemini API batch TTS; persona-aware via `promptTemplate: "audio-profile-v1"`.               |
| **Gradium**       | `GRADIUM_API_KEY`                                                                                                | Voice-note and telephony output.                                                            |
| **Inworld**       | `INWORLD_API_KEY`                                                                                                | Streaming TTS API. Native Opus voice-note and PCM telephony.                                |
| **Local CLI**     | none                                                                                                             | Runs a configured local TTS command.                                                        |
| **Microsoft**     | none                                                                                                             | Public Edge neural TTS via `node-edge-tts`. Best-effort, no SLA.                            |
| **MiniMax**       | `MINIMAX_API_KEY` (or Token Plan: `MINIMAX_OAUTH_TOKEN`, `MINIMAX_CODE_PLAN_KEY`, `MINIMAX_CODING_API_KEY`)      | T2A v2 API. Defaults to `speech-2.8-hd`.                                                    |
| **OpenAI**        | `OPENAI_API_KEY`                                                                                                 | Also used for auto-summary; supports persona `instructions`.                                |
| **OpenRouter**    | `OPENROUTER_API_KEY` (can reuse `models.providers.openrouter.apiKey`)                                            | Default model `hexgrad/kokoro-82m`.                                                         |
| **Volcengine**    | `VOLCENGINE_TTS_API_KEY` or `BYTEPLUS_SEED_SPEECH_API_KEY` (legacy AppID/token: `VOLCENGINE_TTS_APPID`/`_TOKEN`) | BytePlus Seed Speech HTTP API.                                                              |
| **Vydra**         | `VYDRA_API_KEY`                                                                                                  | Shared image, video, and speech provider.                                                   |
| **xAI**           | `XAI_API_KEY`                                                                                                    | xAI batch TTS. Native Opus voice-note is **not** supported.                                 |
| **Xiaomi MiMo**   | `XIAOMI_API_KEY`                                                                                                 | MiMo TTS through Xiaomi chat completions.                                                   |

If multiple providers are configured, the selected one is used first and the
others are fallback options. Auto-summary uses `summaryModel` (or
`agents.defaults.model.primary`), so that provider must also be authenticated
if you keep summaries enabled.

Warning

The bundled **Microsoft** provider uses Microsoft Edge's online neural TTS
service via `node-edge-tts`. It is a public web service without a published
SLA or quota — treat it as best-effort. The legacy provider id `edge` is
normalized to `microsoft` and `openclaw doctor --fix` rewrites persisted
config; new configs should always use `microsoft`.

## Configuration

TTS config lives under `tts` in `~/.openclaw/openclaw.json`. Pick a
preset and adapt the provider block. The `speakerVoice`/`speakerVoiceId`
fields shown below are canonical; each provider's own `voice`/`voiceId`/
`voiceName` field names still work as legacy aliases.

Tabs


Azure Speech

```json5
{
  tts: {
    auto: "always",
    provider: "azure-speech",
    providers: {
      "azure-speech": {
        apiKey: "${AZURE_SPEECH_KEY}",
        region: "eastus",
        speakerVoice: "en-US-JennyNeural",
        lang: "en-US",
        outputFormat: "audio-24khz-48kbitrate-mono-mp3",
        voiceNoteOutputFormat: "ogg-24khz-16bit-mono-opus",
      },
    },
  },
}
```


ElevenLabs

```json5
{
  tts: {
    auto: "always",
    provider: "elevenlabs",
    providers: {
      elevenlabs: {
        apiKey: "${ELEVENLABS_API_KEY}",
        model: "eleven_multilingual_v2",
        speakerVoiceId: "EXAVITQu4vr4xnSDxMaL",
      },
    },
  },
}
```


Fish Audio

```json5
{
  tts: {
    auto: "tagged",
    provider: "fish-audio",
    providers: {
      "fish-audio": {
        apiKey: "${FISH_API_KEY}",
        model: "s2.1-pro",
        speakerVoiceId: "802e3bc2b27e49c2995d23ef70e6ac89",
        latency: "balanced",
      },
    },
  },
}
```


Google Gemini

```json5
{
  tts: {
    auto: "always",
    provider: "google",
    providers: {
      google: {
        apiKey: "${GEMINI_API_KEY}",
        model: "gemini-3.1-flash-tts-preview",
        speakerVoice: "Kore",
        // Optional natural-language style prompts:
        // audioProfile: "Speak in a calm, podcast-host tone.",
        // speakerName: "Alex",
      },
    },
  },
}
```


Gradium

```json5
{
  tts: {
    auto: "always",
    provider: "gradium",
    providers: {
      gradium: {
        apiKey: "${GRADIUM_API_KEY}",
        speakerVoiceId: "YTpq7expH9539ERJ",
      },
    },
  },
}
```


Inworld

```json5
{
  tts: {
    auto: "always",
    provider: "inworld",
    providers: {
      inworld: {
        apiKey: "${INWORLD_API_KEY}",
        modelId: "inworld-tts-1.5-max",
        speakerVoiceId: "Sarah",
        temperature: 0.7,
      },
    },
  },
}
```


Local CLI

```json5
{
  tts: {
    auto: "always",
    provider: "tts-local-cli",
    providers: {
      "tts-local-cli": {
        command: "say",
        args: ["-o", "{{OutputPath}}", "{{Text}}"],
        outputFormat: "wav",
        timeoutMs: 120000,
      },
    },
  },
}
```


Microsoft (no key)

```json5
{
  tts: {
    auto: "always",
    provider: "microsoft",
    providers: {
      microsoft: {
        enabled: true,
        speakerVoice: "en-US-MichelleNeural",
        lang: "en-US",
        outputFormat: "audio-24khz-48kbitrate-mono-mp3",
        rate: "+0%",
        pitch: "+0%",
      },
    },
  },
}
```


MiniMax

```json5
{
  tts: {
    auto: "always",
    provider: "minimax",
    providers: {
      minimax: {
        apiKey: "${MINIMAX_API_KEY}",
        model: "speech-2.8-hd",
        speakerVoiceId: "English_expressive_narrator",
        speed: 1.0,
        vol: 1.0,
        pitch: 0,
      },
    },
  },
}
```


OpenAI + ElevenLabs

```json5
{
  tts: {
    auto: "always",
    provider: "openai",
    summaryModel: "openai/gpt-4.1-mini",
    modelOverrides: { enabled: true },
    providers: {
      openai: {
        apiKey: "${OPENAI_API_KEY}",
        model: "gpt-4o-mini-tts",
        speakerVoice: "alloy",
      },
      elevenlabs: {
        apiKey: "${ELEVENLABS_API_KEY}",
        model: "eleven_multilingual_v2",
        speakerVoiceId: "EXAVITQu4vr4xnSDxMaL",
        voiceSettings: { stability: 0.5, similarityBoost: 0.75, style: 0.0, useSpeakerBoost: true, speed: 1.0 },
        applyTextNormalization: "auto",
        languageCode: "en",
      },
    },
  },
}
```


OpenRouter

```json5
{
  tts: {
    auto: "always",
    provider: "openrouter",
    providers: {
      openrouter: {
        apiKey: "${OPENROUTER_API_KEY}",
        model: "hexgrad/kokoro-82m",
        speakerVoice: "af_alloy",
        responseFormat: "mp3",
      },
    },
  },
}
```


Volcengine

```json5
{
  tts: {
    auto: "always",
    provider: "volcengine",
    providers: {
      volcengine: {
        apiKey: "${VOLCENGINE_TTS_API_KEY}",
        resourceId: "seed-tts-1.0",
        speakerVoice: "en_female_anna_mars_bigtts",
      },
    },
  },
}
```


xAI

```json5
{
  tts: {
    auto: "always",
    provider: "xai",
    providers: {
      xai: {
        apiKey: "${XAI_API_KEY}",
        speakerVoiceId: "eve",
        language: "en",
        responseFormat: "mp3",
      },
    },
  },
}
```


Xiaomi MiMo

```json5
{
  tts: {
    auto: "always",
    provider: "xiaomi",
    providers: {
      xiaomi: {
        apiKey: "${XIAOMI_API_KEY}",
        model: "mimo-v2.5-tts",
        speakerVoice: "mimo_default",
        format: "mp3",
      },
    },
  },
}
```


For Xiaomi `mimo-v2.5-tts-voicedesign`, omit `speakerVoice` and set `style` to
the voice-design prompt. OpenClaw sends that prompt as the TTS `user` message
and does not send `audio.voice` for the voicedesign model.

### Local Speech Swift and speech-core

[Speech Swift](https://github.com/soniqo/speech-swift) and
[speech-core](https://github.com/soniqo/speech-core) provide local speech
inference across macOS, Linux, and Windows. Use the OpenAI-compatible HTTP
provider when Speech Swift and OpenClaw run on the same Mac. Use Local CLI for
direct executable integration on any supported host.

Install `ffmpeg` when a channel needs OpenClaw to convert WAV output to Opus or
raw PCM.

Tabs


macOS HTTP

Warning

This HTTP setup requires Speech Swift v0.0.23 or later. If Homebrew already
installed an older version, run `brew update && brew upgrade speech` first.

Start Speech Swift's local server:

```bash
brew install speech
speech-server --port 8080
```

Point the OpenAI speech provider at its loopback endpoint. `responseFormat`
must be `wav` because the local endpoint does not emit compressed audio:

```json5
{
  tts: {
    auto: "always",
    provider: "openai",
    providers: {
      openai: {
        apiKey: "local",
        baseUrl: "http://127.0.0.1:8080/v1",
        model: "tts-1",
        speakerVoice: "alloy",
        responseFormat: "wav",
      },
    },
  },
}
```

`tts-1` selects Kokoro. Speech Swift registry aliases such as `qwen3-tts`,
`cosyvoice`, and `voxcpm2` select other local engines. The placeholder API key
is required by OpenClaw's provider configuration but is not validated by the
loopback server.

macOS CLI

The Homebrew `speech` executable can write directly to OpenClaw's
per-invocation output path:

```json5
{
  tts: {
    auto: "always",
    provider: "tts-local-cli",
    providers: {
      "tts-local-cli": {
        command: "speech",
        args: ["speak", "{{Text}}", "--output", "{{OutputPath}}"],
        outputFormat: "wav",
        timeoutMs: 120000,
      },
    },
  },
}
```



Linux CLI

Install a speech-core Linux release package, download the ONNX model set once,
and verify synthesis before starting OpenClaw:

```bash
speech download-models
speech speak "Hello from OpenClaw" hello.wav
```

Then configure the packaged Kokoro command:

```json5
{
  tts: {
    auto: "always",
    provider: "tts-local-cli",
    providers: {
      "tts-local-cli": {
        command: "speech",
        args: ["speak", "{{Text}}", "{{OutputPath}}"],
        outputFormat: "wav",
        timeoutMs: 120000,
      },
    },
  },
}
```

See the [speech-core Linux CLI reference](https://github.com/soniqo/speech-core/blob/main/docs/cli.md)
for release packages and model-directory settings.

Windows CLI

Download the speech-core Windows release, extract it, and install the ONNX
models once:

```powershell
$Version = "0.0.11"
$Url = "https://github.com/soniqo/speech-core/releases/download/v$Version/speech-$Version-windows-x64.zip"
Invoke-WebRequest $Url -OutFile speech.zip
Expand-Archive speech.zip
Set-Location "speech\speech-$Version-windows-x64\bin"
Set-ExecutionPolicy -Scope Process Bypass
.\speech_download_models.ps1
```

Then point Local CLI at the packaged Kokoro executable:

```json5
{
  tts: {
    auto: "always",
    provider: "tts-local-cli",
    providers: {
      "tts-local-cli": {
        command: "C:\\path\\to\\speech-0.0.11-windows-x64\\bin\\speech_synthesize.exe",
        args: ["{{OutputPath}}", "{{Text}}", "en"],
        outputFormat: "wav",
        timeoutMs: 120000,
      },
    },
  },
}
```

See the [speech-core Windows CLI reference](https://github.com/soniqo/speech-core/blob/main/docs/cli.md)
for the packaged server, model cache, and standalone command syntax.



### Per-agent voice overrides

Use `agents.entries.*.tts` when one agent should speak with a different provider,
voice, model, persona, or auto-TTS mode. The agent block deep-merges over
`tts`, so provider credentials can stay in the global provider config:

```json5
{
  tts: {
    auto: "always",
    provider: "elevenlabs",
    providers: {
      elevenlabs: { apiKey: "${ELEVENLABS_API_KEY}", model: "eleven_multilingual_v2" },
    },
  },
  agents: {
    entries: {
      reader: {
        default: true,
        tts: {
          providers: {
            elevenlabs: { speakerVoiceId: "EXAVITQu4vr4xnSDxMaL" },
          },
        },
      },
    },
  },
}
```

To pin a per-agent persona, set `agents.entries.*.tts.persona` alongside provider
config — it overrides the global `tts.persona` for that agent only.

Precedence order for automatic replies, `/tts audio`, `/tts status`, and the
`tts` agent tool:

1. `tts`
2. active `agents.entries.*.tts`
3. channel override, when the channel supports `channels.<channel>.tts`
4. account override, when the channel passes `channels.<channel>.accounts.<id>.tts`
5. local `/tts` preferences for this host
6. inline `[[tts:...]]` directives when [model overrides](#model-driven-directives) are enabled

Channel and account overrides use the same shape as `tts` and
deep-merge over the earlier layers, so shared provider credentials can stay in
`tts` while a channel or bot account changes only speaker voice, model, persona,
or auto mode:

```json5
{
  tts: {
    provider: "openai",
    providers: {
      openai: { apiKey: "${OPENAI_API_KEY}", model: "gpt-4o-mini-tts" },
    },
  },
  channels: {
    feishu: {
      accounts: {
        english: {
          tts: {
            providers: {
              openai: { speakerVoice: "shimmer" },
            },
          },
        },
      },
    },
  },
}
```

## Personas

A **persona** is a stable spoken identity that can be applied deterministically
across providers. It can prefer one provider, define provider-neutral prompt
intent, and carry provider-specific bindings for voices, models, prompt
templates, seeds, and voice settings.

### Minimal persona

```json5
{
  tts: {
    auto: "always",
    persona: "narrator",
    personas: {
      narrator: {
        label: "Narrator",
        provider: "elevenlabs",
        providers: {
          elevenlabs: {
            speakerVoiceId: "EXAVITQu4vr4xnSDxMaL",
            modelId: "eleven_multilingual_v2",
          },
        },
      },
    },
  },
}
```

### Full persona (provider-specific shaping)

```json5
{
  tts: {
    auto: "always",
    persona: "alfred",
    personas: {
      alfred: {
        label: "Alfred",
        description: "Dry, warm British butler narrator.",
        provider: "google",
        fallbackPolicy: "preserve-persona",
        providers: {
          google: {
            model: "gemini-3.1-flash-tts-preview",
            speakerVoice: "Algieba",
            promptTemplate: "audio-profile-v1",
          },
          openai: { model: "gpt-4o-mini-tts", speakerVoice: "cedar" },
          elevenlabs: {
            speakerVoiceId: "voice_id",
            modelId: "eleven_multilingual_v2",
            seed: 42,
            voiceSettings: {
              stability: 0.65,
              similarityBoost: 0.8,
              style: 0.25,
              useSpeakerBoost: true,
              speed: 0.95,
            },
          },
        },
      },
    },
  },
}
```

### Persona resolution

The active persona is selected deterministically:

1. `/tts persona <id>` local preference, if set.
2. `tts.persona`, if set.
3. No persona.

Provider selection runs explicit-first:

1. Direct overrides (CLI, gateway, Talk, allowed TTS directives).
2. `/tts provider <id>` local preference.
3. Active persona's `provider`.
4. `tts.provider`.
5. Registry auto-select.

For each provider attempt, OpenClaw merges configs in this order:

1. `tts.providers.<id>`
2. `tts.personas.<persona>.providers.<id>`
3. Trusted request overrides
4. Allowed model-emitted TTS directive overrides

### Custom persona shaping

Provider-neutral `personas.<id>.prompt.*` config is retired. Doctor removes
those fields and points to the speech-provider seam. Put built-in provider
settings under `personas.<id>.providers.<provider>` (for example Google
`personaPrompt` or OpenAI `instructions`). For custom shaping, implement a
speech provider plugin with `prepareSynthesis(ctx)` and return adjusted text,
provider config, or overrides before `synthesize()` runs. This keeps expressive
prompt construction in provider code where request semantics are known.

### Fallback policy

`fallbackPolicy` controls behavior when a persona has **no binding** for the
attempted provider:

| Policy              | Behavior                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `preserve-persona`  | **Default.** Provider-neutral prompt fields stay available; the provider may use them or ignore them.                                            |
| `provider-defaults` | Persona is omitted from prompt preparation for that attempt; the provider uses its neutral defaults while fallback to other providers continues. |
| `fail`              | Skip that provider attempt with `reasonCode: "not_configured"` and `personaBinding: "missing"`. Fallback providers are still tried.              |

The whole TTS request only fails when **every** attempted provider is skipped
or fails.

Talk session provider selection is session-scoped. A Talk client should choose
provider ids, model ids, voice ids, and locales from `talk.catalog` and pass
them through the Talk session or handoff request. Opening a voice session should
not mutate `tts` or global Talk provider defaults.

## Model-driven directives

By default, the assistant **can** emit `[[tts:...]]` directives to override
voice, model, or speed for a single reply, plus an optional
`[[tts:text]]...[[/tts:text]]` block for expressive cues that should appear in
audio only:

```text
Here you go.

[[tts:speakerVoiceId=pMsXgVXv3BLzUgSXRplE model=eleven_v3 speed=1.1]]
[[tts:text]](laughs) Read the song once more.[[/tts:text]]
```

When `tts.auto` is `"tagged"`, **directives are required** to trigger
audio. Streaming block delivery strips directives from visible text before the
channel sees them, even when split across adjacent blocks.

`provider=...` is ignored unless `modelOverrides.allowProvider: true`. When a
reply declares `provider=...`, the other keys in that directive are parsed
only by that provider; unsupported keys are stripped and reported as TTS
directive warnings.

**Available directive keys:**

- `provider` (registered provider id; requires `allowProvider: true`)
- `speakerVoice` / `speakerVoiceId` (legacy aliases: `voice`, `voiceName`, `voice_name`, `google_voice`, `voiceId`)
- `model` / `google_model`
- `stability`, `similarityBoost`, `style`, `speed`, `useSpeakerBoost`
- `vol` / `volume` (MiniMax volume, `(0, 10]`)
- `pitch` (MiniMax integer pitch, −12 to 12; fractional values are truncated)
- `emotion` (Volcengine emotion tag)
- `applyTextNormalization` (`auto|on|off`)
- `languageCode` (ISO 639-1)
- `seed`

**Disable model overrides entirely:**

```json5
{ tts: { modelOverrides: { enabled: false } } }
```

**Allow provider switching while keeping other knobs configurable:**

```json5
{ tts: { modelOverrides: { enabled: true, allowProvider: true, allowSeed: false } } }
```

## Slash commands

Single command `/tts`. On Discord, OpenClaw also registers `/voice` because
`/tts` is a built-in Discord command — text `/tts ...` still works.

```text
/tts off | on | status
/tts chat on | off | default
/tts latest
/tts provider <id>
/tts persona <id> | off
/tts limit <chars>
/tts summary off
/tts audio <text>
```

Note

Commands require an authorized sender (allowlist/owner rules apply) and either
`commands.text` or native command registration must be enabled.

Behavior notes:

- `/tts on` writes the local TTS preference to `always`; `/tts off` writes it to `off`.
- `/tts chat on|off|default` writes a session-scoped auto-TTS override for the current chat.
- `/tts persona <id>` writes the local persona preference; `/tts persona off` clears it.
- `/tts latest` reads the latest assistant reply from the current session transcript and sends it as audio once. It stores only a hash of that reply on the session entry to suppress duplicate voice sends.
- `/tts audio` generates a one-off audio reply (does **not** toggle TTS on).
- `/tts limit <chars>` accepts **100–4096** (4096 is the Telegram caption/message max); values outside that range are rejected.
- `limit` and `summary` are stored in **local prefs**, not the main config.
- `/tts status` includes fallback diagnostics for the latest attempt — `Fallback: <primary> -> <used>`, `Attempts: ...`, and per-attempt detail (`provider:outcome(reasonCode) latency`).
- `/status` shows the active TTS mode plus configured provider, model, voice, and sanitized custom endpoint metadata when TTS is enabled.

## Per-user preferences

Slash commands write local overrides to the TTS preferences path. The default is
`~/.openclaw/settings/tts.json`; override it with `OPENCLAW_TTS_PREFS`. Doctor
moves the retired global `tts.prefsPath` value into shared machine state.
Advanced multi-agent setups may still set `agents.entries.<id>.tts.prefsPath`
when agents intentionally use separate preference stores.

| Stored field | Effect                                                                           |
| ------------ | -------------------------------------------------------------------------------- |
| `auto`       | Local auto-TTS override (`always`, `off`, …)                                     |
| `provider`   | Local primary provider override                                                  |
| `persona`    | Local persona override                                                           |
| `maxLength`  | Summary/truncation threshold (default `1500` chars, `/tts limit` range 100–4096) |
| `summarize`  | Summary toggle (default `true`)                                                  |

These override the effective config from `tts` plus the active
`agents.entries.*.tts` block for that host.

## Output formats

TTS voice delivery is channel-capability driven. Channel plugins advertise
whether voice-style TTS should ask providers for a native `voice-note` target or
keep normal `audio-file` synthesis, and whether the channel transcodes
non-native output before sending.

Telegram also advertises captioned final TTS. With `tts.mode: "final"` and
Auto-TTS set to `always` (or eligible `inbound` mode), streamed text is held
until synthesis finishes and sent as the voice-note caption. Text beyond
Telegram's caption limit follows the voice note as a normal text message. If
synthesis or a proven pre-send delivery step fails, OpenClaw sends the visible
text instead. `tagged` mode keeps its normal streaming behavior, and text
inside a `[[tts:text]]` block remains audio-only.

After synthesis, OpenClaw persists batch TTS output in the media store under
`tool-speech-synthesis`. The reply uses that stable media path instead of a
provider temporary file, and normal media maintenance prunes expired output.
Local CLI providers may still use `{{OutputPath}}` as scratch space before
OpenClaw imports the completed bytes. See [Media playback](/nodes/media-playback)
for inline-player formats and limits.

| Target                                | Format                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Feishu / Matrix / Telegram / WhatsApp | Voice-note replies prefer **Opus** (`opus_48000_64` from ElevenLabs, `opus` from OpenAI). 48 kHz / 64 kbps balances clarity and size. |
| Other channels                        | **MP3** (`mp3_44100_128` from ElevenLabs, `mp3` from OpenAI). 44.1 kHz / 128 kbps is the default balance for speech.                  |
| Talk / telephony                      | Provider-native **PCM** (Inworld 22050 Hz, Google 24 kHz), or `ulaw_8000` from Gradium for telephony.                                 |

Per-provider notes:

- **Feishu / WhatsApp transcoding:** when a voice-note reply lands as MP3/WebM/WAV/M4A or another likely audio file, the channel plugin transcodes it to 48 kHz Ogg/Opus with `ffmpeg` (`libopus`, 64 kbps) before sending the native voice message. WhatsApp sends the result through the Baileys `audio` payload with `ptt: true` and `audio/ogg; codecs=opus`. On transcode failure: Feishu catches the error and falls back to sending the original file as a plain attachment; WhatsApp has no fallback, so the send itself fails rather than posting an incompatible PTT payload.
- **MiniMax:** MP3 (`speech-2.8-hd` model, 32 kHz sample rate) for normal audio attachments; transcoded to 48 kHz Opus with `ffmpeg` for channel-advertised voice-note targets.
- **Xiaomi MiMo:** MP3 by default, or WAV when configured; transcoded to 48 kHz Opus with `ffmpeg` for channel-advertised voice-note targets.
- **Local CLI:** uses the configured `outputFormat`. Voice-note targets are converted to Ogg/Opus and telephony output is converted to raw 16 kHz mono PCM with `ffmpeg`.
- **Google Gemini:** returns raw 24 kHz PCM. OpenClaw wraps it as WAV for audio attachments, transcodes it to 48 kHz Opus for voice-note targets, and returns PCM directly for Talk/telephony.
- **Gradium:** WAV for audio attachments, Opus for voice-note targets, and `ulaw_8000` at 8 kHz for telephony.
- **Inworld:** MP3 for normal audio attachments, native `OGG_OPUS` for voice-note targets, and raw `PCM` at 22050 Hz for Talk/telephony.
- **xAI:** MP3 by default; audio-file synthesis may use `mp3`, `wav`, `pcm`, `mulaw`, or `alaw` for both buffered and streaming output. Voice-note targets use MP3 for streaming and buffered fallback because xAI's `pcm`, `mulaw`, and `alaw` outputs are headerless raw audio. Buffered synthesis uses xAI's batch REST `/v1/tts` endpoint; `textToSpeechStream` uses native `wss://api.x.ai/v1/tts`. This is not the realtime voice contract. Native Opus voice-note format is not supported.
- **Microsoft:** uses `microsoft.outputFormat` (default `audio-24khz-48kbitrate-mono-mp3`).
  - The bundled transport accepts an `outputFormat`, but not all formats are available from the service.
  - Output format values follow Microsoft Speech output formats (including Ogg/WebM Opus).
  - Telegram `sendVoice` accepts OGG/MP3/M4A; use OpenAI/ElevenLabs if you need guaranteed Opus voice messages.
  - If the configured Microsoft output format fails, OpenClaw retries with MP3.
  - When no explicit voice override is set and the default English voice is used, OpenClaw auto-switches to a Chinese neural voice (`zh-CN-XiaoxiaoNeural`, `zh-CN` locale) if the reply text is CJK-dominant.

OpenAI and ElevenLabs choose output formats per channel as listed above. An
explicit OpenAI `responseFormat` overrides that selection; a format that is not
voice-note compatible may be delivered as an audio file or transcoded by a
channel that supports conversion.

## Auto-TTS behavior

When `tts.auto` is enabled, OpenClaw:

- Skips TTS if the reply already contains structured media.
- Skips very short replies (under 10 chars).
- Summarizes long replies when summaries are enabled, using
  `summaryModel` (or `agents.defaults.model.primary`).
- Attaches the generated audio to the reply.
- In `mode: "final"`, sends TTS after streamed text completes. Channels without
  captioned-final support receive an audio-only supplement; Telegram puts text
  within its caption limit on the voice note and sends overflow as follow-up
  text. Generated media goes through the same channel media normalization as
  normal reply attachments.

If the reply exceeds `maxLength`, OpenClaw never skips audio outright:

- **Summary on** (default) and a summary model is available: summarizes the
  text to roughly `maxLength` chars, then synthesizes the summary.
- **Summary off**, summarization fails, or no API key is available for the
  summary model: truncates the text to `maxLength` chars and synthesizes the
  truncated text.

```text
Reply -> TTS enabled?
  no  -> send text
  yes -> has media / short?
          yes -> send text
          no  -> length > limit?
                   no  -> TTS -> attach audio
                   yes -> summary enabled and available?
                            no  -> truncate -> TTS -> attach audio
                            yes -> summarize -> TTS -> attach audio
```

## Field reference

AccordionGroup


Top-level tts.*


ParamField

      Auto-TTS mode. `inbound` only sends audio after an inbound voice message; `tagged` only sends audio when the reply includes `[[tts:...]]` directives or a `[[tts:text]]` block.


ParamField

      Legacy toggle. `openclaw doctor --fix` migrates this to `auto`.


ParamField

      `"all"` includes tool/block replies in addition to final replies.


ParamField

      Speech provider id. When unset, OpenClaw uses the first configured provider in registry auto-select order. Legacy `provider: "edge"` is rewritten to `"microsoft"` by `openclaw doctor --fix`.


ParamField

      Active persona id from `personas`. Normalized to lowercase.


ParamField
" type="object">
      Stable spoken identity. Fields: `label`, `description`, `provider`, `fallbackPolicy`, `prompt`, `providers.<provider>`. See [Personas](#personas).


ParamField

      Cheap model for auto-summary; defaults to `agents.defaults.model.primary`. Accepts `provider/model` or a configured model alias.


ParamField

      Allow the model to emit TTS directives. `enabled` defaults to `true`; `allowProvider` defaults to `false`.


ParamField
" type="object">
      Provider-owned settings keyed by speech provider id. Legacy direct blocks (`tts.openai`, `.elevenlabs`, `.microsoft`, `.edge`) are rewritten by `openclaw doctor --fix`; commit only `tts.providers.<id>`.


ParamField

      Hard cap for TTS input characters. `/tts audio`, `tts.convert`, and `tts.speak` fail if exceeded.


ParamField

      Request timeout in milliseconds. A per-call `timeoutMs` (agent tool, gateway) wins when set; otherwise an explicitly configured `tts.timeoutMs` wins over any plugin-authored provider default.



Provider `apiKey` fields can be raw strings or SecretRefs. During cold Gateway
startup, an unavailable TTS SecretRef marks the built-in TTS capability
configured-unavailable instead of stopping the Gateway. `tts.speak` then returns
`UNAVAILABLE` with reason `SECRET_SURFACE_UNAVAILABLE`, and no provider request is
sent. Status and doctor list the degraded TTS owner and its config paths. The
explicit refs remain in the runtime snapshot, so environment or profile
credentials cannot silently select a different account. Reloads and config-write
preflight apply the owner-aware degradation policy: an unchanged eligible TTS
owner may keep its last-known-good credentials as stale, while a new or changed
failure becomes cold without blocking healthy owners. Structurally invalid refs
and resolved values still fail startup or reject the update.


Azure Speech


ParamField
Env: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_API_KEY`, or `SPEECH_KEY`.

ParamField
Azure Speech region (e.g. `eastus`). Env: `AZURE_SPEECH_REGION` or `SPEECH_REGION`.

ParamField
Optional Azure Speech endpoint override (alias `baseUrl`).

ParamField
Azure voice ShortName. Default `en-US-JennyNeural`. Legacy alias: `voice`.

ParamField
SSML language code. Default `en-US`.

ParamField
Azure `X-Microsoft-OutputFormat` for standard audio. Default `audio-24khz-48kbitrate-mono-mp3`.

ParamField
Azure `X-Microsoft-OutputFormat` for voice-note output. Default `ogg-24khz-16bit-mono-opus`.



ElevenLabs


ParamField
Falls back to `ELEVENLABS_API_KEY` or `XI_API_KEY`.

ParamField
Model id. Default `eleven_multilingual_v2`. Legacy ids `eleven_turbo_v2_5`/`eleven_turbo_v2` are normalized to the matching `flash` model.

ParamField
ElevenLabs voice id. Default `pMsXgVXv3BLzUgSXRplE`. Legacy alias: `voiceId`.

ParamField

      `stability`, `similarityBoost`, `style` (each `0..1`, defaults `0.5`/`0.75`/`0`), `useSpeakerBoost` (`true|false`, default `true`), `speed` (`0.5..2.0`, default `1.0`).


ParamField
Text normalization mode.

ParamField
2-letter ISO 639-1 (e.g. `en`, `de`).

ParamField
Integer `0..4294967295` for best-effort determinism.

ParamField
Override ElevenLabs API base URL.



Google Gemini


ParamField
Falls back to `GEMINI_API_KEY` / `GOOGLE_API_KEY`. If omitted, TTS can reuse `models.providers.google.apiKey` before env fallback.

ParamField
Gemini TTS model. Default `gemini-3.1-flash-tts-preview`.

ParamField
Gemini prebuilt voice name. Default `Kore`. Legacy aliases: `voiceName`, `voice`.

ParamField
Natural-language style prompt prepended before spoken text.

ParamField
Optional speaker label prepended before spoken text when your prompt uses a named speaker.

ParamField
Set to `audio-profile-v1` to wrap active persona prompt fields in a deterministic Gemini TTS prompt structure.

ParamField
Google-specific extra persona prompt text appended to the template's Director's Notes.

ParamField
Only `https://generativelanguage.googleapis.com` is accepted.



Gradium


ParamField
Env: `GRADIUM_API_KEY`.

ParamField
HTTPS Gradium API URL on `api.gradium.ai`. Default `https://api.gradium.ai`.

ParamField
Default Emma (`YTpq7expH9539ERJ`). Legacy alias: `voiceId`.



Inworld

    ### Inworld primary


ParamField
Env: `INWORLD_API_KEY`.

ParamField
Default `https://api.inworld.ai`.

ParamField
Default `inworld-tts-1.5-max`. Also: `inworld-tts-1.5-mini`, `inworld-tts-1-max`, `inworld-tts-1`.

ParamField
Default `Sarah`. Legacy alias: `voiceId`.

ParamField
Sampling temperature `0..2` (exclusive of 0).




Local CLI (tts-local-cli)


ParamField
Local executable or command string for CLI TTS.

ParamField
Command arguments. Supports `{{Text}}`, `{{OutputPath}}`, `{{OutputDir}}`, `{{OutputBase}}` placeholders.

ParamField
Expected CLI output format. Default `mp3` for audio attachments.

ParamField
Command timeout in milliseconds. Default `120000`.

ParamField
Optional command working directory.

ParamField
">Optional environment overrides for the command.

    Command stdout and generated or converted audio are limited to 50 MiB. Diagnostic stderr is limited to 1 MiB. OpenClaw terminates the command and fails synthesis when either limit is exceeded.




Microsoft (no API key)


ParamField
Allow Microsoft speech usage.

ParamField
Microsoft neural voice name (e.g. `en-US-MichelleNeural`). Legacy alias: `voice`. If the default English voice is in effect and reply text is CJK-dominant, OpenClaw auto-switches to `zh-CN-XiaoxiaoNeural`.

ParamField
Language code (e.g. `en-US`).

ParamField
Microsoft output format. Default `audio-24khz-48kbitrate-mono-mp3`. Not all formats are supported by the bundled Edge-backed transport.

ParamField
Percent strings (e.g. `+10%`, `-5%`).

ParamField
Write JSON subtitles alongside the audio file.

ParamField
Proxy URL for Microsoft speech requests.

ParamField
Request timeout override (ms).

ParamField
Legacy alias. Run `openclaw doctor --fix` to rewrite persisted config to `providers.microsoft`.



MiniMax


ParamField
Falls back to `MINIMAX_API_KEY`. Token Plan auth via `MINIMAX_OAUTH_TOKEN`, `MINIMAX_CODE_PLAN_KEY`, or `MINIMAX_CODING_API_KEY`.

ParamField
Default `https://api.minimax.io`. Env: `MINIMAX_API_HOST`.

ParamField
Default `speech-2.8-hd`. Env: `MINIMAX_TTS_MODEL`.

ParamField
Default `English_expressive_narrator`. Env: `MINIMAX_TTS_VOICE_ID`. Legacy alias: `voiceId`.

ParamField
`0.5..2.0`. Default `1.0`.

ParamField
`(0, 10]`. Default `1.0`.

ParamField
Integer `-12..12`. Default `0`. Fractional values are truncated before the request.



OpenAI


ParamField
Falls back to `OPENAI_API_KEY`.

ParamField
OpenAI TTS model id. Default `gpt-4o-mini-tts`.

ParamField
Voice name (e.g. `alloy`, `cedar`). Default `coral`. Legacy alias: `voice`.

ParamField
Explicit OpenAI `instructions` field. When set, persona prompt fields are **not** auto-mapped.

ParamField
Explicit response format. When omitted, OpenClaw selects Opus for voice-note targets and MP3 otherwise. Use `wav` for compatible local endpoints that do not encode compressed audio.

ParamField
">Extra JSON fields merged into `/audio/speech` request bodies after generated OpenAI TTS fields. Use this for OpenAI-compatible endpoints such as Kokoro that require provider-specific keys like `lang`; unsafe prototype keys are ignored.

ParamField

      Override the OpenAI TTS endpoint. Resolution order: config → `OPENAI_TTS_BASE_URL` → `https://api.openai.com/v1`. Non-default values are treated as OpenAI-compatible TTS endpoints, so custom model and voice names are accepted, and `speed` loses its `0.25..4.0` range check.




OpenRouter


ParamField
Env: `OPENROUTER_API_KEY`. Can reuse `models.providers.openrouter.apiKey`.

ParamField
Default `https://openrouter.ai/api/v1`. Legacy `https://openrouter.ai/v1` is normalized.

ParamField
Default `hexgrad/kokoro-82m`. Alias: `modelId`.

ParamField
Default `af_alloy`. Legacy aliases: `voice`, `voiceId`.

ParamField
Default `mp3`.

ParamField
Provider-native speed override.



Volcengine (BytePlus Seed Speech)


ParamField
Env: `VOLCENGINE_TTS_API_KEY` or `BYTEPLUS_SEED_SPEECH_API_KEY`.

ParamField
Default `seed-tts-1.0`. Env: `VOLCENGINE_TTS_RESOURCE_ID`. Use `seed-tts-2.0` when your project has TTS 2.0 entitlement.

ParamField
App key header. Default `aGjiRDfUWi`. Env: `VOLCENGINE_TTS_APP_KEY`.

ParamField
Override the Seed Speech TTS HTTP endpoint. Env: `VOLCENGINE_TTS_BASE_URL`.

ParamField
Voice type. Default `en_female_anna_mars_bigtts`. Env: `VOLCENGINE_TTS_VOICE`. Legacy alias: `voice`.

ParamField
Provider-native speed ratio, `0.2..3`.

ParamField
Provider-native emotion tag.

ParamField
Legacy Volcengine Speech Console fields. Env: `VOLCENGINE_TTS_APPID`, `VOLCENGINE_TTS_TOKEN`, `VOLCENGINE_TTS_CLUSTER` (default `volcano_tts`).



xAI


ParamField
Env: `XAI_API_KEY`.

ParamField
Default `https://api.x.ai/v1`. Env: `XAI_BASE_URL`.

ParamField
Default `eve`. With auth, `openclaw infer tts voices --provider xai` fetches the current built-in catalog; without auth it lists offline fallbacks `ara`, `eve`, `leo`, `rex`, and `sal`. Account custom voice IDs are forwarded even when absent from the built-in list. Legacy alias: `voiceId`.

ParamField
BCP-47 language code or `auto`. Default `en`.

ParamField
Default `mp3`.

ParamField
Provider-native speed override, `0.7..1.5`.



Xiaomi MiMo


ParamField
Env: `XIAOMI_API_KEY`.

ParamField
Default `https://api.xiaomimimo.com/v1`. Env: `XIAOMI_BASE_URL`.

ParamField
Default `mimo-v2.5-tts`. Env: `XIAOMI_TTS_MODEL`. Also supports `mimo-v2.5-tts-voicedesign`.

ParamField
Default `mimo_default` for preset-voice models. Env: `XIAOMI_TTS_VOICE`. Legacy alias: `voice`. Not sent for `mimo-v2.5-tts-voicedesign`.

ParamField
Default `mp3`. Env: `XIAOMI_TTS_FORMAT`.

ParamField
Optional natural-language style instruction sent as the user message; not spoken. For `mimo-v2.5-tts-voicedesign`, this is the voice-design prompt; OpenClaw supplies a default when omitted.


## Agent tool

The `tts` tool converts text to speech and returns an audio attachment for
reply delivery. On Feishu, Matrix, Telegram, and WhatsApp, the audio is
delivered as a voice message rather than a file attachment. Feishu and
WhatsApp can transcode non-Opus TTS output on this path when `ffmpeg` is
available.

WhatsApp sends audio through Baileys as a PTT voice note (`audio` with
`ptt: true`) and sends visible text **separately** from PTT audio because
clients do not consistently render captions on voice notes.

The tool accepts optional `channel` and `timeoutMs` fields; `timeoutMs` is a
per-call provider request timeout in milliseconds. Per-call values override
`tts.timeoutMs`; configured TTS timeouts override any plugin-authored
provider default.

## Gateway RPC

| Method            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `tts.status`      | Read current TTS state and last attempt.     |
| `tts.enable`      | Set local auto preference to `always`.       |
| `tts.disable`     | Set local auto preference to `off`.          |
| `tts.convert`     | One-off text → audio.                        |
| `tts.setProvider` | Set local provider preference.               |
| `tts.personas`    | List configured personas and the active one. |
| `tts.setPersona`  | Set local persona preference.                |
| `tts.providers`   | List configured providers and status.        |

## Service links

- [Azure Speech provider](/providers/azure-speech)
- [Azure Speech REST text-to-speech](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech)
- [ElevenLabs Authentication](https://elevenlabs.io/docs/api-reference/authentication)
- [ElevenLabs Text to Speech](https://elevenlabs.io/docs/api-reference/text-to-speech)
- [Gradium](/providers/gradium)
- [Inworld TTS API](https://docs.inworld.ai/tts/tts)
- [Microsoft Speech output formats](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)
- [MiniMax T2A v2 API](https://platform.minimaxi.com/document/T2A%20V2)
- [node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)
- [OpenAI Audio API reference](https://platform.openai.com/docs/api-reference/audio)
- [OpenAI text-to-speech guide](https://platform.openai.com/docs/guides/text-to-speech)
- [speech-core](https://github.com/soniqo/speech-core)
- [Speech Swift](https://github.com/soniqo/speech-swift)
- [Volcengine TTS HTTP API](/providers/volcengine#text-to-speech)
- [xAI text to speech](https://docs.x.ai/developers/rest-api-reference/inference/voice#text-to-speech-rest)
- [Xiaomi MiMo speech synthesis](/providers/xiaomi#text-to-speech)

## Related

- [Media overview](/tools/media-overview)
- [Media playback](/nodes/media-playback)
- [Music generation](/tools/music-generation)
- [Video generation](/tools/video-generation)
- [Slash commands](/tools/slash-commands)
- [Voice call plugin](/plugins/voice-call)

---
