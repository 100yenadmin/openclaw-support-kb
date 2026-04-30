---
type: openclaw_doc
title: "Runway"
source: "https://docs.openclaw.ai/providers/runway"
source_hash: "b6d7106dc39c34377ee533defb09bef897f23d26fb341ac35df38d7883474631"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "providers/runway.md"
original_doc_path: "providers/runway.md"
duplicate_index: 1
---

# Runway
Source: https://docs.openclaw.ai/providers/runway



OpenClaw ships a bundled `runway` provider for hosted video generation.

| Property    | Value                                                             |
| ----------- | ----------------------------------------------------------------- |
| Provider id | `runway`                                                          |
| Auth        | `RUNWAYML_API_SECRET` (canonical) or `RUNWAY_API_KEY`             |
| API         | Runway task-based video generation (`GET /v1/tasks/{id}` polling) |

## Getting started

<Steps>
  <Step title="Set the API key">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --auth-choice runway-api-key
    ```
  </Step>

  <Step title="Set Runway as the default video provider">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw config set agents.defaults.videoGenerationModel.primary "runway/gen4.5"
    ```
  </Step>

  <Step title="Generate a video">
    Ask the agent to generate a video. Runway will be used automatically.
  </Step>
</Steps>

## Supported modes

| Mode           | Model              | Reference input         |
| -------------- | ------------------ | ----------------------- |
| Text-to-video  | `gen4.5` (default) | None                    |
| Image-to-video | `gen4.5`           | 1 local or remote image |
| Video-to-video | `gen4_aleph`       | 1 local or remote video |

<Note>
  Local image and video references are supported via data URIs. Text-only runs
  currently expose `16:9` and `9:16` aspect ratios.
</Note>

<Warning>
  Video-to-video currently requires `runway/gen4_aleph` specifically.
</Warning>

## Configuration

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: {
    defaults: {
      videoGenerationModel: {
        primary: "runway/gen4.5",
      },
    },
  },
}
```

## Advanced configuration

<AccordionGroup>
  <Accordion title="Environment variable aliases">
    OpenClaw recognizes both `RUNWAYML_API_SECRET` (canonical) and `RUNWAY_API_KEY`.
    Either variable will authenticate the Runway provider.
  </Accordion>

  <Accordion title="Task polling">
    Runway uses a task-based API. After submitting a generation request, OpenClaw
    polls `GET /v1/tasks/{id}` until the video is ready. No additional
    configuration is needed for the polling behavior.
  </Accordion>
</AccordionGroup>

## Related

<CardGroup>
  <Card title="Video generation" href="/tools/video-generation" icon="video">
    Shared tool parameters, provider selection, and async behavior.
  </Card>

  <Card title="Configuration reference" href="/gateway/config-agents#agent-defaults" icon="gear">
    Agent default settings including video generation model.
  </Card>
</CardGroup>
