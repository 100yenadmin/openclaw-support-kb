---
type: openclaw_doc
title: "Deepgram"
source: "https://docs.openclaw.ai/providers/deepgram"
source_hash: "d0007390e6ed72763b715b6ab3ee59bb1ab1f5095fee9696d7586858ae756ca4"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/deepgram.md"
original_doc_path: "providers/deepgram.md"
duplicate_index: 1
---

# Deepgram
Source: https://docs.openclaw.ai/providers/deepgram

Deepgram is a speech-to-text API. OpenClaw uses it for inbound audio/voice-note
transcription through `tools.media.audio` and for Voice Call streaming STT
through `plugins.entries.voice-call.config.streaming`.

Batch transcription uploads the complete audio file to Deepgram and injects
the transcript into the reply pipeline (`{{Transcript}}` + `[Audio]` block).
Voice Call streaming forwards live G.711 u-law frames over Deepgram's
WebSocket `listen` endpoint and emits partial/final transcripts as Deepgram
returns them.

| Detail        | Value                                                      |
| ------------- | ---------------------------------------------------------- |
| Website       | [deepgram.com](https://deepgram.com)                       |
| Docs          | [developers.deepgram.com](https://developers.deepgram.com) |
| Auth          | `DEEPGRAM_API_KEY`                                         |
| Default model | `nova-3`                                                   |

## Getting started

Steps


Set your API key

    ```bash
    DEEPGRAM_API_KEY=dg_...
    ```


Enable the audio provider

    ```json5
    {
      tools: {
        media: {
          audio: {
            enabled: true,
            models: [{ provider: "deepgram", model: "nova-3" }],
          },
        },
      },
    }
    ```


Send a voice note

    Send an audio message through any connected channel. OpenClaw transcribes it
    via Deepgram and injects the transcript into the reply pipeline.


## Configuration options

| Option     | Path                            | Description                           |
| ---------- | ------------------------------- | ------------------------------------- |
| `model`    | `tools.media.models[].model`    | Deepgram model id (default: `nova-3`) |
| `language` | `tools.media.models[].language` | Language hint (optional)              |

`providerOptions.deepgram` merges extra query params directly into the
Deepgram `/listen` request, so any Deepgram-supported param name works
(for example `detect_language`, `punctuate`, `smart_format`):

Tabs


With language hint

    ```json5
    {
      tools: {
        media: {
          audio: {
            enabled: true,
            models: [{ provider: "deepgram", model: "nova-3", language: "en" }],
          },
        },
      },
    }
    ```


With Deepgram options

    ```json5
    {
      tools: {
        media: {
          audio: {
            enabled: true,
            providerOptions: {
              deepgram: {
                detect_language: true,
                punctuate: true,
                smart_format: true,
              },
            },
            models: [{ provider: "deepgram", model: "nova-3" }],
          },
        },
      },
    }
    ```


## Voice Call streaming STT

The bundled `deepgram` plugin also registers a realtime transcription provider
for the Voice Call plugin.

| Setting         | Config path                                                             | Default                                      |
| --------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| API key         | `plugins.entries.voice-call.config.streaming.providers.deepgram.apiKey` | Falls back to `DEEPGRAM_API_KEY`             |
| Base URL        | `...deepgram.baseUrl`                                                   | `DEEPGRAM_BASE_URL` or Deepgram's public API |
| Model           | `...deepgram.model`                                                     | `nova-3`                                     |
| Language        | `...deepgram.language`                                                  | (unset)                                      |
| Encoding        | `...deepgram.encoding`                                                  | `mulaw`                                      |
| Sample rate     | `...deepgram.sampleRate`                                                | `8000`                                       |
| Endpointing     | `...deepgram.endpointingMs`                                             | `800`                                        |
| Interim results | `...deepgram.interimResults`                                            | `true`                                       |

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        config: {
          streaming: {
            enabled: true,
            provider: "deepgram",
            providers: {
              deepgram: {
                apiKey: "${DEEPGRAM_API_KEY}",
                model: "nova-3",
                endpointingMs: 800,
                language: "en-US",
              },
            },
          },
        },
      },
    },
  },
}
```

For a [Deepgram custom endpoint](https://developers.deepgram.com/reference/custom-endpoints),
set `baseUrl` to the endpoint root, including any base path but not `/listen`.
Realtime endpoints accept `http://`, `https://`, `ws://`, and `wss://`. HTTP
maps to WS, HTTPS maps to WSS, and explicit WebSocket schemes stay unchanged.
Malformed URLs and other schemes fail during session setup.

Note

Voice Call receives telephony audio as 8 kHz G.711 u-law. The Deepgram
streaming provider defaults to `encoding: "mulaw"` and `sampleRate: 8000`, so
Twilio media frames can be forwarded directly.

## Notes

AccordionGroup


Authentication

    Authentication follows the standard provider auth order. `DEEPGRAM_API_KEY` is
    the simplest path.


Proxy and custom endpoints

    Override endpoints or headers on the Deepgram `tools.media.models[]` entry when using a proxy.


Output behavior

    Output follows the same audio rules as other providers (size caps, timeouts,
    transcript injection).


## Related

CardGroup


Media tools

    Audio, image, and video processing pipeline overview.


Configuration

    Full config reference including media tool settings.


Troubleshooting

    Common issues and debugging steps.


FAQ

    Frequently asked questions about OpenClaw setup.

---
