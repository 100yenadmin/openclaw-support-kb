---
type: composio_doc
title: "OpenAI Agents SDK"
source: "https://docs.composio.dev/docs/providers/openai-agents.md"
source_hash: "c9d5373076f8bac7c7a7089963f2424c0a2f1e35a31d75f72c832b6a76687aca"
doc_path: "providers/openai-agents.md"
original_doc_path: "providers/openai-agents.md"
duplicate_index: 1
---

# OpenAI Agents SDK (/docs/providers/openai-agents)
Source: https://docs.composio.dev/docs/providers/openai-agents.md


The OpenAI Agents SDK provider transforms Composio tools into the [Agents SDK tool format](https://openai.github.io/openai-agents-python/) with built-in execution.

**Install**

**Python:**

```bash
pip install composio composio-openai-agents openai-agents
```

**TypeScript:**

```bash
npm install @composio/core @composio/openai-agents @openai/agents
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
from composio_openai_agents import OpenAIAgentsProvider
from agents import Agent, Runner

composio = Composio(provider=OpenAIAgentsProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = Agent(
    name="Email Agent",
    instructions="You are a helpful assistant.",
    tools=tools,
)

async def main():
    result = await Runner.run(
        starting_agent=agent,
        input="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
    )
    print(result.final_output)

asyncio.run(main())
```
**TypeScript:**

```typescript
import { Composio } from "@composio/core";
import { OpenAIAgentsProvider } from "@composio/openai-agents";
import { Agent, run } from "@openai/agents";

const composio = new Composio({
  provider: new OpenAIAgentsProvider(),
});

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const agent = new Agent({
  name: "Email Agent",
  instructions: "You are a helpful assistant.",
  tools,
});

const result = await run(
  agent,
  "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
);

console.log(result.finalOutput);
```

---
