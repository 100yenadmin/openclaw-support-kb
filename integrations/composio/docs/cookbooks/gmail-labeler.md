---
type: composio_doc
title: "Gmail Labeler"
source: "https://docs.composio.dev/cookbooks/gmail-labeler.md"
source_hash: "a5452a85fb41644ff611389ac8804ca511681f3c6f4871c09126bc05078be41b"
system: "composio"
kb_namespace: "composio"
doc_path: "cookbooks/gmail-labeler.md"
original_doc_path: "cookbooks/gmail-labeler.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Gmail Labeler (/cookbooks/gmail-labeler)
Source: https://docs.composio.dev/cookbooks/gmail-labeler.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/gmail-labeler)

This cookbook builds a Python script that connects to Gmail, listens for new messages using Composio triggers, and uses Claude to label each email automatically. The agent is scoped to Gmail tools only using a **scoped session**.

# Prerequisites

* Python 3.10+
* [UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Composio API key](https://dashboard.composio.dev/settings)
* [Anthropic API key](https://console.anthropic.com/settings/keys)

# Project setup

Create a new project and install dependencies:

```bash
mkdir composio-gmail-labeler && cd composio-gmail-labeler
uv init && uv add composio composio-claude-agent-sdk claude-agent-sdk
```

Add your API keys to a `.env` file:

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
# Setting up the client

`Composio` takes a `ClaudeAgentSDKProvider` so that tools come back in the format the Claude Agent SDK expects.

```py
import asyncio

from composio import Composio
from composio_claude_agent_sdk import ClaudeAgentSDKProvider
from claude_agent_sdk import query, ClaudeAgentOptions, create_sdk_mcp_server

composio = Composio(provider=ClaudeAgentSDKProvider())
```
# Connecting to Gmail

Before labeling emails, the user needs to connect their Gmail account. The `connect` function creates a scoped session with `toolkits=["gmail"]` and checks the connection status with `session.toolkits()`. If Gmail is not connected, `session.authorize("gmail")` starts the OAuth flow and returns a URL for the user to visit. `wait_for_connection()` blocks until they complete it.

```py
def connect(user_id: str):
    """Check if Gmail is connected. If not, start OAuth and wait."""
    session = composio.create(user_id=user_id, toolkits=["gmail"])
    toolkits = session.toolkits()

    for t in toolkits.items:
        if t.slug == "gmail" and t.connection and t.connection.is_active:
            print("Gmail is already connected.")
            return

    connection_request = session.authorize("gmail")
    print(f"Open this URL to connect Gmail:\n{connection_request.redirect_url}")
    connection_request.wait_for_connection()
    print("Connected.")
```
# Labeling with Claude

For each incoming email, `label_email` fetches Gmail tools from `session.tools()`, wraps them in an MCP server using `create_sdk_mcp_server()`, and passes them to a Claude agent. The agent lists existing labels, picks the best fit or creates a new one, and applies it to the email.

```py
async def label_email(session, message_id: str, subject: str, body: str):
    """Use Claude to label an incoming email."""
    tools = session.tools()
    tool_server = create_sdk_mcp_server(name="composio", version="1.0.0", tools=tools)

    prompt = f"""You received a new email. Analyze it and apply an appropriate label.

Message ID: {message_id}
Subject: {subject}
Body: {body}

Steps:
1. List the existing Gmail labels.
2. Decide which label fits best, or create a new label if none fit.
3. Apply the label to this email using its message ID."""

    options = ClaudeAgentOptions(
        system_prompt="You are an email organizer. Label incoming emails with the most appropriate Gmail label.",
        permission_mode="bypassPermissions",
        mcp_servers={"composio": tool_server},
    )

    async for message in query(prompt=prompt, options=options):
        print(message)
```
# Listening for emails

The `listen` function creates a trigger for new Gmail messages and subscribes to events over WebSocket. When a new email arrives, the handler calls `label_email` to classify and label it.

```py
def listen(user_id: str):
    """Create a trigger, subscribe to events, and label incoming emails."""
    session = composio.create(user_id=user_id, toolkits=["gmail"])

    trigger = composio.triggers.create(
        slug="GMAIL_NEW_GMAIL_MESSAGE",
        user_id=user_id,
        trigger_config={},
    )
    print(f"Trigger created: {trigger.trigger_id}")

    loop = asyncio.new_event_loop()
    subscription = composio.triggers.subscribe()

    @subscription.handle(trigger_id=trigger.trigger_id)
    def handle_event(data):
        payload = data.get("payload", {})
        print(f"New email: {payload.get('subject', 'No subject')}")
        try:
            loop.run_until_complete(
                label_email(
                    session,
                    message_id=payload.get("id", ""),
                    subject=payload.get("subject", ""),
                    body=payload.get("message_text", ""),
                )
            )
        except Exception as e:
            print(f"Error labeling email: {e}")

    print("Listening for new emails...")
    subscription.wait_forever()
```
> SDK subscriptions are ideal for local development and testing. For production, use [webhooks](/docs/setting-up-triggers/subscribing-to-events) to receive trigger events at a URL endpoint.

# Complete script

Here is everything together:

```py
import sys

# region setup
import asyncio

from composio import Composio
from composio_claude_agent_sdk import ClaudeAgentSDKProvider
from claude_agent_sdk import query, ClaudeAgentOptions, create_sdk_mcp_server

composio = Composio(provider=ClaudeAgentSDKProvider())
# endregion setup

# region connect
def connect(user_id: str):
    """Check if Gmail is connected. If not, start OAuth and wait."""
    session = composio.create(user_id=user_id, toolkits=["gmail"])
    toolkits = session.toolkits()

    for t in toolkits.items:
        if t.slug == "gmail" and t.connection and t.connection.is_active:
            print("Gmail is already connected.")
            return

    connection_request = session.authorize("gmail")
    print(f"Open this URL to connect Gmail:\n{connection_request.redirect_url}")
    connection_request.wait_for_connection()
    print("Connected.")
# endregion connect

# region label
async def label_email(session, message_id: str, subject: str, body: str):
    """Use Claude to label an incoming email."""
    tools = session.tools()
    tool_server = create_sdk_mcp_server(name="composio", version="1.0.0", tools=tools)

    prompt = f"""You received a new email. Analyze it and apply an appropriate label.

Message ID: {message_id}
Subject: {subject}
Body: {body}

Steps:
1. List the existing Gmail labels.
2. Decide which label fits best, or create a new label if none fit.
3. Apply the label to this email using its message ID."""

    options = ClaudeAgentOptions(
        system_prompt="You are an email organizer. Label incoming emails with the most appropriate Gmail label.",
        permission_mode="bypassPermissions",
        mcp_servers={"composio": tool_server},
    )

    async for message in query(prompt=prompt, options=options):
        print(message)
# endregion label

# region listen
def listen(user_id: str):
    """Create a trigger, subscribe to events, and label incoming emails."""
    session = composio.create(user_id=user_id, toolkits=["gmail"])

    trigger = composio.triggers.create(
        slug="GMAIL_NEW_GMAIL_MESSAGE",
        user_id=user_id,
        trigger_config={},
    )
    print(f"Trigger created: {trigger.trigger_id}")

    loop = asyncio.new_event_loop()
    subscription = composio.triggers.subscribe()

    @subscription.handle(trigger_id=trigger.trigger_id)
    def handle_event(data):
        payload = data.get("payload", {})
        print(f"New email: {payload.get('subject', 'No subject')}")
        try:
            loop.run_until_complete(
                label_email(
                    session,
                    message_id=payload.get("id", ""),
                    subject=payload.get("subject", ""),
                    body=payload.get("message_text", ""),
                )
            )
        except Exception as e:
            print(f"Error labeling email: {e}")

    print("Listening for new emails...")
    subscription.wait_forever()
# endregion listen

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python main.py connect <user_id>")
        print("  python main.py listen <user_id>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "connect":
        uid = sys.argv[2] if len(sys.argv) > 2 else "default"
        connect(uid)
    elif command == "listen":
        uid = sys.argv[2] if len(sys.argv) > 2 else "default"
        listen(uid)
    else:
        print(f"Unknown command: {command}")
        print("Use 'connect' or 'listen'.")
        sys.exit(1)

```
# Running the script

First, connect your Gmail account:

```bash
uv run --env-file .env python main.py connect default
```
If Gmail is not connected yet, you will get an OAuth URL. Open it in your browser and authorize the app. If already connected, the script prints "Gmail is already connected."

Then start the listener:

```bash
uv run --env-file .env python main.py listen default
```

Send yourself an email and watch the terminal. The agent will receive the event, inspect the email, and apply a label.

# Take it further

The trigger + agent pattern works for any event-driven workflow. Swap the prompt and toolkit to build:

* **Auto-responder**: draft and send replies to common questions instead of just labeling
* **Slack notifier**: add the Slack toolkit so the agent posts a summary of important emails to a channel
* **Lead router**: connect Salesforce and have the agent tag inbound emails by deal stage and assign to reps

- [Slack Summarizer](/cookbooks/slack-summariser): Summarize Slack channels with a single command

- [Background Agent](/cookbooks/background-agent): Run agents autonomously on a schedule

---
