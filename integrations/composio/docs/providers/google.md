---
type: composio_doc
title: "Google"
source: "https://docs.composio.dev/docs/providers/google.md"
source_hash: "f6c499c73e3843cd7036ba07fc688b6f74a9279eab777022332636d56acd68d7"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/google.md"
original_doc_path: "providers/google.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Google (/docs/providers/google)
Source: https://docs.composio.dev/docs/providers/google.md


The Google provider formats Composio tools for [Gemini](https://ai.google.dev/) and the [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/). Pick the tab that matches your setup.

### gemini

In Python, the Gemini provider (`composio_gemini`) wraps Composio tools as typed callables, and the `google-genai` SDK's Automatic Function Calling executes tool calls inside the chat loop for you. In TypeScript, the Google provider transforms Composio tools into Gemini function declarations, and you run the loop: execute each call with `composio.provider.executeToolCall`, feed the result back, and repeat until the model replies with text.

Object arguments that declare no properties preserve arbitrary nested keys in both providers. The TypeScript provider also adds `type: "object"` to schema nodes that declare `properties` without a type, which is the shape Gemini expects for object schemas.

**Install**

**Python:**

**TypeScript:**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-google) and `GOOGLE_API_KEY` with your [Google API key](https://aistudio.google.com/apikey).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
GOOGLE_API_KEY=xxxxxxxxx
```
**Create session and run**

**Python:**

```python
from composio import Composio
from composio_gemini import GeminiProvider
from google import genai
from google.genai import types

composio = Composio(provider=GeminiProvider())
client = genai.Client()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

config = types.GenerateContentConfig(tools=tools)
chat = client.chats.create(model="gemini-3-pro-preview", config=config)

# Automatic Function Calling executes tool calls inside the chat loop
response = chat.send_message(
    "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'"
)
print(response.text)
```
**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { GoogleProvider } from '@composio/google';
import { GoogleGenAI, type Part } from '@google/genai';

const composio = new Composio({
    provider: new GoogleProvider(),
});
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
        tools: [{ functionDeclarations: tools }],
    },
});

let response = await chat.sendMessage({
    message: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
});

// Agentic loop: keep executing tool calls until the model responds with text
while (response.functionCalls && response.functionCalls.length > 0) {
    const parts: Part[] = [];
    for (const fc of response.functionCalls) {
        const result = await composio.provider.executeToolCall("user_123", {
            name: fc.name || '',
            args: (fc.args || {}) as Record<string, unknown>,
        });
        parts.push({
            functionResponse: {
                id: fc.id,
                name: fc.name,
                response: JSON.parse(result),
            },
        });
    }
    response = await chat.sendMessage({ message: parts });
}

console.log(response.text);
```
### adk

The Google ADK provider transforms Composio tools into ADK's `FunctionTool` format. Unlike Gemini function calling, ADK runs the tool loop for you: hand the tools to an `Agent`, and the `Runner` executes calls and continues until the agent produces a final response. ADK integration is Python-only.

**Install**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-google) and `GOOGLE_API_KEY` with your [Google API key](https://aistudio.google.com/apikey).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
GOOGLE_API_KEY=xxxxxxxxx
```
**Create session and run**

```python
from composio import Composio
from composio_google_adk import GoogleAdkProvider
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

composio = Composio(provider=GoogleAdkProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

agent = Agent(
    name="email_agent",
    model="gemini-3-pro-preview",
    instruction="You are an AI agent that sends emails using Gmail.",
    tools=tools,
)

session_service = InMemorySessionService()
adk_session = session_service.create_session_sync(
    app_name="email_agent",
    user_id="user_123",
    session_id="session_1",
)
runner = Runner(
    agent=agent,
    app_name="email_agent",
    session_service=session_service,
)

content = types.Content(
    role="user",
    parts=[types.Part(text="Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")],
)

events = runner.run(user_id="user_123", session_id="session_1", new_message=content)
for event in events:
    if event.is_final_response() and event.content and event.content.parts:
        print(event.content.parts[0].text)
```

## Next [#next]

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
