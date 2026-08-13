---
type: openclaw_doc
title: "SenseAudio"
source: "https://docs.openclaw.ai/providers/senseaudio"
source_hash: "e2ab8c1345ec61ec61cd37705862e5c9a83c3fab725fef2ce97e810407f08746"
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
          models: [
            {
              provider: "senseaudio",
              model: "senseaudio-asr-pro-1.5-260319",
              capabilities: ["audio"],
            },
          ],
          audio: {
            enabled: true,
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
