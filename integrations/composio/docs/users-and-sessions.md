---
type: composio_doc
title: "Users & Sessions"
source: "https://docs.composio.dev/docs/users-and-sessions.md"
source_hash: "90ca247cb7dc8e00e6ecb825abcd6a17c0bf7fb3be7114f3e34e9bb564fcf038"
system: "composio"
kb_namespace: "composio"
doc_path: "users-and-sessions.md"
original_doc_path: "users-and-sessions.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Users & Sessions (/docs/users-and-sessions)
Source: https://docs.composio.dev/docs/users-and-sessions.md


When building AI agents for multiple users, each user needs their own connections and context. This is represented through **users** and **sessions**.

> For a hands-on walkthrough, see the [quickstart](/docs/quickstart).

# Users

A user is an identifier from your app. When someone connects their Gmail or GitHub, that connection is stored under their user ID, so tools always run with the right authentication. Every tool execution and authorization uses the user ID to identify the context. Connections are fully isolated between user IDs.

**Best practices for User IDs**

    * **Recommended:** Database UUID or primary key (`user.id`)
    * **Acceptable:** Unique username (`user.username`)
    * **Avoid:** Email addresses (they can change)
    * **Never:** `default` in production (exposes other users' data)

A user can have multiple connections to the same toolkit.
Let's say you want to allow users to connect both their work and personal email. You can represent the user with the same user ID but differentiate between the two with the connected
account ID.

Here is a detailed guide on how to manage such connections:

- [Managing Multiple Connections](/docs/managing-multiple-connected-accounts): Handle multiple accounts per toolkit for a single user

Triggers are scoped to a connected account. When you create a trigger, it's tied to a specific user's connection:

- [Triggers](/docs/triggers): Event-driven payloads from connected apps

# Sessions

A session is an ephemeral configuration. You specify:

* Which user's authorization and data the agent will access
* What toolkits are enabled or disabled
* What authentication method, scopes, and credentials to use

## Creating a session

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

## Session methods

Once created, a session provides methods to get tools and manage connections:

**Python:**

```python
# Get tools for your AI framework
tools = session.tools()

# Get MCP server URL
mcp_url = session.mcp.url

# Authenticate a user to a toolkit
connection_request = session.authorize("github")

# List available toolkits and their connection status
toolkits = session.toolkits()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
// Get tools for your AI framework
const tools = await session.tools();

// Get MCP server URL
const mcpUrl = session.mcp.url;

// Authenticate a user to a toolkit
const connectionRequest = await session.authorize("github");

// List available toolkits and their connection status
const toolkits = await session.toolkits();
```

# How sessions behave

A session ties together a user, a set of available toolkits, auth configuration for those toolkits, and connected accounts. Each session is designed for a particular agentic task.

Every call to `create()` returns a new session ID, even if the configuration is identical. This gives you clean isolation between tasks and makes it easy to trace activity back to a specific session in logs and analytics.

Sessions persist on the server and don't expire. For multi-turn conversations, store the session ID and reuse it with `composio.use()` rather than calling `create()` again.

## Reusing a session

In multi-turn chat apps, you create a session once and reuse it across requests. Store the session ID and call `composio.use()` to rehydrate it:

**Python:**

```python
session = composio.use("session_id")
tools = session.tools()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.use("session_id");
const tools = await session.tools();
```

This returns the same session with the same toolkits, auth configs, and connected accounts.

## Updating a session

Use `session.update()` to modify a session's configuration without creating a new one. Only the fields you pass are changed — everything else is preserved.

**Python:**

```python
session.update(
    toolkits=["gmail", "slack"],
    auth_configs={"gmail": "ac_new_config"},
    connected_accounts={"slack": ["ca_work_slack"]},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
await session.update({
  toolkits: ["gmail", "slack"],
  authConfigs: { gmail: "ac_new_config" },
  connectedAccounts: { slack: ["ca_work_slack"] },
});
```

You can update toolkits, auth configs, connected accounts, workbench settings, multi-account config, manage connections, tags, tools, and preload. See [Configuring Sessions](/docs/configuring-sessions) for the full list of options.

## Connected accounts persist across sessions

Connections are tied to the user ID, not the session. A user who connected Gmail in one session can access it in every future session without re-authenticating.

**When should I create a new session?**

Reuse a session with `composio.use()` for multi-turn conversations. Create a new session when you need a fundamentally different setup (e.g., a different user or a completely different set of toolkits).

# What to read next

- [Authentication](/docs/authentication): Connect Links, OAuth, API keys, and auth configs

- [Configuring Sessions](/docs/configuring-sessions): Enable toolkits, set auth configs, and select connected accounts

- [Workbench](/docs/workbench): Write and run code in a persistent sandbox

---
