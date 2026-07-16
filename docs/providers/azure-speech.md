---
type: openclaw_doc
title: "Azure Speech"
source: "https://docs.openclaw.ai/providers/azure-speech"
source_hash: "13870dd9287a7bfeb984329a23d27457ab786a3c734ae1b697127162058a4bb5"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/azure-speech.md"
original_doc_path: "providers/azure-speech.md"
duplicate_index: 1
---

# Azure Speech
Source: https://docs.openclaw.ai/providers/azure-speech

Azure Speech is a bundled Azure AI Speech text-to-speech provider. OpenClaw
calls the Azure Speech REST API directly with SSML, synthesizing MP3 for
standard replies, native Ogg/Opus for voice notes, and 8 kHz mulaw for
telephony channels such as Voice Call. The request sends the provider-owned
output format through the `X-Microsoft-OutputFormat` header.

| Detail                  | Value                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Provider ID             | `azure-speech` (alias: `azure`)                                                                                |
| Website                 | [Azure AI Speech](https://azure.microsoft.com/products/ai-services/ai-speech)                                  |
| Docs                    | [Speech REST text-to-speech](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech) |
| Auth                    | `AZURE_SPEECH_KEY` plus `AZURE_SPEECH_REGION`                                                                  |
| Default voice           | `en-US-JennyNeural`                                                                                            |
| Default file output     | `audio-24khz-48kbitrate-mono-mp3`                                                                              |
| Default voice-note file | `ogg-24khz-16bit-mono-opus`                                                                                    |

## Getting started

Steps


Create an Azure Speech resource

    In the Azure portal, create a Speech resource. Copy **KEY 1** from
    Resource Management > Keys and Endpoint, and copy the resource location
    such as `eastus`.

    ```
    AZURE_SPEECH_KEY=<speech-resource-key>
    AZURE_SPEECH_REGION=eastus
    ```



Select Azure Speech in messages.tts

    ```json5
    {
      messages: {
        tts: {
          auto: "always",
          provider: "azure-speech",
          providers: {
            "azure-speech": {
              voice: "en-US-JennyNeural",
              lang: "en-US",
            },
          },
        },
      },
    }
    ```


Send a message

    Send a reply through any connected channel. OpenClaw synthesizes the audio
    with Azure Speech and delivers MP3 for standard audio, or Ogg/Opus when
    the channel expects a voice note.


## Configuration options

All options live under `messages.tts.providers["azure-speech"]`.

| Option                  | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `apiKey`                | Azure Speech resource key. Falls back to `AZURE_SPEECH_KEY`, `AZURE_SPEECH_API_KEY`, or `SPEECH_KEY`. |
| `region`                | Azure Speech resource region. Falls back to `AZURE_SPEECH_REGION` or `SPEECH_REGION`.                 |
| `endpoint`              | Optional Azure Speech endpoint override. Falls back to trusted `AZURE_SPEECH_ENDPOINT`.               |
| `baseUrl`               | Optional Azure Speech base URL override.                                                              |
| `voice`                 | Azure voice ShortName (default `en-US-JennyNeural`). Legacy alias: `voiceId`.                         |
| `lang`                  | SSML language code (default `en-US`).                                                                 |
| `outputFormat`          | Audio-file output format (default `audio-24khz-48kbitrate-mono-mp3`).                                 |
| `voiceNoteOutputFormat` | Voice-note output format (default `ogg-24khz-16bit-mono-opus`).                                       |
| `timeoutMs`             | Request timeout override in milliseconds. Falls back to the global `messages.tts.timeoutMs`.          |

The provider is considered configured once `apiKey` is set plus one of
`region`, `endpoint`, or `baseUrl`. Env vars are only checked as a fallback
for config keys left unset. Workspace `.env` files cannot set
`AZURE_SPEECH_ENDPOINT`; use the process environment, global runtime dotenv,
or explicit config for endpoint routing.

## Notes

AccordionGroup


Authentication

    Azure Speech uses a Speech resource key, not an Azure OpenAI key. The key
    is sent as `Ocp-Apim-Subscription-Key`; OpenClaw derives
    `https://<region>.tts.speech.microsoft.com` from `region` unless you
    provide `endpoint` or `baseUrl`.


Voice names

    Use the Azure Speech voice `ShortName` value, for example
    `en-US-JennyNeural`. The bundled provider can list voices through the
    same Speech resource and filters out voices marked deprecated, retired,
    or disabled.


Audio outputs

    Azure accepts output formats such as `audio-24khz-48kbitrate-mono-mp3`,
    `ogg-24khz-16bit-mono-opus`, and `riff-24khz-16bit-mono-pcm`. OpenClaw
    requests Ogg/Opus for `voice-note` targets so channels can send native
    voice bubbles without an extra MP3 conversion, and forces
    `raw-8khz-8bit-mono-mulaw` for telephony targets.


Alias

    `azure` is accepted as a provider alias for existing config, but new
    config should use `azure-speech` to avoid confusion with Azure OpenAI
    model providers.


## Related

CardGroup


Text-to-speech

    TTS overview, providers, and `messages.tts` config.


Configuration

    Full config reference including `messages.tts` settings.


Providers

    All bundled OpenClaw providers.


Troubleshooting

    Common issues and debugging steps.

---
