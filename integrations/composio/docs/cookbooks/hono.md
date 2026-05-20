---
type: composio_doc
title: "Basic Hono Server"
source: "https://docs.composio.dev/cookbooks/hono.md"
source_hash: "e7385d34cef6269bd2c84952141c0b422e3b5407acb31d9afa80c73fd37b4b40"
system: "composio"
kb_namespace: "composio"
doc_path: "cookbooks/hono.md"
original_doc_path: "cookbooks/hono.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Basic Hono Server (/cookbooks/hono)
Source: https://docs.composio.dev/cookbooks/hono.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/hono)

This cookbook builds a Hono.js server where users can chat with an AI agent that has access to over 1000 tools like Gmail, GitHub, Slack, Notion, and more. Along the way we'll add endpoints to manage which apps a user has connected.

# Prerequisites

* Node.js 18+
* [Composio API key](https://dashboard.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)

# Project setup

Create a new project and install dependencies:

```bash
mkdir composio-hono && cd composio-hono
npm init -y
npm install hono @hono/node-server openai @composio/core @composio/openai tsx dotenv
```

Add your API keys to a `.env` file:

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
# Initializing the clients

`Composio` takes an `OpenAIProvider` so that when we ask for tools later, they come back in the format OpenAI expects.

```ts no-twoslash
const composio = new Composio({ provider: new OpenAIProvider() });
const openai = new OpenAI();

const app = new Hono();
```
# Chat endpoint

The core of the server is a `/chat` endpoint. A user sends a message, and the agent responds, using whatever tools it needs.

`composio.create()` creates a **session** scoped to a user. Calling `session.tools()` returns a set of meta tools that let the agent discover tools across all apps, handle OAuth when needed, and execute actions. We pass these to OpenAI and loop until the model stops calling tools.

```ts no-twoslash
app.post("/chat", async (c) => {
  const { userId, message } = await c.req.json();

  const session = await composio.create(userId);
  const tools = await session.tools();

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a helpful assistant. Use tools to help the user." },
    { role: "user", content: message },
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      tools,
      messages,
    });

    const choice = response.choices[0];
    if (!choice.message.tool_calls?.length) {
      return c.json({ response: choice.message.content });
    }

    messages.push(choice.message);
    const toolResults = await composio.provider.handleToolCalls(userId, response);
    messages.push(...toolResults);
  }
});
```
> If the user hasn't connected the app they're trying to use, the agent will automatically
return an authentication link in its response. The user can complete OAuth and then retry.

That's a working agent. But in most apps you'll also want to manage connections outside of chat, for example to show users what's connected or let them connect new apps from a settings page.

# Checking connections

`session.toolkits()` returns every toolkit in the session along with its connection status. We can expose this as a simple GET endpoint so your frontend can render a connections UI.

```ts no-twoslash
app.get("/connections/:userId", async (c) => {
  const userId = c.req.param("userId");

  const session = await composio.create(userId);
  const toolkits = await session.toolkits();

  return c.json(
    toolkits.items.map((t) => ({
      toolkit: t.slug,
      connected: t.connection?.isActive ?? false,
    }))
  );
});
```
If you just need to check a single toolkit, say before kicking off a workflow that requires Gmail, you can scope the session to that toolkit:

```ts no-twoslash
app.get("/connections/:userId/:toolkit", async (c) => {
  const userId = c.req.param("userId");
  const toolkit = c.req.param("toolkit");

  const session = await composio.create(userId, { toolkits: [toolkit] });
  const result = await session.toolkits();
  const match = result.items.find((t) => t.slug === toolkit);

  return c.json({ toolkit, connected: match?.connection?.isActive ?? false });
});
```
# Connecting an app

When a user wants to connect a new app, `session.authorize()` starts the OAuth flow and returns a redirect URL. Your frontend sends the user there, and once they complete auth, they're connected.

```ts no-twoslash
app.post("/connect/:toolkit", async (c) => {
  const toolkit = c.req.param("toolkit");
  const { userId } = await c.req.json();

  const session = await composio.create(userId, { toolkits: [toolkit] });
  const connectionRequest = await session.authorize(toolkit);

  return c.json({ redirectUrl: connectionRequest.redirectUrl });
});
```
# Complete app

Here's everything together:

```ts title="server.ts"
import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { OpenAI } from "openai";
import { Composio } from "@composio/core";
import { OpenAIProvider } from "@composio/openai";

// #region setup
const composio = new Composio({ provider: new OpenAIProvider() });
const openai = new OpenAI();

const app = new Hono();
// #endregion setup

// #region chat
app.post("/chat", async (c) => {
  const { userId, message } = await c.req.json();

  const session = await composio.create(userId);
  const tools = await session.tools();

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a helpful assistant. Use tools to help the user." },
    { role: "user", content: message },
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      tools,
      messages,
    });

    const choice = response.choices[0];
    if (!choice.message.tool_calls?.length) {
      return c.json({ response: choice.message.content });
    }

    messages.push(choice.message);
    const toolResults = await composio.provider.handleToolCalls(userId, response);
    messages.push(...toolResults);
  }
});
// #endregion chat

// #region list-connections
app.get("/connections/:userId", async (c) => {
  const userId = c.req.param("userId");

  const session = await composio.create(userId);
  const toolkits = await session.toolkits();

  return c.json(
    toolkits.items.map((t) => ({
      toolkit: t.slug,
      connected: t.connection?.isActive ?? false,
    }))
  );
});
// #endregion list-connections

// #region check-connection
app.get("/connections/:userId/:toolkit", async (c) => {
  const userId = c.req.param("userId");
  const toolkit = c.req.param("toolkit");

  const session = await composio.create(userId, { toolkits: [toolkit] });
  const result = await session.toolkits();
  const match = result.items.find((t) => t.slug === toolkit);

  return c.json({ toolkit, connected: match?.connection?.isActive ?? false });
});
// #endregion check-connection

// #region connect
app.post("/connect/:toolkit", async (c) => {
  const toolkit = c.req.param("toolkit");
  const { userId } = await c.req.json();

  const session = await composio.create(userId, { toolkits: [toolkit] });
  const connectionRequest = await session.authorize(toolkit);

  return c.json({ redirectUrl: connectionRequest.redirectUrl });
});
// #endregion connect

serve({ fetch: app.fetch, port: 8000 });
console.log("Server running on http://localhost:8000");

```
# Running the server

```bash
npx tsx server.ts
```
The server runs at `http://localhost:8000`.

# Testing with cURL

## Chat with the agent

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "message": "Star the composiohq/composio repo on GitHub"}'
```
## List all connections

```bash
curl http://localhost:8000/connections/user_123
```
## Check a specific connection

```bash
curl http://localhost:8000/connections/user_123/gmail
```
## Connect an app

```bash
curl -X POST http://localhost:8000/connect/gmail \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123"}'
```

Open the `redirectUrl` from the response in your browser to complete OAuth.

---
