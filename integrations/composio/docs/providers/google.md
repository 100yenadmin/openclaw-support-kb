---
type: composio_doc
title: "Google Generative AI"
source: "https://docs.composio.dev/docs/providers/google.md"
source_hash: "c860d7b9874a9f02868d2ebf02c9adeeac08a152240dd6af1273701048b922d4"
doc_path: "providers/google.md"
original_doc_path: "providers/google.md"
duplicate_index: 1
---

# Google Generative AI (/docs/providers/google)
Source: https://docs.composio.dev/docs/providers/google.md


The Google Generative AI provider transforms Composio tools into a format compatible with [Gemini's function calling](https://ai.google.dev/) capabilities.

**Install**

**Python:**

```bash
pip install composio composio_google google-genai
```

**TypeScript:**

```bash
npm install @composio/core @composio/google @google/genai
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `GOOGLE_API_KEY` with your [Google API key](https://aistudio.google.com/apikey).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
GOOGLE_API_KEY=xxxxxxxxx
```
**Create session and run**

**Python:**

```python
from composio import Composio
from composio_google import GoogleProvider
from google import genai
from google.genai import types

composio = Composio(provider=GoogleProvider())
client = genai.Client()

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()

config = types.GenerateContentConfig(tools=tools)
chat = client.chats.create(model="gemini-3-pro-preview", config=config)
response = chat.send_message("Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")

# Agentic loop — keep executing tool calls until the model responds with text
while response.function_calls:
    parts = []
    for fc in response.function_calls:
        result = composio.provider.execute_tool_call(user_id="user_123", function_call=fc)
        parts.append(types.Part.from_function_response(name=fc.name, response=result))
    response = chat.send_message(parts)

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

// Agentic loop — keep executing tool calls until the model responds with text
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

---
