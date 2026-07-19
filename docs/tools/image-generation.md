---
type: openclaw_doc
title: "Image generation"
source: "https://docs.openclaw.ai/tools/image-generation"
source_hash: "fc3ea0210269c2dcb94dd7bc0d94c579e9005768dd0c101805af54b08d0167fc"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/image-generation.md"
original_doc_path: "tools/image-generation.md"
duplicate_index: 1
---

# Image generation
Source: https://docs.openclaw.ai/tools/image-generation

The `image_generate` tool creates and edits images through your configured
providers. In chat sessions it runs asynchronously: OpenClaw records a
background task, returns the task id immediately, and wakes the agent when
the provider finishes. The completion agent follows the session's normal
visible-reply mode: automatic final reply delivery when configured, or
`message(action="send")` when the session requires the message tool. If the
requester session is inactive or its active wake fails, OpenClaw sends an
idempotent direct fallback with the generated images so the result is not
lost.

Note

The tool only appears when at least one image-generation provider is
available. If you do not see `image_generate` in your agent's tools,
configure `agents.defaults.imageGenerationModel`, set up a provider API key,
or sign in with OpenAI ChatGPT/Codex OAuth.

## Quick start

Steps


Configure auth

    Set an API key for at least one provider (for example `OPENAI_API_KEY`,
    `GEMINI_API_KEY`, `OPENROUTER_API_KEY`) or sign in with OpenAI Codex OAuth.


Pick a default model (optional)

    ```json5
    {
      agents: {
        defaults: {
          imageGenerationModel: {
            primary: "openai/gpt-image-2",
            timeoutMs: 180_000,
          },
        },
      },
    }
    ```

    ChatGPT/Codex OAuth uses the same `openai/gpt-image-2` model ref. When an
    `openai` OAuth profile is configured, OpenClaw routes image requests
    through that OAuth profile instead of first trying `OPENAI_API_KEY`.
    Explicit `models.providers.openai` config (API key, custom/Azure base URL)
    opts back into the direct OpenAI Images API route.



Ask the agent

    _"Generate an image of a friendly robot mascot."_

    The agent calls `image_generate` automatically. No tool allow-listing
    needed - it is enabled by default when a provider is available. The tool
    returns a background task id, then the completion agent sends the
    generated attachment through the `message` tool when it is ready.



Warning

For OpenAI-compatible LAN endpoints such as LocalAI, keep the custom
`models.providers.openai.baseUrl` and explicitly opt in with
`browser.ssrfPolicy.dangerouslyAllowPrivateNetwork: true`. Private and
internal image endpoints remain blocked by default.

## Common routes

| Goal                                                 | Model ref                                          | Auth                                   |
| ---------------------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| OpenAI image generation with API billing             | `openai/gpt-image-2`                               | `OPENAI_API_KEY`                       |
| OpenAI image generation with Codex subscription auth | `openai/gpt-image-2`                               | OpenAI ChatGPT/Codex OAuth             |
| OpenAI transparent-background PNG/WebP               | `openai/gpt-image-1.5`                             | `OPENAI_API_KEY` or OpenAI Codex OAuth |
| DeepInfra image generation                           | `deepinfra/black-forest-labs/FLUX-1-schnell`       | `DEEPINFRA_API_KEY`                    |
| fal Krea 2 expressive/style-directed generation      | `fal/krea/v2/medium/text-to-image`                 | `FAL_KEY`                              |
| OpenRouter image generation                          | `openrouter/google/gemini-3.1-flash-image-preview` | `OPENROUTER_API_KEY`                   |
| LiteLLM image generation                             | `litellm/gpt-image-2`                              | `LITELLM_API_KEY`                      |
| Microsoft Foundry MAI image generation               | `microsoft-foundry/<deployment-name>`              | `AZURE_OPENAI_API_KEY` or Entra ID     |
| Google Gemini image generation                       | `google/gemini-3.1-flash-image`                    | `GEMINI_API_KEY` or `GOOGLE_API_KEY`   |

The same tool handles text-to-image and reference-image editing. Use `image`
for one reference or `images` for multiple. For Krea 2 models on fal, those
references are sent as style references instead of edit inputs.
Provider-supported output hints such as `quality`, `outputFormat`, and
`background` are forwarded when available and reported as ignored when a
provider does not declare support. Bundled transparent-background support is
OpenAI-specific; other providers may still preserve PNG alpha if their
backend emits it.

## Supported providers

