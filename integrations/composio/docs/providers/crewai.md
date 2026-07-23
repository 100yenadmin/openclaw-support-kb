---
type: composio_doc
title: "CrewAI"
source: "https://docs.composio.dev/docs/providers/crewai.md"
source_hash: "10380cb42fbc48dbd48ab4d55a7c5efe8f8e1193c4e5d6286eddf7ebc7ecc66a"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/crewai.md"
original_doc_path: "providers/crewai.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# CrewAI (/docs/providers/crewai)
Source: https://docs.composio.dev/docs/providers/crewai.md


The CrewAI provider turns Composio tools into CrewAI [`BaseTool`](https://docs.crewai.com/concepts/tools) objects that execute themselves. You connect an account, fetch the tools, pass them to an `Agent`, and CrewAI runs the task end to end.

**Install**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-crewai) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

```python
from crewai import Agent, Crew, Task
from composio import Composio
from composio_crewai import CrewAIProvider

composio = Composio(provider=CrewAIProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = Agent(
    role="Email Agent",
    goal="Send emails on behalf of the user",
    backstory="You are an AI agent that sends emails using Gmail.",
    tools=tools,
    llm="gpt-5.2",
)

task = Task(
    description="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
    agent=agent,
    expected_output="Confirmation that the email was sent",
)

crew = Crew(agents=[agent], tasks=[task])
result = crew.kickoff()
print(result)
```
# Provider specifics

Each Composio tool becomes a CrewAI `BaseTool` whose `args_schema` is built from the tool's input schema, so CrewAI validates arguments before running anything.

When validation fails, the tool does not raise. It returns a structured result instead:

```python
{"successful": False, "error": "<validation message>", "data": None}
```

Check `successful` in your task output rather than wrapping calls in `try`/`except`.

# Next

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
