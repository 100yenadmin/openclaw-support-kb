---
type: openclaw_doc
title: "LiteLLM"
source: "https://docs.openclaw.ai/providers/litellm"
source_hash: "1805264ee5eef8ddfdb0cf21e53e1d352ec1473615adc544e381e6a5679013a7"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/litellm.md"
original_doc_path: "providers/litellm.md"
duplicate_index: 1
---

# LiteLLM
Source: https://docs.openclaw.ai/providers/litellm

[LiteLLM](https://litellm.ai) is an open-source LLM gateway with a unified API to 100+ model
providers. Route OpenClaw through LiteLLM for centralized cost tracking, logging, virtual keys with
spend limits, and backend failover without changing OpenClaw config.

## Quick start

Tabs


Onboarding (recommended)

    ```bash
    openclaw onboard --auth-choice litellm-api-key
    ```

    For non-interactive setup against a remote proxy, pass the proxy URL explicitly:

    ```bash
    openclaw onboard --non-interactive --accept-risk --auth-choice litellm-api-key \
      --litellm-api-key "$LITELLM_API_KEY" --custom-base-url "https://litellm.example/v1"
    ```




Manual setup


Steps


Start LiteLLM Proxy

        ```bash
        pip install 'litellm[proxy]'
        litellm --model claude-opus-4-6
        ```


Point OpenClaw to LiteLLM

        ```bash
        export LITELLM_API_KEY="your-litellm-key"
        openclaw
        ```




## Configuration

```json5
{
  models: {
    providers: {
      litellm: {
        baseUrl: "http://localhost:4000",
        apiKey: "${LITELLM_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "claude-opus-4-6",
            name: "Claude Opus 4.6",
            reasoning: true,
            input: ["text", "image"],
            contextWindow: 200000,
            maxTokens: 64000,
          },
          {
            id: "gpt-4o",
            name: "GPT-4o",
            reasoning: false,
            input: ["text", "image"],
            contextWindow: 128000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
  agents: {
    defaults: {
      model: { primary: "litellm/claude-opus-4-6" },
    },
  },
}
```

The default model onboarding writes is `litellm/claude-opus-4-6`.

## Image generation

LiteLLM can back the `image_generate` tool through OpenAI-compatible `/images/generations` and
`/images/edits` routes. Default image model is `gpt-image-2`; configure a different one under
`agents.defaults.mediaModels.image`:

```json5
{
  models: {
    providers: {
      litellm: {
        baseUrl: "http://localhost:4000",
        apiKey: "${LITELLM_API_KEY}",
      },
    },
  },
  agents: {
    defaults: {
      mediaModels: {
        image: {
          primary: "litellm/gpt-image-2",
          timeoutMs: 180000,
        },
      },
    },
  },
}
```

Loopback LiteLLM URLs (`http://localhost:4000`, `127.0.0.1`, `::1`, `host.docker.internal`) work
without a global private-network override. For a LAN-hosted proxy, set
`models.providers.litellm.request.allowPrivateNetwork: true` because the API key is sent to that host.

## Advanced

AccordionGroup


Virtual keys

    Create a dedicated key for OpenClaw with spend limits:

    ```bash
    curl -X POST "http://localhost:4000/key/generate" \
      -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "key_alias": "openclaw",
        "max_budget": 50.00,
        "budget_duration": "monthly"
      }'
    ```

    Use the generated key as `LITELLM_API_KEY`.




Model routing

    LiteLLM can route model requests to different backends. Configure in your LiteLLM `config.yaml`:

    ```yaml
    model_list:
      - model_name: claude-opus-4-6
        litellm_params:
          model: claude-opus-4-6
          api_key: os.environ/ANTHROPIC_API_KEY

      - model_name: gpt-4o
        litellm_params:
          model: gpt-4o
          api_key: os.environ/OPENAI_API_KEY
    ```

    OpenClaw keeps requesting `claude-opus-4-6`; LiteLLM handles the routing.




Viewing usage

    ```bash
    # Key info
    curl "http://localhost:4000/key/info" \
      -H "Authorization: Bearer sk-litellm-key"

    # Spend logs
    curl "http://localhost:4000/spend/logs" \
      -H "Authorization: Bearer $LITELLM_MASTER_KEY"
    ```




Proxy behavior notes

    - LiteLLM runs on `http://localhost:4000` by default.
    - OpenClaw connects through LiteLLM's proxy-style OpenAI-compatible `/v1` endpoint.
    - Native-OpenAI-only request shaping does not apply through a configured LiteLLM base URL:
      no `service_tier`, no Responses `store`, no prompt-cache hints, no OpenAI reasoning-effort
      payload shaping.
    - Hidden OpenClaw attribution headers (`originator`, `version`, `User-Agent`) are only sent to
      verified native OpenAI endpoints, so they are not injected on a custom LiteLLM base URL.


Note

For general provider configuration and failover behavior, see [Model Providers](/concepts/model-providers).

## Related

CardGroup


LiteLLM Docs

    Official LiteLLM documentation and API reference.


Model selection

    Overview of all providers, model refs, and failover behavior.


Configuration

    Full config reference.


Models

    How to choose and configure models.

---
