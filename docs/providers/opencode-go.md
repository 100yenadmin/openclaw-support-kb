---
type: openclaw_doc
title: "OpenCode Go"
source: "https://docs.openclaw.ai/providers/opencode-go"
source_hash: "1947fdde13e58c4555f98425a2a08ee08238b5aa6048f5bb68cbdb092b139f59"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "providers/opencode-go.md"
original_doc_path: "providers/opencode-go.md"
duplicate_index: 1
---

# OpenCode Go
Source: https://docs.openclaw.ai/providers/opencode-go



OpenCode Go is the Go catalog within [OpenCode](/providers/opencode).
It uses the same `OPENCODE_API_KEY` as the Zen catalog, but keeps the runtime
provider id `opencode-go` so upstream per-model routing stays correct.

| Property         | Value                           |
| ---------------- | ------------------------------- |
| Runtime provider | `opencode-go`                   |
| Auth             | `OPENCODE_API_KEY`              |
| Parent setup     | [OpenCode](/providers/opencode) |

## Built-in catalog

OpenClaw sources most Go catalog rows from the bundled pi model registry and
supplements current upstream rows while the registry catches up. Run
`openclaw models list --provider opencode-go` for the current model list.

The provider includes:

| Model ref                       | Name                  |
| ------------------------------- | --------------------- |
| `opencode-go/glm-5`             | GLM-5                 |
| `opencode-go/glm-5.1`           | GLM-5.1               |
| `opencode-go/kimi-k2.5`         | Kimi K2.5             |
| `opencode-go/kimi-k2.6`         | Kimi K2.6 (3x limits) |
| `opencode-go/deepseek-v4-pro`   | DeepSeek V4 Pro       |
| `opencode-go/deepseek-v4-flash` | DeepSeek V4 Flash     |
| `opencode-go/mimo-v2-omni`      | MiMo V2 Omni          |
| `opencode-go/mimo-v2-pro`       | MiMo V2 Pro           |
| `opencode-go/minimax-m2.5`      | MiniMax M2.5          |
| `opencode-go/minimax-m2.7`      | MiniMax M2.7          |
| `opencode-go/qwen3.5-plus`      | Qwen3.5 Plus          |
| `opencode-go/qwen3.6-plus`      | Qwen3.6 Plus          |

## Getting started

<Tabs>
  <Tab title="Interactive">
    <Steps>
      <Step title="Run onboarding">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        openclaw onboard --auth-choice opencode-go
        ```
      </Step>

      <Step title="Set a Go model as default">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        openclaw config set agents.defaults.model.primary "opencode-go/kimi-k2.6"
        ```
      </Step>

      <Step title="Verify models are available">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        openclaw models list --provider opencode-go
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="Non-interactive">
    <Steps>
      <Step title="Pass the key directly">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        openclaw onboard --opencode-go-api-key "$OPENCODE_API_KEY"
        ```
      </Step>

      <Step title="Verify models are available">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        openclaw models list --provider opencode-go
        ```
      </Step>
    </Steps>
  </Tab>
</Tabs>

## Config example

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  env: { OPENCODE_API_KEY: "YOUR_API_KEY_HERE" }, // pragma: allowlist secret
  agents: { defaults: { model: { primary: "opencode-go/kimi-k2.6" } } },
}
```

## Advanced configuration

<AccordionGroup>
  <Accordion title="Routing behavior">
    OpenClaw handles per-model routing automatically when the model ref uses
    `opencode-go/...`. No additional provider config is required.
  </Accordion>

  <Accordion title="Runtime ref convention">
    Runtime refs stay explicit: `opencode/...` for Zen, `opencode-go/...` for Go.
    This keeps upstream per-model routing correct across both catalogs.
  </Accordion>

  <Accordion title="Shared credentials">
    The same `OPENCODE_API_KEY` is used by both the Zen and Go catalogs. Entering
    the key during setup stores credentials for both runtime providers.
  </Accordion>
</AccordionGroup>

<Tip>
  See [OpenCode](/providers/opencode) for the shared onboarding overview and the full
  Zen + Go catalog reference.
</Tip>

## Related

<CardGroup>
  <Card title="OpenCode (parent)" href="/providers/opencode" icon="server">
    Shared onboarding, catalog overview, and advanced notes.
  </Card>

  <Card title="Model selection" href="/concepts/model-providers" icon="layers">
    Choosing providers, model refs, and failover behavior.
  </Card>
</CardGroup>
