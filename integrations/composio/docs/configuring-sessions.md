---
type: composio_doc
title: "Configuring Sessions"
source: "https://docs.composio.dev/docs/configuring-sessions.md"
source_hash: "02a0079521325fa0a690f22fb5d50e2e3bf480e508c64d9fb135eb18fda66367"
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


# Creating a session [#creating-a-session]

**Python:**

```python
session = composio.sessions.create(user_id="user_123")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
```

By default, a session has access to every toolkit in the Composio catalog. Your agent can discover and use any of them through `COMPOSIO_SEARCH_TOOLS`. Use the options below to restrict or customize what's available.

You can also attach local custom tools and custom toolkits that run in-process alongside Composio tools. See [Custom tools and toolkits](/docs/extending-sessions/custom-tools-and-toolkits).

# Enabling toolkits [#enabling-toolkits]

To limit a session to specific toolkits, pass an array of toolkit slugs. The agent can only discover and use tools from these toolkits.

**Python:**

```python
# Using array format
session = composio.sessions.create(
    user_id="user_123",
    toolkits=["github", "gmail", "slack"]
)

# Using object format with enable key
session = composio.sessions.create(
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

# Disabling toolkits [#disabling-toolkits]

To keep every toolkit discoverable except a few, use the `disable` syntax. This is useful when you want broad access but need to exclude specific toolkits.

**Python:**

```python
session = composio.sessions.create(
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

# Direct tools preset [#direct-tools-preset]

The direct tools preset preloads every tool allowed by session filters into the session's tool list and disables session meta tools by default. Use it for specialized agents with a narrow tool set that don't need dynamic tool discovery, in-chat auth, or workbench helpers.

This is not the default mode for broad agents. The default session behavior keeps meta tools available so the agent can search for relevant tools and avoid context bloat.

**Python:**

```python
from composio import Composio, SESSION_PRESET_DIRECT_TOOLS
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

session = composio.sessions.create(
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

## Enable selected meta tools [#enable-selected-meta-tools]

With the direct tools preset, you can re-enable supported meta tool groups that your agent still needs. This session loads Gmail tools upfront while keeping connection management and workbench support available:

**Python:**

```python
from composio import Composio, SESSION_PRESET_DIRECT_TOOLS
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

session = composio.sessions.create(
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
    sandbox={
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
  sandbox: {
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

# Enabling or disabling specific tools [#enabling-or-disabling-specific-tools]

To control which individual tools are available within a toolkit, use the `tools` configuration. The key is the toolkit slug and the value specifies which tools to enable or disable.

To enable only specific tools, pass an `enable` list per toolkit:

**Python:**

```python
session = composio.sessions.create(
    user_id="user_123",
    tools={
        # Only these Gmail tools will be available
        "gmail": {"enable": ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"]},
        # Only issue-related GitHub tools
        "github": {"enable": ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]}
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  tools: {
    // Only these Gmail tools will be available
    gmail: { enable: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"] },
    // Only issue-related GitHub tools
    github: { enable: ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"] }
  }
});
```

The shorthand array syntax is equivalent to `enable`:

**Python:**

```python
session = composio.sessions.create(
    user_id="user_123",
    tools={
        "gmail": ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"],
        "github": ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  tools: {
    gmail: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"],
    github: ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]
  }
});
```

To keep every tool in a toolkit except a few, use `disable`:

**Python:**

```python
session = composio.sessions.create(
    user_id="user_123",
    tools={
        # All Slack tools except delete
        "slack": {"disable": ["SLACK_DELETE_MESSAGE"]},
        # All GitHub tools except destructive ones
        "github": {"disable": ["GITHUB_DELETE_REPO", "GITHUB_DELETE_BRANCH"]}
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  tools: {
    // All Slack tools except delete
    slack: { disable: ["SLACK_DELETE_MESSAGE"] },
    // All GitHub tools except destructive ones
    github: { disable: ["GITHUB_DELETE_REPO", "GITHUB_DELETE_BRANCH"] }
  }
});
```

# Filtering tools by tags [#filtering-tools-by-tags]

Tools carry behavior tags that you can filter on. The available tags are:

| Tag               | Description                                 |
| ----------------- | ------------------------------------------- |
| `readOnlyHint`    | Tools that only read data                   |
| `destructiveHint` | Tools that modify or delete data            |
| `idempotentHint`  | Tools that can be safely retried            |
| `openWorldHint`   | Tools that operate in an open world context |

To apply tag filters across all toolkits, pass `tags` at the session level:

**Python:**

```python
# Only include read-only and idempotent tools
session = composio.sessions.create(
    user_id="user_123",
    tags=["readOnlyHint", "idempotentHint"]
)

# Enable some tags, disable others
session = composio.sessions.create(
    user_id="user_123",
    tags={
        "enable": ["readOnlyHint"],
        "disable": ["destructiveHint"]
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// Only include read-only and idempotent tools
const session = await composio.create("user_123", {
  tags: ["readOnlyHint", "idempotentHint"]
});

// Enable some tags, disable others
const sessionWithTagConfig = await composio.create("user_123", {
  tags: {
    enable: ["readOnlyHint"],
    disable: ["destructiveHint"]
  }
});
```

To override the global tags for a specific toolkit, set `tags` inside that toolkit's `tools` config:

**Python:**

```python
session = composio.sessions.create(
    user_id="user_123",
    # Global: only read-only tools
    tags=["readOnlyHint"],
    tools={
        # Override for GitHub: allow all tools except destructive
        "github": {"tags": {"disable": ["destructiveHint"]}},
        # Override for Gmail: only read-only tools (explicit)
        "gmail": {"tags": ["readOnlyHint"]}
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  // Global: only read-only tools
  tags: ["readOnlyHint"],
  tools: {
    // Override for GitHub: allow all tools except destructive
    github: { tags: { disable: ["destructiveHint"] } },
    // Override for Gmail: only read-only tools (explicit)
    gmail: { tags: ["readOnlyHint"] }
  }
});
```

# Preloading tools [#preloading-tools]

Return a known set of tools directly from `session.tools()` and the session MCP tool list, without the agent searching for them first.

By default, sessions expose [meta tools](/toolkits/meta-tools) that let the agent discover app tools at runtime. Use `preload.tools` when you already know which tools the agent needs, so it can call them without going through search each time.

Keep the preloaded set small, generally fewer than 20 tools, to avoid context bloat.

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

session = composio.sessions.create(
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

For SDK custom tools, set `preload: true` on the custom tool or custom toolkit. See [Preloading custom tools](/docs/extending-sessions/custom-tools-and-toolkits#preloading-custom-tools).

To preload every tool allowed by the session filters, use the `preload.tools = "all"` shortcut (`preload={"tools": "all"}` in Python, `preload: { tools: "all" }` in TypeScript). The `all` shorthand works for both Composio tools and SDK custom tools.

# Custom auth configs [#custom-auth-configs]

Use your own OAuth credentials instead of Composio's defaults. Pass an auth config ID per toolkit:

**Python:**

```python
session = composio.sessions.create(
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

# Account selection [#account-selection]

When a user has multiple connected accounts for the same toolkit, specify which one the session uses:

**Python:**

```python
session = composio.sessions.create(
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

## Precedence [#precedence]

When executing a tool, the session selects the connected account in this order:

1. The `connectedAccounts` override, if provided in the session config.
2. The `authConfigs` override, which finds or creates a connection on that config.
3. An auth config previously created for this toolkit.
4. A new auth config created using Composio managed auth.
5. Otherwise, an error if no Composio managed auth scheme exists for the toolkit.

When a user has multiple connected accounts for a toolkit, the session uses the most recently connected one.

# Disabling the sandbox [#disabling-the-sandbox]

By default, sessions include the [sandbox](/docs/sandbox/remote), a persistent environment that provides `COMPOSIO_REMOTE_WORKBENCH` and `COMPOSIO_REMOTE_BASH_TOOL`. If your use case doesn't need code execution, disable it:

**Python:**

```python
session = composio.sessions.create(
    user_id="user_123",
    sandbox={
        "enable": False
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  sandbox: {
    enable: false,
  },
});
```

When disabled:

* `COMPOSIO_REMOTE_WORKBENCH` and `COMPOSIO_REMOTE_BASH_TOOL` are excluded from the session
* Sandbox-related system prompt lines are stripped
* Direct sandbox calls are rejected with a 400 error

> `sandbox` is the preferred config key. `workbench` still works as a fully supported alias and isn't deprecated, so existing code keeps running unchanged.

# Sandbox compute tier [#sandbox-compute-tier]

The sandbox runs per session. Pick a compute tier to match the workload: heavier code execution or larger in-memory data benefits from a bigger sandbox. Pass the tier via `sandbox.sandbox_size` (snake\_case on the wire, `sandboxSize` in the TypeScript SDK).

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
session = composio.sessions.create(
    user_id="user_123",
    sandbox={
        "sandbox_size": "large",
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  sandbox: {
    enable: true,
    sandboxSize: "large",
  },
});
```

> **Pricing:** Sandboxes are not billed today. Composio plans to begin billing for sandbox usage soon (metered by tier and runtime). Pick a tier that matches your workload, but expect future pricing to track actual usage.

Changing `sandbox_size` on an existing session recreates the sandbox on the next access. The sandbox's in-memory filesystem state is lost, but the persistent [`/mnt/files/` mount](/docs/sandbox/remote#files-and-mounts) survives the restart.

# Session methods [#session-methods]

For framework examples, see provider-specific documentation like [OpenAI](/docs/providers/openai) or [Vercel AI SDK](/docs/providers/vercel). To connect over MCP instead, see [Using sessions via MCP](/docs/sessions-via-mcp).

## tools() [#tools]

Get the tools the session exposes for your AI framework. By default these are the session's [meta tools](/toolkits/meta-tools), formatted for your configured provider.

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

## authorize() [#authorize]

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

For more details, see [Manually authenticating users](/docs/manually-authenticating).

## toolkits() [#toolkits]

List the toolkits enabled for the session and their connection status, sorted by popularity. Use it to build a UI showing which apps are connected. Each toolkit includes its `slug`, `name`, `logo`, and connection status, and the call returns the first 20 by default.

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

Filter to only connected toolkits:

**Python:**

```python
connected = session.toolkits(is_connected=True)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const connected = await session.toolkits({ isConnected: true });
```

Paginate through every toolkit with `limit` and the returned cursor:

**Python:**

```python
all_toolkits = []
cursor = None

while True:
    result = session.toolkits(limit=20, next_cursor=cursor)
    all_toolkits.extend(result.items)
    cursor = result.next_cursor
    if not cursor:
        break
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const allToolkits: any[] = [];
let cursor: string | undefined;

do {
  const { items, cursor: nextCursor } = await session.toolkits({ limit: 20, cursor });
  allToolkits.push(...items);
  cursor = nextCursor;
} while (cursor);
```

## delete() [#delete]

Delete a session when you're done with it. Deleted sessions immediately stop being retrievable or executable, and the call returns the deleted `session_id`. Deleting a missing or already-deleted session surfaces the backend `404`.

> Requires `@composio/core` ≥ `0.13.1` (TypeScript) or `composio` ≥ `0.17.1` (Python).

**Python:**

```python
result = session.delete()
print(result["session_id"], result["deleted"])
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create('user_123');
const result = await session.delete();
console.log(result.sessionId, result.deleted);
```

# Browsing the catalog [#browsing-the-catalog]

Before configuring a session, explore the toolkits and tools available. Browse them visually at [dashboard.composio.dev](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-configuring-sessions) or in the [docs catalog](/toolkits), or fetch them programmatically:

**Python:**

```python
# List toolkits
toolkits = composio.toolkits.get()

# List tools within a toolkit (top 20 by default)
tools = composio.tools.get("user_123", toolkits=["GITHUB"])
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const userId = 'user_123';
// List toolkits
const toolkits = await composio.toolkits.get();

// List tools within a toolkit (top 20 by default)
const tools = await composio.tools.get(userId, { toolkits: ["GITHUB"] });
```

Inspect a tool's input and output schema without a user context with `getRawComposioToolBySlug`:

**Python:**

```python
tool = composio.tools.get_raw_composio_tool_by_slug("GMAIL_SEND_EMAIL")
print(tool.name)
print(tool.description)
print(tool.input_parameters)
print(tool.output_parameters)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const tool = await composio.tools.getRawComposioToolBySlug("GMAIL_SEND_EMAIL");
console.log(tool.name);
console.log(tool.description);
console.log(tool.inputParameters);
console.log(tool.outputParameters);
```

# Next [#next]

- [Sandbox](/docs/sandbox/remote): Give sessions a persistent compute environment with COMPOSIO_REMOTE_WORKBENCH and COMPOSIO_REMOTE_BASH_TOOL

---
