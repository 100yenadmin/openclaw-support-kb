---
type: composio_doc
title: "LangGraph"
source: "https://docs.composio.dev/docs/providers/langgraph.md"
source_hash: "a88779c6677741ea52f4300807903e574eb6b0b033ff54d3bfa9c7146d12f2d9"
doc_path: "providers/langgraph.md"
original_doc_path: "providers/langgraph.md"
duplicate_index: 1
---

# LangGraph (/docs/providers/langgraph)
Source: https://docs.composio.dev/docs/providers/langgraph.md


The LangGraph provider transforms Composio tools into LangChain's [StructuredTool](https://python.langchain.com/docs/how_to/custom_tools/) format for use with [LangGraph](https://langchain-ai.github.io/langgraph/) agents.

**Install**

```bash
pip install composio composio_langgraph langgraph langchain_openai
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

```python
from composio import Composio
from composio_langgraph import LanggraphProvider
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

composio = Composio(provider=LanggraphProvider())
llm = ChatOpenAI(model="gpt-5.2")

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = create_agent(tools=tools, model=llm)
result = agent.invoke({"messages": [("user", "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")]})

print(result["messages"][-1].content)
```

---
