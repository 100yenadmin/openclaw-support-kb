---
type: composio_doc
title: "LlamaIndex"
source: "https://docs.composio.dev/docs/providers/llamaindex.md"
source_hash: "2ec649e8e077c5f90ece8f3442498594dd03cf3d91d5d0da4b1ddbab9f09ec8c"
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


The LlamaIndex provider transforms Composio tools into LlamaIndex's [FunctionTool](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/) format with built-in execution.

**Install**

**Python:**

```bash
pip install composio composio_llamaindex llama-index llama-index-llms-openai
```

**TypeScript:**

```bash
npm install @composio/core @composio/llamaindex @llamaindex/openai @llamaindex/workflow
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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

---
