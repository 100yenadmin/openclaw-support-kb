---
type: composio_doc
title: "TypeScript SDK Reference"
source: "https://docs.composio.dev/reference/sdk-reference/typescript.md"
source_hash: "996c5d6c53525822eab4b0b81565217ab5f52cc786bcfe453d1f54381e07bbbb"
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

| Class                                                                                                | Description                                                     |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`Composio`](/reference/sdk-reference/typescript/composio)                                           | This is the core class for Composio.                            |
| [`AuthConfigs`](/reference/sdk-reference/typescript/auth-configs)                                    | AuthConfigs class                                               |
| [`ConnectedAccounts`](/reference/sdk-reference/typescript/connected-accounts)                        | ConnectedAccounts class                                         |
| [`Experimental`](/reference/sdk-reference/typescript/experimental)                                   | `composio.experimental` namespace. Mirrors the Python SDK's     |
| [`MCP`](/reference/sdk-reference/typescript/mcp)                                                     | MCP (Model Control Protocol) class                              |
| [`RemoteFile`](/reference/sdk-reference/typescript/remote-file)                                      | Represents a file stored in a tool router session's file mount. |
| [`SessionContextImpl`](/reference/sdk-reference/typescript/session-context-impl)                     | Concrete implementation of SessionContext.                      |
| [`Toolkits`](/reference/sdk-reference/typescript/toolkits)                                           | Toolkits class                                                  |
| [`ToolRouterSession`](/reference/sdk-reference/typescript/tool-router-session)                       | ToolRouterSession API                                           |
| [`ToolRouterSessionFilesMount`](/reference/sdk-reference/typescript/tool-router-session-files-mount) | ToolRouterSessionFilesMount API                                 |
| [`Tools`](/reference/sdk-reference/typescript/tools)                                                 | This class is used to manage tools in the Composio SDK.         |
| [`Triggers`](/reference/sdk-reference/typescript/triggers)                                           | Trigger (Instance) class                                        |

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
