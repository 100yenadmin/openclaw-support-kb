---
type: composio_doc
title: "CrewAI"
source: "https://docs.composio.dev/docs/providers/crewai.md"
source_hash: "bc4d49da413b1a4161efc21b7e5fd84a3f4de84a6ac7e5b73a9eccbc13a56ea7"
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


The CrewAI provider transforms Composio tools into CrewAI's [BaseTool](https://docs.crewai.com/concepts/tools) format with built-in execution.

**Install**

```bash
pip install composio composio_crewai crewai
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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

---
