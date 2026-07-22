---
type: openclaw_doc
title: "Inworld"
source: "https://docs.openclaw.ai/providers/inworld"
source_hash: "c8389e6af21f6990bda47117a900215f9b686d114351cc5c4d56f5927a0265f6"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/inworld.md"
original_doc_path: "providers/inworld.md"
duplicate_index: 1
---

# Inworld
Source: https://docs.openclaw.ai/providers/inworld

Inworld is a streaming text-to-speech (TTS) provider. In OpenClaw it synthesizes outbound reply audio (MP3 by default, OGG_OPUS for voice notes) and raw PCM audio for telephony channels such as Voice Call.

OpenClaw posts to Inworld's streaming TTS endpoint, concatenates the returned base64 audio chunks into a single buffer, and hands the result to the standard reply-audio pipeline.

| Property      | Value                                                           |
| ------------- | --------------------------------------------------------------- |
| Provider id   | `inworld`                                                       |
| Plugin        | official external package (`@openclaw/inworld-speech`)          |
| Contract      | `speechProviders` (TTS only)                                    |
| Auth env var  | `INWORLD_API_KEY` (HTTP Basic, Base64 dashboard credential)     |
| Base URL      | `https://api.inworld.ai`                                        |
| Default voice | `Sarah`                                                         |
| Default model | `inworld-tts-1.5-max`                                           |
| Output        | MP3 (default), OGG_OPUS (voice notes), PCM 22050 Hz (telephony) |
| Website       | [inworld.ai](https://inworld.ai)                                |
| Docs          | [docs.inworld.ai/tts/tts](https://docs.inworld.ai/tts/tts)      |

## Install plugin

```bash
openclaw plugins install @openclaw/inworld-speech
openclaw gateway restart
```

## Getting started

Steps


Set your API key

    Copy the credential from your Inworld dashboard (Workspace > API Keys) and set it as an env var. The value is sent verbatim as the HTTP Basic credential, so do not Base64-encode it again or convert it to a bearer token.

    ```bash
    INWORLD_API_KEY=<base64-credential-from-dashboard>
    ```



Select Inworld in tts

    ```json5
    {
      tts: {
        auto: "always",
        provider: "inworld",
        providers: {
          inworld: {
            voiceId: "Sarah",
            modelId: "inworld-tts-1.5-max",
          },
        },
      },
    }
    ```


Send a message

    Send a reply through any connected channel. OpenClaw synthesizes the audio with Inworld and delivers it as MP3 (or OGG_OPUS when the channel expects a voice note).


## Configuration options

| Option        | Path                                | Description                                                         |
| ------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `apiKey`      | `tts.providers.inworld.apiKey`      | Base64 dashboard credential. Falls back to `INWORLD_API_KEY`.       |
| `baseUrl`     | `tts.providers.inworld.baseUrl`     | Override Inworld API base URL (default `https://api.inworld.ai`).   |
| `voiceId`     | `tts.providers.inworld.voiceId`     | Voice identifier (default `Sarah`). Legacy alias: `speakerVoiceId`. |
| `modelId`     | `tts.providers.inworld.modelId`     | TTS model id (default `inworld-tts-1.5-max`).                       |
| `temperature` | `tts.providers.inworld.temperature` | Sampling temperature, `0` (exclusive) to `2` (optional).            |

## Notes

AccordionGroup


Authentication

    Inworld uses HTTP Basic auth with a single Base64-encoded credential string. Copy it verbatim from the Inworld dashboard. The provider sends it as `Authorization: Basic <apiKey>` without any further encoding, so do not Base64-encode it yourself and do not pass a bearer-style token. See [TTS auth notes](/tools/tts#inworld-primary) for the same callout.


Models

    Supported model ids: `inworld-tts-1.5-max` (default), `inworld-tts-1.5-mini`, `inworld-tts-1-max`, `inworld-tts-1`.


Audio outputs

    Replies use MP3 by default. When the channel target is `voice-note`, OpenClaw asks Inworld for `OGG_OPUS` so the audio plays as a native voice bubble. Telephony synthesis uses raw `PCM` at 22050 Hz to feed the telephony bridge.


Custom endpoints

    Override the API host with `tts.providers.inworld.baseUrl`. Trailing slashes are stripped before requests are sent.


## Related

CardGroup


Text-to-speech

    TTS overview, providers, and `tts` config.


Configuration

    Full config reference including `tts` settings.


Providers

    All supported OpenClaw providers.


Troubleshooting

    Common issues and debugging steps.

---
