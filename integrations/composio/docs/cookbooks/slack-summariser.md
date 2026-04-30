---
type: composio_doc
title: "Slack Summarizer"
source: "https://docs.composio.dev/cookbooks/slack-summariser.md"
source_hash: "12ff66ec84c0ca6003d4efc41c4a70860e1e2946be3b2f9edc041e7386ebeb9d"
doc_path: "cookbooks/slack-summariser.md"
original_doc_path: "cookbooks/slack-summariser.md"
duplicate_index: 1
---

# Slack Summarizer (/cookbooks/slack-summariser)
Source: https://docs.composio.dev/cookbooks/slack-summariser.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/slack-summariser)

This cookbook builds a standalone Python script that connects to a Slack workspace, fetches recent messages from a channel, and summarizes the key topics, decisions, and action items. We'll use **scoped sessions** to limit the agent to Slack tools only.

# Prerequisites

* Python 3.10+
* [UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Composio API key](https://platform.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)

# Project setup

Create a new project and install dependencies:

```bash
mkdir composio-slack-summarizer && cd composio-slack-summarizer
uv init && uv add composio composio-openai-agents openai-agents
```

Add your API keys to a `.env` file:

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
# Setting up the client

`Composio` takes an `OpenAIAgentsProvider` so that tools come back in the format the OpenAI Agents SDK expects.

```py
from agents import Agent, Runner
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(provider=OpenAIAgentsProvider())
```
# Connecting to Slack

Before summarizing, we need to make sure the user has connected their Slack workspace. The `connect` function creates a scoped session with `toolkits=["slack"]` and checks the connection status via `session.toolkits()`. If Slack is not connected, `session.authorize("slack")` starts the OAuth flow and returns a URL for the user to visit. `wait_for_connection()` blocks until they complete it.

```py
def connect(user_id: str):
    """Check if Slack is connected. If not, start OAuth and wait."""
    session = composio.create(user_id=user_id, toolkits=["slack"])
    toolkits = session.toolkits()

    for t in toolkits.items:
        if t.slug == "slack" and t.connection and t.connection.is_active:
            print("Slack is already connected.")
            return

    connection_request = session.authorize("slack")
    print(f"Open this URL to connect Slack:\n{connection_request.redirect_url}")
    connection_request.wait_for_connection()
    print("Connected.")
```
# Summarizing a channel

With Slack connected, the `summarize` function creates a session and grabs the tools. We hand them to an agent with focused summarization instructions. `Runner.run_sync` handles the agentic loop: the agent calls the Slack tool to fetch messages and produces a summary.

```py
def summarize(user_id: str, channel: str):
    """Fetch recent messages from a Slack channel and summarize them."""
    session = composio.create(user_id=user_id, toolkits=["slack"])
    tools = session.tools()

    agent = Agent(
        name="Slack Summarizer",
        instructions=(
            "You summarize Slack channel messages. "
            "Fetch recent messages from the given channel and provide a concise summary "
            "of the key topics, decisions, and action items."
        ),
        tools=tools,
    )

    result = Runner.run_sync(
        starting_agent=agent,
        input=f"Summarize the recent messages from the #{channel} channel.",
    )
    print(result.final_output)
```
# Complete script

Here is everything together:

```py
import sys

# region setup
from agents import Agent, Runner
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(provider=OpenAIAgentsProvider())
# endregion setup

# region connect
def connect(user_id: str):
    """Check if Slack is connected. If not, start OAuth and wait."""
    session = composio.create(user_id=user_id, toolkits=["slack"])
    toolkits = session.toolkits()

    for t in toolkits.items:
        if t.slug == "slack" and t.connection and t.connection.is_active:
            print("Slack is already connected.")
            return

    connection_request = session.authorize("slack")
    print(f"Open this URL to connect Slack:\n{connection_request.redirect_url}")
    connection_request.wait_for_connection()
    print("Connected.")
# endregion connect

# region summarize
def summarize(user_id: str, channel: str):
    """Fetch recent messages from a Slack channel and summarize them."""
    session = composio.create(user_id=user_id, toolkits=["slack"])
    tools = session.tools()

    agent = Agent(
        name="Slack Summarizer",
        instructions=(
            "You summarize Slack channel messages. "
            "Fetch recent messages from the given channel and provide a concise summary "
            "of the key topics, decisions, and action items."
        ),
        tools=tools,
    )

    result = Runner.run_sync(
        starting_agent=agent,
        input=f"Summarize the recent messages from the #{channel} channel.",
    )
    print(result.final_output)
# endregion summarize

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python main.py connect <user_id>")
        print("  python main.py summarize <user_id> <channel>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "connect":
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        connect(user_id)
    elif command == "summarize":
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        channel = sys.argv[3] if len(sys.argv) > 3 else "general"
        summarize(user_id, channel)
    else:
        print(f"Unknown command: {command}")
        print("Use 'connect' or 'summarize'.")
        sys.exit(1)

```
# Running the script

First, connect your Slack workspace:

```bash
uv run --env-file .env python main.py connect default
```
If Slack is not connected yet, you'll get an OAuth URL. Open it in your browser and authorize the app. If you've already connected, the script will print "Slack is already connected."

Then run the summarizer:

```bash
uv run --env-file .env python main.py summarize default general
```

Replace `general` with any channel name you want to summarize.

# Take it further

The summarizer reads from one channel, but the same pattern scales to broader workflows:

* **Cross-channel digest**: summarize multiple channels in one run and post a combined digest to a `#daily-summary` channel
* **Trigger-based**: use a [Slack trigger](/docs/setting-up-triggers/creating-triggers) to auto-summarize whenever a channel hits 50+ unread messages
* **Action items to Linear**: add the Linear toolkit and have the agent extract action items from the summary and create tickets

- [Gmail Labeler](/cookbooks/gmail-labeler): Event-driven agent that labels emails as they arrive

- [Background Agent](/cookbooks/background-agent): Run agents autonomously on a schedule

---
