---
type: composio_doc
title: "Vercel AI SDK"
source: "https://docs.composio.dev/docs/providers/vercel.md"
source_hash: "182ec3b6c7732faeb1a2faa4b44a35cea8af028209c14de73892193c4b61ab8f"
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


The Vercel AI SDK provider transforms Composio tools into Vercel's [tool format](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling) with built-in execution, so you don't write a manual agentic loop. Each wrapped tool carries its own `execute` function, and the AI SDK calls it for you.

**Install**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-vercel) and `ANTHROPIC_API_KEY` with your [Anthropic API key](https://console.anthropic.com/settings/keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
ANTHROPIC_API_KEY=xxxxxxxxx
```
**Create session and run**

The Vercel provider is **agentic**: tools include an `execute` function, so the AI SDK handles tool calls automatically. Set [`stopWhen`](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling) to cap how many tool-calling steps a run can take.

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
## Provider specifics [#provider-specifics]

**Strict mode.** Some models reject tool schemas that contain optional parameters. Pass `strict: true` to the provider to drop every non-required property from each tool's input schema before it reaches the AI SDK:

```typescript
// @noErrors
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const composio = new Composio({ provider: new VercelProvider({ strict: true }) });
```

> The provider converts each Composio tool's JSON Schema to a Zod schema for the AI SDK and normalizes tool arguments, so it still works when a model emits tool input as a JSON string rather than an object.

## Next [#next]

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
