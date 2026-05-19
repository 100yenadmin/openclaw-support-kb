---
type: composio_doc
title: "Configuring Sessions"
source: "https://docs.composio.dev/docs/configuring-sessions.md"
source_hash: "7a24fd7209490247ce0a024f37b93651cdea8fafa03d59322cad2073f1d41c25"
system: "composio"
kb_namespace: "composio"
doc_path: "configuring-sessions.md"
original_doc_path: "configuring-sessions.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Configuring Sessions (/docs/configuring-sessions)
Source: https://docs.composio.dev/docs/configuring-sessions.md


# Creating a session

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

By default, a session has access to **all toolkits** in the Composio catalog. Your agent can discover and use any of them through `COMPOSIO_SEARCH_TOOLS`. Use the options below to restrict or customize what's available.

You can also attach local experimental custom tools and custom toolkits that run in-process alongside Composio tools. See [Custom tools and toolkits](/docs/toolkits/custom-tools-and-toolkits).

# Enabling toolkits

Restrict the session to specific toolkits:

**Python:**

```python
# Using array format
session = composio.create(
    user_id="user_123",
    toolkits=["github", "gmail", "slack"]
)

# Using object format with enable key
session = composio.create(
    user_id="user_123",
    toolkits={"enable": ["github", "gmail", "slack"]}
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// Using array format
const session = await composio.create("user_123", {
  toolkits: ["github", "gmail", "slack"],
});

// Using object format with enable key
const session2 = await composio.create("user_123", {
  toolkits: { enable: ["github", "gmail", "slack"] },
});
```

# Disabling toolkits

Keep all toolkits enabled except specific ones:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    toolkits={"disable": ["exa", "firecrawl"]}
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  toolkits: { disable: ["exa", "firecrawl"] },
});
```

# Preloading tools

By default, sessions expose [meta tools](/reference/meta-tools) that let the agent
discover app tools at runtime. Use `preload.tools` when you already know the
small set of tools that should be returned directly from `session.tools()` and
the session MCP tool list.

Preloading is useful for frequently used tools because the agent can call them
without going through search each time. Keep the preloaded set small, generally
fewer than 20 tools, to avoid context bloat.

> Requires `@composio/core` ≥ `0.9.0` (TypeScript) or `composio` ≥ `0.13.0`
(Python). Older SDKs do not support `preload.tools`,
`sessionPreset` / `session_preset`, or custom-tool `preload`.

> `preload.tools` is not supported when `multiAccount.enable` is true. See
[Managing multiple connected accounts](/docs/managing-multiple-connected-accounts).

**Python:**

```python
from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

session = composio.create(
    user_id="user_123",
    toolkits=["gmail"],
    preload={
        "tools": [
            "GMAIL_FETCH_EMAILS",
            "GMAIL_CREATE_EMAIL_DRAFT",
        ],
    },
)

tools = session.tools()
print([tool.name for tool in tools])
# GMAIL_FETCH_EMAILS
# GMAIL_CREATE_EMAIL_DRAFT
# COMPOSIO_SEARCH_TOOLS
# ... other default meta tools
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { OpenAIAgentsProvider } from '@composio/openai-agents';

