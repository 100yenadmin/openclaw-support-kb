---
type: openclaw_doc
title: "Code execution"
source: "https://docs.openclaw.ai/tools/code-execution"
source_hash: "524bc52c5bb51ca62ca69d904ecfc451e0f559fd6b466bb2365447fde19ce3e5"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/code-execution.md"
original_doc_path: "tools/code-execution.md"
duplicate_index: 1
---

# Code execution
Source: https://docs.openclaw.ai/tools/code-execution

`code_execution` runs sandboxed remote Python analysis on xAI's Responses API
(`https://api.x.ai/v1/responses`, same endpoint `x_search` uses). It is
registered by the bundled `xai` plugin under the `tools` contract.

| Property           | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| Tool name          | `code_execution`                                                                  |
| Provider plugin    | `xai` (bundled, `enabledByDefault: true`)                                         |
| Auth               | xAI auth profile, `XAI_API_KEY`, or `plugins.entries.xai.config.webSearch.apiKey` |
| Default model      | `grok-4-1-fast`                                                                   |
| Default timeout    | 30 seconds                                                                        |
| Default `maxTurns` | unset (xAI applies its own internal limit)                                        |

Use it for calculations, tabulation, quick statistics, and chart-style
analysis, including data returned by `x_search` or `web_search`. It has no
access to local files, your shell, your repo, or paired devices, and it does
not persist state between calls, so treat each call as ephemeral analysis, not
a notebook session. For fresh X data, run [`x_search`](/tools/web#x_search)
first and pipe the result in.

For local execution, use [`exec`](/tools/exec) instead.

## Setup

Steps


Provide xAI credentials

    OAuth requires an eligible SuperGrok or X Premium subscription
    (device-code verification, so it works from remote hosts without a
    localhost callback):

    ```bash
    openclaw models auth login --provider xai --method oauth
    ```

    During a fresh install, the same choice is available in onboarding:

    ```bash
    openclaw onboard --install-daemon --auth-choice xai-oauth
    ```

    Or an API key:

    ```bash
    openclaw models auth login --provider xai --method api-key
    export XAI_API_KEY=xai-...
    ```

    Or via config:

    ```json5
    {
      plugins: {
        entries: {
          xai: {
            config: {
              webSearch: {
                apiKey: "xai-...",
              },
            },
          },
        },
      },
    }
    ```

    Any of these three also power `x_search` and Grok `web_search`.




Enable and tune code_execution

    `code_execution` is available whenever xAI credentials resolve. Set
    `plugins.entries.xai.config.codeExecution.enabled` to `false` to disable
    it, or use the same block to override the model, turn cap, or timeout:

    ```json5
    {
      plugins: {
        entries: {
          xai: {
            config: {
              codeExecution: {
                enabled: true,
                model: "grok-4-1-fast", // override the default xAI code-execution model
                maxTurns: 2,            // optional cap on internal tool turns
                timeoutSeconds: 30,     // request timeout (default: 30)
              },
            },
          },
        },
      },
    }
    ```




Restart the Gateway

    ```bash
    openclaw gateway restart
    ```

    `code_execution` appears in the agent's tool list once the xAI plugin
    re-registers with `enabled: true`.



## How to use it

Make the analysis intent explicit; the tool takes a single `task` parameter,
so send the full request and any inline data in one prompt:

```text
Use code_execution to calculate the 7-day moving average for these numbers: ...
```

```text
Use x_search to find posts mentioning OpenClaw this week, then use code_execution to count them by day.
```

```text
Use web_search to gather the latest AI benchmark numbers, then use code_execution to compare percent changes.
```

## Errors

Without auth, the tool returns a structured JSON error (not a thrown
exception), so the agent can self-correct:

```json
{
  "error": "missing_xai_api_key",
  "message": "code_execution needs xAI credentials. Run `openclaw onboard --auth-choice xai-oauth` to sign in with Grok, run `openclaw onboard --auth-choice xai-api-key`, set `XAI_API_KEY` in the Gateway environment, or configure `plugins.entries.xai.config.webSearch.apiKey`.",
  "docs": "https://docs.openclaw.ai/tools/code-execution"
}
```

## Related

CardGroup


Exec tool

    Local shell execution on your machine or paired node.


Exec approvals

    Allow/deny policy for shell execution.


Web tools

    `web_search`, `x_search`, and `web_fetch`.


xAI provider

    Grok models, web/x search, and code execution config.

---
