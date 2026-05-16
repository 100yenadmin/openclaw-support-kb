---
type: composio_doc
title: "Quickstart"
source: "https://docs.composio.dev/docs/quickstart.md"
source_hash: "aaf45806b5cd02e22d6dae2e76e8971115d082fa913129640784511c5c6edc56"
system: "composio"
kb_namespace: "composio"
doc_path: "quickstart.md"
original_doc_path: "quickstart.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Quickstart (/docs/quickstart)
Source: https://docs.composio.dev/docs/quickstart.md


Build your first AI agent with Composio Tools. You'll create a [session](/docs/users-and-sessions) for a user, give your agent access to [tools](/docs/tools-and-toolkits), and let it take action across 1000+ apps.

> If you are an AI agent setting up Composio for yourself, you can [sign up as an agent](/docs/signing-up-as-an-agent) without a human-created account first.

## OpenAI Agents

> Choose your integration type · [Use this guide to decide](/docs/native-tools-vs-mcp)

### Native Tools

#### Install

**Python:**

```bash
pip install python-dotenv composio composio-openai-agents openai-agents
```

**TypeScript:**

```bash
npm install @composio/core @composio/openai-agents @openai/agents
```

#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `OPENAI_API_KEY` from [OpenAI](https://platform.openai.com/api-keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
#### Create session and run agent

**Python:**

```python
from dotenv import load_dotenv
from composio import Composio
from agents import Agent, Runner, SQLiteSession
from composio_openai_agents import OpenAIAgentsProvider

load_dotenv()

# Initialize Composio with OpenAI Agents provider
composio = Composio(provider=OpenAIAgentsProvider())

# Create a session for your user
user_id = "user_123"
session = composio.create(user_id=user_id)
tools = session.tools()

# For multi-turn, store the session ID in your db and reuse instead of calling create() again:
# session_id = session.session_id
# session = composio.use(session_id)

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
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
""")

while True:
    user_input = input("You: ").strip()
    if user_input.lower() == "exit":
        break

    print("Assistant: ", end="", flush=True)
    result = Runner.run_sync(starting_agent=agent, input=user_input, session=memory)
    print(f"{result.final_output}\n")
```
**TypeScript:**

```typescript
import "dotenv/config";
import { Composio } from "@composio/core";
import { Agent, run, MemorySession } from "@openai/agents";
import { OpenAIAgentsProvider } from "@composio/openai-agents";
import { createInterface } from "readline/promises";

// Initialize Composio with OpenAI Agents provider
const composio = new Composio({ provider: new OpenAIAgentsProvider() });

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);
const tools = await session.tools();

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const agent = new Agent({
  name: "Personal Assistant",
  instructions: "You are a helpful personal assistant. Use Composio tools to take action.",
  model: "gpt-5.2",
  tools,
});

const memory = new MemorySession();
const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
`);

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  process.stdout.write("Assistant: ");
  const result = await run(agent, input, { session: memory });
  process.stdout.write(`${result.finalOutput}\n`);
}
readline.close();
```
### MCP

#### Install

**Python:**

```bash
pip install python-dotenv composio openai-agents
```
**TypeScript:**

```bash
npm install dotenv @composio/core @openai/agents zod@3
```
#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `OPENAI_API_KEY` from [OpenAI](https://platform.openai.com/api-keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
#### Create session and run agent

**Python:**

```python
from dotenv import load_dotenv
from composio import Composio
from agents import Agent, Runner, HostedMCPTool, SQLiteSession

load_dotenv()

# Initialize Composio
composio = Composio()

# Create a session for your user
user_id = "user_123"
session = composio.create(user_id=user_id)

# For multi-turn, store the session ID in your db and reuse instead of calling create() again:
# session_id = session.session_id
# session = composio.use(session_id)

