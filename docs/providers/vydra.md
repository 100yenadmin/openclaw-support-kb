---
type: openclaw_doc
title: "Vydra"
source: "https://docs.openclaw.ai/providers/vydra"
source_hash: "1bbc59398f48b4afb5890c0c6a8f285112a805c65e1240e9dd597a0d5cf6bcba"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/vydra.md"
original_doc_path: "providers/vydra.md"
duplicate_index: 1
---

# Vydra
Source: https://docs.openclaw.ai/providers/vydra

The bundled Vydra plugin adds:

- Image generation via `vydra/grok-imagine`
- Video generation via `vydra/veo3` (text-to-video) and `vydra/kling` (image-to-video)
- Speech synthesis via Vydra's ElevenLabs-backed TTS route

OpenClaw uses the same `VYDRA_API_KEY` for all three capabilities.

| Property        | Value                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| Provider id     | `vydra`                                                                   |
| Plugin          | bundled, `enabledByDefault: true`                                         |
| Auth env var    | `VYDRA_API_KEY`                                                           |
| Onboarding flag | `--auth-choice vydra-api-key`                                             |
| Direct CLI flag | `--vydra-api-key <key>`                                                   |
| Contracts       | `imageGenerationProviders`, `videoGenerationProviders`, `speechProviders` |
| Base URL        | `https://www.vydra.ai/api/v1` (use the `www` host)                        |

Warning

Use `https://www.vydra.ai/api/v1` as the base URL. Vydra's apex host (`https://vydra.ai/api/v1`) currently redirects to `www`. Some HTTP clients drop `Authorization` on that cross-host redirect, which turns a valid API key into a misleading auth failure. The bundled plugin normalizes any configured `vydra.ai` base URL to `www.vydra.ai` to avoid that.

## Setup

Steps


Run interactive onboarding

    ```bash
    openclaw onboard --auth-choice vydra-api-key
    ```

    Or set the env var directly:

    ```bash
    export VYDRA_API_KEY="vydra_live_..."
    ```



Choose a default capability

    Pick one or more of the capabilities below (image, video, or speech) and apply the matching configuration.


## Capabilities

AccordionGroup


Image generation

    Default and only bundled image model:

    - `vydra/grok-imagine`

    Set it as the default image provider:

    ```json5
    {
      agents: {
        defaults: {
          imageGenerationModel: {
            primary: "vydra/grok-imagine",
          },
        },
      },
    }
    ```

    Bundled support is text-to-image only, at most one image per request. Vydra's hosted edit routes expect remote image URLs, and the bundled plugin does not add a Vydra-specific upload bridge.


Note

    See [Image Generation](/tools/image-generation) for shared tool parameters, provider selection, and failover behavior.





Video generation

    Registered video models:

    - `vydra/veo3` for text-to-video (rejects image reference inputs)
    - `vydra/kling` for image-to-video (requires exactly one remote image URL)

    Set Vydra as the default video provider:

    ```json5
    {
      agents: {
        defaults: {
          videoGenerationModel: {
            primary: "vydra/veo3",
          },
        },
      },
    }
    ```

    Notes:

    - `vydra/kling` rejects local file uploads up front; only a remote image URL reference works.
    - Vydra's `kling` HTTP route has been inconsistent about whether it requires `image_url` or `video_url`; the bundled provider sends the same remote image URL in both fields.
    - The bundled plugin stays conservative and does not forward undocumented style knobs such as aspect ratio, resolution, watermark, or generated audio.


Note

    See [Video Generation](/tools/video-generation) for shared tool parameters, provider selection, and failover behavior.





Video live tests

    Provider-specific live coverage:

    ```bash
    OPENCLAW_LIVE_TEST=1 \
    OPENCLAW_LIVE_VYDRA_VIDEO=1 \
    pnpm test:live -- extensions/vydra/vydra.live.test.ts
    ```

    The bundled Vydra live file covers:

    - `vydra/veo3` text-to-video
    - `vydra/kling` image-to-video using a remote image URL

    Override the remote image fixture when needed:

    ```bash
    export OPENCLAW_LIVE_VYDRA_KLING_IMAGE_URL="https://example.com/reference.png"
    ```




Speech synthesis

    Set Vydra as the speech provider:

    ```json5
    {
      messages: {
        tts: {
          provider: "vydra",
          providers: {
            vydra: {
              apiKey: "${VYDRA_API_KEY}",
              voiceId: "21m00Tcm4TlvDq8ikWAM",
            },
          },
        },
      },
    }
    ```

    Defaults:

    - Model: `elevenlabs/tts`
    - Voice id: `21m00Tcm4TlvDq8ikWAM` ("Rachel")

    The bundled plugin exposes this one known-good default voice and returns MP3 audio files.



## Related

CardGroup


Provider directory

    Browse all available providers.


Image generation

    Shared image tool parameters and provider selection.


Video generation

    Shared video tool parameters and provider selection.


Configuration reference

    Agent defaults and model configuration.

---
