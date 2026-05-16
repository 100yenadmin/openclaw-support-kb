---
type: composio_doc
title: "In-chat authentication"
source: "https://docs.composio.dev/docs/authenticating-users/in-chat-authentication.md"
source_hash: "e8f17368551daf39e0cc2a6ad11ece60a2c6ba6e7a1ee2c6651fd463a4effb64"
system: "composio"
kb_namespace: "composio"
doc_path: "authenticating-users/in-chat-authentication.md"
original_doc_path: "authenticating-users/in-chat-authentication.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# In-chat authentication (/docs/authenticating-users/in-chat-authentication)
Source: https://docs.composio.dev/docs/authenticating-users/in-chat-authentication.md


In-chat authentication lets your agent prompt users to connect accounts during chat. When a tool requires authentication, the agent returns a Connect Link URL. The user authenticates, confirms in chat, and the agent retries. For an overview of all auth approaches, see [Authentication](/docs/authentication).

# How it works

1. Agent searches for tools via the `COMPOSIO_SEARCH_TOOLS` meta-tool
2. The `COMPOSIO_MANAGE_CONNECTIONS` meta-tool checks connection status, returns Connect Link URL if needed
3. User authenticates, confirms in chat, agent continues

# Configuration

By just creating a session with default configs, you are enabling in-chat auth. The `manage_connections` parameter defaults to `True`, which includes the `COMPOSIO_MANAGE_CONNECTIONS` meta-tool automatically:

**Python:**

```python
session = composio.create(user_id="user_123")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
```

## Custom callback URL

Redirect users back to your chat page after they complete authentication:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    manage_connections={
        "callback_url": "https://yourapp.com/chat"
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  manageConnections: {
    callbackUrl: "https://yourapp.com/chat",
  },
});
```

# Examples

**Python:**

```python
from dotenv import load_dotenv
from composio import Composio
from agents import Agent, Runner, SQLiteSession
from composio_openai_agents import OpenAIAgentsProvider

load_dotenv()

# Initialize Composio with OpenAI Agents provider (API key from env var COMPOSIO_API_KEY)
composio = Composio(provider=OpenAIAgentsProvider())

# Unique identifier of the user
user_id = "user_123"

# Create a session and get native tools for the user
session = composio.create(user_id=user_id)
tools = session.tools()

# Configure OpenAI agent with Composio tools
agent = Agent(
    name="Personal Assistant",
    instructions="You are a helpful personal assistant. Use Composio tools to take action.",
    model="gpt-5.2",
    tools=tools,
)

# Memory for multi-turn conversation
memory = SQLiteSession("conversation")

print("""
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  • 'Summarize my emails from today'
  • 'List all open issues on the composio github repository'
""")

while True:
    user_input = input("You: ").strip()
    if user_input.lower() == "exit":
        break

    print("Assistant: ", end="", flush=True)
    try:
        result = Runner.run_sync(starting_agent=agent, input=user_input, session=memory)
        print(f"{result.final_output}\n")
    except Exception as e:
        print(f"\n[Error]: {e}")
```

**TypeScript:**

```typescript
import "dotenv/config";
import { Composio } from "@composio/core";
import { Agent, run, MemorySession } from "@openai/agents";
import { OpenAIAgentsProvider } from "@composio/openai-agents";
import { createInterface } from "readline/promises";

// Initialize Composio with OpenAI Agents provider (API key from env var COMPOSIO_API_KEY)
const composio = new Composio({ provider: new OpenAIAgentsProvider() });

// Unique identifier of the user
const userId = "user_123";
// Create a session for the user
const session = await composio.create(userId);
const tools = await session.tools();

const agent = new Agent({
  name: "Personal Assistant",
  instructions: "You are a helpful personal assistant. Use Composio tools to take action.",
  model: "gpt-5.2",
  tools,
});

// Set up interactive terminal input/output for the conversation
const readline = createInterface({ input: process.stdin, output: process.stdout });
// Create a memory session for persistent multi-turn conversation
const memory = new MemorySession();

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  • 'Summarize my emails from today'
  • 'List all open issues on the composio github repository and create a Google Sheet with the issues'
`);

// Multi-turn conversation with agentic tool calling
while (true) {
    const query = await readline.question("You: ");
    const input = query.trim();

    if (input.toLowerCase() === "exit") break;
    process.stdout.write("Assistant: ");

    try {
      const result = await run(agent, input, { session: memory });
      process.stdout.write(`${result.finalOutput}`);
    } catch (error) {
    console.error("\n[Error]:", error instanceof Error ? error.message : error);
    }
}
readline.close();
```

What this looks like when you run the code:

```
Assistant: What would you like me to do today? Type 'exit' to end the conversation.

> Star the composio repo on GitHub
Assistant: I need you to connect your GitHub account first.
Please click here to authorize: https://connect.composio.dev/link/ln_abc123

> Done
```

# What to read next

- [Manual authentication](/docs/authenticating-users/manually-authenticating): Pre-authenticate users before chat using Connect Links and session.authorize()

- [White-labeling authentication](/docs/white-labeling-authentication): Use your own OAuth apps so users see your branding on consent screens

- [Configuring Sessions](/docs/configuring-sessions): Restrict toolkits, set custom auth configs, and select connected accounts

---
