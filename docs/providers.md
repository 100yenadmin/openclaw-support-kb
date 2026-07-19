---
type: openclaw_doc
title: "Provider directory"
source: "https://docs.openclaw.ai/providers"
source_hash: "f6c5c86629c5d69fb1a68f070c62bb4bf20a7f2d466fa2040bf1f6e94cba8fd4"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers.md"
original_doc_path: "providers.md"
duplicate_index: 1
---

# Provider directory
Source: https://docs.openclaw.ai/providers

OpenClaw can use many LLM providers. Pick a provider, authenticate, then set the
default model as `provider/model`.

Looking for chat channel docs (WhatsApp/Telegram/Discord/Slack/Mattermost (plugin)/etc.)? See [Channels](/channels).

## Quick start

1. Authenticate with the provider (usually via `openclaw onboard`).
2. Set the default model:

```json5
{
  agents: { defaults: { model: { primary: "anthropic/claude-opus-4-6" } } },
}
```

## Provider docs

- [Alibaba Model Studio](/providers/alibaba)
- [Amazon Bedrock](/providers/bedrock)
- [Amazon Bedrock Mantle](/providers/bedrock-mantle)
- [Anthropic (API + Claude CLI)](/providers/anthropic)
- [Arcee AI (Trinity models)](/providers/arcee)
- [Azure Speech](/providers/azure-speech)
- [Baseten (Inkling + Model APIs)](/providers/baseten)
- [BytePlus (International)](/concepts/model-providers#byteplus-international)
- [Cerebras](/providers/cerebras)
- [Chutes](/providers/chutes)
- [ClawRouter (managed multi-provider routing)](/providers/clawrouter)
- [Cloudflare AI Gateway](/providers/cloudflare-ai-gateway)
- [Cohere](/providers/cohere)
- [ComfyUI](/providers/comfy)
- [DeepSeek](/providers/deepseek)
- [ds4 (local DeepSeek V4)](/providers/ds4)
- [ElevenLabs](/providers/elevenlabs)
- [fal](/providers/fal)
- [Featherless AI](/providers/featherless)
- [Fireworks](/providers/fireworks)
- [GitHub Copilot](/providers/github-copilot)
- [GMI Cloud](/providers/gmi)
- [Google (Gemini)](/providers/google)
- [Gradium](/providers/gradium)
- [Groq (LPU inference)](/providers/groq)
- [Hugging Face (Inference)](/providers/huggingface)
- [inferrs (local models)](/providers/inferrs)
- [Kilocode](/providers/kilocode)
- [LiteLLM (unified gateway)](/providers/litellm)
- [LM Studio (local models)](/providers/lmstudio)
- [LongCat](/providers/longcat)
- [MiniMax](/providers/minimax)
- [Mistral](/providers/mistral)
- [Moonshot AI (Kimi + Kimi Coding)](/providers/moonshot)
- [NovitaAI](/providers/novita)
- [NVIDIA](/providers/nvidia)
- [Ollama (cloud + local models)](/providers/ollama)
- [Ollama Cloud](/providers/ollama-cloud)
- [OpenAI (API + Codex)](/providers/openai)
- [OpenCode](/providers/opencode)
- [OpenCode Go](/providers/opencode-go)
- [OpenRouter](/providers/openrouter)
- [Perplexity (web search)](/providers/perplexity-provider)
- [Qianfan](/providers/qianfan)
- [Qwen Cloud](/providers/qwen)
- [Runway](/providers/runway)
- [SenseAudio](/providers/senseaudio)
- [SGLang (local models)](/providers/sglang)
- [StepFun](/providers/stepfun)
- [Synthetic](/providers/synthetic)
- [Tencent Cloud (TokenHub / TokenPlan)](/providers/tencent)
- [Together AI](/providers/together)
- [Venice (Venice AI, privacy-focused)](/providers/venice)
- [Vercel AI Gateway](/providers/vercel-ai-gateway)
- [vLLM (local models)](/providers/vllm)
- [Volcengine (Doubao)](/providers/volcengine)
- [Vydra](/providers/vydra)
- [xAI](/providers/xai)
- [Xiaomi](/providers/xiaomi)
- [Z.AI (GLM)](/providers/zai)

## Shared overview pages

- [Additional provider variants](/providers/models#additional-provider-variants) - Anthropic Vertex, Copilot Proxy, and Gemini CLI OAuth
- [Image Generation](/tools/image-generation) - Shared `image_generate` tool, provider selection, and failover
- [Music Generation](/tools/music-generation) - Shared `music_generate` tool, provider selection, and failover
- [Video Generation](/tools/video-generation) - Shared `video_generate` tool, provider selection, and failover

## Transcription providers

- [Deepgram (audio transcription)](/providers/deepgram)
- [ElevenLabs](/providers/elevenlabs#speech-to-text)
- [Mistral](/providers/mistral#audio-transcription-voxtral)
- [OpenAI](/providers/openai)
- [SenseAudio](/providers/senseaudio)
- [xAI](/providers/xai)

## Community tools

- [Claude Max API Proxy](/providers/claude-max-api-proxy) - Community proxy for Claude subscription credentials (verify Anthropic policy/terms before use)

For the full provider catalog (xAI, Groq, Mistral, etc.) and advanced configuration,
see [Model providers](/concepts/model-providers).

---
