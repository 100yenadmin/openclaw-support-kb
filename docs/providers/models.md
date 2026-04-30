---
type: openclaw_doc
title: "Model provider quickstart"
source: "https://docs.openclaw.ai/providers/models"
source_hash: "a23c0dd5147f003ecdbbb8bb4f2adcc96a1afcd75a7fd5aa51df5988d13c1c0f"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "providers/models.md"
original_doc_path: "providers/models.md"
duplicate_index: 1
---

# Model provider quickstart
Source: https://docs.openclaw.ai/providers/models



# Model Providers

OpenClaw can use many LLM providers. Pick one, authenticate, then set the default
model as `provider/model`.

## Quick start (two steps)

1. Authenticate with the provider (usually via `openclaw onboard`).
2. Set the default model:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6" } } },
}
```

## Supported providers (starter set)

* [Alibaba Model Studio](/providers/alibaba)
* [Amazon Bedrock](/providers/bedrock)
* [Anthropic (API + Claude CLI)](/providers/anthropic)
* [BytePlus (International)](/concepts/model-providers#byteplus-international)
* [Chutes](/providers/chutes)
* [ComfyUI](/providers/comfy)
* [Cloudflare AI Gateway](/providers/cloudflare-ai-gateway)
* [DeepInfra](/providers/deepinfra)
* [fal](/providers/fal)
* [Fireworks](/providers/fireworks)
* [GLM models](/providers/glm)
* [MiniMax](/providers/minimax)
* [Mistral](/providers/mistral)
* [Moonshot AI (Kimi + Kimi Coding)](/providers/moonshot)
* [OpenAI (API + Codex)](/providers/openai)
* [OpenCode (Zen + Go)](/providers/opencode)
* [OpenRouter](/providers/openrouter)
* [Qianfan](/providers/qianfan)
* [Qwen](/providers/qwen)
* [Runway](/providers/runway)
* [StepFun](/providers/stepfun)
* [Synthetic](/providers/synthetic)
* [Vercel AI Gateway](/providers/vercel-ai-gateway)
* [Venice (Venice AI)](/providers/venice)
* [xAI](/providers/xai)
* [Z.AI](/providers/zai)

## Additional bundled provider variants

* `anthropic-vertex` - implicit Anthropic on Google Vertex support when Vertex credentials are available; no separate onboarding auth choice
* `copilot-proxy` - local VS Code Copilot Proxy bridge; use `openclaw onboard --auth-choice copilot-proxy`
* `google-gemini-cli` - unofficial Gemini CLI OAuth flow; requires a local `gemini` install (`brew install gemini-cli` or `npm install -g @google/gemini-cli`); default model `google-gemini-cli/gemini-3-flash-preview`; use `openclaw onboard --auth-choice google-gemini-cli` or `openclaw models auth login --provider google-gemini-cli --set-default`

For the full provider catalog (xAI, Groq, Mistral, etc.) and advanced configuration,
see [Model providers](/concepts/model-providers).

## Related

* [Model selection](/concepts/model-providers)
* [Model failover](/concepts/model-failover)
* [Models CLI](/cli/models)
