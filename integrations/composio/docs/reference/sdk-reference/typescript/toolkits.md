---
type: composio_doc
title: "Toolkits"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/toolkits.md"
source_hash: "68970c31220a2e5e782ac07afc11403df4ba806d111df30c239773bb61afa2dc"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/toolkits.md"
original_doc_path: "reference/sdk-reference/typescript/toolkits.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Toolkits (/reference/sdk-reference/typescript/toolkits)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/toolkits.md


# Usage [#usage]

Access this class through the `composio.toolkits` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.toolkits.list();
```

# Methods [#methods]

## authorize() [#authorize]

Authorizes a user to use a toolkit.
This method will create an auth config if one doesn't exist and initiate a connection request.

```typescript
async authorize(userId: string, toolkitSlug: string, authConfigId?: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                          |
| ----------------- | ------------------------ | ------------------------------------ |
| `userId`          | `string`                 | The user id of the user to authorize |
| `toolkitSlug`     | `string`                 | The slug of the toolkit to authorize |
| `authConfigId?`   | `string`                 |                                      |
| `requestOptions?` | `ComposioRequestOptions` |                                      |

**Returns**

`Promise` — The connection request object

**Example**

```typescript
const connectionRequest = await composio.toolkits.authorize(userId, 'github');
```

***

## get() [#get]

Retrieves a specific toolkit by its slug identifier.

**Overload 1**

```typescript
async get(slug: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                           |
| ----------------- | ------------------------ | ----------------------------------------------------- |
| `slug`            | `string`                 | The unique slug identifier of the toolkit to retrieve |
| `requestOptions?` | `ComposioRequestOptions` |                                                       |

**Returns**

`Promise` — The toolkit object with detailed information

**Overload 2**

```typescript
async get(query?: ToolkitListParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                             |
| ----------------- | ------------------------ | --------------------------------------- |
| `query?`          | `ToolkitListParams`      | The query parameters to filter toolkits |
| `requestOptions?` | `ComposioRequestOptions` |                                         |

**Returns**

`Promise` — A paginated list of toolkits matching the query criteria

**Example**

```typescript
// Get a specific toolkit
const githubToolkit = await composio.toolkits.get('github');
console.log(githubToolkit.name); // GitHub
console.log(githubToolkit.authConfigDetails); // Authentication configuration details
```

***

## getAuthConfigCreationFields() [#getauthconfigcreationfields]

Retrieves the fields required for creating an auth config for a toolkit.

```typescript
async getAuthConfigCreationFields(toolkitSlug: string, authScheme: AuthSchemeType, options: { requiredOnly?: boolean }): Promise
```

**Parameters**

| Name          | Type                           | Description                                        |
| ------------- | ------------------------------ | -------------------------------------------------- |
| `toolkitSlug` | `string`                       | The slug of the toolkit to retrieve the fields for |
| `authScheme`  | `AuthSchemeType`               | The auth scheme to retrieve the fields for         |
| `options`     | `\{ requiredOnly?: boolean \}` |                                                    |

**Returns**

`Promise` — The fields required for creating an auth config

***

## getConnectedAccountInitiationFields() [#getconnectedaccountinitiationfields]

Retrieves the fields required for initiating a connected account for a toolkit.

```typescript
async getConnectedAccountInitiationFields(toolkitSlug: string, authScheme: AuthSchemeType, options: { requiredOnly?: boolean }): Promise
```

**Parameters**

| Name          | Type                           | Description                                        |
| ------------- | ------------------------------ | -------------------------------------------------- |
| `toolkitSlug` | `string`                       | The slug of the toolkit to retrieve the fields for |
| `authScheme`  | `AuthSchemeType`               | The auth scheme to retrieve the fields for         |
| `options`     | `\{ requiredOnly?: boolean \}` |                                                    |

**Returns**

`Promise` — The fields required for initiating a connected account

***

## listCategories() [#listcategories]

Retrieves all toolkit categories available in the Composio SDK.

This method fetches the complete list of categories from the Composio API
and transforms the response to use camelCase property naming.

```typescript
async listCategories(requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     |
| ----------------- | ------------------------ |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise` — The list of toolkit categories

**Example**

```typescript
// Get all toolkit categories
const categories = await composio.toolkits.listCategories();
console.log(categories.items); // Array of category objects
```

***

---