agent = Agent(
    name="Personal Assistant",
    instructions="You are a helpful personal assistant. Use Composio tools to take action.",
    model="gpt-5.2",
    tools=[
        HostedMCPTool(
            tool_config={
                "type": "mcp",
                "server_label": "composio",
                "server_url": session.mcp.url,
                "require_approval": "never",
                "headers": session.mcp.headers,
            }
        )
    ],
)

memory = SQLiteSession(user_id)

print("""
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
""")

while True:
    user_input = input("You: ").strip()
    if user_input.lower() == "exit":
        break

    print("Assistant: ", end="", flush=True)
    result = Runner.run_sync(starting_agent=agent, input=user_input, session=memory)
    print(f"{result.final_output}\n")
```
**TypeScript:**

```typescript
import "dotenv/config";
import { Composio } from "@composio/core";
import { Agent, run, hostedMcpTool, MemorySession } from "@openai/agents";
import { createInterface } from "readline/promises";

// Initialize Composio
const composio = new Composio();

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const agent = new Agent({
  name: "Personal Assistant",
  instructions: "You are a helpful personal assistant. Use Composio tools to take action.",
  model: "gpt-5.2",
  tools: [
    hostedMcpTool({
      serverLabel: "composio",
      serverUrl: session.mcp.url,
      headers: session.mcp.headers,
    }),
  ],
});

const memory = new MemorySession();
const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
`);

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  process.stdout.write("Assistant: ");
  const result = await run(agent, input, { session: memory });
  process.stdout.write(`${result.finalOutput}\n`);
}
readline.close();
```
## Claude Agent SDK

> Choose your integration type · [Use this guide to decide](/docs/native-tools-vs-mcp)

### Native Tools

#### Install

**Python:**

```bash
pip install python-dotenv composio composio-claude-agent-sdk claude-agent-sdk
```
**TypeScript:**

```bash
npm install dotenv @composio/core @composio/claude-agent-sdk @anthropic-ai/claude-agent-sdk
```
#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `ANTHROPIC_API_KEY` from [Anthropic](https://console.anthropic.com/settings/keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
#### Create session and run agent

**Python:**

```python
import asyncio
from dotenv import load_dotenv
from composio import Composio
from composio_claude_agent_sdk import ClaudeAgentSDKProvider
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, create_sdk_mcp_server, AssistantMessage, TextBlock

load_dotenv()

# Initialize Composio with Claude Agent SDK provider
composio = Composio(provider=ClaudeAgentSDKProvider())

# Create a session for your user
user_id = "user_123"
session = composio.create(user_id=user_id)
tools = session.tools()

# For multi-turn, store the session ID in your db and reuse instead of calling create() again:
# session_id = session.session_id
# session = composio.use(session_id)

custom_server = create_sdk_mcp_server(name="composio", version="1.0.0", tools=tools)

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are a helpful assistant. Use tools to complete tasks.",
        permission_mode="bypassPermissions",
        mcp_servers={"composio": custom_server},
    )

    async with ClaudeSDKClient(options=options) as client:
        print("""
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
""")

        while True:
            user_input = input("You: ").strip()
            if user_input.lower() == "exit":
                break

            await client.query(user_input)
            print("Claude: ", end="", flush=True)
            async for message in client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="", flush=True)
            print()

asyncio.run(main())
```
**TypeScript:**

```typescript
import "dotenv/config";
import { Composio } from "@composio/core";
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";
import { createInterface } from "readline/promises";

// Initialize Composio with Claude Agent SDK provider
const composio = new Composio({ provider: new ClaudeAgentSDKProvider() });

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);
const tools = await session.tools();

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const customServer = createSdkMcpServer({
  name: "composio",
  version: "1.0.0",
  tools: tools,
});

const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository and create a Google Sheet with the issues'
`);

let isFirstQuery = true;
const options = {
  mcpServers: { composio: customServer },
  permissionMode: "bypassPermissions" as const,
};

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  const queryOptions = isFirstQuery ? options : { ...options, continue: true };
  isFirstQuery = false;

  process.stdout.write("Claude: ");
  for await (const stream of query({ prompt: input, options: queryOptions })) {
    if (stream.type === "assistant") {
      for (const block of stream.message.content) {
        if (block.type === "text") {
          process.stdout.write(block.text);
        }
      }
    }
  }
  console.log();
}

