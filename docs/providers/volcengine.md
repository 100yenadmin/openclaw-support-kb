---
type: openclaw_doc
title: "Volcengine (Doubao)"
source: "https://docs.openclaw.ai/providers/volcengine"
source_hash: "d29de214078e78c1b37e23c432df5cace06ee803631002c28dd9c5b03d92a27f"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/volcengine.md"
original_doc_path: "providers/volcengine.md"
duplicate_index: 1
---

# Volcengine (Doubao)
Source: https://docs.openclaw.ai/providers/volcengine

The Volcengine provider gives access to Doubao models and third-party models hosted on Volcano Engine, with separate endpoints for general and coding workloads. The same official plugin also registers Volcengine Speech as a TTS provider.

| Detail     | Value                                                      |
| ---------- | ---------------------------------------------------------- |
| Providers  | `volcengine` (general + TTS), `volcengine-plan` (coding)   |
| Model auth | `VOLCANO_ENGINE_API_KEY`                                   |
| TTS auth   | `VOLCENGINE_TTS_API_KEY` or `BYTEPLUS_SEED_SPEECH_API_KEY` |
| API        | OpenAI-compatible models, BytePlus Seed Speech TTS         |

## Getting started

Steps


Install the plugin

    ```bash
    openclaw plugins install @openclaw/volcengine-provider
    openclaw gateway restart
    ```


Set the API key

    Run interactive onboarding:

    ```bash
    openclaw onboard --auth-choice volcengine-api-key
    ```

    This registers both the general (`volcengine`) and coding (`volcengine-plan`) providers from a single API key.



Set a default model

    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "volcengine-plan/ark-code-latest" },
        },
      },
    }
    ```


Verify the model is available

    ```bash
    openclaw models list --provider volcengine
    openclaw models list --provider volcengine-plan
    ```


Tip

For non-interactive setup (CI, scripting), pass the key directly:

```bash
openclaw onboard --non-interactive --accept-risk --skip-health \
  --mode local \
  --auth-choice volcengine-api-key \
  --volcengine-api-key "$VOLCANO_ENGINE_API_KEY"
