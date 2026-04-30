---
type: openclaw_doc
title: "ElevenLabs"
source: "https://docs.openclaw.ai/providers/elevenlabs"
source_hash: "813bfb96716cab5f17a86afaa789bbbb121266c5716df7c6950b93e97e588888"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "providers/elevenlabs.md"
original_doc_path: "providers/elevenlabs.md"
duplicate_index: 1
---

# ElevenLabs
Source: https://docs.openclaw.ai/providers/elevenlabs



OpenClaw uses ElevenLabs for text-to-speech, batch speech-to-text with Scribe
v2, and Voice Call streaming STT with Scribe v2 Realtime.

| Capability               | OpenClaw surface                              | Default                  |
| ------------------------ | --------------------------------------------- | ------------------------ |
| Text-to-speech           | `messages.tts` / `talk`                       | `eleven_multilingual_v2` |
| Batch speech-to-text     | `tools.media.audio`                           | `scribe_v2`              |
| Streaming speech-to-text | Voice Call `streaming.provider: "elevenlabs"` | `scribe_v2_realtime`     |

## Authentication

Set `ELEVENLABS_API_KEY` in the environment. `XI_API_KEY` is also accepted for
compatibility with existing ElevenLabs tooling.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
export ELEVENLABS_API_KEY="..."
```

## Text-to-speech

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  messages: {
    tts: {
      providers: {
        elevenlabs: {
          apiKey: "${ELEVENLABS_API_KEY}",
          voiceId: "pMsXgVXv3BLzUgSXRplE",
          modelId: "eleven_multilingual_v2",
        },
      },
    },
  },
}
```

Set `modelId` to `eleven_v3` to use ElevenLabs v3 TTS. OpenClaw keeps
`eleven_multilingual_v2` as the default for existing installs.

## Speech-to-text

Use Scribe v2 for inbound audio attachments and short recorded voice segments:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  tools: {
    media: {
      audio: {
        enabled: true,
        models: [{ provider: "elevenlabs", model: "scribe_v2" }],
      },
    },
  },
}
```

OpenClaw sends multipart audio to ElevenLabs `/v1/speech-to-text` with
`model_id: "scribe_v2"`. Language hints map to `language_code` when present.

## Voice Call streaming STT

The bundled `elevenlabs` plugin registers Scribe v2 Realtime for Voice Call
streaming transcription.

| Setting         | Config path                                                               | Default                                           |
| --------------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| API key         | `plugins.entries.voice-call.config.streaming.providers.elevenlabs.apiKey` | Falls back to `ELEVENLABS_API_KEY` / `XI_API_KEY` |
| Model           | `...elevenlabs.modelId`                                                   | `scribe_v2_realtime`                              |
| Audio format    | `...elevenlabs.audioFormat`                                               | `ulaw_8000`                                       |
| Sample rate     | `...elevenlabs.sampleRate`                                                | `8000`                                            |
| Commit strategy | `...elevenlabs.commitStrategy`                                            | `vad`                                             |
| Language        | `...elevenlabs.languageCode`                                              | (unset)                                           |

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  plugins: {
    entries: {
      "voice-call": {
        config: {
          streaming: {
            enabled: true,
            provider: "elevenlabs",
            providers: {
              elevenlabs: {
                apiKey: "${ELEVENLABS_API_KEY}",
                audioFormat: "ulaw_8000",
                commitStrategy: "vad",
                languageCode: "en",
              },
            },
          },
        },
      },
    },
  },
}
```

<Note>
  Voice Call receives Twilio media as 8 kHz G.711 u-law. The ElevenLabs realtime
  provider defaults to `ulaw_8000`, so telephony frames can be forwarded without
  transcoding.
</Note>

## Related

* [Text-to-speech](/tools/tts)
* [Model selection](/concepts/model-providers)
