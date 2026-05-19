---
type: composio_doc
title: "Vercel AI SDK"
source: "https://docs.composio.dev/docs/providers/vercel.md"
source_hash: "a87f339f9fa980382f36ba1846877be3a67ab23b9e9e406bad538128126f8d96"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/vercel.md"
original_doc_path: "providers/vercel.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Vercel AI SDK (/docs/providers/vercel)
Source: https://docs.composio.dev/docs/providers/vercel.md


The Vercel AI SDK provider transforms Composio tools into Vercel's [tool format](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling) with built-in execution — no manual agentic loop needed.

**Install**

```bash
npm install @composio/core @composio/vercel ai @ai-sdk/anthropic
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys) and `ANTHROPIC_API_KEY` with your [Anthropic API key](https://console.anthropic.com/settings/keys).

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
# Multi-turn chat

For multi-turn apps, create the session once and reuse it across requests with `composio.use()`:

```typescript
// @noErrors
import { anthropic } from "@ai-sdk/anthropic";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import { generateText, stepCountIs } from "ai";

const composio = new Composio({ provider: new VercelProvider() });

// First request — create and store the session ID
const session = await composio.create("user_123");
const sessionId = session.sessionId;
// store sessionId in your database or chat state

// Subsequent requests — reuse the session
const session = await composio.use(sessionId);
const tools = await session.tools();

const { text } = await generateText({
  model: anthropic("claude-opus-4-6"),
  tools,
  prompt: "What emails did I get today?",
  stopWhen: stepCountIs(10),
});
```

---
