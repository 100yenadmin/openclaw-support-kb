---
type: openclaw_doc
title: "Fal"
source: "https://docs.openclaw.ai/providers/fal"
source_hash: "a852c49d0f389f1ebe8e166e26f6cae4b5295834ab670ed3d84b2ff5d1bc7dbe"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "providers/fal.md"
original_doc_path: "providers/fal.md"
duplicate_index: 1
---

# Fal
Source: https://docs.openclaw.ai/providers/fal



OpenClaw ships a bundled `fal` provider for hosted image and video generation.

| Property | Value                                                         |
| -------- | ------------------------------------------------------------- |
| Provider | `fal`                                                         |
| Auth     | `FAL_KEY` (canonical; `FAL_API_KEY` also works as a fallback) |
| API      | fal model endpoints                                           |

## Getting started

<Steps>
  <Step title="Set the API key">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --auth-choice fal-api-key
    ```
  </Step>

  <Step title="Set a default image model">
    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
    {
      agents: {
        defaults: {
          imageGenerationModel: {
            primary: "fal/fal-ai/flux/dev",
          },
        },
      },
    }
    ```
  </Step>
</Steps>

## Image generation

The bundled `fal` image-generation provider defaults to
`fal/fal-ai/flux/dev`.

| Capability     | Value                      |
| -------------- | -------------------------- |
| Max images     | 4 per request              |
| Edit mode      | Enabled, 1 reference image |
| Size overrides | Supported                  |
| Aspect ratio   | Supported                  |
| Resolution     | Supported                  |
| Output format  | `png` or `jpeg`            |

<Warning>
  The fal image edit endpoint does **not** support `aspectRatio` overrides.
</Warning>

Use `outputFormat: "png"` when you want PNG output. fal does not declare an
explicit transparent-background control in OpenClaw, so `background:
"transparent"` is reported as an ignored override for fal models.

To use fal as the default image provider:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: {
    defaults: {
      imageGenerationModel: {
        primary: "fal/fal-ai/flux/dev",
      },
    },
  },
}
```

## Video generation

The bundled `fal` video-generation provider defaults to
`fal/fal-ai/minimax/video-01-live`.

| Capability | Value                                                              |
| ---------- | ------------------------------------------------------------------ |
| Modes      | Text-to-video, single-image reference, Seedance reference-to-video |
| Runtime    | Queue-backed submit/status/result flow for long-running jobs       |

<AccordionGroup>
  <Accordion title="Available video models">
    **HeyGen video-agent:**

    * `fal/fal-ai/heygen/v2/video-agent`

    **Seedance 2.0:**

    * `fal/bytedance/seedance-2.0/fast/text-to-video`
    * `fal/bytedance/seedance-2.0/fast/image-to-video`
    * `fal/bytedance/seedance-2.0/fast/reference-to-video`
    * `fal/bytedance/seedance-2.0/text-to-video`
    * `fal/bytedance/seedance-2.0/image-to-video`
    * `fal/bytedance/seedance-2.0/reference-to-video`
  </Accordion>

  <Accordion title="Seedance 2.0 config example">
    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
    {
      agents: {
        defaults: {
          videoGenerationModel: {
            primary: "fal/bytedance/seedance-2.0/fast/text-to-video",
          },
        },
      },
    }
    ```
  </Accordion>

  <Accordion title="Seedance 2.0 reference-to-video config example">
    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
    {
      agents: {
        defaults: {
          videoGenerationModel: {
            primary: "fal/bytedance/seedance-2.0/fast/reference-to-video",
          },
        },
      },
    }
    ```

    Reference-to-video accepts up to 9 images, 3 videos, and 3 audio references
    through the shared `video_generate` `images`, `videos`, and `audioRefs`
    parameters, with at most 12 total reference files.
  </Accordion>

  <Accordion title="HeyGen video-agent config example">
    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
    {
      agents: {
        defaults: {
          videoGenerationModel: {
            primary: "fal/fal-ai/heygen/v2/video-agent",
          },
        },
      },
    }
    ```
  </Accordion>
</AccordionGroup>

<Tip>
  Use `openclaw models list --provider fal` to see the full list of available fal
  models, including any recently added entries.
</Tip>

## Related

<CardGroup>
  <Card title="Image generation" href="/tools/image-generation" icon="image">
    Shared image tool parameters and provider selection.
  </Card>

  <Card title="Video generation" href="/tools/video-generation" icon="video">
    Shared video tool parameters and provider selection.
  </Card>

  <Card title="Configuration reference" href="/gateway/config-agents#agent-defaults" icon="gear">
    Agent defaults including image and video model selection.
  </Card>
</CardGroup>
