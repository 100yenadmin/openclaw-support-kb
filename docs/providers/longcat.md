---
type: openclaw_doc
title: "LongCat"
source: "https://docs.openclaw.ai/providers/longcat"
source_hash: "a0b99e4cf5282eee16ab77a8a371df6820bf8ec2f008546ac60fc1c8e6f38d0b"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/longcat.md"
original_doc_path: "providers/longcat.md"
duplicate_index: 1
---

# LongCat
Source: https://docs.openclaw.ai/providers/longcat

[LongCat](https://longcat.ai) provides a hosted API for LongCat-2.0, a
reasoning model built for coding and agentic workloads. OpenClaw provides the
official LongCat plugin for LongCat's OpenAI-compatible endpoint.

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Provider   | `longcat`                          |
| Auth       | `LONGCAT_API_KEY`                  |
| API        | OpenAI-compatible Chat Completions |
| Base URL   | `https://api.longcat.chat/openai`  |
| Model      | `longcat/LongCat-2.0`              |
| Context    | 1,048,576 tokens                   |
| Max output | 131,072 tokens                     |
| Input      | Text                               |

## Install plugin

Install the official package, then restart Gateway:

```bash
openclaw plugins install @openclaw/longcat-provider
openclaw gateway restart
```

## Getting started

Steps


Create an API key

    Sign in to the [LongCat API Platform](https://longcat.chat/platform/) and
    create a key on the [API Keys](https://longcat.chat/platform/api_keys)
    page.


Run onboarding

    ```bash
    openclaw onboard --auth-choice longcat-api-key
    ```


Verify the model

    ```bash
    openclaw models list --provider longcat
    ```


Onboarding adds the hosted catalog and selects `longcat/LongCat-2.0` when no
primary model is already configured.

### Non-interactive setup

```bash
openclaw onboard --non-interactive --accept-risk --skip-health \
  --mode local \
  --auth-choice longcat-api-key \
  --longcat-api-key "$LONGCAT_API_KEY"
```

## Reasoning behavior

LongCat exposes binary thinking control. OpenClaw maps enabled thinking levels
to `thinking: { type: "enabled" }` and `/think off` to
`thinking: { type: "disabled" }`. LongCat does not currently document
`reasoning_effort`, so OpenClaw does not send it.

LongCat returns reasoning in `reasoning_content`. OpenClaw preserves that field
when replaying assistant tool-call turns so multi-turn agent sessions retain
the provider's expected message shape.

## Pricing

The built-in catalog uses LongCat's pay-as-you-go list prices in USD per million
tokens: $0.75 uncached input, $0.015 cached input, and $2.95 output. LongCat may
offer temporary discounts; the [pricing page](https://longcat.chat/platform/docs/pricing/long-cat-2.0)
and your billing records are authoritative.

## Self-hosted LongCat-2.0

The `longcat` provider targets LongCat's hosted API. For the open weights on
[Hugging Face](https://huggingface.co/meituan-longcat/LongCat-2.0), serve the
model through an OpenAI-compatible runtime and use OpenClaw's existing
[vLLM](/providers/vllm) or [SGLang](/providers/sglang) provider instead.

Keep the runtime's exact model identifier in the self-hosted provider catalog;
do not route a local deployment through `longcat/LongCat-2.0`.

## Troubleshooting

AccordionGroup


The key works in a shell but not in the Gateway

    Daemon-managed Gateway processes do not inherit every interactive shell
    variable. Put `LONGCAT_API_KEY` in `~/.openclaw/.env`, configure it through
    onboarding, or use an approved secret reference.



Requests fail with 402 or 429

    `402` means the account has insufficient token quota. `429` means the API
    key hit a rate limit. Check [LongCat usage](https://longcat.chat/platform/usage)
    and retry rate-limited requests after the provider's backoff window.



The model does not appear

    Run `openclaw plugins list` and confirm the `longcat` plugin is
    enabled, then run `openclaw models list --provider longcat`.


## Related

CardGroup


Model providers

    Provider configuration, model refs, and failover behavior.


LongCat API docs

    Hosted API endpoints, authentication, limits, and examples.


LongCat-2.0 model card

    Architecture, deployment guidance, and model details.


Secrets

    Store provider credentials without embedding plaintext in config.

---
