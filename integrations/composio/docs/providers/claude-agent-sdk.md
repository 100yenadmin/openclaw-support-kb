---
type: composio_doc
title: "Claude Agent SDK"
source: "https://docs.composio.dev/docs/providers/claude-agent-sdk.md"
source_hash: "360d80582ba25518cf0f6dae43203420ff9ab326123d68f2d9a5026dddb34d53"
doc_path: "providers/claude-agent-sdk.md"
original_doc_path: "providers/claude-agent-sdk.md"
duplicate_index: 1
---

# Claude Agent SDK (/docs/providers/claude-agent-sdk)
Source: https://docs.composio.dev/docs/providers/claude-agent-sdk.md


The Claude Agent SDK provider transforms Composio tools into tools compatible with the [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk).

> Looking for the Claude Messages API? See the [Anthropic](/docs/providers/anthropic) provider page.

**Install**

**Python:**

```bash
pip install composio composio_claude_agent_sdk claude-agent-sdk
```

**TypeScript:**

```bash
npm install @composio/core @composio/claude-agent-sdk @anthropic-ai/claude-agent-sdk
```

**Configure API Keys**

> Set `COMPOSIO_API_KEY` with your API key from [Settings](https://platform.composio.dev/?next_page=/settings) and `ANTHROPIC_API_KEY` with your [Anthropic API key](https://console.anthropic.com/settings/keys).

```txt title=".env"
COMPOSIO_API_KEY=xxxxxxxxx
ANTHROPIC_API_KEY=xxxxxxxxx
```
**Create session and run**

**Python:**

```python
import asyncio
from composio import Composio
from composio_claude_agent_sdk import ClaudeAgentSDKProvider
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, create_sdk_mcp_server

composio = Composio(provider=ClaudeAgentSDKProvider())

# Create a session for your user
session = composio.create(user_id="user_123")
tools = session.tools()
tool_server = create_sdk_mcp_server(name="composio", version="1.0.0", tools=tools)

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are a helpful assistant",
        permission_mode="bypassPermissions",
        mcp_servers={"composio": tool_server},
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'")
        async for msg in client.receive_response():
            print(msg)

asyncio.run(main())
```
**TypeScript:**

```js
import { Composio } from '@composio/core';
import { ClaudeAgentSDKProvider } from '@composio/claude-agent-sdk';
import { createSdkMcpServer, query } from '@anthropic-ai/claude-agent-sdk';

const composio = new Composio({
    provider: new ClaudeAgentSDKProvider(),
});

// Create a session for your user
const session = await composio.create("user_123");
const tools = await session.tools();
const toolServer = createSdkMcpServer({
    name: "composio",
    version: "1.0.0",
    tools: tools,
});

for await (const content of query({
    prompt: "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'",
    options: {
        mcpServers: { composio: toolServer },
        permissionMode: "bypassPermissions",
    },
})) {
    if (content.type === "assistant") {
        console.log("Claude:", content.message);
    }
}
```

---
