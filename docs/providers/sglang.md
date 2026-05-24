---
type: openclaw_doc
title: "SGLang"
source: "https://docs.openclaw.ai/providers/sglang"
source_hash: "670ce5b50b2157704282840c5d382eb422831ae29c0a7755d265850bf96e6ec1"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/sglang.md"
original_doc_path: "providers/sglang.md"
duplicate_index: 1
---

# SGLang
Source: https://docs.openclaw.ai/providers/sglang

SGLang serves open-weight models via an OpenAI-compatible HTTP API. OpenClaw connects to SGLang using the `openai-completions` provider family with auto-discovery of available models.

| Property                  | Value                                                        |
| ------------------------- | ------------------------------------------------------------ |
| Provider id               | `sglang`                                                     |
| Plugin                    | bundled, `enabledByDefault: true`                            |
| Auth env var              | `SGLANG_API_KEY` (any non-empty value if server has no auth) |
| Onboarding flag           | `--auth-choice sglang`                                       |
| API                       | OpenAI-compatible (`openai-completions`)                     |
| Default base URL          | `http://127.0.0.1:30000/v1`                                  |
| Default model placeholder | `sglang/Qwen/Qwen3-8B`                                       |
| Streaming usage           | Yes (`supportsStreamingUsage: true`)                         |
| Pricing                   | Marked external-free (`modelPricing.external: false`)        |

OpenClaw also **auto-discovers** available models from SGLang when you opt in with `SGLANG_API_KEY`. Use `sglang/*` in `agents.defaults.models` to keep discovery dynamic when you also configure a custom SGLang base URL. See [Model discovery (implicit provider)](#model-discovery-implicit-provider) below.

## Getting started

Steps


Start SGLang

    Launch SGLang with an OpenAI-compatible server. Your base URL should expose
    `/v1` endpoints (for example `/v1/models`, `/v1/chat/completions`). SGLang
    commonly runs on:

    - `http://127.0.0.1:30000/v1`



Set an API key

    Any value works if no auth is configured on your server:

    ```bash
    export SGLANG_API_KEY="sglang-local"
    ```



Run onboarding or set a model directly

    ```bash
    openclaw onboard
    ```

    Or configure the model manually:

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "sglang/your-model-id" },
        },
      },
    }
    ```



## Model discovery (implicit provider)

When `SGLANG_API_KEY` is set (or an auth profile exists) and you **do not**
define `models.providers.sglang`, OpenClaw will query:

- `GET http://127.0.0.1:30000/v1/models`

and convert the returned IDs into model entries.

Note

If you set `models.providers.sglang` explicitly, OpenClaw uses your declared
models by default. Add `"sglang/*": {}` to `agents.defaults.models` when you
want OpenClaw to query that configured provider's `/models` endpoint and include
all advertised SGLang models.

## Explicit configuration (manual models)

Use explicit config when:

- SGLang runs on a different host/port.
- You want to pin `contextWindow`/`maxTokens` values.
- Your server requires a real API key (or you want to control headers).

```json5
{
  models: {
    providers: {
      sglang: {
        baseUrl: "http://127.0.0.1:30000/v1",
        apiKey: "${SGLANG_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "your-model-id",
            name: "Local SGLang Model",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 128000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

## Advanced configuration

AccordionGroup


Proxy-style behavior

    SGLang is treated as a proxy-style OpenAI-compatible `/v1` backend, not a
    native OpenAI endpoint.

    | Behavior | SGLang |
    |----------|--------|
    | OpenAI-only request shaping | Not applied |
    | `service_tier`, Responses `store`, prompt-cache hints | Not sent |
    | Reasoning-compat payload shaping | Not applied |
    | Hidden attribution headers (`originator`, `version`, `User-Agent`) | Not injected on custom SGLang base URLs |




Troubleshooting

    **Server not reachable**

    Verify the server is running and responding:

    ```bash
    curl http://127.0.0.1:30000/v1/models
    ```

    **Auth errors**

    If requests fail with auth errors, set a real `SGLANG_API_KEY` that matches
    your server configuration, or configure the provider explicitly under
    `models.providers.sglang`.


Tip

    If you run SGLang without authentication, any non-empty value for
    `SGLANG_API_KEY` is sufficient to opt in to model discovery.




## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full config schema including provider entries.

---
