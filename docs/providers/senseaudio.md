---
type: openclaw_doc
title: "SenseAudio"
source: "https://docs.openclaw.ai/providers/senseaudio"
source_hash: "9e5897bd1e2ab73f9bb552be7ec8bfcea67493963740d0f9be26f6a0d74df07c"
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
| Docs          | [docs.senseaudio.cn](https://docs.senseaudio.cn) |

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
