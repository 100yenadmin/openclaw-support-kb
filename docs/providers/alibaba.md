---
type: openclaw_doc
title: "Alibaba Model Studio"
source: "https://docs.openclaw.ai/providers/alibaba"
source_hash: "dba80ed881d41ef281a19b6b3350522f88a2698b0b6844088a1ab206b709fdf2"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/alibaba.md"
original_doc_path: "providers/alibaba.md"
duplicate_index: 1
---

# Alibaba Model Studio
Source: https://docs.openclaw.ai/providers/alibaba

OpenClaw ships a bundled `alibaba` plugin that registers a video-generation provider for Wan models on Alibaba Model Studio (the international name for DashScope). The plugin is enabled by default; you only need to set an API key.

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

    Use onboarding to store the key against the `alibaba` provider:

    ```bash
    openclaw onboard --auth-choice alibaba-model-studio-api-key
    ```

    Or pass the key directly during install/onboarding:

    ```bash
    openclaw onboard --alibaba-model-studio-api-key <your-key>
    ```

    Or export any of the accepted env vars before starting the Gateway:

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

    The list should include all five bundled Wan models. If `MODELSTUDIO_API_KEY` is unresolved, `openclaw models status --json` reports the missing credential under `auth.unusableProfiles`.



Note

  The Alibaba plugin and the [Qwen plugin](/providers/qwen) both authenticate against DashScope and accept overlapping env vars. Use `alibaba/...` model ids to drive the dedicated Wan video surface; use `qwen/...` ids when you want Qwen's chat, embedding, or media-understanding surface.

## Built-in Wan models

| Model ref                  | Mode                      |
| -------------------------- | ------------------------- |
| `alibaba/wan2.6-t2v`       | Text-to-video (default)   |
| `alibaba/wan2.6-i2v`       | Image-to-video            |
| `alibaba/wan2.6-r2v`       | Reference-to-video        |
| `alibaba/wan2.6-r2v-flash` | Reference-to-video (fast) |
| `alibaba/wan2.7-r2v`       | Reference-to-video        |

## Capabilities and limits

The bundled provider mirrors DashScope's Wan video API caps. All three modes share the same per-request video count and duration cap; only the input shape differs.

| Mode               | Max output videos | Max input images | Max input videos | Max duration | Supported controls                                        |
| ------------------ | ----------------- | ---------------- | ---------------- | ------------ | --------------------------------------------------------- |
| Text-to-video      | 1                 | n/a              | n/a              | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |
| Image-to-video     | 1                 | 1                | n/a              | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |
| Reference-to-video | 1                 | n/a              | 4                | 10 s         | `size`, `aspectRatio`, `resolution`, `audio`, `watermark` |

When a request omits `durationSeconds`, the provider sends DashScope's accepted default of **5 seconds**. Set `durationSeconds` explicitly on the [video generation tool](/tools/video-generation) to extend up to 10 s.

Warning

  Reference image and video inputs must be remote `http(s)` URLs. Local file paths are not accepted by DashScope's reference modes; upload to object storage first or use the [media tool](/tools/media-overview) flow that already produces a public URL.

## Advanced configuration

AccordionGroup


Override the DashScope base URL

    The provider defaults to the international DashScope endpoint. To target the China-region endpoint, set:

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

    Configured `auth.profiles` entries (set via `openclaw models auth login`) override env-var resolution. See [Auth profiles in the models FAQ](/help/faq-models#what-is-an-auth-profile) for profile rotation, cooldown, and override mechanics.




Relationship to the Qwen plugin

    Both bundled plugins talk to DashScope and accept overlapping API keys. Use:

    - `alibaba/wan*.*` ids to drive the dedicated Wan video provider documented on this page.
    - `qwen/*` ids for Qwen chat, embedding, and media understanding (see [Qwen](/providers/qwen)).

    Setting `MODELSTUDIO_API_KEY` once authenticates both plugins because the auth env var list intentionally overlaps; you do not need to onboard each plugin separately.



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
