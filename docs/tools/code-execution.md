---
type: openclaw_doc
title: "Code execution"
source: "https://docs.openclaw.ai/tools/code-execution"
source_hash: "205bde7e4648b13de404f2d3718332aa0b4835faaf7e65500702028c41c27569"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/code-execution.md"
original_doc_path: "tools/code-execution.md"
duplicate_index: 1
---

# Code execution
Source: https://docs.openclaw.ai/tools/code-execution



`code_execution` runs sandboxed remote Python analysis on xAI's Responses API. It is registered by the bundled `xai` plugin (under the `tools` contract) and dispatches to the same `https://api.x.ai/v1/responses` endpoint used by `x_search`.

| Property           | Value                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| Tool name          | `code_execution`                                                                  |
| Provider plugin    | `xai` (bundled, `enabledByDefault: true`)                                         |
| Auth               | xAI auth profile, `XAI_API_KEY`, or `plugins.entries.xai.config.webSearch.apiKey` |
| Default model      | `grok-4-1-fast`                                                                   |
| Default timeout    | 30 seconds                                                                        |
| Default `maxTurns` | unset (xAI applies its own internal limit)                                        |

This is different from local [`exec`](/tools/exec):

* `exec` runs shell commands on your machine or paired node.
* `code_execution` runs Python in xAI's remote sandbox.

Use `code_execution` for:

* Calculations.
* Tabulation.
* Quick statistics.
* Chart-style analysis.
* Analyzing data returned by `x_search` or `web_search`.

Do **not** use it when you need local files, your shell, your repo, or paired devices. Use [`exec`](/tools/exec) for that.

## Setup

<Steps>
  <Step title="Provide xAI credentials">
    Sign in with Grok OAuth using an eligible SuperGrok or X Premium subscription,
    use the remote-friendly device-code flow, or store an API key. OAuth works
    for `code_execution` and `x_search`; `XAI_API_KEY` or plugin web-search
    config can also power Grok `web_search`.

    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw models auth login --provider xai --method oauth
    openclaw models auth login --provider xai --device-code
    ```

    During a fresh install, the same auth choices are available inside
    onboarding:

    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --install-daemon
    openclaw onboard --install-daemon --auth-choice xai-device-code
    ```

    Or use an API key:

    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw models auth login --provider xai --method api-key
    export XAI_API_KEY=xai-...
    ```

    Or via config:

    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
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
  </Step>

  <Step title="Enable and tune code_execution">
    `code_execution` is available when xAI credentials are available. Set
    `plugins.entries.xai.config.codeExecution.enabled` to `false` to disable it,
    or use the same block to tune the model and timeout.

    ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
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
  </Step>

  <Step title="Restart the Gateway">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw gateway restart
    ```

    `code_execution` shows up in the agent's tool list once the xAI plugin re-registers with `enabled: true`.
  </Step>
</Steps>

## How to use it

Ask naturally and make the analysis intent explicit:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
Use code_execution to calculate the 7-day moving average for these numbers: ...
```

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
Use x_search to find posts mentioning OpenClaw this week, then use code_execution to count them by day.
```

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
Use web_search to gather the latest AI benchmark numbers, then use code_execution to compare percent changes.
```

The tool takes a single `task` parameter internally, so the agent should send the full analysis request and any inline data in one prompt.

## Errors

When the tool runs without auth, it returns a structured `missing_xai_api_key` error pointing at the auth-profile, env var, and config options. The error is JSON, not a thrown exception, so the agent can self-correct:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "error": "missing_xai_api_key",
  "message": "code_execution needs xAI credentials. Run `openclaw onboard --auth-choice xai-oauth` to sign in with Grok, run `openclaw onboard --auth-choice xai-api-key`, set `XAI_API_KEY` in the Gateway environment, or configure `plugins.entries.xai.config.webSearch.apiKey`.",
  "docs": "https://docs.openclaw.ai/tools/code-execution"
}
```

## Limits

* This is remote xAI execution, not local process execution.
* Treat results as ephemeral analysis, not a persistent notebook session.
* Do not assume access to local files or your workspace.
* For fresh X data, use [`x_search`](/tools/web#x_search) first and pipe the result into `code_execution`.

## Related

<CardGroup>
  <Card title="Exec tool" href="/tools/exec" icon="terminal">
    Local shell execution on your machine or paired node.
  </Card>

  <Card title="Exec approvals" href="/tools/exec-approvals" icon="shield">
    Allow/deny policy for shell execution.
  </Card>

  <Card title="Web tools" href="/tools/web" icon="globe">
    `web_search`, `x_search`, and `web_fetch`.
  </Card>

  <Card title="xAI provider" href="/providers/xai" icon="microchip">
    Grok models, web/x search, and code execution config.
  </Card>
</CardGroup>
