---
type: composio_doc
title: "OpenAI"
source: "https://docs.composio.dev/docs/providers/openai.md"
source_hash: "74be191a4abaa9b2176edaf8234ef6d4ef3b6035acceaecab8781b82a3256e75"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/openai.md"
original_doc_path: "providers/openai.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# OpenAI (/docs/providers/openai)
Source: https://docs.composio.dev/docs/providers/openai.md


Composio integrates with OpenAI through the [Responses API](https://platform.openai.com/docs/api-reference/responses), [Chat Completions API](https://platform.openai.com/docs/api-reference/chat), and [Agents SDK](https://openai.github.io/openai-agents-python/). Pick the tab that matches your integration.

> Choose your integration type · [Use this guide to decide](/docs/native-tools-vs-mcp)

### Responses API

The OpenAI Provider is the default provider for the Composio SDK. It transforms Composio tools into a format compatible with OpenAI function calling through the Responses API.

**Install**

**Python:**

```bash
pip install composio composio_openai openai
```

**TypeScript:**

```bash
npm install @composio/core @composio/openai openai
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

The [Responses API](https://platform.openai.com/docs/api-reference/responses) is the recommended way to build agentic flows with OpenAI.

**Python:**

```python
import json
from openai import OpenAI
from composio import Composio
from composio_openai import OpenAIResponsesProvider

composio = Composio(provider=OpenAIResponsesProvider())
client = OpenAI()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

response = client.responses.create(
    model="gpt-5.2",
    tools=tools,
    input=[
        {
            "role": "user",
            "content": "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
        }
    ]
)

# Agentic loop — keep executing tool calls until the model responds with text
while True:
    tool_calls = [o for o in response.output if o.type == "function_call"]
    if not tool_calls:
        break
    results = composio.provider.handle_tool_calls(response=response, user_id="user_123")
    response = client.responses.create(
        model="gpt-5.2",
        tools=tools,
        previous_response_id=response.id,
        input=[
            {"type": "function_call_output", "call_id": tool_calls[i].call_id, "output": json.dumps(result)}
            for i, result in enumerate(results)
        ]
    )

# Print final response
for item in response.output:
    if item.type == "message":
        print(item.content[0].text)
```
**TypeScript:**

```typescript
import OpenAI from 'openai';
import { Composio } from '@composio/core';
import { OpenAIResponsesProvider } from '@composio/openai';

const composio = new Composio({
    provider: new OpenAIResponsesProvider(),
});
const client = new OpenAI();

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

let response = await client.responses.create({
    model: "gpt-5.2",
    tools: tools,
    input: [
        {
            role: "user",
            content: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
        },
    ],
});

// Agentic loop — keep executing tool calls until the model responds with text
while (true) {
    const toolCalls = response.output.filter((o) => o.type === "function_call");
    if (toolCalls.length === 0) break;

    const results = await composio.provider.handleToolCalls("user_123", response.output);
    response = await client.responses.create({
        model: "gpt-5.2",
        tools: tools,
        previous_response_id: response.id,
        input: results.map((result, i) => ({
            type: "function_call_output" as const,
            call_id: toolCalls[i].call_id,
            output: JSON.stringify(result),
        })),
    });
}

// Print final response
for (const item of response.output) {
    if (item.type === "message") {
        const block = item.content[0];
        if (block.type === "output_text") {
            console.log(block.text);
        }
    }
}
```
### Chat Completions

The `OpenAIProvider` (Chat Completions) is the default provider used by the Composio SDK when no other provider is specified.

**Install**

**Python:**

```bash
pip install composio composio_openai openai
```
**TypeScript:**

```bash
npm install @composio/core @composio/openai openai
```
**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

The [Chat Completions API](https://platform.openai.com/docs/api-reference/chat) generates a model response from a list of messages.
The `OpenAIProvider` (Chat Completions) is the default provider used by Composio SDK.

**Python:**

```python
import json
from openai import OpenAI
from composio import Composio
from composio_openai import OpenAIProvider

composio = Composio(provider=OpenAIProvider())
client = OpenAI()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

messages = [
    {"role": "user", "content": "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"}
]

response = client.chat.completions.create(
    model="gpt-5.2",
    tools=tools,
    messages=messages,
)

# Agentic loop — keep executing tool calls until the model responds with text
while response.choices[0].message.tool_calls:
    results = composio.provider.handle_tool_calls(response=response, user_id="user_123")
    messages.append(response.choices[0].message)
    for i, tc in enumerate(response.choices[0].message.tool_calls):
        messages.append({
            "role": "tool",
            "tool_call_id": tc.id,
            "content": json.dumps(results[i]),
        })
    response = client.chat.completions.create(
        model="gpt-5.2",
        tools=tools,
        messages=messages,
    )

print(response.choices[0].message.content)
```
**TypeScript:**

```typescript
import OpenAI from 'openai';
import { Composio } from '@composio/core';
import { OpenAIProvider } from '@composio/openai';

const composio = new Composio({
    provider: new OpenAIProvider(),
});
const client = new OpenAI();

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
        role: "user",
        content: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
    },
];

let response = await client.chat.completions.create({
    model: "gpt-5.2",
    tools: tools,
    messages: messages,
});

// Agentic loop — keep executing tool calls until the model responds with text
while (response.choices[0].message.tool_calls) {
    const results = await composio.provider.handleToolCalls("user_123", response);
    messages.push(response.choices[0].message);
    for (const [i, tc] of response.choices[0].message.tool_calls.entries()) {
        messages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(results[i]),
        });
    }
    response = await client.chat.completions.create({
        model: "gpt-5.2",
        tools: tools,
        messages: messages,
    });
}

console.log(response.choices[0].message.content);
```
### Agents SDK

The OpenAI Agents SDK provider transforms Composio tools into the Agents SDK tool format with built-in execution.

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
# Multi-turn chat

For multi-turn apps, create the session once and reuse it across requests with `composio.use()`. Store the session ID in your database or chat state:

**Python:**

```python
from composio import Composio

composio = Composio()

# First request — create and store the session ID
session = composio.create(user_id="user_123")
session_id = session.session_id
# store session_id in your database or chat state

# Subsequent requests — reuse the session
session = composio.use(session_id)
tools = session.tools()
```
**TypeScript:**

```typescript
// @noErrors
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// ---cut---
// First request — create and store the session ID
const session = await composio.create("user_123");
const sessionId = session.sessionId;
// store sessionId in your database or chat state

// Subsequent requests — reuse the session
const session = await composio.use(sessionId);
const tools = await session.tools();
```

---
