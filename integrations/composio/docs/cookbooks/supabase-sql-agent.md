---
type: composio_doc
title: "Supabase SQL Agent"
source: "https://docs.composio.dev/cookbooks/supabase-sql-agent.md"
source_hash: "49db0ab287fff025ad1f2d2b7d9bbf9cd27c02459bca01e5e8520cd4ddbff307"
doc_path: "cookbooks/supabase-sql-agent.md"
original_doc_path: "cookbooks/supabase-sql-agent.md"
duplicate_index: 1
---

# Supabase SQL Agent (/cookbooks/supabase-sql-agent)
Source: https://docs.composio.dev/cookbooks/supabase-sql-agent.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/supabase-sql-agent)

This cookbook builds a CLI agent that connects to your Supabase account and lets you query your databases using natural language. The agent translates plain English into SQL, runs it against your project, and explains the results. We'll use **scoped sessions** to limit the agent to Supabase tools only.

# Prerequisites

* Python 3.10+
* [UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Composio API key](https://platform.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)

# Project setup

Create a new project and install dependencies:

```bash
mkdir composio-supabase-agent && cd composio-supabase-agent
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
# Connecting to Supabase

Before running queries, the user needs to connect their Supabase account. The `connect` function creates a scoped session with `toolkits=["supabase"]` and checks the connection status via `session.toolkits()`. If Supabase is not connected, `session.authorize("supabase")` starts the OAuth flow and returns a URL for the user to visit. `wait_for_connection()` blocks until they complete it.

```py
def connect(user_id: str):
    """Check if Supabase is connected. If not, start OAuth and wait."""
    session = composio.create(user_id=user_id, toolkits=["supabase"])
    toolkits = session.toolkits()

    for t in toolkits.items:
        if t.slug == "supabase" and t.connection and t.connection.is_active:
            print("Supabase is already connected.")
            return

    connection_request = session.authorize("supabase")
    print(f"Open this URL to connect Supabase:\n{connection_request.redirect_url}")
    connection_request.wait_for_connection()
    print("Connected.")
```
# Querying with natural language

With Supabase connected, the `query` function creates a session scoped to `toolkits=["supabase"]` and grabs the tools. We hand them to an agent and run an interactive loop where the user types questions and the agent translates them into SQL.

```py
def query(user_id: str):
    """Interactive loop: ask questions in natural language, get SQL results."""
    session = composio.create(user_id=user_id, toolkits=["supabase"])
    tools = session.tools()

    agent = Agent(
        name="Supabase SQL Agent",
        instructions=(
            "You are a Supabase SQL assistant. You help users query their Supabase "
            "databases using natural language. First list the user's projects to find "
            "the right database, then translate their questions into SQL queries and "
            "run them. Always explain the results clearly."
        ),
        tools=tools,
    )

    print("Supabase SQL Agent (type 'exit' to quit)")
    print("-" * 45)

    last_response_id = None
    while True:
        user_input = input("you > ")
        if user_input.strip().lower() == "exit":
            break

        result = Runner.run_sync(
            starting_agent=agent,
            input=user_input,
            previous_response_id=last_response_id,
        )
        last_response_id = result.last_response_id
        print(f"agent > {result.final_output}\n")
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
    """Check if Supabase is connected. If not, start OAuth and wait."""
    session = composio.create(user_id=user_id, toolkits=["supabase"])
    toolkits = session.toolkits()

    for t in toolkits.items:
        if t.slug == "supabase" and t.connection and t.connection.is_active:
            print("Supabase is already connected.")
            return

    connection_request = session.authorize("supabase")
    print(f"Open this URL to connect Supabase:\n{connection_request.redirect_url}")
    connection_request.wait_for_connection()
    print("Connected.")
# endregion connect

# region query
def query(user_id: str):
    """Interactive loop: ask questions in natural language, get SQL results."""
    session = composio.create(user_id=user_id, toolkits=["supabase"])
    tools = session.tools()

    agent = Agent(
        name="Supabase SQL Agent",
        instructions=(
            "You are a Supabase SQL assistant. You help users query their Supabase "
            "databases using natural language. First list the user's projects to find "
            "the right database, then translate their questions into SQL queries and "
            "run them. Always explain the results clearly."
        ),
        tools=tools,
    )

    print("Supabase SQL Agent (type 'exit' to quit)")
    print("-" * 45)

    last_response_id = None
    while True:
        user_input = input("you > ")
        if user_input.strip().lower() == "exit":
            break

        result = Runner.run_sync(
            starting_agent=agent,
            input=user_input,
            previous_response_id=last_response_id,
        )
        last_response_id = result.last_response_id
        print(f"agent > {result.final_output}\n")
# endregion query

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python main.py connect <user_id>")
        print("  python main.py query <user_id>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "connect":
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        connect(user_id)
    elif command == "query":
        user_id = sys.argv[2] if len(sys.argv) > 2 else "default"
        query(user_id)
    else:
        print(f"Unknown command: {command}")
        print("Use 'connect' or 'query'.")
        sys.exit(1)

```
# Running the script

First, connect your Supabase account:

```bash
uv run --env-file .env python main.py connect default
```
If Supabase is not connected yet, you'll get an OAuth URL. Open it in your browser and authorize the app.

Then start the interactive query agent:

```bash
uv run --env-file .env python main.py query default
```
Try asking things like:

```
you > List all my Supabase projects
you > Show me all tables in my default project
you > How many users signed up this week?
you > What are the top 10 most recent orders?
```

Type `exit` to quit.

# Take it further

The agent has full access to your Supabase projects via SQL. Some ideas:

* **Scheduled reports**: wrap this in a cron job to generate daily metrics and post them to Slack using the Slack toolkit
* **Admin dashboard backend**: pair with FastAPI to expose natural-language queries as an API for internal tools
* **Data migration helper**: ask the agent to compare schemas across projects and generate migration SQL

- [FastAPI Server](/cookbooks/fast-api): Wrap an agent in an HTTP server with auth and connection management

- [Background Agent](/cookbooks/background-agent): Run agents autonomously on a schedule

---
