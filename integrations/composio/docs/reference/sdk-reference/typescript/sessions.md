---
type: composio_doc
title: "Sessions"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/sessions.md"
source_hash: "2fbdf6bcbe5d9feb404eb5ad2b648de206b5c9dabb43a4666c6a622bc9ff099b"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/sessions.md"
original_doc_path: "reference/sdk-reference/typescript/sessions.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Sessions (/reference/sdk-reference/typescript/sessions)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/sessions.md


## Usage [#usage]

Access this class through the `composio.sessions` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.sessions.list();
```

## Methods [#methods]

### create() [#create]

Creates a new tool router session for a user.
Use `sessionPreset: SessionPreset.DIRECT_TOOLS` when all needed tools
should be exposed directly; see `ToolRouterCreateSessionConfig`.

**Overload 1**

```typescript
async create(userId: string, config: ToolRouterCreateSessionConfig & { mcp: true }, requestOptions?: ComposioRequestOptions): Promise>
```

**Parameters**

| Name              | Type                                              | Description                                                             |
| ----------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| `userId`          | `string`                                          | \{string} The user id to create the session for                         |
| `config`          | `ToolRouterCreateSessionConfig & \{ mcp: true \}` | \{ToolRouterCreateSessionConfig} The config for the tool router session |
| `requestOptions?` | `ComposioRequestOptions`                          |                                                                         |

**Returns**

`Promise>` — The tool router session

**Overload 2**

```typescript
async create(userId: string, config?: ToolRouterCreateSessionConfig, requestOptions?: ComposioRequestOptions): Promise>
```

**Parameters**

| Name              | Type                            | Description                                                             |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `userId`          | `string`                        | \{string} The user id to create the session for                         |
| `config?`         | `ToolRouterCreateSessionConfig` | \{ToolRouterCreateSessionConfig} The config for the tool router session |
| `requestOptions?` | `ComposioRequestOptions`        |                                                                         |

**Returns**

`Promise>` — The tool router session

**Example**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();

const session = await composio.sessions.create('user_123', {
  toolkits: ['gmail'],
  manageConnections: true,
  experimental: {
    customTools: [myCustomTool],
    customToolkits: [myToolkit],
  },
});
```

***

### delete() [#delete]

Delete a tool router session by ID.

Deleted sessions immediately stop being retrievable or executable. Deleting
a missing or already-deleted session surfaces the backend 404.

```typescript
async delete(id: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     |
| ----------------- | ------------------------ |
| `id`              | `string`                 |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise`

***

### use() [#use]

Use an existing session

**Overload 1**

```typescript
async use(id: string, options: { customTools?: CustomTool[]; customToolkits?: CustomToolkit[]; mcp: true }, requestOptions?: ComposioRequestOptions): Promise>
```

**Parameters**

| Name              | Type                                                                            | Description                            |
| ----------------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| `id`              | `string`                                                                        | \{string} The id of the session to use |
| `options`         | `\{ customTools?: CustomTool[]; customToolkits?: CustomToolkit[]; mcp: true \}` |                                        |
| `requestOptions?` | `ComposioRequestOptions`                                                        |                                        |

**Returns**

`Promise>` — The tool router session

**Overload 2**

```typescript
async use(id: string, options?: { customTools?: CustomTool[]; customToolkits?: CustomToolkit[]; mcp?: boolean }, requestOptions?: ComposioRequestOptions): Promise>
```

**Parameters**

| Name              | Type                                                                                | Description                            |
| ----------------- | ----------------------------------------------------------------------------------- | -------------------------------------- |
| `id`              | `string`                                                                            | \{string} The id of the session to use |
| `options?`        | `\{ customTools?: CustomTool[]; customToolkits?: CustomToolkit[]; mcp?: boolean \}` |                                        |
| `requestOptions?` | `ComposioRequestOptions`                                                            |                                        |

**Returns**

`Promise>` — The tool router session

**Example**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const id = 'session_123';
const session = await composio.sessions.use(id);

console.log(session.mcp.url);
console.log(session.mcp.headers);
```

***

---
