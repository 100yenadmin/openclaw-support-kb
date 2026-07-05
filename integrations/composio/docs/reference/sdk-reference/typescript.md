---
type: composio_doc
title: "TypeScript SDK Reference"
source: "https://docs.composio.dev/reference/sdk-reference/typescript.md"
source_hash: "37d2b9e74866aa4f6edd7ab47cd03c59102630ebd07c218d5097170075231b19"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript.md"
original_doc_path: "reference/sdk-reference/typescript.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# TypeScript SDK Reference (/reference/sdk-reference/typescript)
Source: https://docs.composio.dev/reference/sdk-reference/typescript.md


# Installation

**npm:**

```bash
npm install @composio/core
```

**pnpm:**

```bash
pnpm add @composio/core
```

**yarn:**

```bash
yarn add @composio/core
```

**bun:**

```bash
bun add @composio/core
```

# Classes

| Class                                                                         | Description                                                                 |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`Composio`](/reference/sdk-reference/typescript/composio)                    | This is the core class for Composio.                                        |
| [`AuthConfigs`](/reference/sdk-reference/typescript/auth-configs)             | AuthConfigs class                                                           |
| [`ConnectedAccounts`](/reference/sdk-reference/typescript/connected-accounts) | ConnectedAccounts class                                                     |
| [`Experimental`](/reference/sdk-reference/typescript/experimental)            | Experimental API                                                            |
| [`MCP`](/reference/sdk-reference/typescript/mcp)                              | MCP (Model Control Protocol) class                                          |
| [`RemoteFile`](/reference/sdk-reference/typescript/remote-file)               | Represents a file stored in a tool router session's file mount.             |
| [`Sessions`](/reference/sdk-reference/typescript/sessions)                    | First-class API for creating and reusing Composio sessions.                 |
| [`Toolkits`](/reference/sdk-reference/typescript/toolkits)                    | Toolkits class                                                              |
| [`Session`](/reference/sdk-reference/typescript/session)                      | A Composio session — the object returned by `composio.sessions.create(...)` |
| [`Session files`](/reference/sdk-reference/typescript/session-files)          | File mount for a Composio session, reached via `session.experimental.files` |
| [`Tools`](/reference/sdk-reference/typescript/tools)                          | This class is used to manage tools in the Composio SDK.                     |
| [`Triggers`](/reference/sdk-reference/typescript/triggers)                    | Trigger (Instance) class                                                    |

# Quick Start

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY
});

// Get tools for a user
const tools = await composio.tools.get('user-123', {
  toolkits: ['github']
});

// Execute a tool
const result = await composio.tools.execute('GITHUB_GET_REPOS', {
  userId: 'user-123',
  arguments: { owner: 'composio' }
});
```

---
