---
type: openclaw_doc
title: "SenseAudio"
source: "https://docs.openclaw.ai/providers/senseaudio"
source_hash: "c2586b1a02048beccb793d08d0ee4e1c2e6c2ee3738634a5e87ea69b6d2ba4c0"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/senseaudio.md"
original_doc_path: "providers/senseaudio.md"
duplicate_index: 1
---

# SenseAudio
Source: https://docs.openclaw.ai/providers/senseaudio

SenseAudio transcribes inbound audio and voice-note attachments through OpenClaw's shared `tools.media.audio` pipeline. OpenClaw posts multipart audio to the OpenAI-compatible transcription endpoint and injects the returned text as `{{Transcript}}` plus an `[Audio]` block.

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| Provider id   | `senseaudio`                                     |
| Plugin        | bundled, `enabledByDefault: true`                |
| Contract      | `mediaUnderstandingProviders` (audio)            |
| Auth env var  | `SENSEAUDIO_API_KEY`                             |
| Default model | `senseaudio-asr-pro-1.5-260319`                  |
| Default URL   | `https://api.senseaudio.cn/v1`                   |
| Website       | [senseaudio.cn](https://senseaudio.cn)           |
| Docs          | [senseaudio.cn/docs](https://senseaudio.cn/docs) |

## Getting started

Steps


Set your API key

    ```bash
    export SENSEAUDIO_API_KEY="..."
    ```


Enable the audio provider

    ```json5
    {
      tools: {
        media: {
          audio: {
            enabled: true,
            models: [{ provider: "senseaudio", model: "senseaudio-asr-pro-1.5-260319" }],
          },
        },
      },
    }
    ```


Send a voice note

    Send an audio message through any connected channel. OpenClaw uploads the
    audio to SenseAudio and uses the transcript in the reply pipeline.


## Options

| Option     | Path                            | Description                         |
| ---------- | ------------------------------- | ----------------------------------- |
| `model`    | `tools.media.models[].model`    | SenseAudio ASR model id             |
| `language` | `tools.media.models[].language` | Optional language hint              |
| `prompt`   | `tools.media.models[].prompt`   | Optional transcription prompt       |
| `baseUrl`  | `tools.media.models[].baseUrl`  | Override the OpenAI-compatible base |
| `headers`  | `tools.media.models[].headers`  | Extra request headers               |

Note

SenseAudio is batch STT only in OpenClaw. Voice Call realtime transcription
continues to use providers with streaming STT support.

## Related

- [Media understanding (audio)](/nodes/audio)
- [Model providers](/concepts/model-providers)

---
