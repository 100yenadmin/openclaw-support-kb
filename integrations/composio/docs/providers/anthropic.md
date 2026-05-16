---
type: composio_doc
title: "Anthropic"
source: "https://docs.composio.dev/docs/providers/anthropic.md"
source_hash: "df36b69712b666f53169809ee440230cdb318703c376b955eefa8c3ea8c4ff40"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/anthropic.md"
original_doc_path: "providers/anthropic.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Anthropic (/docs/providers/anthropic)
Source: https://docs.composio.dev/docs/providers/anthropic.md


The Anthropic Provider transforms Composio tools into a format compatible with the [Claude Messages API](https://docs.anthropic.com/en/api/messages).

> Looking for the Claude Agent SDK? See the [Claude Agent SDK](/docs/providers/claude-agent-sdk) provider page.

**Install**

**Python:**

```bash
pip install composio composio_anthropic anthropic
```

**TypeScript:**

```bash
npm install @composio/core @composio/anthropic @anthropic-ai/sdk
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `ANTHROPIC_API_KEY` with your [Anthropic API key](https://console.anthropic.com/settings/keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
ANTHROPIC_API_KEY=xxxxxxxxx
```
**Create session and run**

**Python:**

```python
import json
import anthropic
from composio import Composio
from composio_anthropic import AnthropicProvider

composio = Composio(provider=AnthropicProvider())
client = anthropic.Anthropic()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

messages = [
    {"role": "user", "content": "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"}
]

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    tools=tools,
    messages=messages,
)

# Agentic loop — keep executing tool calls until the model responds with text
while response.stop_reason == "tool_use":
    tool_use_blocks = [block for block in response.content if block.type == "tool_use"]
    results = composio.provider.handle_tool_calls(user_id="user_123", response=response)
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [
            {"type": "tool_result", "tool_use_id": tool_use_blocks[i].id, "content": json.dumps(result)}
            for i, result in enumerate(results)
        ]
    })
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )

# Print final response
for block in response.content:
    if block.type == "text":
        print(block.text)
```
**TypeScript:**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { Composio } from '@composio/core';
import { AnthropicProvider } from '@composio/anthropic';

const composio = new Composio({
    provider: new AnthropicProvider(),
});
const client = new Anthropic();

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const messages: Anthropic.MessageParam[] = [
    {
        role: "user",
        content: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
    },
];

let response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    tools: tools,
    messages: messages,
});

// Agentic loop — keep executing tool calls until the model responds with text
while (response.stop_reason === "tool_use") {
    const toolResults = await composio.provider.handleToolCalls("user_123", response);
    messages.push({ role: "assistant", content: response.content });
    messages.push(...toolResults);
    response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 4096,
        tools: tools,
        messages: messages,
    });
}

// Print final response
for (const block of response.content) {
    if (block.type === "text") {
        console.log(block.text);
    }
}
```
# Multi-turn chat

For multi-turn apps, create the session once and reuse it across requests with `composio.use()`:

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
