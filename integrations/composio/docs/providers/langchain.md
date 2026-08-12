---
type: composio_doc
title: "LangChain"
source: "https://docs.composio.dev/docs/providers/langchain.md"
source_hash: "7e770cc653a8f30198472bd4fb7972bbe2598ace2b926eabf7c1f044b40476ee"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/langchain.md"
original_doc_path: "providers/langchain.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# LangChain (/docs/providers/langchain)
Source: https://docs.composio.dev/docs/providers/langchain.md


The LangChain provider formats Composio tools for [LangChain](https://python.langchain.com/) and [LangGraph](https://langchain-ai.github.io/langgraph/) agents. Pick the tab that matches your setup.

### langchain

The LangChain provider transforms each Composio tool into a LangChain [`DynamicStructuredTool`](https://js.langchain.com/docs/concepts/tools/) with built-in execution. You can hand the tools to `create_agent` in Python or wire them into a graph node in TypeScript, and the framework runs the tool loop for you.

**Install**

**Python:**

**TypeScript:**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-langchain) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

**Python:**

```python
from composio import Composio
from composio_langchain import LangchainProvider
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

composio = Composio(provider=LangchainProvider())
llm = ChatOpenAI(model="gpt-5.2")

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = create_agent(tools=tools, model=llm)
result = agent.invoke({"messages": [("user", "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")]})

print(result["messages"][-1].content)
```
**TypeScript:**

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { Composio } from '@composio/core';
import { LangchainProvider } from '@composio/langchain';

const composio = new Composio({
  provider: new LangchainProvider(),
});

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: 'gpt-5.2',
  temperature: 0,
}).bindTools(tools);

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return 'tools';
  }
  return '__end__';
}

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', callModel)
  .addEdge('__start__', 'agent')
  .addNode('tools', toolNode)
  .addEdge('tools', 'agent')
  .addConditionalEdges('agent', shouldContinue);

const app = workflow.compile();

const finalState = await app.invoke({
  messages: [new HumanMessage("Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")],
});
console.log(finalState.messages[finalState.messages.length - 1].content);
```
### langgraph

The LangGraph provider transforms Composio tools into the same LangChain `DynamicStructuredTool` format, ready to use with LangGraph agents. LangGraph integration is Python-only.

**Install**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-langchain) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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

## Python argument validation [#python-argument-validation]

The Python LangChain and LangGraph providers build a Pydantic argument model from each tool's JSON Schema. Object arguments that declare no properties accept and preserve arbitrary nested keys. For objects that declare named properties, undeclared keys are rejected unless the schema allows them with `additionalProperties`.

Schemas that use `patternProperties` or schema-valued `additionalProperties` validate dynamic keys before execution. The providers also preserve whether an optional argument was omitted or explicitly set to `None`. By default, declared defaults are included, while optional arguments without defaults stay absent. Set `schema_config={"skip_defaults": True}` when creating the provider to leave declared defaults absent too.

When validation fails, the tool does not run. LangChain surfaces the failure as a tool error observation so the agent can correct its arguments and retry.

## Next [#next]

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
