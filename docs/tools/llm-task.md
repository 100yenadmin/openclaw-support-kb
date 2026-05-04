---
type: openclaw_doc
title: "LLM task"
source: "https://docs.openclaw.ai/tools/llm-task"
source_hash: "9f86b31bedc3c94296b35be0183c68241563d6e54ba289405bdfacb6c9925f06"
doc_path: "tools/llm-task.md"
original_doc_path: "tools/llm-task.md"
duplicate_index: 1
---

# LLM task
Source: https://docs.openclaw.ai/tools/llm-task



`llm-task` is an **optional plugin tool** that runs a JSON-only LLM task and
returns structured output (optionally validated against JSON Schema).

This is ideal for workflow engines like Lobster: you can add a single LLM step
without writing custom OpenClaw code for each workflow.

## Enable the plugin

1. Enable the plugin:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "plugins": {
    "entries": {
      "llm-task": { "enabled": true }
    }
  }
}
```

2. Allow the optional tool:

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "tools": {
    "alsoAllow": ["llm-task"]
  }
}
```

Use `tools.allow` only when you want restrictive allowlist mode.

## Config (optional)

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "plugins": {
    "entries": {
      "llm-task": {
        "enabled": true,
        "config": {
          "defaultProvider": "openai-codex",
          "defaultModel": "gpt-5.5",
          "defaultAuthProfileId": "main",
          "allowedModels": ["openai/gpt-5.4"],
          "maxTokens": 800,
          "timeoutMs": 30000
        }
      }
    }
  }
}
```

`allowedModels` is an allowlist of `provider/model` strings. If set, any request
outside the list is rejected.

## Tool parameters

* `prompt` (string, required)
* `input` (any, optional)
* `schema` (object, optional JSON Schema)
* `provider` (string, optional)
* `model` (string, optional)
* `thinking` (string, optional)
* `authProfileId` (string, optional)
* `temperature` (number, optional)
* `maxTokens` (number, optional)
* `timeoutMs` (number, optional)

`thinking` accepts the standard OpenClaw reasoning presets, such as `low` or `medium`.

## Output

Returns `details.json` containing the parsed JSON (and validates against
`schema` when provided).

## Example: Lobster workflow step

```lobster theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw.invoke --tool llm-task --action json --args-json '{
  "prompt": "Given the input email, return intent and draft.",
  "thinking": "low",
  "input": {
    "subject": "Hello",
    "body": "Can you help?"
  },
  "schema": {
    "type": "object",
    "properties": {
      "intent": { "type": "string" },
      "draft": { "type": "string" }
    },
    "required": ["intent", "draft"],
    "additionalProperties": false
  }
}'
```

## Safety notes

* The tool is **JSON-only** and instructs the model to output only JSON (no
  code fences, no commentary).
* No tools are exposed to the model for this run.
* Treat output as untrusted unless you validate with `schema`.
* Put approvals before any side-effecting step (send, post, exec).

## Related

* [Thinking levels](/tools/thinking)
* [Sub-agents](/tools/subagents)
* [Slash commands](/tools/slash-commands)
