---
type: composio_doc
title: "Workplace search agent"
source: "https://docs.composio.dev/cookbooks/workplace-search.md"
source_hash: "88eb0caaf506c4134ebf8574513a4425ec9e60c0b97e3aeab79b46b38279f220"
system: "composio"
kb_namespace: "composio"
doc_path: "cookbooks/workplace-search.md"
original_doc_path: "cookbooks/workplace-search.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Workplace search agent (/cookbooks/workplace-search)
Source: https://docs.composio.dev/cookbooks/workplace-search.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/workplace-search)

Build a search agent that queries across your workplace tools and returns answers with citations. One session, four toolkits.

# What you'll learn

* **Manual authentication**: connect multiple apps with `session.authorize()` and `wait_for_connection()`
* **Multi-toolkit sessions**: one session spanning GitHub, Slack, Gmail, and Notion
* **Cross-app search**: agent decides which apps to query based on the question

# Prerequisites

* Python 3.10+
* [UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Composio API key](https://dashboard.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)

# Project setup

```bash
mkdir composio-workplace-search && cd composio-workplace-search
uv init && uv add composio composio-openai-agents openai-agents
```

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
USER_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```
# File structure

```
composio-workplace-search/
  authorize.py   # One-time: connect GitHub, Slack, Gmail, Notion
  agent.py       # The search agent
  .env
```
# Step 1: Connect your apps

Before the agent can search, each toolkit needs an active connection. `authorize.py` walks through them one by one, skipping any that are already connected.

```py
"""
One-time setup: connect your GitHub, Slack, Gmail, and Notion accounts.
Run this once before using the search agent.
"""

import os

from composio import Composio

composio = Composio()

# Set USER_ID in your .env file
user_id = os.environ["USER_ID"]

session = composio.create(
    user_id=user_id,
    toolkits=["github", "slack", "gmail", "notion"],
)

# Authorize each toolkit one at a time
for toolkit in ["github", "slack", "gmail", "notion"]:
    print(f"\n--- {toolkit.upper()} ---")

    # Check if already connected
    status = session.toolkits(toolkits=[toolkit])
    if status.items and status.items[0].connection and status.items[0].connection.is_active:
        print(f"Already connected.")
        continue

    connection = session.authorize(toolkit)
    print(f"Open this URL to connect:\n{connection.redirect_url}")

    connected = connection.wait_for_connection()
    print(f"Connected: {connected.id}")

print("\nAll done. Run agent.py to start searching.")

```
Run it once:

```bash
uv run --env-file .env python authorize.py
```
Each toolkit prints a URL. Open it in a browser, complete OAuth, and the script moves to the next one. You only need to do this once per user.

> If you're using sessions with meta tools (`COMPOSIO_MANAGE_CONNECTIONS`), authentication happens in-chat automatically. This manual flow is useful when you want to pre-connect apps once locally before deploying `agent.py` to a CI pipeline or scheduled job.

# Step 2: Build the agent

## Setting up the client

```py
import asyncio
import os
import sys

from agents import Agent, Runner
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(provider=OpenAIAgentsProvider())
```
## The system prompt

The prompt tells the agent to search across apps, synthesize findings, and cite every source. If a toolkit isn't connected, it skips it instead of failing.

```py
SYSTEM_PROMPT = """You are a workplace search agent. You have access to GitHub, Slack, Gmail, and Notion.

When the user asks a question:
1. Break it down: decide which apps to search and what to look for.
2. Search across multiple apps in parallel when possible.
3. Synthesize findings into a single answer with citations.

For every piece of information you include, cite the source:
- GitHub: link to the issue, PR, or file
- Slack: channel name and date
- Gmail: sender and subject line
- Notion: page title

If a toolkit is not connected, skip it and note which sources were unavailable.
Do not ask for clarification. Use broad search terms and filter from the results."""
```
## Running the search

`session.tools()` returns provider-wrapped tools ready for the OpenAI Agents SDK. The `USER_ID` from your `.env` file scopes all connections to that user.

```py
async def main():
    # Set USER_ID in your .env file
    user_id = os.environ["USER_ID"]

    session = composio.create(
        user_id=user_id,
        toolkits=["github", "slack", "gmail", "notion"],
    )

    tools = session.tools()

    agent = Agent(
        name="Workplace Search",
        model="gpt-5.4",
        instructions=SYSTEM_PROMPT,
        tools=tools,
    )

    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else input("\nSearch: ")
    result = await Runner.run(starting_agent=agent, input=query)

    print(result.final_output)
```
# Running the agent

```bash
uv run --env-file .env python agent.py "What decisions were made about the v2 migration?"
```
Or start it interactively:

```bash
uv run --env-file .env python agent.py
```
Example output:

```
Based on my search across your connected apps:

**GitHub**: PR #412 "v2 migration plan" (merged Feb 15) outlines the database
schema changes. Issue #389 tracks the remaining blockers.
(Source: github.com/acme/backend/pull/412)

**Slack**: In #engineering on Feb 14, @alice proposed splitting the migration
into two phases. The team agreed in the thread.
(Source: #engineering, Feb 14)

**Gmail**: No relevant emails found for "v2 migration".

**Notion**: Skipped (not connected)
```

# How it works

1. `authorize.py` connects each toolkit via OAuth using `session.authorize()` and `wait_for_connection()`. It checks `session.toolkits()` first to skip already-connected apps.
2. The session is created with four toolkits. Composio scopes all tool calls to the user's connected accounts.
3. The agent searches across apps, synthesizes results, and cites sources with links, channel names, or sender info.
4. The `USER_ID` in `.env` scopes all connections — swap it to switch users without changing code.

# Take it further

The prompt and toolkits are the only moving parts. Change them to change what the agent searches:

* **Engineering on-call**: add PagerDuty and Datadog toolkits, ask "what incidents fired overnight and which PRs might be related?"
* **Sales prep**: connect Salesforce and Gmail, ask "summarize all recent activity with Acme Corp before my call"
* **Compliance audit**: add Jira and Confluence, ask "which security tickets are still open and do any docs reference the old auth flow?"

- [Background Agent](/cookbooks/background-agent): Run a similar multi-app agent on a cron schedule

- [Enable and disable toolkits](/docs/toolkits/enable-and-disable-toolkits): Restrict tools to read-only with tags

---


# API Reference


---