| Provider          | Default model                           | Edit support                       | Auth                                                  |
| ----------------- | --------------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| ComfyUI           | `workflow`                              | Yes (1 image, workflow-configured) | `COMFY_API_KEY` or `COMFY_CLOUD_API_KEY` for cloud    |
| DeepInfra         | `black-forest-labs/FLUX-1-schnell`      | Yes (1 image)                      | `DEEPINFRA_API_KEY`                                   |
| fal               | `fal-ai/flux/dev`                       | Yes (model-specific limits)        | `FAL_KEY`                                             |
| Google            | `gemini-3.1-flash-image`                | Yes (up to 5 images)               | `GEMINI_API_KEY` or `GOOGLE_API_KEY`                  |
| LiteLLM           | `gpt-image-2`                           | Yes (up to 5 input images)         | `LITELLM_API_KEY`                                     |
| Microsoft Foundry | `<deployment-name>`                     | Yes (MAI-Image-2.5 models only)    | `AZURE_OPENAI_API_KEY` or Entra ID (`az login`)       |
| MiniMax           | `image-01`                              | Yes (subject reference)            | `MINIMAX_API_KEY` or MiniMax OAuth (`minimax-portal`) |
| OpenAI            | `gpt-image-2`                           | Yes (up to 5 images)               | `OPENAI_API_KEY` or OpenAI ChatGPT/Codex OAuth        |
| OpenRouter        | `google/gemini-3.1-flash-image-preview` | Yes (up to 5 input images)         | `OPENROUTER_API_KEY`                                  |
| Vydra             | `grok-imagine`                          | No                                 | `VYDRA_API_KEY`                                       |
| xAI               | `grok-imagine-image`                    | Yes (up to 3 images)               | `XAI_API_KEY`                                         |

Use `action: "list"` to inspect available providers and models at runtime:

```text
/tool image_generate action=list
```

Use `action: "status"` to inspect the active image-generation task for the
current session:

```text
/tool image_generate action=status
```

## Provider capabilities

| Capability            | ComfyUI            | DeepInfra | fal                                            | Google         | Microsoft Foundry | MiniMax               | OpenAI         | Vydra | xAI            |
| --------------------- | ------------------ | --------- | ---------------------------------------------- | -------------- | ----------------- | --------------------- | -------------- | ----- | -------------- |
| Generate (max count)  | 1                  | 4         | 4                                              | 4              | 1                 | 9                     | 4              | 1     | 4              |
| Edit / reference      | 1 image (workflow) | 1 image   | Flux: 1; GPT: 10; Krea style refs: 10; NB2: 14 | Up to 5 images | 1 image           | 1 image (subject ref) | Up to 5 images | -     | Up to 3 images |
| Size control          | -                  | ✓         | ✓                                              | ✓              | ✓                 | -                     | Up to 4K       | -     | -              |
| Aspect ratio          | -                  | -         | ✓                                              | ✓              | -                 | ✓                     | -              | -     | ✓              |
| Resolution (1K/2K/4K) | -                  | -         | ✓                                              | ✓              | -                 | -                     | -              | -     | 1K, 2K         |

## Tool parameters

ParamField

  Image generation prompt. Required for `action: "generate"`.

ParamField

  Use `"status"` to inspect the active session task or `"list"` to inspect
  available providers and models at runtime.

ParamField

  Provider/model override (e.g. `openai/gpt-image-2`). Use
  `openai/gpt-image-1.5` for transparent OpenAI backgrounds.

ParamField

  Single reference image path or URL for edit mode.

ParamField

  Multiple reference images for edit mode or style-reference models (up to 14
  through the shared tool; provider-specific limits still apply).

ParamField

  Size hint: `1024x1024`, `1536x1024`, `1024x1536`, `2048x2048`, `3840x2160`.

ParamField

  Aspect ratio: `1:1`, `2:1`, `20:9`, `19.5:9`, `2:3`, `3:2`, `2.35:1`, `3:4`,
  `4:3`, `4:5`, `5:4`, `9:16`, `9:19.5`, `9:20`, `16:9`, `21:9`, `1:2`, `4:1`,
  `1:4`, `8:1`, `1:8`. Providers validate their model-specific subset.

ParamField
Resolution hint.

ParamField

  Quality hint when the provider supports it.

ParamField

  Output format hint when the provider supports it.

ParamField

  Background hint when the provider supports it. Use `transparent` with
  `outputFormat: "png"` or `"webp"` for transparency-capable providers.

ParamField
Number of images to generate (1-4).

ParamField

  Optional provider request timeout in milliseconds. When Codex calls
  `image_generate` through dynamic tools, this per-call value still overrides
  the configured default and is capped at 600000 ms.

