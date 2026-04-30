---
type: composio_doc
title: "Build a Chat App"
source: "https://docs.composio.dev/cookbooks/chat-app.md"
source_hash: "8062aaf7dbabbef1f0ba7c2552096eff94226980ce4670cd13235a09e9683d5f"
doc_path: "cookbooks/chat-app.md"
original_doc_path: "cookbooks/chat-app.md"
duplicate_index: 1
---

# Build a Chat App (/cookbooks/chat-app)
Source: https://docs.composio.dev/cookbooks/chat-app.md


Give your AI agent access to Gmail, GitHub, Slack, Notion, and 1000+ other apps. This tutorial builds a Next.js chat app that handles tool discovery, user authentication, and action execution in about **30 lines of code**.

[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/chat-app)

# What you'll build

* A chat app where your agent can find and use tools across 1000+ apps
* In-chat OAuth authentication so users can connect apps directly in the conversation
* A tool call display that shows what the agent is doing in real time

# Prerequisites

* [Bun](https://bun.sh) (or Node.js 18+)
* [Composio API key](https://platform.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)

**Stack:** Next.js, Vercel AI SDK, OpenAI, Composio

# Create the project

Create a new Next.js app and install the dependencies:

```bash
bunx create-next-app composio-chat --yes
cd composio-chat
bun add @composio/core @composio/vercel @ai-sdk/openai ai @ai-sdk/react
```

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `OPENAI_API_KEY` from [OpenAI](https://platform.openai.com/api-keys).

Add your API keys to a `.env.local` file in the project root:

```bash title=".env.local"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
Start the dev server:

```bash
bun dev
```
# Build the backend

A **session** scopes tools and credentials to a specific user. Create `app/api/chat/route.ts`:

```ts title="app/api/chat/route.ts"
import { openai } from "@ai-sdk/openai";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import {
  streamText,
  convertToModelMessages,
  generateId,
  stepCountIs,
  type UIMessage,
} from "ai";

const composio = new Composio({ provider: new VercelProvider() });

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const session = await composio.create("user_123");
  const tools = await session.tools();

  const result = streamText({
    model: openai("gpt-5.4"),
    system: "You are a helpful assistant. Use Composio tools to help the user.",
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => generateId(),
  });
}

```
That's the entire backend. `composio.create("user_123")` creates a session that lets the agent search for tools, authenticate users, and execute actions. This ID scopes all connections and credentials to this user. In production, use the user ID from your auth system.

# Build the chat UI

Replace `app/page.tsx`:

```tsx title="app/page.tsx"
// @noErrors
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Composio Chat</h1>

      
        {messages.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            Try: &quot;Star the composio repo on GitHub&quot;
          </p>
        )}
        {messages.map((m) => (
          
            <span className="font-semibold shrink-0">
              {m.role === "user" ? "You:" : "Agent:"}
            </span>
            
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  <span key={i}>
                    {String(part.text)
                      .split(/(https?:\/\/[^\s)]+)/g)
                      .map((segment, j) =>
                        segment.match(/^https?:\/\//) ? (
                          <a key={j} href={segment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{segment}</a>
                        ) : (
                          segment
                        )
                      )}
                  </span>
                ) : null
              )}
            
          
        ))}
        {isLoading && (
          <p className="text-gray-400 text-sm">Thinking...</p>
        )}
      

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}

```
Go to [localhost:3000](http://localhost:3000). You should see the chat interface.

# Try a tool call

Send this message:

```
Star the composio repo on GitHub
```
Here's what happens:

1. The agent searches for relevant tools, finds `GITHUB_STAR_REPO`, and checks your connection status.
2. You haven't connected GitHub yet, so the agent generates an auth link and shows it to you.
3. Click the link, authorize with GitHub, and tell the agent you're done.
4. The agent executes `GITHUB_STAR_REPO` with your credentials.

Discovery, authentication, and execution all happened automatically. You didn't write any tool-specific code.

> This in-chat authentication flow works out of the box. For production apps, you can [authenticate users ahead of time](/docs/authenticating-users/manually-authenticating) during onboarding.

# Show tool calls in the UI

Tool calls happen invisibly by default. Add a component that shows the tool name and status so you can see what the agent is doing.

Create `components/ToolCallDisplay.tsx`:

```tsx title="components/ToolCallDisplay.tsx"
"use client";

import { useState } from "react";

export function ToolCallDisplay({
  toolName,
  input,
  output,
  isLoading,
}: {
  toolName: string;
  input: unknown;
  output?: unknown;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    
      <button
        onClick={() => setExpanded(!expanded)}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors ${
          isLoading
            ? "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        {isLoading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
        ) : (
          <span className="text-green-600 dark:text-green-400">✓</span>
        )}
        <code className="font-mono">{toolName}</code>
        {!isLoading && <span className="text-gray-400">{expanded ? "▴" : "▾"}</span>}
      </button>

      {expanded && !isLoading && (
        <pre className="mt-1 ml-1 max-h-40 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md border border-gray-200 bg-gray-50 p-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          {output != null
            ? String(JSON.stringify(output, null, 2))
            : String(JSON.stringify(input, null, 2))}
        </pre>
      )}
    
  );
}

```
Update `app/page.tsx` to render tool calls:

```tsx title="app/page.tsx"
// @noErrors
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { ToolCallDisplay } from "../components/ToolCallDisplay";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Composio Chat</h1>

      
        {messages.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            Try: &quot;Star the composio repo on GitHub&quot;
          </p>
        )}
        {messages.map((m) => (
          
            <span className="font-semibold shrink-0">
              {m.role === "user" ? "You:" : "Agent:"}
            </span>
            
              {m.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <span key={i}>
                      {String(part.text)
                        .split(/(https?:\/\/[^\s)]+)/g)
                        .map((segment, j) =>
                          segment.match(/^https?:\/\//) ? (
                            <a key={j} href={segment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{segment}</a>
                          ) : (
                            segment
                          )
                        )}
                    </span>
                  );
                }
                if (isToolUIPart(part)) {
                  return (
                    
                  );
                }
                return null;
              })}
            
          
        ))}
        {isLoading && (
          <p className="text-gray-400 text-sm">Thinking...</p>
        )}
      

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}

```

Tool calls now show inline with a spinner while running and a checkmark when complete. Click to expand and see the raw output.

# How it works

The session handles tool discovery and execution at runtime. Instead of loading thousands of tool definitions into your agent's context, the agent searches for what it needs, authenticates the user if necessary, and executes the action. Token refresh and credential management are handled automatically.

Try a few more requests:

* "Summarize my emails from today"
* "What's on my calendar this week?"
* "Create a GitHub issue in my repo"

# Take it further

- [Build an App Connections Dashboard](/cookbooks/app-connections-dashboard): 
A dedicated page where users manage their app connections

- [Managing multiple connected accounts](/docs/managing-multiple-connected-accounts): 
Let users connect multiple accounts for the same toolkit

- [Configuring sessions](/docs/configuring-sessions): 
Lock down which toolkits your agent can access

- [How Composio works](/docs/how-composio-works): 
Understand sessions, tool discovery, and execution under the hood

---
