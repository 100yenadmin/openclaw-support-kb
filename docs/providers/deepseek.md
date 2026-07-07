---
type: openclaw_doc
title: "DeepSeek"
source: "https://docs.openclaw.ai/providers/deepseek"
source_hash: "585b8672799fde19ca2a83888624bbbb65f5d13cd73aadb8b6616261c83c7baa"
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

    Prompts for your API key and sets `deepseek/deepseek-v4-flash` as the default model.



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

| Model ref                    | Name              | Input | Context   | Max output | Notes                                      |
| ---------------------------- | ----------------- | ----- | --------- | ---------- | ------------------------------------------ |
| `deepseek/deepseek-v4-flash` | DeepSeek V4 Flash | text  | 1,000,000 | 384,000    | Default model; V4 thinking-capable surface |
| `deepseek/deepseek-v4-pro`   | DeepSeek V4 Pro   | text  | 1,000,000 | 384,000    | V4 thinking-capable surface                |
| `deepseek/deepseek-chat`     | DeepSeek Chat     | text  | 131,072   | 8,192      | DeepSeek V3.2 non-thinking surface         |
| `deepseek/deepseek-reasoner` | DeepSeek Reasoner | text  | 131,072   | 65,536     | Reasoning-enabled V3.2 surface             |

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

Use `deepseek/deepseek-v4-flash` for the default fast path. Use
`deepseek/deepseek-v4-pro` for the stronger model when you can accept higher
cost or latency.

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
  env: { DEEPSEEK_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "deepseek/deepseek-v4-flash" },
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