ParamField
Output filename hint.

ParamField

  OpenAI-only hints: `background`, `moderation`, `outputCompression`, and `user`.

ParamField

  fal Krea 2 creativity control. Defaults to `medium`.

Note

Not all providers support all parameters. When a fallback provider supports a
nearby geometry option instead of the exact requested one, OpenClaw remaps to
the closest supported size, aspect ratio, or resolution before submission.
Unsupported output hints are dropped for providers that do not declare
support and reported in the tool result. Tool results report the applied
settings; `details.normalization` captures any requested-to-applied
translation.

## Configuration

### Model selection

```json5
{
  agents: {
    defaults: {
      imageGenerationModel: {
        primary: "openai/gpt-image-2",
        timeoutMs: 180_000,
        fallbacks: [
          "openrouter/google/gemini-3.1-flash-image-preview",
          "google/gemini-3.1-flash-image",
          "fal/fal-ai/flux/dev",
        ],
      },
    },
  },
}
```

### Provider selection order

OpenClaw tries providers in this order:

1. **`model` parameter** from the tool call (if the agent specifies one).
2. **`imageGenerationModel.primary`** from config.
3. **`imageGenerationModel.fallbacks`** in order.
4. **Auto-detection** - auth-backed provider defaults only:
   - current default provider first;
   - remaining registered image-generation providers in provider-id order.

If a provider fails (auth error, rate limit, etc.), the next configured
candidate is tried automatically. If all fail, the error includes details
from each attempt.

AccordionGroup


Per-call model overrides are exact

    A per-call `model` override tries only that provider/model and does
    not continue to configured primary/fallback or auto-detected providers.


Auto-detection is auth-aware

    A provider default only enters the candidate list when OpenClaw can
    actually authenticate that provider. Set
    `agents.defaults.mediaGenerationAutoProviderFallback: false` to use only
    explicit `model`, `primary`, and `fallbacks` entries.


Timeouts

    Set `agents.defaults.imageGenerationModel.timeoutMs` for slow image
    backends. A per-call `timeoutMs` tool parameter overrides the configured
    default, and configured defaults override plugin-authored provider
    defaults. Google and OpenRouter hosted image providers use 180 second
    defaults; Microsoft Foundry MAI, xAI, and Azure OpenAI image generation use
    600 seconds. Codex dynamic-tool calls use a 120 second `image_generate`
    bridge default and honor the same timeout budget when configured, bounded
    by OpenClaw's 600000 ms dynamic-tool bridge maximum.


Inspect at runtime

    Use `action: "list"` to inspect the currently registered providers,
    their default models, and auth env-var hints.


### Image editing

OpenAI, OpenRouter, Google, DeepInfra, fal, Microsoft Foundry, MiniMax,
ComfyUI, and xAI support editing reference images. Krea 2 models on fal use
the same `image` / `images` fields as style references instead of edit
inputs. Pass a reference image path or URL:

```text
"Generate a watercolor version of this photo" + image: "/path/to/photo.jpg"
```

OpenAI, OpenRouter, and Google support up to 5 reference images via the
`images` parameter; xAI supports up to 3. fal supports 1 reference image for
Flux image-to-image, up to 10 for GPT Image 2 edits, up to 10 style references
for Krea 2, and up to 14 for Nano Banana 2 edits. Microsoft Foundry, MiniMax,
and ComfyUI support 1.

## Provider deep dives

AccordionGroup


