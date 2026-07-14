---
type: composio_doc
title: "LlamaIndex"
source: "https://docs.composio.dev/docs/providers/llamaindex.md"
source_hash: "2d4f1482d88366007472fe867dfbb90fc462371f952fa2d73187de15bd7ef6ae"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/llamaindex.md"
original_doc_path: "providers/llamaindex.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# LlamaIndex (/docs/providers/llamaindex)
Source: https://docs.composio.dev/docs/providers/llamaindex.md


The LlamaIndex provider turns Composio tools into LlamaIndex [`FunctionTool`](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/) objects that execute themselves. You connect an account, fetch the tools, hand them to a `FunctionAgent`, and LlamaIndex drives the calls. The provider ships for both Python and TypeScript.

**Install**

**Python:**

**TypeScript:**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

**Python:**

```python
import asyncio
from composio import Composio
from composio_llamaindex import LlamaIndexProvider
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI

composio = Composio(provider=LlamaIndexProvider())
llm = OpenAI(model="gpt-5.2")

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = FunctionAgent(tools=tools, llm=llm)

async def main():
    result = await agent.run(
        user_msg="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
    )
    print(result)

asyncio.run(main())
```
**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { LlamaindexProvider } from '@composio/llamaindex';
import { openai } from '@llamaindex/openai';
import { agent } from '@llamaindex/workflow';

const composio = new Composio({
  provider: new LlamaindexProvider(),
});

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const myAgent = agent({
  llm: openai({ model: 'gpt-5.2' }),
  tools,
});

const result = await myAgent.run(
  "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
);

console.log(result.data.result);
```

# Next

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