readline.close();
```
### MCP

#### Install

**Python:**

```bash
pip install python-dotenv composio claude-agent-sdk
```
**TypeScript:**

```bash
npm install dotenv @composio/core @anthropic-ai/claude-agent-sdk
```
#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `ANTHROPIC_API_KEY` from [Anthropic](https://console.anthropic.com/settings/keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
#### Create session and run agent

**Python:**

```python
import asyncio
from dotenv import load_dotenv
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock, ToolUseBlock
from composio import Composio

load_dotenv()

# Initialize Composio
composio = Composio()

# Create a session for your user
user_id = "user_123"
session = composio.create(user_id=user_id)

# For multi-turn, store the session ID in your db and reuse instead of calling create() again:
# session_id = session.session_id
# session = composio.use(session_id)

options = ClaudeAgentOptions(
    system_prompt=(
        "You are a helpful assistant with access to external tools. "
        "Always use the available tools to complete user requests."
    ),
    mcp_servers={
        "composio": {
            "type": "http",
            "url": session.mcp.url,
            "headers": session.mcp.headers,
        }
    },
    permission_mode="bypassPermissions",
)

async def main():
    print("""
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository and create a notion page with the issues'
""")

    async with ClaudeSDKClient(options) as client:
        while True:
            user_input = input("You: ").strip()
            if user_input.lower() == "exit":
                break

            await client.query(user_input)
            print("Claude: ", end="", flush=True)
            async for msg in client.receive_response():
                if isinstance(msg, AssistantMessage):
                    for block in msg.content:
                        if isinstance(block, ToolUseBlock):
                            print(f"\n  [Using tool: {block.name}]")
                        elif isinstance(block, TextBlock):
                            print(block.text, end="", flush=True)
            print()

asyncio.run(main())
```
**TypeScript:**

```typescript
import "dotenv/config";
import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import { Composio } from "@composio/core";
import { createInterface } from "readline/promises";

// Initialize Composio
const composio = new Composio();

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const options: Options = {
  systemPrompt: `You are a helpful assistant with access to external tools. ` +
    `Always use the available tools to complete user requests.`,
  mcpServers: {
    composio: {
      type: "http",
      url: session.mcp.url,
      headers: session.mcp.headers,
    },
  },
  permissionMode: "bypassPermissions",
};

const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository and create a Google Sheet with the issues'
`);

let isFirstQuery = true;

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  const queryOptions = isFirstQuery ? options : { ...options, continue: true };
  isFirstQuery = false;

  process.stdout.write("Claude: ");
  for await (const stream of query({ prompt: input, options: queryOptions })) {
    if (stream.type === "assistant") {
      for (const block of stream.message.content) {
        if (block.type === "tool_use") {
          process.stdout.write(`\n  [Using tool: ${block.name}]\n`);
        } else if (block.type === "text") {
          process.stdout.write(block.text);
        }
      }
    }
  }
  console.log();
}

readline.close();
```
## Vercel AI SDK

> Choose your integration type · [Use this guide to decide](/docs/native-tools-vs-mcp)

### Native Tools

#### Install

```bash
npm install @composio/core @composio/vercel ai @ai-sdk/anthropic
```
#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `ANTHROPIC_API_KEY` from [Anthropic](https://console.anthropic.com/settings/keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
#### Create session and run agent

```typescript
import "dotenv/config";
import { anthropic } from "@ai-sdk/anthropic";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import { streamText, stepCountIs, type ModelMessage } from "ai";
import { createInterface } from "readline/promises";

// Initialize Composio with Vercel provider
const composio = new Composio({ provider: new VercelProvider() });

// Create a session for your user
const userId = "user_123";
const session = await composio.create(userId);
const tools = await session.tools();

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = session.sessionId;
// const session = await composio.use(sessionId);

const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
`);

