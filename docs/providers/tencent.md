---
type: openclaw_doc
title: "Tencent Cloud (TokenHub / TokenPlan)"
source: "https://docs.openclaw.ai/providers/tencent"
source_hash: "a4b1de0fb000d4957c4b734228caf72afde9b781c6c87cf25e9f1b54c08ff4cd"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/tencent.md"
original_doc_path: "providers/tencent.md"
duplicate_index: 1
---

# Tencent Cloud (TokenHub / TokenPlan)
Source: https://docs.openclaw.ai/providers/tencent

Install the official Tencent Cloud provider plugin to access Tencent Hy3 through two endpoints — TokenHub (`tencent-tokenhub`) and TokenPlan (`tencent-tokenplan`) — using an OpenAI-compatible API.

| Property                  | Value                                                 |
| ------------------------- | ----------------------------------------------------- |
| Provider ids              | `tencent-tokenhub`, `tencent-tokenplan`               |
| Package                   | `@openclaw/tencent-provider`                          |
| TokenHub auth env var     | `TOKENHUB_API_KEY`                                    |
| TokenPlan auth env var    | `TOKENPLAN_API_KEY`                                   |
| TokenHub onboarding flag  | `--auth-choice tokenhub-api-key`                      |
| TokenPlan onboarding flag | `--auth-choice tokenplan-api-key`                     |
| TokenHub direct CLI flag  | `--tokenhub-api-key <key>`                            |
| TokenPlan direct CLI flag | `--tokenplan-api-key <key>`                           |
| API                       | OpenAI-compatible (`openai-completions`)              |
| TokenHub base URL         | `https://tokenhub.tencentmaas.com/v1`                 |
| TokenHub global base URL  | `https://tokenhub-intl.tencentmaas.com/v1` (override) |
| TokenPlan base URL        | `https://api.lkeap.cloud.tencent.com/plan/v3`         |
| Default model             | `tencent-tokenhub/hy3`                                |

## Quick start

Steps


Create a Tencent API key

    Create an API key for Tencent Cloud TokenHub and TokenPlan. If you choose a limited access scope for the key, include **hy3** (and **hy3 preview** if you plan to use it on TokenHub) in the allowed models.


Run onboarding


CodeGroup

```bash TokenHub onboarding
openclaw onboard --auth-choice tokenhub-api-key
```

```bash TokenHub direct flag
openclaw onboard --non-interactive \
  --auth-choice tokenhub-api-key \
  --tokenhub-api-key "$TOKENHUB_API_KEY"
```

```bash TokenPlan onboarding
openclaw onboard --auth-choice tokenplan-api-key
```

```bash TokenPlan direct flag
openclaw onboard --non-interactive \
  --auth-choice tokenplan-api-key \
  --tokenplan-api-key "$TOKENPLAN_API_KEY"
```

```bash Env only
export TOKENHUB_API_KEY=...
export TOKENPLAN_API_KEY=...
```





Verify the model

    ```bash
    openclaw models list --provider tencent-tokenhub
    openclaw models list --provider tencent-tokenplan
    ```


## Non-interactive setup

```bash
# TokenHub
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice tokenhub-api-key \
  --tokenhub-api-key "$TOKENHUB_API_KEY" \
  --skip-health \
  --accept-risk

# TokenPlan
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice tokenplan-api-key \
  --tokenplan-api-key "$TOKENPLAN_API_KEY" \
  --skip-health \
  --accept-risk
```

Note

`--accept-risk` is required alongside `--non-interactive`.

## Built-in catalog

| Model ref                      | Name                   | Input | Context | Max output | Notes             |
| ------------------------------ | ---------------------- | ----- | ------- | ---------- | ----------------- |
| `tencent-tokenhub/hy3-preview` | hy3 preview (TokenHub) | text  | 256,000 | 64,000     | reasoning-enabled |
| `tencent-tokenhub/hy3`         | hy3 (TokenHub)         | text  | 256,000 | 64,000     | reasoning-enabled |
| `tencent-tokenplan/hy3`        | hy3 (TokenPlan)        | text  | 256,000 | 64,000     | reasoning-enabled |

hy3 is Tencent Hunyuan's large MoE language model for reasoning, long-context instruction following, code, and agent workflows. Tencent's OpenAI-compatible examples use `hy3` as the model id and support standard chat-completions tool calling plus `reasoning_effort`.

Tip

  The model id is `hy3`. Do not confuse it with Tencent's `HY-3D-*` models, which are 3D generation APIs and are not the OpenClaw chat model configured by this provider.

## Advanced configuration

AccordionGroup


Endpoint override

    OpenClaw's built-in catalog uses Tencent Cloud's `https://tokenhub.tencentmaas.com/v1` endpoint. Override it only if your TokenHub account or region requires a different one:

    ```bash
    openclaw config set models.providers.tencent-tokenhub.baseUrl "https://your-endpoint/v1"
    ```




Environment availability for the daemon

    If the Gateway runs as a managed service (launchd, systemd, Docker), `TOKENHUB_API_KEY` and `TOKENPLAN_API_KEY` must be visible to that process. Set them in `~/.openclaw/.env` or via `env.shellEnv` so launchd, systemd, or Docker exec environments can read them.


Warning

      Keys exported only in an interactive shell are not visible to managed gateway processes. Use the env file or config seam for persistent availability.




## Related

CardGroup


Model providers

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full config schema including provider settings.


Tencent TokenHub

    Tencent Cloud's TokenHub product page.


Hy3 preview model card

    Tencent Hunyuan Hy3 preview details and benchmarks.

---
