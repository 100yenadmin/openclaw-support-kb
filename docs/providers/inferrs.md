---
type: openclaw_doc
title: "Inferrs"
source: "https://docs.openclaw.ai/providers/inferrs"
source_hash: "e1438d49fbf42fdf0e5330674975a73748b72cbfd18c8e8aaa3ec45b45dc29e2"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/inferrs.md"
original_doc_path: "providers/inferrs.md"
duplicate_index: 1
---

# Inferrs
Source: https://docs.openclaw.ai/providers/inferrs

[inferrs](https://github.com/ericcurtin/inferrs) serves local models behind an OpenAI-compatible `/v1` API. OpenClaw talks to it through the generic `openai-completions` adapter.

| Property           | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Provider id        | `inferrs` (custom; configure under `models.providers.inferrs`)       |
| Plugin             | none — not a bundled OpenClaw provider plugin                        |
| Auth env var       | none required; any value works if your inferrs server has no auth    |
| API                | OpenAI-compatible (`openai-completions`)                             |
| Suggested base URL | `http://127.0.0.1:8080/v1` (or wherever your inferrs server listens) |

Note

  `inferrs` is a custom self-hosted OpenAI-compatible backend, not a dedicated OpenClaw provider plugin: you configure it under `models.providers.inferrs` instead of picking an onboarding auth choice. For a bundled plugin with auto-discovery, see [SGLang](/providers/sglang) or [vLLM](/providers/vllm).

## Getting started

Steps


Start inferrs with a model

    ```bash
    inferrs serve google/gemma-4-E2B-it \
      --host 127.0.0.1 \
      --port 8080 \
      --device metal
    ```


Verify the server is reachable

    ```bash
    curl http://127.0.0.1:8080/health
    curl http://127.0.0.1:8080/v1/models
    ```


Add an OpenClaw provider entry

    Add an explicit provider entry and point your default model at it. See the config example below.


## Full config example

Gemma 4 on a local `inferrs` server:

```json5
{
  agents: {
    defaults: {
      model: { primary: "inferrs/google/gemma-4-E2B-it" },
      models: {
        "inferrs/google/gemma-4-E2B-it": {
          alias: "Gemma 4 (inferrs)",
        },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      inferrs: {
        baseUrl: "http://127.0.0.1:8080/v1",
        apiKey: "inferrs-local",
        api: "openai-completions",
        models: [
          {
            id: "google/gemma-4-E2B-it",
            name: "Gemma 4 E2B (inferrs)",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 131072,
            maxTokens: 4096,
            compat: {
              requiresStringContent: true,
            },
          },
        ],
      },
    },
  },
}
```

## On-demand startup

OpenClaw can start `inferrs` itself only when an `inferrs/...` model is selected. Add `localService` to the same provider entry:

```json5
{
  models: {
    providers: {
      inferrs: {
        baseUrl: "http://127.0.0.1:8080/v1",
        apiKey: "inferrs-local",
        api: "openai-completions",
        timeoutSeconds: 300,
        localService: {
          command: "/opt/homebrew/bin/inferrs",
          args: [
            "serve",
            "google/gemma-4-E2B-it",
            "--host",
            "127.0.0.1",
            "--port",
            "8080",
            "--device",
            "metal",
          ],
          healthUrl: "http://127.0.0.1:8080/v1/models",
          readyTimeoutMs: 180000,
          idleStopMs: 0,
        },
        models: [
          {
            id: "google/gemma-4-E2B-it",
            name: "Gemma 4 E2B (inferrs)",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 131072,
            maxTokens: 4096,
            compat: {
              requiresStringContent: true,
            },
          },
        ],
      },
    },
  },
}
```

`command` must be an absolute path. Run `which inferrs` on the Gateway host and use that path. Full field reference: [Local model services](/gateway/local-model-services).

## Advanced configuration

AccordionGroup


Why requiresStringContent matters

    Some `inferrs` Chat Completions routes accept only string `messages[].content`, not structured content-part arrays.


Warning

    If OpenClaw runs fail with:

    ```text
    messages[1].content: invalid type: sequence, expected a string
    ```

    set `compat.requiresStringContent: true` in the model entry. OpenClaw then flattens pure text content parts into plain strings before sending the request.





Gemma and tool-schema caveat

    Some `inferrs` + Gemma combinations accept small direct `/v1/chat/completions` requests but fail on full OpenClaw agent-runtime turns. Try disabling the tool schema surface first:

    ```json5
    compat: {
      requiresStringContent: true,
      supportsTools: false
    }
    ```

    That reduces prompt pressure on stricter local backends. If tiny direct requests still work but normal OpenClaw agent turns keep crashing inside `inferrs`, treat it as an upstream model/server limitation rather than an OpenClaw transport issue.




Manual smoke test

    Test both layers once configured:

    ```bash
    curl http://127.0.0.1:8080/v1/chat/completions \
      -H 'content-type: application/json' \
      -d '{"model":"google/gemma-4-E2B-it","messages":[{"role":"user","content":"What is 2 + 2?"}],"stream":false}'
    ```

    ```bash
    openclaw infer model run \
      --model inferrs/google/gemma-4-E2B-it \
      --prompt "What is 2 + 2? Reply with one short sentence." \
      --json
    ```

    If the first command works but the second fails, see Troubleshooting below.




Proxy-style behavior

    Because `inferrs` uses the generic `openai-completions` adapter (not `openai-responses`), native-OpenAI-only request shaping never applies: no `service_tier`, no Responses `store`, no prompt-cache hints, and no OpenAI reasoning-compat payload shaping get sent.


## Troubleshooting

AccordionGroup


curl /v1/models fails

    `inferrs` is not running, not reachable, or not bound to the host/port you configured. Confirm the server is started and listening on that address.



messages[].content expected a string

    Set `compat.requiresStringContent: true` in the model entry (see above).



Direct /v1/chat/completions calls pass but openclaw infer model run fails

    Set `compat.supportsTools: false` to disable the tool schema surface (see the Gemma caveat above).



inferrs still crashes on larger agent turns

    If schema errors are gone but `inferrs` still crashes on larger agent turns, treat it as an upstream `inferrs` or model limitation. Reduce prompt pressure or switch backend/model.


Tip

For general help, see [Troubleshooting](/help/troubleshooting) and [FAQ](/help/faq).

## Related

CardGroup


Local models

    Running OpenClaw against local model servers.


Local model services

    Starting local model servers on demand for configured providers.


Gateway troubleshooting

    Debugging local OpenAI-compatible backends that pass probes but fail agent runs.


Model selection

    Overview of all providers, model refs, and failover behavior.

---
