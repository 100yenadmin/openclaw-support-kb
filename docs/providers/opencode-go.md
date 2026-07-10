---
type: openclaw_doc
title: "OpenCode Go"
source: "https://docs.openclaw.ai/providers/opencode-go"
source_hash: "4cbbc4ebdbca75b9f049904fb02a459604802d4bb1ae10eb55ad65570a3b69e5"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/opencode-go.md"
original_doc_path: "providers/opencode-go.md"
duplicate_index: 1
---

# OpenCode Go
Source: https://docs.openclaw.ai/providers/opencode-go

OpenCode Go is the Go catalog inside [OpenCode](/providers/opencode). It shares
the `OPENCODE_API_KEY` credential with the Zen catalog, but keeps its own
runtime provider id (`opencode-go`) so upstream per-model routing stays
correct.

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| Runtime provider | `opencode-go`                                      |
| Auth             | `OPENCODE_API_KEY` (alias: `OPENCODE_ZEN_API_KEY`) |
| Parent setup     | [OpenCode](/providers/opencode)                    |

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

## Built-in catalog

Run `openclaw models list --provider opencode-go` for the current model list.
Bundled rows:

| Model ref                       | Name              | Context   | Max output | Image input |
| ------------------------------- | ----------------- | --------- | ---------- | ----------- |
| `opencode-go/deepseek-v4-pro`   | DeepSeek V4 Pro   | 1M        | 384K       | No          |
| `opencode-go/deepseek-v4-flash` | DeepSeek V4 Flash | 1M        | 384K       | No          |
| `opencode-go/glm-5`             | GLM-5             | 202,752   | 32,768     | No          |
| `opencode-go/glm-5.1`           | GLM-5.1           | 202,752   | 32,768     | No          |
| `opencode-go/glm-5.2`           | GLM-5.2           | 1M        | 131,072    | No          |
| `opencode-go/hy3-preview`       | HY3 Preview       | 262,144   | 32,768     | No          |
| `opencode-go/kimi-k2.5`         | Kimi K2.5         | 262,144   | 65,536     | Yes         |
| `opencode-go/kimi-k2.6`         | Kimi K2.6         | 262,144   | 65,536     | Yes         |
| `opencode-go/kimi-k2.7-code`    | Kimi K2.7 Code    | 262,144   | 262,144    | Yes         |
| `opencode-go/mimo-v2.5`         | MiMo V2.5         | 1M        | 128,000    | Yes         |
| `opencode-go/mimo-v2.5-pro`     | MiMo V2.5 Pro     | 1,048,576 | 128,000    | No          |
| `opencode-go/minimax-m2.5`      | MiniMax M2.5      | 204,800   | 65,536     | No          |
| `opencode-go/minimax-m2.7`      | MiniMax M2.7      | 204,800   | 131,072    | No          |
| `opencode-go/minimax-m3`        | MiniMax M3        | 204,800   | 131,072    | No          |
| `opencode-go/qwen3.5-plus`      | Qwen3.5 Plus      | 262,144   | 65,536     | Yes         |
| `opencode-go/qwen3.6-plus`      | Qwen3.6 Plus      | 262,144   | 65,536     | Yes         |
| `opencode-go/qwen3.7-max`       | Qwen3.7 Max       | 1M        | 65,536     | No          |
| `opencode-go/qwen3.7-plus`      | Qwen3.7 Plus      | 1M        | 65,536     | Yes         |

## Advanced configuration

AccordionGroup


Routing behavior

    OpenClaw routes any `opencode-go/...` model ref automatically. No extra
    provider config is required.



Runtime ref convention

    Runtime refs stay explicit: `opencode/...` for Zen, `opencode-go/...` for
    Go. This keeps upstream per-model routing correct across both catalogs.



Shared credentials

    One `OPENCODE_API_KEY` covers both the Zen and Go catalogs. Entering the
    key during setup stores credentials for both runtime providers.


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