const messages: ModelMessage[] = [];

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  messages.push({ role: "user", content: input });
  process.stdout.write("Assistant: ");

  const result = await streamText({
    system: "You are a helpful personal assistant. Use Composio tools to take action.",
    model: anthropic("claude-sonnet-4-6"),
    messages,
    stopWhen: stepCountIs(10),
    onStepFinish: (step) => {
      for (const toolCall of step.toolCalls) {
        process.stdout.write(`\n[Using tool: ${toolCall.toolName}]`);
      }
    },
    tools,
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  console.log();

  messages.push(...(await result.response).messages);
}

readline.close();
```
### MCP

#### Install

```bash
npm install dotenv @composio/core ai @ai-sdk/anthropic @ai-sdk/mcp
```
#### Configure API Keys

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `ANTHROPIC_API_KEY` from [Anthropic](https://console.anthropic.com/settings/keys).

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```
#### Create session and run agent

```typescript
import "dotenv/config";
import { anthropic } from "@ai-sdk/anthropic";
import { createMCPClient } from "@ai-sdk/mcp";
import { Composio } from "@composio/core";
import { streamText, stepCountIs, type ModelMessage } from "ai";
import { createInterface } from "readline/promises";

// Initialize Composio
const composio = new Composio();

// Create a session for your user
const userId = "user_123";
const composioSession = await composio.create(userId);
const { mcp } = composioSession;

// For multi-turn, store the session ID in your db and reuse instead of calling create() again:
// const sessionId = composioSession.sessionId;
// const composioSession = await composio.use(sessionId);

// Create an MCP client to connect to Composio
const client = await createMCPClient({
  transport: {
    type: "http",
    url: mcp.url,
    headers: mcp.headers,
  },
});
const tools = await client.tools();

const readline = createInterface({ input: process.stdin, output: process.stdout });

console.log(`
What task would you like me to help you with?
I can use tools like Gmail, GitHub, Linear, Notion, and more.
(Type 'exit' to exit)
Example tasks:
  - 'Summarize my emails from today'
  - 'List all open issues on the composio github repository'
`);

const messages: ModelMessage[] = [];

while (true) {
  const input = (await readline.question("You: ")).trim();
  if (input.toLowerCase() === "exit") break;

  messages.push({ role: "user", content: input });
  process.stdout.write("Assistant: ");

  const result = await streamText({
    system: "You are a helpful personal assistant. Use Composio tools to take action.",
    model: anthropic("claude-sonnet-4-6"),
    messages,
    stopWhen: stepCountIs(10),
    onStepFinish: (step) => {
      for (const toolCall of step.toolCalls) {
        process.stdout.write(`\n[Using tool: ${toolCall.toolName}]`);
      }
    },
    tools,
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  console.log();

  messages.push(...(await result.response).messages);
}

await client.close();
readline.close();
```

> By default, sessions have access to **all available toolkits** in the Composio catalog. Your agent can discover and use any of them through `COMPOSIO_SEARCH_TOOLS`. To restrict which toolkits are available, see [Enable and disable toolkits](/docs/toolkits/enable-and-disable-toolkits).

> Every `composio.create()` call returns a new session ID. For multi-turn conversations or web apps, store the session ID and call `composio.use(sessionId)` on subsequent requests instead of creating a new session each time. See [Reusing a session](/docs/users-and-sessions#reusing-a-session).

# Next steps

- [Configuring Sessions](/docs/configuring-sessions): Restrict toolkits, set custom auth configs, and select connected accounts

- [Authenticating Users](/docs/authentication): Learn how users connect their accounts via Connect Links, OAuth, and API keys

- [How Composio works](/docs/how-composio-works): Understand what happens under the hood: sessions, meta tools, and the tool execution lifecycle

- [Build a chat app](/cookbooks/chat-app): Full Next.js tutorial: tool discovery, auth, and multi-turn conversations

---