const composio = new Composio({
  apiKey: 'your_api_key',
  provider: new OpenAIAgentsProvider(),
});
const session = await composio.create("user_123", {
  toolkits: ["gmail"],
  preload: {
    tools: ["GMAIL_FETCH_EMAILS", "GMAIL_CREATE_EMAIL_DRAFT"],
  },
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// GMAIL_FETCH_EMAILS
// GMAIL_CREATE_EMAIL_DRAFT
// COMPOSIO_SEARCH_TOOLS
// ... other default meta tools
```

For SDK custom tools, set `preload: true` on the custom tool or custom toolkit. See
[Preloading custom tools](/docs/toolkits/custom-tools-and-toolkits#preloading-custom-tools).

Use the `preload.tools = "all"` shortcut (`preload={"tools": "all"}` in Python,
`preload: { tools: "all" }` in TypeScript) to preload every tool allowed by the
session filters. The `all` shorthand works for both Composio tools and SDK
custom tools.

# Direct tools preset

The direct tools preset preloads every tool allowed by session filters into the
session's tool list and disables session meta tools by default. This can be
useful for specialized agents with a narrow tool set that do not need dynamic
tool discovery, in-chat auth, or workbench helpers.

This is not the default mode for broad agents. The default session behavior keeps
meta tools available so the agent can search for relevant tools and avoid
context bloat.

**Python:**

```python
from composio import Composio, SESSION_PRESET_DIRECT_TOOLS
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

session = composio.create(
    user_id="user_123",
    toolkits=["gmail"],
    tools={
        "gmail": {
            "enable": [
                "GMAIL_FETCH_EMAILS",
                "GMAIL_CREATE_EMAIL_DRAFT",
            ],
        },
    },
    session_preset=SESSION_PRESET_DIRECT_TOOLS,
)

tools = session.tools()
print([tool.name for tool in tools])
# GMAIL_FETCH_EMAILS
# GMAIL_CREATE_EMAIL_DRAFT
```

**TypeScript:**

```typescript
import { Composio, SessionPreset } from '@composio/core';
import { OpenAIAgentsProvider } from '@composio/openai-agents';

const composio = new Composio({
  apiKey: 'your_api_key',
  provider: new OpenAIAgentsProvider(),
});
const session = await composio.create("user_123", {
  toolkits: ["gmail"],
  tools: {
    gmail: {
      enable: ["GMAIL_FETCH_EMAILS", "GMAIL_CREATE_EMAIL_DRAFT"],
    },
  },
  sessionPreset: SessionPreset.DIRECT_TOOLS,
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// GMAIL_FETCH_EMAILS
// GMAIL_CREATE_EMAIL_DRAFT
```

**Enable selected meta tools**

When using the direct tools preset, you can selectively re-enable supported meta
tool groups that your agent still needs. For example, this session loads Gmail
reply-drafting tools upfront while keeping connection management and workbench
support available:

**Python:**

```python
from composio import Composio, SESSION_PRESET_DIRECT_TOOLS
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

session = composio.create(
    user_id="user_123",
    toolkits=["gmail"],
    tools={
        "gmail": {
            "enable": [
                "GMAIL_FETCH_EMAILS",
                "GMAIL_CREATE_EMAIL_DRAFT",
            ],
        },
    },
    session_preset=SESSION_PRESET_DIRECT_TOOLS,
    manage_connections={
        "enable": True,
    },
    workbench={
        "enable": True,
    },
)

tools = session.tools()
print([tool.name for tool in tools])
# GMAIL_FETCH_EMAILS
# GMAIL_CREATE_EMAIL_DRAFT
# COMPOSIO_MANAGE_CONNECTIONS
# COMPOSIO_REMOTE_WORKBENCH
# COMPOSIO_REMOTE_BASH_TOOL
```

**TypeScript:**

```typescript
import { Composio, SessionPreset } from '@composio/core';
import { OpenAIAgentsProvider } from '@composio/openai-agents';

const composio = new Composio({
  apiKey: 'your_api_key',
  provider: new OpenAIAgentsProvider(),
});
const session = await composio.create("user_123", {
  toolkits: ["gmail"],
  tools: {
    gmail: {
      enable: ["GMAIL_FETCH_EMAILS", "GMAIL_CREATE_EMAIL_DRAFT"],
    },
  },
  sessionPreset: SessionPreset.DIRECT_TOOLS,
  manageConnections: {
    enable: true,
  },
  workbench: {
    enable: true,
  },
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// GMAIL_FETCH_EMAILS
// GMAIL_CREATE_EMAIL_DRAFT
// COMPOSIO_MANAGE_CONNECTIONS
// COMPOSIO_REMOTE_WORKBENCH
// COMPOSIO_REMOTE_BASH_TOOL
```

# Custom auth configs

Use your own OAuth credentials instead of Composio's defaults:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        "slack": "ac_your_slack_config"
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  authConfigs: {
    github: "ac_your_github_config",
    slack: "ac_your_slack_config",
  },
});
```

See [White-labeling authentication](/docs/white-labeling-authentication) for branding, or [Managed vs custom auth](/docs/custom-app-vs-managed-app) for toolkits that require your own credentials.

# Account selection

If a user has multiple connected accounts for the same toolkit, you can specify which one to use:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    connected_accounts={
        "gmail": ["ca_work_gmail"],
        "github": ["ca_personal_github"],
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  connectedAccounts: {
    gmail: ["ca_work_gmail"],
    github: ["ca_personal_github"],
  },
});
```

> Arrays are the preferred format for `connectedAccounts`. A single string (e.g. `"ca_work_gmail"`) is still accepted for backwards compatibility and is automatically coerced to a single-element array. Only one account per toolkit is allowed when [multi-account mode](/docs/managing-multiple-connected-accounts) is disabled.

## Precedence

When executing a tool, the connected account is selected in this order:

1. `connectedAccounts` override if provided in session config
2. `authConfigs` override - finds or creates connection on that config
3. Auth config previously created for this toolkit
4. Creates new auth config using Composio managed auth
5. Error if no Composio managed auth scheme exists for the toolkit

If a user has multiple connected accounts for a toolkit, the most recently connected one is used.

# Disabling workbench

By default, sessions include the [workbench](/docs/workbench) — a persistent sandbox that provides `COMPOSIO_REMOTE_WORKBENCH` and `COMPOSIO_REMOTE_BASH_TOOL`. If your use case doesn't need code execution, you can disable it:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    workbench={
        "enable": False
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  workbench: {
    enable: false,
  },
});
```

When disabled:

* `COMPOSIO_REMOTE_WORKBENCH` and `COMPOSIO_REMOTE_BASH_TOOL` are excluded from the session
* Workbench-related system prompt lines are stripped
* Direct workbench calls are rejected with a 400 error

# Sandbox compute tier

The workbench runs in a per-session sandbox. You can pick a compute tier to match the workload — heavier code execution or larger in-memory data benefits from a bigger sandbox. The tier is passed via `workbench.sandbox_size` (snake\_case on the wire; `sandboxSize` in the TypeScript SDK).

> Requires `@composio/core` ≥ `0.8.1` (TypeScript) or `composio` ≥ `0.12.1` (Python). Older SDKs reject `sandboxSize` (TypeScript) or silently drop `sandbox_size` (Python). See the [release notes](/docs/changelog/2026/04/28).

| Tier       | vCPU | RAM  |
| ---------- | ---- | ---- |
| `standard` | 1    | 1 GB |
| `medium`   | 2    | 2 GB |
| `large`    | 4    | 4 GB |
| `xlarge`   | 8    | 8 GB |

Defaults to `standard` when omitted.

**Python:**

```python
session = composio.create(
    user_id="user_123",
    workbench={
        "sandbox_size": "large",
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  workbench: {
    enable: true,
    sandboxSize: "large",
  },
});
```

> **Pricing:** Sandboxes are not billed today. Composio plans to begin billing for sandbox usage soon (metered by tier and runtime). Pick a tier that matches your workload — but expect future pricing to track actual usage.

Changing `sandbox_size` on an existing session recreates the sandbox on next access. The sandbox's in-memory filesystem state is lost, but the persistent `/mnt/files/` mount survives the restart.

# Session methods

## mcp

Get the MCP server URL to use with any MCP-compatible client.

**Python:**

```python
mcp_url = session.mcp.url
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const { mcp } = session;
console.log(mcp.url);
```

For framework examples, see provider-specific documentation like [OpenAI](/docs/providers/openai) or [Vercel AI SDK](/docs/providers/vercel).

## tools()

Get native tools from the session for use with AI frameworks.

**Python:**

```python
tools = session.tools()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const tools = await session.tools();
```

## authorize()

Manually authenticate a user to a toolkit outside of the chat flow.

**Python:**

```python
connection_request = session.authorize("github")

print(connection_request.redirect_url)

connected_account = connection_request.wait_for_connection()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const connectionRequest = await session.authorize("github", {
  callbackUrl: "https://myapp.com/callback",
});

console.log(connectionRequest.redirectUrl);

const connectedAccount = await connectionRequest.waitForConnection();
```

For more details, see [Manually authenticating users](/docs/authenticating-users/manually-authenticating).

## toolkits()

List available toolkits and their connection status. You can use this to build a UI showing which apps are connected.

**Python:**

```python
toolkits = session.toolkits()

for toolkit in toolkits.items:
    status = toolkit.connection.connected_account.id if toolkit.connection.is_active else "Not connected"
    print(f"{toolkit.name}: {status}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const toolkits = await session.toolkits();

toolkits.items.forEach((toolkit) => {
  console.log(`${toolkit.name}: ${toolkit.connection?.connectedAccount?.id ?? "Not connected"}`);
});
```

Returns the first 20 toolkits by default.

# What to read next

- [Tools and toolkits](/docs/tools-and-toolkits): Understand the meta tools and toolkit catalog behind session tools

- [Enable & disable toolkits](/docs/toolkits/enable-and-disable-toolkits): Control which toolkits and individual tools are available in sessions

- [Workbench](/docs/workbench): Configure the sandbox for bulk operations and data processing

- [In-chat authentication](/docs/authenticating-users/in-chat-authentication): Let the agent prompt users to connect accounts during conversation

---
