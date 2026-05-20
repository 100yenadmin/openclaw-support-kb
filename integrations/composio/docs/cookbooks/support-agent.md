---
type: composio_doc
title: "Support Knowledge Agent"
source: "https://docs.composio.dev/cookbooks/support-agent.md"
source_hash: "24b93aa8d97c4dc488c1c6d4c0a903ac60ebefb40115d484250890bad75c8ec7"
system: "composio"
kb_namespace: "composio"
doc_path: "cookbooks/support-agent.md"
original_doc_path: "cookbooks/support-agent.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Support Knowledge Agent (/cookbooks/support-agent)
Source: https://docs.composio.dev/cookbooks/support-agent.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/support-agent)

This cookbook builds an **agentic RAG** system: an interactive CLI agent that triages support issues by pulling context from Notion docs, Datadog monitors, and GitHub issues. It uses scoped sessions, multi-turn chat with streaming, and a structured system prompt.

# Prerequisites

* Python 3.10+
* [UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Composio API key](https://dashboard.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)

# Project setup

Create a new project and install dependencies:

```bash
mkdir composio-support-agent && cd composio-support-agent
uv init && uv add composio composio-openai-agents openai-agents
```

Add your API keys to a `.env` file:

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
# Setting up the client

`Composio` takes an `OpenAIAgentsProvider` so that tools come back in the format the OpenAI Agents SDK expects. We also import the streaming event types we'll need for real-time output.

```py
import asyncio

from agents import Agent, Runner
from agents.stream_events import RawResponsesStreamEvent
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider
from openai.types.responses import ResponseTextDeltaEvent

composio = Composio(provider=OpenAIAgentsProvider())
```
# Defining the agent

The system prompt tells the agent what tools it has and how to behave. It knows about Datadog, Notion, and GitHub, and decides on its own which to use based on the question.

```py
SYSTEM_PROMPT = """You are a Support Knowledge Agent. Use your tools to help the user triage issues, find documentation, and manage incidents. Call tools first, then respond with what you found. Be concise."""

def create_agent(tools) -> Agent:
    return Agent(
        name="Support Knowledge Agent",
        model="gpt-5.4",
        instructions=SYSTEM_PROMPT,
        tools=tools,
    )
```
# Chat loop with streaming

The chat loop creates a session scoped to three toolkits: `datadog`, `notion`, and `github`. The agent only sees tools from these services. `Runner.run_streamed` streams tokens as they arrive so you see the response in real time. Message history is tracked in a list for multi-turn context.

```py
async def main():
    user_id = "default"
    session = composio.create(
        user_id=user_id,
        toolkits=["datadog", "notion", "github"],
    )
    tools = session.tools()
    agent = create_agent(tools)

    messages = []
    print("Support Knowledge Agent (type 'quit' to exit)")
    print("-" * 50)

    while True:
        user_input = input("\nYou: ").strip()
        if not user_input or user_input.lower() == "quit":
            break

        messages.append({"role": "user", "content": user_input})

        print("\nAgent: ", end="", flush=True)
        result = Runner.run_streamed(starting_agent=agent, input=messages, max_turns=30)
        async for event in result.stream_events():
            if isinstance(event, RawResponsesStreamEvent) and isinstance(event.data, ResponseTextDeltaEvent):
                print(event.data.delta, end="", flush=True)
        print()

        messages.append({"role": "assistant", "content": result.final_output})

asyncio.run(main())
```
> If a toolkit isn't connected yet, the agent will automatically return an authentication link in its response. The user can complete OAuth and then retry.

# Complete script

Here's everything together:

```py
# region setup
import asyncio

from agents import Agent, Runner
from agents.stream_events import RawResponsesStreamEvent
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider
from openai.types.responses import ResponseTextDeltaEvent

composio = Composio(provider=OpenAIAgentsProvider())
# endregion setup

# region agent
SYSTEM_PROMPT = """You are a Support Knowledge Agent. Use your tools to help the user triage issues, find documentation, and manage incidents. Call tools first, then respond with what you found. Be concise."""

def create_agent(tools) -> Agent:
    return Agent(
        name="Support Knowledge Agent",
        model="gpt-5.4",
        instructions=SYSTEM_PROMPT,
        tools=tools,
    )
# endregion agent

# region chat
async def main():
    user_id = "default"
    session = composio.create(
        user_id=user_id,
        toolkits=["datadog", "notion", "github"],
    )
    tools = session.tools()
    agent = create_agent(tools)

    messages = []
    print("Support Knowledge Agent (type 'quit' to exit)")
    print("-" * 50)

    while True:
        user_input = input("\nYou: ").strip()
        if not user_input or user_input.lower() == "quit":
            break

        messages.append({"role": "user", "content": user_input})

        print("\nAgent: ", end="", flush=True)
        result = Runner.run_streamed(starting_agent=agent, input=messages, max_turns=30)
        async for event in result.stream_events():
            if isinstance(event, RawResponsesStreamEvent) and isinstance(event.data, ResponseTextDeltaEvent):
                print(event.data.delta, end="", flush=True)
        print()

        messages.append({"role": "assistant", "content": result.final_output})

asyncio.run(main())
# endregion chat

```
# Running the agent

```bash
uv run --env-file .env python main.py
```
The agent starts an interactive chat. Type a message and watch the response stream in. Type `quit` to exit.

```
Support Knowledge Agent (type 'quit' to exit)
--------------------------------------------

You: The payments service is returning 500 errors. Can you check what's going on?

Agent: I checked Datadog and found an active alert on the payments-api monitor...
```

# Take it further

The agent's scope is defined by its toolkits and system prompt. Swap them to build different support workflows:

* **Escalation bot**: add PagerDuty and Slack toolkits so the agent can page on-call engineers and post incident threads automatically
* **Customer-facing KB**: replace Datadog with Zendesk, let the agent search help articles and draft replies to open tickets
* **Incident timeline**: add Jira and Confluence toolkits so the agent can cross-reference tickets with runbook docs and build a timeline

- [Workplace Search](/cookbooks/workplace-search): Search across GitHub, Slack, Gmail, and Notion from a single agent

- [Background Agent](/cookbooks/background-agent): Run a multi-app agent autonomously on a cron schedule

---
