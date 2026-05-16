---
type: composio_doc
title: "SessionContextImpl"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/session-context-impl.md"
source_hash: "d305338d01f772dd3b99bd4e2138a87e301fd85e6a8755043e8245021889f723"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/session-context-impl.md"
original_doc_path: "reference/sdk-reference/typescript/session-context-impl.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# SessionContextImpl (/reference/sdk-reference/typescript/session-context-impl)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/session-context-impl.md


# Usage

Access this class through the `composio.sessionContextImpl` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.sessionContextImpl.list();
```

# Properties

| Name     | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `userId` | `string` | The user ID for this session |

# Methods

## execute()

Execute any tool from within a custom tool.
Routes to sibling local tools in-process when available,
otherwise delegates to the backend API.

Returns the same response shape as session.execute().

```typescript
async execute(toolSlug: string, arguments_: Record<string, unknown>): Promise<{ data: Record<string, unknown>; error: string | null; logId: string }>
```

**Parameters**

| Name         | Type                      |
| ------------ | ------------------------- |
| `toolSlug`   | `string`                  |
| `arguments_` | `Record<string, unknown>` |

**Returns**

`Promise<...>`

***

## proxyExecute()

Proxy API calls through Composio's auth layer.
The backend resolves the connected account from the toolkit within the session.

```typescript
async proxyExecute(params: object): Promise
```

**Parameters**

| Name     | Type     |
| -------- | -------- |
| `params` | `object` |

**Returns**

`Promise`

***

---
