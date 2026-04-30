---
type: composio_doc
title: "Vercel AI SDK"
source: "https://docs.composio.dev/docs/providers/vercel.md"
source_hash: "a45fcb9385225fd5f173ce3e3fa2e31f5f74240e50b96f7a586328f1c6c10ab4"
doc_path: "providers/vercel.md"
original_doc_path: "providers/vercel.md"
duplicate_index: 1
---

# Vercel AI SDK (/docs/providers/vercel)
Source: https://docs.composio.dev/docs/providers/vercel.md


The Vercel AI SDK provider transforms Composio tools into Vercel's [tool format](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling) with built-in execution — no manual agentic loop needed.

**Install**

```bash
npm install @composio/core @composio/vercel ai @ai-sdk/anthropic
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `ANTHROPIC_API_KEY` with your [Anthropic API key](https://console.anthropic.com/settings/keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
ANTHROPIC_API_KEY=xxxxxxxxx
```
**Create session and run**

The Vercel provider is **agentic** — tools include an `execute` function, so the AI SDK handles tool calls automatically via [`stopWhen`](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling).

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import { generateText, stepCountIs } from "ai";

const composio = new Composio({ provider: new VercelProvider() });

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();

const { text } = await generateText({
  model: anthropic("claude-opus-4-6"),
  tools,
  prompt: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
  stopWhen: stepCountIs(10),
});

console.log(text);
```

---
