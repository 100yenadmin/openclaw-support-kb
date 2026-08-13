---
type: openclaw_doc
title: "Cloudflare AI gateway"
source: "https://docs.openclaw.ai/providers/cloudflare-ai-gateway"
source_hash: "2c3c5aeabdd1c9febf460ec4187d3ac5b523df0714f92d3305210a6720d12109"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/cloudflare-ai-gateway.md"
original_doc_path: "providers/cloudflare-ai-gateway.md"
duplicate_index: 1
---

# Cloudflare AI gateway
Source: https://docs.openclaw.ai/providers/cloudflare-ai-gateway

[Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) sits in front of provider APIs and adds analytics, caching, and controls. For Anthropic, OpenClaw uses the Anthropic Messages API through your Gateway endpoint.

| Property      | Value                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------- |
| Provider      | `cloudflare-ai-gateway`                                                                  |
| Plugin        | official external package (`@openclaw/cloudflare-ai-gateway-provider`)                   |
| Base URL      | `https://gateway.ai.cloudflare.com/v1/<account_id>/<gateway_id>/anthropic`               |
| Default model | `cloudflare-ai-gateway/claude-sonnet-4-6`                                                |
| API key       | `CLOUDFLARE_AI_GATEWAY_API_KEY` (your provider API key for requests through the Gateway) |

Note

For Anthropic models routed through Cloudflare AI Gateway, use your **Anthropic API key** as the provider key.

When thinking is enabled for Anthropic Messages models, OpenClaw strips trailing
assistant prefill turns before sending the payload through Cloudflare AI Gateway.
Anthropic rejects response prefilling with extended thinking, while ordinary
non-thinking prefill remains available.

## Install plugin

Install the official plugin, then restart Gateway:

```bash
openclaw plugins install @openclaw/cloudflare-ai-gateway-provider
openclaw gateway restart
```

## Getting started

Steps


Set the provider API key and Gateway details

    Run onboarding and choose the Cloudflare AI Gateway auth option:

    ```bash
    openclaw onboard --auth-choice cloudflare-ai-gateway-api-key
    ```

    This prompts for your account ID, gateway ID, and API key.



Set a default model

    Add the model to your OpenClaw config:

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "cloudflare-ai-gateway/claude-sonnet-4-6" },
        },
      },
    }
    ```



Verify the model is available

    ```bash
    openclaw models list --provider cloudflare-ai-gateway
    ```


## Non-interactive example

For scripted or CI setups, pass all values on the command line:

```bash
openclaw onboard --non-interactive --accept-risk --skip-health \
  --mode local \
  --auth-choice cloudflare-ai-gateway-api-key \
  --cloudflare-ai-gateway-account-id "your-account-id" \
  --cloudflare-ai-gateway-gateway-id "your-gateway-id" \
  --cloudflare-ai-gateway-api-key "$CLOUDFLARE_AI_GATEWAY_API_KEY"
```

## Advanced configuration

AccordionGroup


Authenticated gateways

    If you enabled Gateway authentication in Cloudflare, add the `cf-aig-authorization` header. This is **in addition to** your provider API key.

    ```json5
    {
      models: {
        providers: {
          "cloudflare-ai-gateway": {
            headers: {
              "cf-aig-authorization": "Bearer <cloudflare-ai-gateway-token>",
            },
          },
        },
      },
    }
    ```


Tip

    The `cf-aig-authorization` header authenticates with the Cloudflare Gateway itself, while the provider API key (for example, your Anthropic key) authenticates with the upstream provider.





Environment note

    If the Gateway runs as a daemon (launchd/systemd), make sure `CLOUDFLARE_AI_GATEWAY_API_KEY` is available to that process.


Warning

    A key exported only in an interactive shell will not help a launchd/systemd daemon unless that environment is imported there as well. Set the key in `~/.openclaw/.env` or via `env.shellEnv` to ensure the gateway process can read it.




## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Troubleshooting

    General troubleshooting and FAQ.

---
