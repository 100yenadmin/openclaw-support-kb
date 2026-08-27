---
type: composio_doc
title: "OpenAI"
source: "https://docs.composio.dev/docs/providers/openai.md"
source_hash: "7d2c5d7e7fa2a6634d9db0cd460bdaf5d07a185296fdd649cb6109a1c429d290"
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


The OpenAI provider formats Composio tools for OpenAI's function-calling and executes the tool calls the model returns. It works three ways:

* The [Responses API](https://platform.openai.com/docs/api-reference/responses), the recommended way to build agentic flows, where you run the tool-call loop yourself.
* The [Chat Completions API](https://platform.openai.com/docs/api-reference/chat), the classic message-based interface, where you also run the loop.
* The [Agents SDK](https://openai.github.io/openai-agents-python/), where the SDK runs the loop and executes Composio tools for you.

The OpenAI provider is the default provider for the Composio SDK, so you get it without configuring anything. Pick the tab that matches your integration.

### responses

The `OpenAIResponsesProvider` transforms Composio tools into OpenAI's function-calling format for the Responses API, then executes the tool calls the model returns and shapes the results into `function_call_output` items you feed back in.

**Install**

**Python:**

**TypeScript:**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-openai) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

The [Responses API](https://platform.openai.com/docs/api-reference/responses) is the recommended way to build agentic flows with OpenAI. You pass `previous_response_id` on each turn so the model keeps the prior context, and you send back only the new `function_call_output` items.

> Passing a session to `handle_tool_calls` / `handleToolCalls` requires `composio` newer than 0.19.0 (Python) or `@composio/core` ≥ 0.17.0 with `@composio/openai` ≥ 0.12.0 (TypeScript). On earlier versions, execute session tools with [`session.execute()`](/docs/how-composio-works#executing-session-tools).

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

# Agentic loop: keep executing tool calls until the model responds with text
while True:
    tool_calls = [o for o in response.output if o.type == "function_call"]
    if not tool_calls:
        break
    results = composio.provider.handle_tool_calls(response=response, session=session)
    response = client.responses.create(
        model="gpt-5.2",
        tools=tools,
        previous_response_id=response.id,
        input=[
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(results[i]),
            }
            for i, call in enumerate(tool_calls)
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

// Agentic loop: keep executing tool calls until the model responds with text
while (true) {
    const toolCalls = response.output.filter((o) => o.type === "function_call");
    if (toolCalls.length === 0) break;

    const outputs = await composio.provider.handleToolCalls(session, response.output);
    response = await client.responses.create({
        model: "gpt-5.2",
        tools: tools,
        previous_response_id: response.id,
        input: outputs,
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
### chat

The `OpenAIProvider` targets the Chat Completions API and is the default provider used by the Composio SDK when you do not specify one.

**Install**

**Python:**

**TypeScript:**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-openai) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

The [Chat Completions API](https://platform.openai.com/docs/api-reference/chat) generates a model response from a list of messages. You keep the full message list yourself and append each assistant message and its `tool` results before the next call.

> Passing a session to `handle_tool_calls` / `handleToolCalls` requires `composio` newer than 0.19.0 (Python) or `@composio/core` ≥ 0.17.0 with `@composio/openai` ≥ 0.12.0 (TypeScript). On earlier versions, execute session tools with [`session.execute()`](/docs/how-composio-works#executing-session-tools).

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

# Agentic loop: keep executing tool calls until the model responds with text
while response.choices[0].message.tool_calls:
    results = composio.provider.handle_tool_calls(response=response, session=session)
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

// Agentic loop: keep executing tool calls until the model responds with text
while (response.choices[0].message.tool_calls) {
    const results = await composio.provider.handleToolCalls(session, response);
    messages.push(response.choices[0].message);
    messages.push(...results);
    response = await client.chat.completions.create({
        model: "gpt-5.2",
        tools: tools,
        messages: messages,
    });
}

console.log(response.choices[0].message.content);
```
### agents

The `OpenAIAgentsProvider` transforms Composio tools into the Agents SDK tool format with execution built in, so the SDK runs the tool-call loop and you only define the agent and call `run`.

**Install**

**Python:**

**TypeScript:**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-openai) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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
## Provider specifics [#provider-specifics]

The OpenAI integration ships three providers, one per API surface:

* **`OpenAIResponsesProvider`** for the Responses API. `handleToolCalls` executes each `function_call` and returns `function_call_output` items keyed by `call_id`, paired with `previous_response_id` so you only resend new outputs each turn.
* **`OpenAIProvider`** for the Chat Completions API. This is the SDK default, so `new Composio()` with no provider uses it. You keep the full message list and append each assistant message plus its `tool` results yourself.
* **`OpenAIAgentsProvider`** for the Agents SDK. Tools come with execution wired in, so the SDK runs the loop for you.

**Strict mode.** Pass `strict: true` or `strict=True` to `OpenAIResponsesProvider`, or pass `strict: true` to the TypeScript `OpenAIAgentsProvider`, to normalize each tool's input schema for [structured outputs](https://platform.openai.com/docs/guides/structured-outputs). The Python Agents SDK provider does not support strict mode yet. Every object lists all of its properties in `required` and is closed, while optional properties stay available but accept `null`. A `null` is dropped before the tool runs unless the tool's own schema accepts `null` for that parameter. Tools whose schema strict mode cannot express, such as objects that accept arbitrary keys, `allOf`, `prefixItems`, or unresolved `$ref`s, are sent without strict mode and log a warning.

**Python:**

```python
from composio import Composio
from composio_openai import OpenAIResponsesProvider

composio = Composio(provider=OpenAIResponsesProvider(strict=True))
```
**TypeScript:**

```typescript
// @noErrors
import { Composio } from "@composio/core";
import { OpenAIResponsesProvider } from "@composio/openai";

const composio = new Composio({
  provider: new OpenAIResponsesProvider({ strict: true }),
});
```

> Pass the session to `handleToolCalls` / `handle_tool_calls` when the model received tools from `session.tools()`. The helper preserves the provider's argument normalization and executes every call through that session. For tools fetched via [`tools.get`](/docs/tools-direct/executing-tools), pass the user ID instead.

Use the Responses or Agents provider for new agentic flows; reach for Chat Completions when you are extending an existing Chat Completions codebase.

## Next [#next]

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
