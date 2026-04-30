---
type: composio_doc
title: "Mastra"
source: "https://docs.composio.dev/docs/providers/mastra.md"
source_hash: "9bbc79005348238e1f947a03f976d449f4f2c23aa5a869bf6e5ce6f98ceef224"
doc_path: "providers/mastra.md"
original_doc_path: "providers/mastra.md"
duplicate_index: 1
---

# Mastra (/docs/providers/mastra)
Source: https://docs.composio.dev/docs/providers/mastra.md


The Mastra provider transforms Composio tools into [Mastra's tool format](https://mastra.ai/en/docs/tools-mcp/overview#creating-tools) with built-in execution.

**Install**

```bash
npm install @composio/core @composio/mastra @mastra/core @ai-sdk/openai
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
OPENAI_API_KEY=xxxxxxxxx
```
**Create session and run**

```typescript
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const composio = new Composio({
  provider: new MastraProvider(),
});

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const agent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-5.2"),
  tools,
});

const { text } = await agent.generate([
  { role: "user", content: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'" },
]);

console.log(text);
```

---
