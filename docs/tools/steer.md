---
type: openclaw_doc
title: "Steer"
source: "https://docs.openclaw.ai/tools/steer"
source_hash: "c7e5db2cef7c7aa07987512088014f343d6173f5dd6408840e43e7ff3efe2400"
doc_path: "tools/steer.md"
original_doc_path: "tools/steer.md"
duplicate_index: 1
---

# Steer
Source: https://docs.openclaw.ai/tools/steer



`/steer` sends guidance to an already-active run. It is for "adjust this
run while it is still working" moments, not for starting a new turn.

## Current session

Use top-level `/steer` to target the active run for the current session:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
/steer prefer the smaller patch and keep the tests focused
/tell summarize before making the next tool call
```

Behavior:

* Targets only the current session's active run.
* Works independently of the session's `/queue` mode.
* Does not start a new run when the session is idle.
* Replies with a warning when there is no active run to steer.
* Uses the active runtime's steering path, so the model sees the guidance at
  the next supported runtime boundary.

## Steer vs queue

`/queue steer` changes how normal inbound messages behave when they arrive
while a run is active. `/steer <message>` is an explicit command that tries to
inject that command's message into the active run at the next supported runtime
boundary, regardless of the stored `/queue` setting.

Use:

* `/steer <message>` when you want to guide the active run right now.
* `/queue steer` when you want future normal messages to steer active runs by
  default.
* `/queue collect` or `/queue followup` when new messages should wait for a
  later turn instead of steering the active run.

For queue modes and fallback behavior, see [Command queue](/concepts/queue) and
[Steering queue](/concepts/queue-steering).

## Sub-agents

Use `/subagents steer` when the target is a child run:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
/subagents steer 2 focus only on the API surface
```

Top-level `/steer` does not select a sub-agent by id or list index. It always
targets the current session's active run. See [Sub-agents](/tools/subagents) for
sub-agent ids, labels, and control commands.

## ACP sessions

Use `/acp steer` when the target is an ACP harness session:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
/acp steer --session agent:main:acp:codex tighten the repro
```

See [ACP agents](/tools/acp-agents) for ACP session selection and runtime
behavior.

## Related

* [Slash commands](/tools/slash-commands)
* [Command queue](/concepts/queue)
* [Steering queue](/concepts/queue-steering)
* [Sub-agents](/tools/subagents)
