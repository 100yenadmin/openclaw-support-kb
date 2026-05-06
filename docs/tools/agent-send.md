---
type: openclaw_doc
title: "Agent send"
source: "https://docs.openclaw.ai/tools/agent-send"
source_hash: "6bf88a4f06b3c536b1ec7c6ca9e895d677e1072b9ba12a9a1c41f665d5313836"
doc_path: "tools/agent-send.md"
original_doc_path: "tools/agent-send.md"
duplicate_index: 1
---

# Agent send
Source: https://docs.openclaw.ai/tools/agent-send



`openclaw agent` runs a single agent turn from the command line without needing
an inbound chat message. Use it for scripted workflows, testing, and
programmatic delivery.

## Quick start

<Steps>
  <Step title="Run a simple agent turn">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw agent --message "What is the weather today?"
    ```

    This sends the message through the Gateway and prints the reply.
  </Step>

  <Step title="Target a specific agent or session">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    # Target a specific agent
    openclaw agent --agent ops --message "Summarize logs"

    # Target a phone number (derives session key)
    openclaw agent --to +15555550123 --message "Status update"

    # Reuse an existing session
    openclaw agent --session-id abc123 --message "Continue the task"
    ```
  </Step>

  <Step title="Deliver the reply to a channel">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    # Deliver to WhatsApp (default channel)
    openclaw agent --to +15555550123 --message "Report ready" --deliver

    # Deliver to Slack
    openclaw agent --agent ops --message "Generate report" \
      --deliver --reply-channel slack --reply-to "#reports"
    ```
  </Step>
</Steps>

## Flags

| Flag                          | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `--message \<text\>`          | Message to send (required)                                  |
| `--to \<dest\>`               | Derive session key from a target (phone, chat id)           |
| `--agent \<id\>`              | Target a configured agent (uses its `main` session)         |
| `--session-id \<id\>`         | Reuse an existing session by id                             |
| `--local`                     | Force local embedded runtime (skip Gateway)                 |
| `--deliver`                   | Send the reply to a chat channel                            |
| `--channel \<name\>`          | Delivery channel (whatsapp, telegram, discord, slack, etc.) |
| `--reply-to \<target\>`       | Delivery target override                                    |
| `--reply-channel \<name\>`    | Delivery channel override                                   |
| `--reply-account \<id\>`      | Delivery account id override                                |
| `--thinking \<level\>`        | Set thinking level for the selected model profile           |
| `--verbose \<on\|full\|off\>` | Set verbose level                                           |
| `--timeout \<seconds\>`       | Override agent timeout                                      |
| `--json`                      | Output structured JSON                                      |

## Behavior

* By default, the CLI goes **through the Gateway**. Add `--local` to force the
  embedded runtime on the current machine.
* If the Gateway is unreachable, the CLI **falls back** to the local embedded run.
* Session selection: `--to` derives the session key (group/channel targets
  preserve isolation; direct chats collapse to `main`).
* Thinking and verbose flags persist into the session store.
* Output: plain text by default, or `--json` for structured payload + metadata.

## Examples

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Simple turn with JSON output
openclaw agent --to +15555550123 --message "Trace logs" --verbose on --json

# Turn with thinking level
openclaw agent --session-id 1234 --message "Summarize inbox" --thinking medium

# Deliver to a different channel than the session
openclaw agent --agent ops --message "Alert" --deliver --reply-channel telegram --reply-to "@admin"
```

## Related

<CardGroup>
  <Card title="Agent CLI reference" href="/cli/agent" icon="terminal">
    Full `openclaw agent` flag and option reference.
  </Card>

  <Card title="Sub-agents" href="/tools/subagents" icon="users">
    Background sub-agent spawning.
  </Card>

  <Card title="Sessions" href="/concepts/session" icon="comments">
    How session keys work and how `--to`, `--agent`, and `--session-id` resolve them.
  </Card>

  <Card title="Slash commands" href="/tools/slash-commands" icon="slash">
    Native command catalog used inside agent sessions.
  </Card>
</CardGroup>
