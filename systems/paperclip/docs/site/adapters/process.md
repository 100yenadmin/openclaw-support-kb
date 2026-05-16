---
type: paperclip_doc
title: "process"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/adapters/process.md"
source_hash: "32e801b8d58a011544d5e5c97a103c675f36fd688cb993a9c00599059978709a"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/adapters/process.md"
original_doc_path: "docs/adapters/process.md"
---

# process

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/adapters/process.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/adapters/process.md

---
title: Process Adapter
summary: Generic shell process adapter
---

The `process` adapter executes arbitrary shell commands. Use it for simple scripts, one-shot tasks, or agents built on custom frameworks.

## When to Use

- Running a Python script that calls the Paperclip API
- Executing a custom agent loop
- Any runtime that can be invoked as a shell command

## When Not to Use

- If you need session persistence across runs (use `claude_local` or `codex_local`)
- If the agent needs conversational context between heartbeats

## Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `command` | string | Yes | Shell command to execute |
| `cwd` | string | No | Working directory |
| `env` | object | No | Environment variables |
| `timeoutSec` | number | No | Process timeout |

## How It Works

1. Paperclip spawns the configured command as a child process
2. Standard Paperclip environment variables are injected (`PAPERCLIP_AGENT_ID`, `PAPERCLIP_API_KEY`, etc.)
3. The process runs to completion
4. Exit code determines success/failure

## Example

An agent that runs a Python script:

```json
{
  "adapterType": "process",
  "adapterConfig": {
    "command": "python3 /path/to/agent.py",
    "cwd": "/path/to/workspace",
    "timeoutSec": 300
  }
}
```

The script can use the injected environment variables to authenticate with the Paperclip API and perform work.
