---
type: composio_doc
title: "Configuring Sessions"
source: "https://docs.composio.dev/docs/configuring-sessions.md"
source_hash: "92665ff9a684d681b9da0ef81ea2de7ca14d8bd3cdf6cdcfb38f1a1ce87dbe60"
doc_path: "configuring-sessions.md"
original_doc_path: "configuring-sessions.md"
duplicate_index: 1
---

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

For TypeScript sessions, you can also attach local experimental custom tools and custom toolkits that run in-process with Composio tools. See [Custom tools and toolkits](/docs/toolkits/custom-tools-and-toolkits).

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

See [White-labeling authentication](/docs/white-labeling-authentication) for branding, or [Using custom auth configs](/docs/using-custom-auth-configuration) for toolkits that require your own credentials.

# Account selection

If a user has multiple connected accounts for the same toolkit, you can specify which one to use:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    connected_accounts={
        "gmail": "ca_work_gmail",
        "github": "ca_personal_github"
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  connectedAccounts: {
    gmail: "ca_work_gmail",
    github: "ca_personal_github",
  },
});
```

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

For framework examples, see provider-specific documentation like [OpenAI Agents](/docs/providers/openai-agents) or [Vercel AI SDK](/docs/providers/vercel).

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

- [In-chat authentication](/docs/authenticating-users/in-chat-authentication): Let the agent prompt users to connect accounts during conversation

- [Manual authentication](/docs/authenticating-users/manually-authenticating): Pre-authenticate users before chat using Connect Links and session.authorize()

- [Enable & disable toolkits](/docs/toolkits/enable-and-disable-toolkits): Control which toolkits and individual tools are available in sessions

- [White-labeling authentication](/docs/white-labeling-authentication): Use your own OAuth apps so users see your branding on consent screens

---
