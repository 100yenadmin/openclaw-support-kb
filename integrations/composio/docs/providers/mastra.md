---
type: composio_doc
title: "Mastra"
source: "https://docs.composio.dev/docs/providers/mastra.md"
source_hash: "ed13051100119f7d92f3e055244768bc4bd1deb60dd06b834771204f5f0a2ad9"
system: "composio"
kb_namespace: "composio"
doc_path: "providers/mastra.md"
original_doc_path: "providers/mastra.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Mastra (/docs/providers/mastra)
Source: https://docs.composio.dev/docs/providers/mastra.md


The Mastra provider transforms Composio tools into [Mastra's tool format](https://mastra.ai/en/docs/tools-mcp/overview#creating-tools) with built-in execution. Pass the wrapped tools to a Mastra `Agent`, and the agent calls them automatically. Each tool gets both an input and an output schema, so Mastra can validate tool results as well as arguments.

**Install**

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=docs-providers-mastra) and `OPENAI_API_KEY` with your [OpenAI API key](https://platform.openai.com/api-keys).

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
## Provider specifics [#provider-specifics]

**Strict mode.** Pass `strict: true` to normalize each tool's input schema for OpenAI structured outputs before Mastra compiles it: every object lists all of its properties in `required` and is closed, and optional properties stay available but accept `null`. A `null` is dropped before the tool runs unless the tool's own schema accepts `null` for that parameter, so nullable fields still receive an explicit `null`. Tools whose schema cannot be expressed in strict mode, such as objects that accept arbitrary keys, `allOf`, `prefixItems`, or unresolved `$ref`s, keep their original schema and log a warning:

```typescript
// @noErrors
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";

const composio = new Composio({ provider: new MastraProvider({ strict: true }) });
```

> The provider runs each tool's JSON Schema through Mastra's schema-compat layer and inlines internal `$ref` pointers first. A few Composio tools reference `$defs` entries that the upstream API does not emit. Rather than crash `tools.get`, the provider falls back to a permissive object schema for that property and logs one warning per tool, so the affected field validates loosely.

## Next [#next]

- [What is a session?](/docs/how-composio-works): How sessions scope users, tools, and auth, and how to reuse them across requests.

---
