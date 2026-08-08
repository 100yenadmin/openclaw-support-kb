---
type: openclaw_doc
title: "Alibaba Model Studio"
source: "https://docs.openclaw.ai/providers/alibaba"
source_hash: "fd7f601795ff5c584cd4cfbf6360f1f1dc6038596362e24c1661a1a820179994"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/alibaba.md"
original_doc_path: "providers/alibaba.md"
duplicate_index: 1
---

# Alibaba Model Studio
Source: https://docs.openclaw.ai/providers/alibaba

The bundled `alibaba` plugin registers a video-generation provider for Wan models on Alibaba Model Studio (the international name for DashScope). It is enabled by default; only an API key is needed.

| Property         | Value                                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| Provider id      | `alibaba`                                                                       |
| Plugin           | bundled, `enabledByDefault: true`                                               |
| Auth env vars    | `MODELSTUDIO_API_KEY` → `DASHSCOPE_API_KEY` → `QWEN_API_KEY` (first match wins) |
| Onboarding flag  | `--auth-choice alibaba-model-studio-api-key`                                    |
| Direct CLI flag  | `--alibaba-model-studio-api-key <key>`                                          |
| Default model    | `alibaba/wan2.6-t2v`                                                            |
| Default base URL | `https://dashscope-intl.aliyuncs.com`                                           |

## Getting started

Steps


Set an API key

    Store the key against the `alibaba` provider through onboarding:

    ```bash
    openclaw onboard --auth-choice alibaba-model-studio-api-key
    ```

    Or pass the key directly:

    ```bash
    openclaw onboard --alibaba-model-studio-api-key <your-key>
    ```

    Or export one of the accepted env vars before starting the Gateway:

    ```bash
    export MODELSTUDIO_API_KEY=sk-...
    # or DASHSCOPE_API_KEY=...
    # or QWEN_API_KEY=...
    ```



Set a default video model

    ```json5
    {
      agents: {
        defaults: {
          videoGenerationModel: {
            primary: "alibaba/wan2.6-t2v",
          },
        },
      },
    }
    ```


Verify the provider is configured

    ```bash
    openclaw models list --provider alibaba
    ```

    The list includes all five bundled Wan models. If `MODELSTUDIO_API_KEY` cannot be resolved, `openclaw models status --json` reports the missing credential under `auth.unusableProfiles`.



Note

  The Alibaba plugin and the [Qwen plugin](/providers/qwen) both authenticate against DashScope and accept overlapping env vars. Use `alibaba/...` model ids for the dedicated Wan video surface; use `qwen/...` ids for Qwen chat, embedding, or media-understanding.

## Built-in Wan models

| Model ref                  | Mode                      |
| -------------------------- | ------------------------- |
| `alibaba/wan2.6-t2v`       | Text-to-video (default)   |
| `alibaba/wan2.6-i2v`       | Image-to-video            |
| `alibaba/wan2.6-r2v`       | Reference-to-video        |
| `alibaba/wan2.6-r2v-flash` | Reference-to-video (fast) |
| `alibaba/wan2.7-r2v`       | Reference-to-video        |

## Capabilities and limits

Each model advertises only its matching runtime mode. Geometry also follows the
vendor protocol for that model family instead of sending one generic parameter shape.

| Mode                         | Max output videos | Reference limits                      | Max duration | Supported controls                                                   |
| ---------------------------- | ----------------- | ------------------------------------- | ------------ | -------------------------------------------------------------------- |
| Text-to-video                | 1                 | n/a                                   | 15 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark`            |
| Image-to-video               | 1                 | 1 image                               | 15 s         | `resolution`, `audio`, `watermark`                                   |
| Reference-to-video (Wan 2.6) | 1                 | 5 total images/videos; up to 3 videos | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark`            |
| Reference-to-video (Wan 2.7) | 1                 | 5 total images/videos; up to 3 videos | 10 s         | `size`, `aspectRatio`, `resolution`, `watermark`; audio is always on |

Wan 2.6 text/reference models translate `resolution` plus `aspectRatio` to the
documented exact `size`. Wan 2.6 image-to-video sends the `resolution` tier and
uses the input image's aspect ratio. Wan 2.7 reference-to-video sends the newer
`media`, `resolution`, and `ratio` fields and always generates audio.

A request that omits `durationSeconds` gets DashScope's accepted default of **5 seconds**.

Warning

  Reference image and video inputs must be remote `http(s)` URLs; DashScope's reference modes reject local file paths. Upload to object storage first, or use the [media tool](/tools/media-overview) flow that already produces a public URL.

## Advanced configuration

AccordionGroup


Override the DashScope base URL

    The provider defaults to the international DashScope endpoint. To target the China-region endpoint:

    ```json5
    {
      models: {
        providers: {
          alibaba: {
            baseUrl: "https://dashscope.aliyuncs.com",
          },
        },
      },
    }
    ```

    The provider strips trailing slashes before constructing AIGC task URLs.




Auth env priority

    OpenClaw resolves the Alibaba API key from environment variables in this order, taking the first non-empty value:

    1. `MODELSTUDIO_API_KEY`
    2. `DASHSCOPE_API_KEY`
    3. `QWEN_API_KEY`

    Configured `auth.profiles` entries (set via `openclaw models auth login`) override env-var resolution. See [Auth profiles in the models FAQ](/help/faq-models#auth-profiles-what-they-are-and-how-to-manage-them) for profile rotation, cooldown, and override mechanics.




Relationship to the Qwen plugin

    Both bundled plugins talk to DashScope and accept overlapping API keys. Use:

    - `alibaba/wan*.*` ids for the dedicated Wan video provider documented on this page.
    - `qwen/*` ids for Qwen chat, embedding, and media understanding (see [Qwen](/providers/qwen)).

    Setting `MODELSTUDIO_API_KEY` once authenticates both plugins, since the auth env var list intentionally overlaps; onboarding each plugin separately is not required.



## Related

CardGroup


Video generation

    Shared video tool parameters and provider selection.


Qwen

    Qwen chat, embedding, and media-understanding setup on the same DashScope auth.


Configuration reference

    Agent defaults and model configuration.


Models FAQ

    Auth profiles, switching models, and resolving "no profile" errors.

---
