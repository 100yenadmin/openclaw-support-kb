---
type: composio_doc
title: "Users & Sessions"
source: "https://docs.composio.dev/docs/users-and-sessions.md"
source_hash: "94033186f7fd4f326035d0b779a76af1c2b126c521b21f8d5c8abff315fc55be"
doc_path: "users-and-sessions.md"
original_doc_path: "users-and-sessions.md"
duplicate_index: 1
---

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

A session ties together a user, a set of available toolkits, auth configuration for those toolkits, and connected accounts. Call `create()` whenever you want to do a task. Each session is designed for a particular agentic task, and if you want to change the context of the task, create a new session.

You don't need to cache session IDs, manage session lifetimes, or worry about expiration. Sessions persist on the server and don't expire. Just call `create()` with what you need.

## Sessions are immutable

A session's configuration is fixed at creation. You cannot change the toolkits, auth configs, or connected accounts on an existing session.

This means the boundary for a new session isn't a new chat or a new request. It's when the contract changes. If a user starts with "search my personal Gmail" and then says "actually use my work email," that's a different session because the auth changed.

## Connected accounts persist across sessions

Connections are tied to the user ID, not the session. A user who connected Gmail in one session can access it in every future session without re-authenticating.

**When should I create a new session?**

Create a new session when the config changes: different toolkits, different auth config, or a different connected account. You don't need to store or manage session IDs. Just call `create()` each time.

# What to read next

- [Authentication](/docs/authentication): Connect Links, OAuth, API keys, and auth configs

- [Configuring Sessions](/docs/configuring-sessions): Enable toolkits, set auth configs, and select connected accounts

- [Workbench](/docs/workbench): Write and run code in a persistent sandbox

---
