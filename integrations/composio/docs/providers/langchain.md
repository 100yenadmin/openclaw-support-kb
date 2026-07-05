---
type: composio_doc
title: "LangChain"
source: "https://docs.composio.dev/docs/providers/langchain.md"
source_hash: "d7eb176ad11181072d40c5380e214b8c5978b953a7c7a85c0427c672e4bd03cb"
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

> Choose your integration type · [Use this guide to decide](/docs/native-tools-vs-mcp)

### LangChain

The LangChain provider transforms each Composio tool into a LangChain [`DynamicStructuredTool`](https://js.langchain.com/docs/concepts/tools/) with built-in execution. You can hand the tools to `create_agent` in Python or wire them into a graph node in TypeScript, and the framework runs the tool loop for you.

**Install**

**Python:**

```bash
pip install composio composio_langchain langchain langchain_openai
```

**TypeScript:**

```bash
npm install @composio/core @composio/langchain @langchain/openai @langchain/langgraph @langchain/core
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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
### LangGraph

The LangGraph provider transforms Composio tools into the same LangChain `DynamicStructuredTool` format, ready to use with LangGraph agents. LangGraph integration is Python-only.

**Install**

```bash
pip install composio composio_langgraph langgraph langchain_openai
```
**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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

# Next

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
