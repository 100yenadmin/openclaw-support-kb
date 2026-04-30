---
type: openclaw_doc
title: "Code execution"
source: "https://docs.openclaw.ai/tools/code-execution"
source_hash: "4271e2b4bd717678b7294139e1d659e2f07154110cea07aece0f2e5d28aa9c75"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "tools/code-execution.md"
original_doc_path: "tools/code-execution.md"
duplicate_index: 1
---

# Code execution
Source: https://docs.openclaw.ai/tools/code-execution



`code_execution` runs sandboxed remote Python analysis on xAI's Responses API.
This is different from local [`exec`](/tools/exec):

* `exec` runs shell commands on your machine or node
* `code_execution` runs Python in xAI's remote sandbox

Use `code_execution` for:

* calculations
* tabulation
* quick statistics
* chart-style analysis
* analyzing data returned by `x_search` or `web_search`

Do **not** use it when you need local files, your shell, your repo, or paired
devices. Use [`exec`](/tools/exec) for that.

## Setup

You need an xAI API key. Any of these work:

* `XAI_API_KEY`
* `plugins.entries.xai.config.webSearch.apiKey`

Example:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  plugins: {
    entries: {
      xai: {
        config: {
          webSearch: {
            apiKey: "xai-...",
          },
          codeExecution: {
            enabled: true,
            model: "grok-4-1-fast",
            maxTurns: 2,
            timeoutSeconds: 30,
          },
        },
      },
    },
  },
}
```

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

The tool takes a single `task` parameter internally, so the agent should send
the full analysis request and any inline data in one prompt.

## Limits

* This is remote xAI execution, not local process execution.
* It should be treated as ephemeral analysis, not a persistent notebook.
* Do not assume access to local files or your workspace.
* For fresh X data, use [`x_search`](/tools/web#x_search) first.

## Related

* [Exec tool](/tools/exec)
* [Exec approvals](/tools/exec-approvals)
* [apply\_patch tool](/tools/apply-patch)
* [Web tools](/tools/web)
* [xAI](/providers/xai)
