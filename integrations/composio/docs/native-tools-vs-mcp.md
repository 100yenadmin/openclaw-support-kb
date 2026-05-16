---
type: composio_doc
title: "Native Tools vs MCP"
source: "https://docs.composio.dev/docs/native-tools-vs-mcp.md"
source_hash: "6f84d23cc7a9b2c79e4321f8484975f1b86343466dc983887179edddf072b2c9"
system: "composio"
kb_namespace: "composio"
doc_path: "native-tools-vs-mcp.md"
original_doc_path: "native-tools-vs-mcp.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Native Tools vs MCP (/docs/native-tools-vs-mcp)
Source: https://docs.composio.dev/docs/native-tools-vs-mcp.md


**Native tools** give your LLM tool schemas as function definitions. Composio formats them for your specific framework (OpenAI, Anthropic, Vercel AI, etc.) through [provider packages](/docs/providers).

**MCP** exposes tools through the [Model Context Protocol](https://modelcontextprotocol.io). Any MCP-compatible client can connect to a Composio MCP server URL. No provider packages needed.

|                             | Native tools                                                  | MCP                                                                   |
| --------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Setup**                   | [Provider package](/docs/providers) for your framework        | SDK or just a URL                                                     |
| **Intercepting tool calls** | Yes, you can log, retry, or require approval before each call | Limited, depends on what the MCP client supports                      |
| **Context window**          | You control what's loaded                                     | Client loads all tools the server exposes                             |
| **Latency**                 | SDK calls Composio API directly                               | MCP protocol adds overhead for tool list discovery and each execution |

With native tools, you choose exactly which schemas enter your LLM's context. With MCP, the client pulls the full tool list from the server. A [5-server setup can consume \~55K tokens](https://www.anthropic.com/engineering/advanced-tool-use) before the conversation starts. If you're working with many tools, native tools give you more control over that cost.

# Native tools

**Python:**

```python
from composio import Composio
from composio_openai import OpenAIProvider

composio = Composio(provider=OpenAIProvider())
session = composio.create(user_id="user_123")
tools = session.tools()
# Returns meta tools (COMPOSIO_SEARCH_TOOLS, COMPOSIO_MANAGE_CONNECTIONS, etc.)
# Agent discovers and executes tools at runtime
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { OpenAIProvider } from '@composio/openai';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new OpenAIProvider(),
});
const session = await composio.create("user_123");
const tools = await session.tools();
// Returns meta tools (COMPOSIO_SEARCH_TOOLS, COMPOSIO_MANAGE_CONNECTIONS, etc.)
```

# MCP

**Python:**

```python
from composio import Composio

composio = Composio()
session = composio.create(user_id="user_123")

mcp_url = session.mcp.url
mcp_headers = session.mcp.headers
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const session = await composio.create("user_123");

const mcpUrl = session.mcp.url;
const mcpHeaders = session.mcp.headers;
```

Then pass `session.mcp.url` and `session.mcp.headers` to your framework:

**OpenAI Agents (Python):**

```python
from agents import Agent, HostedMCPTool

agent = Agent(
    name="Assistant",
    tools=[
        HostedMCPTool(
            tool_config={
                "type": "mcp",
                "server_label": "composio",
                "server_url": session.mcp.url,
                "headers": session.mcp.headers,
                "require_approval": "never",
            }
        )
    ],
)
```

**Claude Agent SDK (Python):**

```python
from claude_agent_sdk import ClaudeAgentOptions

options = ClaudeAgentOptions(
    mcp_servers={
        "composio": {
            "type": "http",
            "url": session.mcp.url,
            "headers": session.mcp.headers,
        }
    },
)
```

**Vercel AI SDK (TypeScript):**

```typescript
import { Composio } from "@composio/core";
import { createMCPClient } from "@ai-sdk/mcp";

const composio = new Composio();
const { mcp } = await composio.create("user_123");

const client = await createMCPClient({
  transport: {
    type: "http",
    url: mcp.url,
    headers: mcp.headers,
  },
});
const tools = await client.tools();
```

See the [quickstart](/docs/quickstart) for full working examples.

# Next steps

- [Quickstart](/docs/quickstart): Build an agent with sessions

- [Providers](/docs/providers): OpenAI, Anthropic, Vercel AI, LangChain

---
