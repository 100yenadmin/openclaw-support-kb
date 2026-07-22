---
type: openclaw_doc
title: "PixVerse"
source: "https://docs.openclaw.ai/providers/pixverse"
source_hash: "b9cc857430b63fd3cea4a001dd72acbd83e7c657e0397ed4c3fc92c5af4cb850"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/pixverse.md"
original_doc_path: "providers/pixverse.md"
duplicate_index: 1
---

# PixVerse
Source: https://docs.openclaw.ai/providers/pixverse

OpenClaw provides `pixverse` as an official external plugin for hosted PixVerse video generation. The plugin registers the `pixverse` provider against the `videoGenerationProviders` contract.

| Property           | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Provider id        | `pixverse`                                                           |
| Plugin package     | `@openclaw/pixverse-provider`                                        |
| Auth env var       | `PIXVERSE_API_KEY`                                                   |
| Onboarding flag    | `--auth-choice pixverse-api-key`                                     |
| Direct CLI flag    | `--pixverse-api-key <key>`                                           |
| API                | PixVerse Platform API v2 (`video_id` submission plus result polling) |
| Default model      | `pixverse/v6`                                                        |
| Default API region | International                                                        |

## Getting started

Steps


Install the plugin

    ```bash
    openclaw plugins install @openclaw/pixverse-provider
    openclaw gateway restart
    ```


Set the API key

    ```bash
    openclaw onboard --auth-choice pixverse-api-key
    ```

    The wizard prompts for the International or CN endpoint (see API region
    below) before writing `region` and `baseUrl` into the provider config.
    Non-interactive runs (key from `--pixverse-api-key` or `PIXVERSE_API_KEY`)
    default to International.

    Onboarding also sets `agents.defaults.mediaModels.video.primary` to
    `pixverse/v6` when no default video model is configured yet.



Switch an existing default video provider (optional)

    ```bash
    openclaw config set agents.defaults.mediaModels.video.primary "pixverse/v6"
    ```


Generate a video

    Ask the agent to generate a video. PixVerse will be used automatically.


## Supported modes and models

The provider exposes PixVerse generation models through OpenClaw's shared video tool.

| Mode           | Models               | Reference input         |
| -------------- | -------------------- | ----------------------- |
| Text-to-video  | `v6` (default), `c1` | None                    |
| Image-to-video | `v6` (default), `c1` | 1 local or remote image |

Local image references are uploaded to PixVerse before the image-to-video request. Remote image URLs are passed through the PixVerse image upload endpoint as `image_url`.

| Option          | Supported values                                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Duration        | 1-15 seconds (default 5)                                                                                                         |
| Resolution      | `360P`, `540P`, `720P`, `1080P` (default `540P`; `480P` requests map to `540P`)                                                  |
| Aspect ratio    | `16:9` (default), `4:3`, `1:1`, `3:4`, `9:16`, `2:3`, `3:2`, `21:9`; text-to-video only, image-to-video follows the source image |
| Generated audio | `audio: true`                                                                                                                    |

Note

PixVerse image template generation is not exposed through `image_generate` yet. That API is template-id driven, while OpenClaw's shared image-generation contract does not currently have a PixVerse-specific typed option bag.

## Provider options

The video provider accepts these optional provider-specific keys:

| Option                               | Type   | Effect                                        |
| ------------------------------------ | ------ | --------------------------------------------- |
| `seed`                               | number | Deterministic seed, 0 to 2147483647           |
| `negativePrompt` / `negative_prompt` | string | Negative prompt                               |
| `quality`                            | string | PixVerse quality such as `720p`               |
| `motionMode` / `motion_mode`         | string | Image-to-video motion mode (default `normal`) |
| `cameraMovement` / `camera_movement` | string | PixVerse camera movement preset               |
| `templateId` / `template_id`         | number | Activated PixVerse template id                |

## Configuration

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: {
        primary: "pixverse/v6",
      },
    },
  },
}
```

## Advanced configuration

AccordionGroup


API region

    | Region value    | PixVerse API base URL                         |
    | --------------- | --------------------------------------------- |
    | `international` | `https://app-api.pixverse.ai/openapi/v2`      |
    | `cn`            | `https://app-api.pixverseai.cn/openapi/v2`    |

    Set `models.providers.pixverse.region` manually when your key belongs to a
    specific PixVerse platform region, or run
    `openclaw onboard --auth-choice pixverse-api-key` to choose one in the
    setup wizard:

    ```json5
    {
      models: {
        providers: {
          pixverse: {
            region: "cn", // "international" or "cn"
            baseUrl: "https://app-api.pixverseai.cn/openapi/v2",
            models: [],
          },
        },
      },
    }
    ```




Custom base URL

    Set `models.providers.pixverse.baseUrl` only when routing through a trusted compatible proxy.
    `baseUrl` takes precedence over `region`.

    ```json5
    {
      models: {
        providers: {
          pixverse: {
            baseUrl: "https://app-api.pixverse.ai/openapi/v2",
          },
        },
      },
    }
    ```




Task polling

    PixVerse returns a `video_id` from the generation request. OpenClaw polls
    `/openapi/v2/video/result/{video_id}` every 5 seconds until the task
    succeeds, fails, or hits the timeout (default 5 minutes; override with
    `agents.defaults.mediaModels.video.timeoutMs`).


## Related

CardGroup


Video generation

    Shared tool parameters, provider selection, and async behavior.


Configuration reference

    Agent default settings including video generation model.

---
