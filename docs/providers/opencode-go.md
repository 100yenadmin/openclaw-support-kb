---
type: openclaw_doc
title: "OpenCode Go"
source: "https://docs.openclaw.ai/providers/opencode-go"
source_hash: "97a7b7c6a368b3c972523ca8525e215b48c35a7174528e8398fa51ee61ce7e07"
system: "openclaw"
kb_namespace: "openclaw"
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

OpenClaw sources most Go catalog rows from the bundled OpenClaw model registry and
supplements current upstream rows while the registry catches up. Run
`openclaw models list --provider opencode-go` for the current model list.

The provider includes:

| Model ref                       | Name                  |
| ------------------------------- | --------------------- |
| `opencode-go/glm-5`             | GLM-5                 |
| `opencode-go/glm-5.1`           | GLM-5.1               |
| `opencode-go/glm-5.2`           | GLM-5.2               |
| `opencode-go/kimi-k2.5`         | Kimi K2.5             |
| `opencode-go/kimi-k2.6`         | Kimi K2.6 (3x limits) |
| `opencode-go/kimi-k2.7-code`    | Kimi K2.7 Code        |
| `opencode-go/deepseek-v4-pro`   | DeepSeek V4 Pro       |
| `opencode-go/deepseek-v4-flash` | DeepSeek V4 Flash     |
| `opencode-go/mimo-v2-omni`      | MiMo V2 Omni          |
| `opencode-go/mimo-v2-pro`       | MiMo V2 Pro           |
| `opencode-go/minimax-m2.5`      | MiniMax M2.5          |
| `opencode-go/minimax-m2.7`      | MiniMax M2.7          |
| `opencode-go/qwen3.5-plus`      | Qwen3.5 Plus          |
| `opencode-go/qwen3.6-plus`      | Qwen3.6 Plus          |

GLM-5.2 uses a 1M-token context window and supports up to 131K output tokens.

## Getting started

Tabs


Interactive


Steps


Run onboarding

        ```bash
        openclaw onboard --auth-choice opencode-go
        ```


Set a Go model as default

        ```bash
        openclaw config set agents.defaults.model.primary "opencode-go/kimi-k2.6"
        ```


Verify models are available

        ```bash
        openclaw models list --provider opencode-go
        ```





Non-interactive


Steps


Pass the key directly

        ```bash
        openclaw onboard --opencode-go-api-key "$OPENCODE_API_KEY"
        ```


Verify models are available

        ```bash
        openclaw models list --provider opencode-go
        ```




## Config example

```json5
{
  env: { OPENCODE_API_KEY: "YOUR_API_KEY_HERE" }, // pragma: allowlist secret
  agents: { defaults: { model: { primary: "opencode-go/kimi-k2.6" } } },
}
```

## Advanced configuration

AccordionGroup


Routing behavior

    OpenClaw handles per-model routing automatically when the model ref uses
    `opencode-go/...`. No additional provider config is required.



Runtime ref convention

    Runtime refs stay explicit: `opencode/...` for Zen, `opencode-go/...` for Go.
    This keeps upstream per-model routing correct across both catalogs.



Shared credentials

    The same `OPENCODE_API_KEY` is used by both the Zen and Go catalogs. Entering
    the key during setup stores credentials for both runtime providers.


Tip

See [OpenCode](/providers/opencode) for the shared onboarding overview and the full
Zen + Go catalog reference.

## Related

CardGroup


OpenCode (parent)

    Shared onboarding, catalog overview, and advanced notes.


Model selection

    Choosing providers, model refs, and failover behavior.

---