```

## Providers and endpoints

| Provider          | Endpoint                                  | Use case       |
| ----------------- | ----------------------------------------- | -------------- |
| `volcengine`      | `ark.cn-beijing.volces.com/api/v3`        | General models |
| `volcengine-plan` | `ark.cn-beijing.volces.com/api/coding/v3` | Coding models  |

Note

Both providers are configured from a single API key. Setup registers both automatically, and the coding provider's model picker also reuses the general provider's auth (`volcengine-plan` is an auth alias of `volcengine`).

## Built-in catalog

Tabs


General (volcengine)

    | Model ref                                      | Name                    | Input              | Context   |
    | ---------------------------------------------- | ----------------------- | ------------------ | --------- |
    | `volcengine/doubao-seed-evolving`              | Doubao Seed Evolving    | text, image, video | 1,024,000 |
    | `volcengine/doubao-seed-2-1-pro-260628`        | Doubao Seed 2.1 Pro     | text, image, video | 256,000   |
    | `volcengine/doubao-seed-2-1-turbo-260628`      | Doubao Seed 2.1 Turbo   | text, image, video | 256,000   |
    | `volcengine/glm-5-2-260617`                    | GLM 5.2                 | text               | 1,024,000 |
    | `volcengine/deepseek-v4-pro-260425`            | DeepSeek V4 Pro         | text               | 1,024,000 |
    | `volcengine/deepseek-v4-flash-260425`          | DeepSeek V4 Flash       | text               | 1,024,000 |


Coding (volcengine-plan)

    | Model ref                                  | Name                  | Input              | Context   |
    | ------------------------------------------ | --------------------- | ------------------ | --------- |
    | `volcengine-plan/ark-code-latest`          | Ark Coding Plan       | text               | 256,000   |
    | `volcengine-plan/doubao-seed-2.1-turbo`    | Doubao Seed 2.1 Turbo | text, image, video | 256,000   |
    | `volcengine-plan/glm-5.2`                  | GLM 5.2               | text               | 1,024,000 |
    | `volcengine-plan/deepseek-v4-pro`          | DeepSeek V4 Pro       | text               | 1,024,000 |
    | `volcengine-plan/deepseek-v4-flash`        | DeepSeek V4 Flash     | text               | 1,024,000 |


Both catalogs are static (no `/models` discovery call) and support OpenAI-compatible streamed usage accounting. Tool schemas for both providers automatically drop `minLength`, `maxLength`, `minItems`, `maxItems`, `minContains`, and `maxContains` keywords, since the Volcengine tool-call API rejects them.

## Text-to-speech

Volcengine TTS uses the BytePlus Seed Speech HTTP API (`voice.ap-southeast-1.bytepluses.com`) and is configured separately from the OpenAI-compatible Doubao model API key. In the BytePlus console, open Seed Speech > Settings > API Keys, copy the API key, then set:

```bash
export VOLCENGINE_TTS_API_KEY="byteplus_seed_speech_api_key"
export VOLCENGINE_TTS_RESOURCE_ID="seed-tts-1.0"
```

Then enable it in `openclaw.json`:

```json5
{
  tts: {
    auto: "always",
    provider: "volcengine",
    providers: {
      volcengine: {
        apiKey: "byteplus_seed_speech_api_key",
        voice: "en_female_anna_mars_bigtts",
        speedRatio: 1.0,
      },
    },
  },
}
```

Available fields under `tts.providers.volcengine`: `apiKey`, `voice`, `speedRatio` (0.2-3.0), `emotion`, `cluster`, `resourceId`, `appKey`, and `baseUrl`. `!emotion=<value>` also works as an inline voice directive when voice-setting overrides are allowed.

For voice-note targets, OpenClaw requests provider-native `ogg_opus`. For normal audio attachments, it requests `mp3`. Provider aliases `bytedance` and `doubao` also resolve to this speech provider.

The default resource id is `seed-tts-1.0`, the entitlement BytePlus grants to newly created Seed Speech API keys by default. If your project has TTS 2.0 entitlement, set `VOLCENGINE_TTS_RESOURCE_ID=seed-tts-2.0`.

Warning

`VOLCANO_ENGINE_API_KEY` is for the ModelArk/Doubao model endpoints and is not a Seed Speech API key. TTS needs a Seed Speech API key from the BytePlus Speech Console, or a legacy Speech Console AppID/token pair.

Legacy AppID/token auth remains supported for older Speech Console applications:

```bash
export VOLCENGINE_TTS_APPID="speech_app_id"
export VOLCENGINE_TTS_TOKEN="speech_access_token"
export VOLCENGINE_TTS_CLUSTER="volcano_tts"
```

Other optional TTS env vars: `VOLCENGINE_TTS_VOICE`, `VOLCENGINE_TTS_APP_KEY`, and `VOLCENGINE_TTS_BASE_URL` override the corresponding `tts.providers.volcengine` config fields when set.

## Advanced configuration

AccordionGroup


Default model after onboarding

    `openclaw onboard --auth-choice volcengine-api-key` sets `volcengine-plan/ark-code-latest` as the default model while also registering the general `volcengine` catalog.



Model picker fallback behavior

    During onboarding/configure model selection, the Volcengine auth choice prefers both `volcengine/*` and `volcengine-plan/*` rows. If those models are not loaded yet, OpenClaw falls back to the unfiltered catalog instead of showing an empty provider-scoped picker.



Environment variables for daemon processes

    If the Gateway runs as a daemon (launchd/systemd), make sure model and TTS env vars such as `VOLCANO_ENGINE_API_KEY`, `VOLCENGINE_TTS_API_KEY`, `BYTEPLUS_SEED_SPEECH_API_KEY`, `VOLCENGINE_TTS_APPID`, and `VOLCENGINE_TTS_TOKEN` are available to that process (for example, in `~/.openclaw/.env` or via `env.shellEnv`).


Warning

When running OpenClaw as a background service, environment variables set in your interactive shell are not automatically inherited. See the daemon note above.

## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


Configuration

    Full config reference for agents, models, and providers.


Troubleshooting

    Common issues and debugging steps.


FAQ

    Frequently asked questions about OpenClaw setup.

---