OpenAI gpt-image-2 (and gpt-image-1.5)

    OpenAI image generation defaults to `openai/gpt-image-2`. If an
    `openai` OAuth profile is configured, OpenClaw reuses the same
    OAuth profile used by Codex subscription chat models and sends the
    image request through the Codex Responses backend. Legacy Codex base
    URLs such as `https://chatgpt.com/backend-api` are canonicalized to
    `https://chatgpt.com/backend-api/codex` for image requests. OpenClaw
    does **not** silently fall back to `OPENAI_API_KEY` for that request -
    to force direct OpenAI Images API routing, configure
    `models.providers.openai` explicitly with an API key, custom base URL,
    or Azure endpoint.

    The `openai/gpt-image-1.5`, `openai/gpt-image-1`, and
    `openai/gpt-image-1-mini` models can still be selected explicitly. Use
    `gpt-image-1.5` for transparent-background PNG/WebP output; the current
    `gpt-image-2` API rejects `background: "transparent"`.

    `gpt-image-2` supports both text-to-image generation and
    reference-image editing through the same `image_generate` tool.
    OpenClaw forwards `prompt`, `count`, `size`, `quality`, `outputFormat`,
    and reference images to OpenAI. OpenAI does **not** receive
    `aspectRatio` or `resolution` directly; when possible OpenClaw maps
    those into a supported `size`, otherwise the tool reports them as
    ignored overrides.

    OpenAI-specific options live under the `openai` object:

    ```json
    {
      "quality": "low",
      "outputFormat": "jpeg",
      "openai": {
        "background": "opaque",
        "moderation": "low",
        "outputCompression": 60,
        "user": "end-user-42"
      }
    }
    ```

    `openai.background` accepts `transparent`, `opaque`, or `auto`;
    transparent outputs require `outputFormat` `png` or `webp` and a
    transparency-capable OpenAI image model. OpenClaw routes default
    `gpt-image-2` transparent-background requests to `gpt-image-1.5`.
    `openai.outputCompression` applies to JPEG/WebP outputs and is ignored
    for PNG outputs.

    The top-level `background` hint is provider-neutral and currently maps
    to the same OpenAI `background` request field when the OpenAI provider
    is selected. Providers that do not declare background support return
    it in `ignoredOverrides` instead of receiving the unsupported parameter.

    To route OpenAI image generation through an Azure OpenAI deployment
    instead of `api.openai.com`, see
    [Azure OpenAI endpoints](/providers/openai#azure-openai-endpoints).



Microsoft Foundry MAI image models

    Microsoft Foundry image generation uses deployed MAI image deployment names
    under the `microsoft-foundry/` provider prefix. There is no provider-level
    default model because the MAI API expects your deployment name in the
    `model` field:

    ```json5
    {
      agents: {
        defaults: {
          imageGenerationModel: {
            primary: "microsoft-foundry/<deployment-name>",
            timeoutMs: 600_000,
          },
        },
      },
    }
    ```

    The provider uses Microsoft Foundry's MAI API, not the OpenAI Images API:

    - Generation endpoint: `/mai/v1/images/generations`
    - Edit endpoint: `/mai/v1/images/edits`
    - Auth: `AZURE_OPENAI_API_KEY` / provider API key, or Entra ID through `az login`
    - Output: one PNG image
    - Size: default `1024x1024`; width and height must each be at least 768 px,
      and total pixels must be at most 1,048,576
    - Edits: one PNG or JPEG reference image, supported only by
      `MAI-Image-2.5-Flash` and `MAI-Image-2.5` deployments

    Prompt-only generation can use a custom deployment name with just the
    Foundry endpoint configured. Edits with custom deployment names need
    onboarding/model metadata so OpenClaw can verify that the deployment is
    backed by `MAI-Image-2.5-Flash` or `MAI-Image-2.5`.

    Current MAI image models are `MAI-Image-2.5-Flash`, `MAI-Image-2.5`,
    `MAI-Image-2e`, and `MAI-Image-2`. See
    [Microsoft Foundry plugin](/plugins/reference/microsoft-foundry) for setup
    and chat-model behavior.



OpenRouter image models

    OpenRouter image generation uses the same `OPENROUTER_API_KEY` and
    routes through OpenRouter's chat completions image API. Select
    OpenRouter image models with the `openrouter/` prefix:

    ```json5
    {
      agents: {
        defaults: {
          imageGenerationModel: {
            primary: "openrouter/google/gemini-3.1-flash-image-preview",
          },
        },
      },
    }
    ```

    OpenClaw forwards `prompt`, `count`, reference images, and
    Gemini-compatible `aspectRatio` / `resolution` hints to OpenRouter.
    Current built-in OpenRouter image model shortcuts include
    `google/gemini-3.1-flash-image`,
    `google/gemini-3-pro-image`, and `openai/gpt-5.4-image-2`. Use
    `action: "list"` to see what your configured plugin exposes.



fal Krea 2

    Krea 2 models on fal use fal's native Krea schema instead of the generic
    `image_size` schema used by Flux. OpenClaw sends:

    - `aspect_ratio` for aspect-ratio hints
    - `creativity`, defaulting to `medium`
    - `image_style_references` when `image` or `images` are supplied

    Select Krea 2 Medium for faster expressive illustration and Krea 2 Large
    for slower, more detailed photoreal and textured looks:

    ```json5
    {
      agents: {
        defaults: {
          imageGenerationModel: {
            primary: "fal/krea/v2/medium/text-to-image",
          },
        },
      },
    }
    ```

    Krea 2 currently returns one image per request. Prefer `aspectRatio` for
    Krea; OpenClaw maps `size` to the closest supported Krea aspect ratio and
    rejects `resolution` for Krea rather than dropping it. Use `fal.creativity`
    when you want a native Krea creativity level:

    ```json
    {
      "model": "fal/krea/v2/medium/text-to-image",
      "prompt": "A cyber zine portrait with risograph texture",
      "aspectRatio": "9:16",
      "fal": {
        "creativity": "high"
      }
    }
    ```



MiniMax dual-auth

    MiniMax image generation is available through both bundled MiniMax
    auth paths:

    - `minimax/image-01` for API-key setups
    - `minimax-portal/image-01` for OAuth setups



xAI grok-imagine-image

    The bundled xAI provider uses `/v1/images/generations` for prompt-only
    requests and `/v1/images/edits` when `image` or `images` is present.

    - Models: `xai/grok-imagine-image`, `xai/grok-imagine-image-quality`
    - Count: up to 4
    - References: one `image` or up to three `images`
    - Aspect ratios: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`, `2:1`,
      `1:2`, `19.5:9`, `9:19.5`, `20:9`, `9:20`
    - Resolutions: `1K`, `2K`
    - Outputs: returned as OpenClaw-managed image attachments

    OpenClaw intentionally does not expose xAI-native `quality`, `mask`,
    `user`, or the `auto` aspect ratio until those controls exist in the shared
    cross-provider `image_generate` contract.



## Examples

Tabs


Generate (4K landscape)

```text
/tool image_generate action=generate model=openai/gpt-image-2 prompt="A clean editorial poster for OpenClaw image generation" size=3840x2160 count=1
```


Generate (transparent PNG)

```text
/tool image_generate action=generate model=openai/gpt-image-1.5 prompt="A simple red circle sticker on a transparent background" outputFormat=png background=transparent
```

Equivalent CLI:

```bash
openclaw infer image generate \
  --model openai/gpt-image-1.5 \
  --output-format png \
  --background transparent \
  --prompt "A simple red circle sticker on a transparent background" \
  --json
```



Generate (OpenAI low quality)

```text
/tool image_generate action=generate model=openai/gpt-image-2 prompt="Low-cost draft poster for a quiet productivity app" quality=low openai='{"moderation":"low"}'
```

Equivalent CLI:

```bash
openclaw infer image generate \
  --model openai/gpt-image-2 \
  --quality low \
  --openai-moderation low \
  --prompt "Low-cost draft poster for a quiet productivity app" \
  --json
```



Generate (two square)

```text
/tool image_generate action=generate model=openai/gpt-image-2 prompt="Two visual directions for a calm productivity app icon" size=1024x1024 count=2
```


Edit (one reference)

```text
/tool image_generate action=generate model=openai/gpt-image-2 prompt="Keep the subject, replace the background with a bright studio setup" image=/path/to/reference.png size=1024x1536
```


Edit (multiple references)

```text
/tool image_generate action=generate model=openai/gpt-image-2 prompt="Combine the character identity from the first image with the color palette from the second" images='["/path/to/character.png","/path/to/palette.jpg"]' size=1536x1024
```


Krea style references

```text
/tool image_generate action=generate model=fal/krea/v2/medium/text-to-image prompt="An expressive editorial portrait using this color palette and print texture" images='["/path/to/palette.png","/path/to/texture.jpg"]' aspectRatio=9:16 fal='{"creativity":"high"}'
```


The same `--output-format`, `--background`, `--quality`, and
`--openai-moderation` flags are available on `openclaw infer image edit`;
`--openai-background` remains as an OpenAI-specific alias. Bundled providers
other than OpenAI do not declare explicit background control today, so
`background: "transparent"` is reported as ignored for them.

## Related

- [Tools overview](/tools) - all available agent tools
- [ComfyUI](/providers/comfy) - local ComfyUI and Comfy Cloud workflow setup
- [fal](/providers/fal) - fal image and video provider setup
- [Google (Gemini)](/providers/google) - Gemini image provider setup
- [Microsoft Foundry plugin](/plugins/reference/microsoft-foundry) - Microsoft Foundry chat and MAI image setup
- [MiniMax](/providers/minimax) - MiniMax image provider setup
- [OpenAI](/providers/openai) - OpenAI Images provider setup
- [Vydra](/providers/vydra) - Vydra image, video, and speech setup
- [xAI](/providers/xai) - Grok image, video, search, code execution, and TTS setup
- [Configuration reference](/gateway/config-agents#agent-defaults) - `imageGenerationModel` config
- [Models](/concepts/models) - model configuration and failover

---
