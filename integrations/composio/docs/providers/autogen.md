---
type: composio_doc
title: "AutoGen"
source: "https://docs.composio.dev/docs/providers/autogen.md"
source_hash: "d6646e23ded3b90002da76c1c1d6f354a3d31cb7021ba7aa2d1eb75de28712d3"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/autogen.md"
original_doc_path: "providers/autogen.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# AutoGen (/docs/providers/autogen)
Source: https://docs.composio.dev/docs/providers/autogen.md


The AutoGen provider turns Composio tools into AutoGen [`FunctionTool`](https://microsoft.github.io/autogen/) objects and registers them with your agents. You connect an account, fetch the tools, register them with a caller and executor agent, and AutoGen handles the conversation and tool calls.

The provider runs on the [`ag2`](https://github.com/ag2ai/ag2) distribution, the community-maintained continuation of AutoGen 0.2, so it works for AG2 projects out of the box.

**Install**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

```python
import os

from autogen import AssistantAgent, LLMConfig, UserProxyAgent
from composio import Composio
from composio_autogen import AutogenProvider

composio = Composio(provider=AutogenProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

chatbot = AssistantAgent(
    "chatbot",
    system_message="Reply TERMINATE when the task is done or when user's content is empty",
    llm_config=LLMConfig({
        "api_type": "openai",
        "model": "gpt-5.2",
        "api_key": os.environ["OPENAI_API_KEY"],
    }),
)

user_proxy = UserProxyAgent(
    "user_proxy",
    is_termination_msg=lambda msg: "TERMINATE" in (msg.get("content", "") or ""),
    human_input_mode="NEVER",
    code_execution_config={"use_docker": False},
)

# Register tools with both agents
composio.provider.register_tools(caller=chatbot, executor=user_proxy, tools=tools)

response = user_proxy.initiate_chat(
    chatbot,
    message="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
)

print(response.chat_history)
```

# Provider specifics

AutoGen needs tools registered with two agents, not passed once. Call `composio.provider.register_tools(caller=..., executor=..., tools=tools)`: the `caller` decides which tool to invoke, and the `executor` runs it.

Each tool comes back as an AutoGen `FunctionTool` with a generated `name`. AutoGen caps function names at 64 characters, so the provider hashes and truncates long tool slugs to stay under the limit. The registered name will not always match the original Composio slug.

> `register_tools` is unique to the AutoGen provider. Other providers pass tools straight into the agent constructor, so don't expect this method elsewhere.

# Next

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
