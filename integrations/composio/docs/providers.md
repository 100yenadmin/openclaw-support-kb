---
type: composio_doc
title: "Providers"
source: "https://docs.composio.dev/docs/providers.md"
source_hash: "5362fa6788dd8f666d4f6f62fd409f72d51d70879cc1b2a5fb76c99e9ab4af5f"
system: "composio"
kb_namespace: "composio"
doc_path: "providers.md"
original_doc_path: "providers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Providers (/docs/providers)
Source: https://docs.composio.dev/docs/providers.md


Composio works with any AI framework. A provider is the adapter that turns Composio tools into the native tool format your framework expects, so you don't write glue code.

Pick the provider that matches the SDK or agent framework you already use. Each one fetches tools, handles execution, and hands your agent objects it understands. If your framework isn't listed, you can [build your own provider](/docs/providers/custom-providers).

# AI SDKs

Use these when you call a model SDK directly.

- [Anthropic](/docs/providers/anthropic) ('Python', 'TypeScript')

- [OpenAI](/docs/providers/openai) ('Python', 'TypeScript')

- [Vercel AI SDK](/docs/providers/vercel) ('TypeScript')

- [Google](/docs/providers/google) ('Python', 'TypeScript')

# Agent frameworks

Use these when an agent framework orchestrates the tool calls for you.

- [LangChain](/docs/providers/langchain) ('Python', 'TypeScript')

- [CrewAI](/docs/providers/crewai) ('Python')

- [LlamaIndex](/docs/providers/llamaindex) ('Python', 'TypeScript')

- [Mastra](/docs/providers/mastra) ('TypeScript')

- [Pi](/docs/providers/pi) ('TypeScript')

- [AutoGen](/docs/providers/autogen) ('Python')

# Custom

- [Build your own](/docs/providers/custom-providers) ('Python', 'TypeScript')

---
