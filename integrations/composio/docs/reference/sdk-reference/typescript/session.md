---
type: composio_doc
title: "Session"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/session.md"
source_hash: "8e10fa99a173ebb3248cb30e969a17cc4be8fba34961cdc16e2d921efef848d2"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/session.md"
original_doc_path: "reference/sdk-reference/typescript/session.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Session (/reference/sdk-reference/typescript/session)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/session.md


## Properties [#properties]

| Name            | Type                                                                         | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configVersion` | `number`                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                    |
| `experimental`  | `SessionExperimental`                                                        |                                                                                                                                                                                                                                                                                                                                                                                                    |
| `mcp`           | `\{ headers?: Record<string, string>; type: 'http' \| 'sse'; url: string \}` | Hosted MCP endpoint (`session.mcp.url` / `session.mcp.headers`). Exists on every session at runtime, but only surfaced in the type when the session is created with `\{ mcp: true \}` (which returns `Session`); the default `SessionWithoutMcp` omits `mcp`, so MCP is an explicit opt-in. See [https://docs.composio.dev/docs/sessions-via-mcp](https://docs.composio.dev/docs/sessions-via-mcp) |
| `preload`       | `Preload`                                                                    |                                                                                                                                                                                                                                                                                                                                                                                                    |
| `sandbox`       | `Workbench`                                                                  | Resolved sandbox (code-execution) config returned by the API. `enable` defaults to `true` server-side.                                                                                                                                                                                                                                                                                             |
| `sessionId`     | `string`                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                    |
| `warnings`      | `Warning[]`                                                                  |                                                                                                                                                                                                                                                                                                                                                                                                    |

## Methods [#methods]

### authorize() [#authorize]

Initiate an authorization flow for a toolkit.
Returns a ConnectionRequest with a redirect URL for the user.

Pass `experimental: { accountType: 'SHARED', aclConfigForShared }` to
create a SHARED connection with a per-user ACL in one flow. Default
behaviour (omit the block) creates a PRIVATE connection.

Experimental — shape may change in future releases.

`aclConfigForShared` is validated against the same caps as
`composio.connectedAccounts.link()` (≤1000 entries per list, each
`userId` 1..256 characters). Invalid input throws `ValidationError`
at the SDK boundary.

```typescript
async authorize(toolkit: string, options?: { callbackUrl?: string; alias?: string; experimental?: { accountType?: ConnectedAccountType; aclConfigForShared?: ConnectedAccountAclConfig; }; }, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toolkit`         | `string`                                                                                                                                                |
| `options?`        | `\{ callbackUrl?: string; alias?: string; experimental?: \{ accountType?: ConnectedAccountType; aclConfigForShared?: ConnectedAccountAclConfig; \}; \}` |
| `requestOptions?` | `ComposioRequestOptions`                                                                                                                                |

**Returns**

`Promise`

***

### customToolkits() [#customtoolkits]

List all custom toolkits registered in this session.
Returns toolkits with their tools showing final slugs.

```typescript
customToolkits(): RegisteredCustomToolkit[]
```

**Returns**

`RegisteredCustomToolkit[]` — Array of registered custom toolkits

***

### customTools() [#customtools]

List all custom tools registered in this session.
Returns tools with their final slugs, schemas, and resolved toolkit.

```typescript
customTools(options?: { toolkit?: string }): RegisteredCustomTool[]
```

**Parameters**

| Name       | Type                     |
| ---------- | ------------------------ |
| `options?` | `\{ toolkit?: string \}` |

**Returns**

`RegisteredCustomTool[]` — Array of registered custom tools

***

### delete() [#delete]

Delete this session.

Deleted sessions immediately stop being retrievable or executable. Deleting
an already-deleted session surfaces the backend 404.

```typescript
async delete(requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     |
| ----------------- | ------------------------ |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise`

***

### execute() [#execute]

Execute a tool within the session.

For custom tools, accepts the original slug (e.g. "GREP") or the
full slug (e.g. "LOCAL\_GREP"). Custom tools are executed in-process;
remote tools are sent to the Composio backend.

```typescript
async execute(toolSlug: string, arguments_?: Record<string, unknown>, options?: ToolRouterSessionExecuteOptions, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                              | Description                |
| ----------------- | --------------------------------- | -------------------------- |
| `toolSlug`        | `string`                          | The tool slug to execute   |
| `arguments_?`     | `Record<string, unknown>`         | Optional tool arguments    |
| `options?`        | `ToolRouterSessionExecuteOptions` | Optional execution options |
| `requestOptions?` | `ComposioRequestOptions`          |                            |

**Returns**

`Promise` — The tool execution result

***

### proxyExecute() [#proxyexecute]

Proxy an API call through Composio's auth layer using the session's connected account.
The backend resolves the connected account from the toolkit within the session.

```typescript
async proxyExecute(params: SessionProxyExecuteParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                        | Description                                                                      |
| ----------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `params`          | `SessionProxyExecuteParams` | Proxy request parameters (toolkit, endpoint, method, body, headers/query params) |
| `requestOptions?` | `ComposioRequestOptions`    |                                                                                  |

**Returns**

`Promise` — The proxied API response with status, data, headers

***

### search() [#search]

Search for tools by semantic use case.
Returns relevant tools for the given query with schemas and guidance.

```typescript
async search(params: { query: string; toolkits?: string[]; }, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                                        |
| ----------------- | ------------------------------------------- |
| `params`          | `\{ query: string; toolkits?: string[]; \}` |
| `requestOptions?` | `ComposioRequestOptions`                    |

**Returns**

`Promise`

***

### toolkits() [#toolkits]

Query the connection state of toolkits in the session.
Supports pagination and filtering by toolkit slugs.

```typescript
async toolkits(options?: ToolRouterToolkitsOptions, requestOptions?: ComposioRequestOptions): Promise<{ cursor: string | undefined; items: { connection?: { authConfig?: ... | ...; connectedAccount?: { id: ...; status: ... }; isActive: boolean }; isNoAuth: boolean; logo?: string; name: string; slug: string }[]; totalPages: number }>
```

**Parameters**

| Name              | Type                        |
| ----------------- | --------------------------- |
| `options?`        | `ToolRouterToolkitsOptions` |
| `requestOptions?` | `ComposioRequestOptions`    |

**Returns**

`Promise<\{ cursor: string \| undefined; items: \{ connection?: \{ authConfig?: ... \| ...; connectedAccount?: \{ id: ...; status: ... \}; isActive: boolean \}; isNoAuth: boolean; logo?: string; name: string; slug: string \}[]; totalPages: number \}>`

***

### tools() [#tools]

Get the tools available in the session, formatted for your AI framework.
Requires a provider to be configured in the Composio constructor.

When custom tools are bound to the session, execution of COMPOSIO\_MULTI\_EXECUTE\_TOOL
is intercepted: local tools are executed in-process, remote tools are sent to the backend.

```typescript
async tools(modifiers?: SessionMetaToolOptions, requestOptions?: ComposioRequestOptions): Promise>
```

**Parameters**

| Name              | Type                     |
| ----------------- | ------------------------ |
| `modifiers?`      | `SessionMetaToolOptions` |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise>`

***

### update() [#update]

Partially update the session configuration.
Only the fields provided will be changed; omitted fields are preserved.
Mutates this session's `configVersion`, `preload`, and `warnings` in-place.

```typescript
async update(config: ToolRouterUpdateSessionConfig, requestOptions?: ComposioRequestOptions): Promise<void>
```

**Parameters**

| Name              | Type                            |
| ----------------- | ------------------------------- |
| `config`          | `ToolRouterUpdateSessionConfig` |
| `requestOptions?` | `ComposioRequestOptions`        |

**Returns**

`Promise<void>`

***

---
