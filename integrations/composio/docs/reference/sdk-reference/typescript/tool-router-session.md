---
type: composio_doc
title: "ToolRouterSession"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/tool-router-session.md"
source_hash: "ce36c70436c553cab937d7b061f1694d7674761376bd2aa35283af12b4a708f8"
doc_path: "reference/sdk-reference/typescript/tool-router-session.md"
original_doc_path: "reference/sdk-reference/typescript/tool-router-session.md"
duplicate_index: 1
---

# ToolRouterSession (/reference/sdk-reference/typescript/tool-router-session)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/tool-router-session.md


# Usage

Access this class through the `composio.toolRouterSession` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.toolRouterSession.list();
```

# Properties

| Name           | Type                  |
| -------------- | --------------------- |
| `experimental` | `SessionExperimental` |
| `mcp`          | `object`              |
| `sessionId`    | `string`              |

# Methods

## authorize()

Initiate an authorization flow for a toolkit.
Returns a ConnectionRequest with a redirect URL for the user.

```typescript
async authorize(toolkit: string, options?: { alias?: string; callbackUrl?: string }): Promise
```

**Parameters**

| Name       | Type     |
| ---------- | -------- |
| `toolkit`  | `string` |
| `options?` | `object` |

**Returns**

`Promise`

***

## customToolkits()

List all custom toolkits registered in this session.
Returns toolkits with their tools showing final slugs.

```typescript
customToolkits(): RegisteredCustomToolkit[]
```

**Returns**

`RegisteredCustomToolkit[]` — Array of registered custom toolkits

***

## customTools()

List all custom tools registered in this session.
Returns tools with their final slugs, schemas, and resolved toolkit.

```typescript
customTools(options?: { toolkit?: string }): RegisteredCustomTool[]
```

**Parameters**

| Name       | Type     |
| ---------- | -------- |
| `options?` | `object` |

**Returns**

`RegisteredCustomTool[]` — Array of registered custom tools

***

## execute()

Execute a tool within the session.

For custom tools, accepts the original slug (e.g. "GREP") or the
full slug (e.g. "LOCAL\_GREP"). Custom tools are executed in-process;
remote tools are sent to the Composio backend.

```typescript
async execute(toolSlug: string, arguments_?: Record<string, unknown>): Promise<{ data: Record<string, unknown>; error: string | null; logId: string }>
```

**Parameters**

| Name          | Type                      | Description              |
| ------------- | ------------------------- | ------------------------ |
| `toolSlug`    | `string`                  | The tool slug to execute |
| `arguments_?` | `Record<string, unknown>` | Optional tool arguments  |

**Returns**

`Promise<...>` — The tool execution result

***

## proxyExecute()

Proxy an API call through Composio's auth layer using the session's connected account.
The backend resolves the connected account from the toolkit within the session.

```typescript
async proxyExecute(params: object): Promise
```

**Parameters**

| Name     | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| `params` | `object` | Proxy request parameters (toolkit, endpoint, method, body, headers/query params) |

**Returns**

`Promise` — The proxied API response with status, data, headers

***

## search()

Search for tools by semantic use case.
Returns relevant tools for the given query with schemas and guidance.

```typescript
async search(params: { query: string; toolkits?: string[] }): Promise<...>
```

**Parameters**

| Name     | Type     |
| -------- | -------- |
| `params` | `object` |

**Returns**

`Promise<...>`

***

## toolkits()

Query the connection state of toolkits in the session.
Supports pagination and filtering by toolkit slugs.

```typescript
async toolkits(options?: { cursor?: string; isConnected?: boolean; limit?: number; search?: string; toolkits?: string[] }): Promise<...>
```

**Parameters**

| Name       | Type     |
| ---------- | -------- |
| `options?` | `object` |

**Returns**

`Promise<...>`

***

## tools()

Get the tools available in the session, formatted for your AI framework.
Requires a provider to be configured in the Composio constructor.

When custom tools are bound to the session, execution of COMPOSIO\_MULTI\_EXECUTE\_TOOL
is intercepted: local tools are executed in-process, remote tools are sent to the backend.

```typescript
async tools(modifiers?: SessionMetaToolOptions): Promise
```

**Parameters**

| Name         | Type                     |
| ------------ | ------------------------ |
| `modifiers?` | `SessionMetaToolOptions` |

**Returns**

`Promise`

***

---
