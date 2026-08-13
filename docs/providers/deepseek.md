---
type: openclaw_doc
title: "DeepSeek"
source: "https://docs.openclaw.ai/providers/deepseek"
source_hash: "ea6a2c2fceda3b040065fc000b38cf4ac91ad8f0a125743ffb63470e01e2735f"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/deepseek.md"
original_doc_path: "providers/deepseek.md"
duplicate_index: 1
---

# DeepSeek
Source: https://docs.openclaw.ai/providers/deepseek

[DeepSeek](https://www.deepseek.com) provides powerful AI models with an OpenAI-compatible API.

| Property | Value                      |
| -------- | -------------------------- |
| Provider | `deepseek`                 |
| Auth     | `DEEPSEEK_API_KEY`         |
| API      | OpenAI-compatible          |
| Base URL | `https://api.deepseek.com` |

## Install plugin

Install the official plugin, then restart Gateway:

```bash
openclaw plugins install @openclaw/deepseek-provider
openclaw gateway restart
```

## Getting started

Steps


Get your API key

    Create an API key at [platform.deepseek.com](https://platform.deepseek.com/api_keys).


Run onboarding

    ```bash
    openclaw onboard --auth-choice deepseek-api-key
    ```

    Prompts for your API key and sets `deepseek/deepseek-v4-pro` as the default model.



Verify models are available

    ```bash
    openclaw models list --provider deepseek
    ```

    To inspect the plugin's static catalog without a running Gateway:

    ```bash
    openclaw models list --all --provider deepseek
    ```



AccordionGroup


Non-interactive setup

    For scripted or headless installations, pass all flags directly:

    ```bash
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice deepseek-api-key \
      --deepseek-api-key "$DEEPSEEK_API_KEY" \
      --skip-health \
      --accept-risk
    ```



Warning

If Gateway runs as a daemon (launchd/systemd), make sure `DEEPSEEK_API_KEY` is
available to that process (for example, in `~/.openclaw/.env` or via
`env.shellEnv`).

## Built-in catalog

| Model ref                    | Name              | Input | Context   | Max output | Notes                            |
| ---------------------------- | ----------------- | ----- | --------- | ---------- | -------------------------------- |
| `deepseek/deepseek-v4-flash` | DeepSeek V4 Flash | text  | 1,000,000 | 384,000    | Fast V4 thinking-capable surface |
| `deepseek/deepseek-v4-pro`   | DeepSeek V4 Pro   | text  | 1,000,000 | 384,000    | Default; strongest V4 model      |

Warning

DeepSeek retired `deepseek-chat` and `deepseek-reasoner` on July 24, 2026 at
15:59 UTC. Those model IDs are no longer accessible. Move configured model refs
to `deepseek/deepseek-v4-flash` or `deepseek/deepseek-v4-pro`.

OpenClaw's local cost estimates follow DeepSeek's published cache-hit,
cache-miss, and output rates. DeepSeek can change those rates; its
[Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing/) page is
authoritative for billing.

Tip

V4 models support DeepSeek's `thinking` control. OpenClaw also replays
DeepSeek `reasoning_content` on follow-up turns so thinking sessions with tool
calls can continue.
Use `/think xhigh` or `/think max` with DeepSeek V4 models to request DeepSeek's
maximum `reasoning_effort`; both map to `"max"`.

## Thinking and tools

DeepSeek V4 thinking sessions require replayed assistant messages from a
thinking-enabled turn to include `reasoning_content` on follow-up requests.
OpenClaw's DeepSeek plugin backfills that field automatically, so normal
multi-turn tool use works on `deepseek/deepseek-v4-flash` and
`deepseek/deepseek-v4-pro` even when history came from another
OpenAI-compatible provider (no native `reasoning_content`) or from a plain
assistant message. No `/new` required after switching providers mid-session.

When thinking is disabled (including the UI **None** selection), OpenClaw
sends `thinking: { type: "disabled" }` and strips replayed `reasoning_content`
from outgoing history, keeping the session on the non-thinking DeepSeek path.

Fresh onboarding selects the stronger `deepseek/deepseek-v4-pro` model. Use
`deepseek/deepseek-v4-flash` when lower cost or latency matters more than
maximum capability.

## Live testing

To run only the DeepSeek V4 direct-model checks from the modern model live suite:

```bash
OPENCLAW_LIVE_PROVIDERS=deepseek \
OPENCLAW_LIVE_MODELS="deepseek/deepseek-v4-flash,deepseek/deepseek-v4-pro" \
pnpm test:live src/agents/models.profiles.live.test.ts
```

Verifies both V4 models complete and that thinking/tool follow-up turns
preserve the replay payload DeepSeek requires.

## Config example

```json5
{
  env: { vars: { DEEPSEEK_API_KEY: "sk-..." } },
  agents: {
    defaults: {
      model: { primary: "deepseek/deepseek-v4-pro" },
    },
  },
}
```

## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration reference

    Full config reference for agents, models, and providers.

---
