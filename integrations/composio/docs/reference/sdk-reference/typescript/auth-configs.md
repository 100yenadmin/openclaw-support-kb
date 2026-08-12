---
type: composio_doc
title: "AuthConfigs"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs.md"
source_hash: "6a6cadad1d7d632b46dff5de43ce08e5151585dda4deb6c644e9608e86ae31e1"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/auth-configs.md"
original_doc_path: "reference/sdk-reference/typescript/auth-configs.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# AuthConfigs (/reference/sdk-reference/typescript/auth-configs)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs.md


## Usage [#usage]

Access this class through the `composio.authConfigs` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.authConfigs.list();
```

## Methods [#methods]

### create() [#create]

Create a new auth config

```typescript
async create(toolkit: string, options: CreateAuthConfigParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                            |
| ----------------- | ------------------------ | -------------------------------------- |
| `toolkit`         | `string`                 | Unique identifier of the toolkit       |
| `options`         | `CreateAuthConfigParams` | Options for creating a new auth config |
| `requestOptions?` | `ComposioRequestOptions` |                                        |

**Returns**

`Promise` — Created auth config

**Example**

```typescript
const authConfig = await authConfigs.create('my-toolkit', {
  type: AuthConfigTypes.CUSTOM,
  name: 'My Custom Auth Config',
  authScheme: AuthSchemeTypes.API_KEY,
  credentials: {
    apiKey: '1234567890',
  },
});
```

***

### delete() [#delete]

Deletes an authentication configuration.

This method permanently removes an auth config from the Composio platform.
This action cannot be undone and will prevent any connected accounts that use
this auth config from functioning.

```typescript
async delete(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                        |
| ----------------- | ------------------------ | -------------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the auth config to delete |
| `requestOptions?` | `ComposioRequestOptions` |                                                    |

**Returns**

`Promise` — The deletion response

**Example**

```typescript
// Delete an auth config
await composio.authConfigs.delete('auth_abc123');
```

***

### disable() [#disable]

Disables an authentication configuration.

This is a convenience method that calls updateStatus with 'DISABLED'.
When disabled, the auth config cannot be used to create new connected accounts
or authenticate with third-party services, but existing connections may continue to work.

```typescript
async disable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                         |
| ----------------- | ------------------------ | --------------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the auth config to disable |
| `requestOptions?` | `ComposioRequestOptions` |                                                     |

**Returns**

`Promise` — The updated auth config details

**Example**

```typescript
// Disable an auth config
await composio.authConfigs.disable('auth_abc123');
```

***

### enable() [#enable]

Enables an authentication configuration.

This is a convenience method that calls updateStatus with 'ENABLED'.
When enabled, the auth config can be used to create new connected accounts
and authenticate with third-party services.

```typescript
async enable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                        |
| ----------------- | ------------------------ | -------------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the auth config to enable |
| `requestOptions?` | `ComposioRequestOptions` |                                                    |

**Returns**

`Promise` — The updated auth config details

**Example**

```typescript
// Enable an auth config
await composio.authConfigs.enable('auth_abc123');
```

***

### get() [#get]

Retrieves a specific authentication configuration by its ID.

This method fetches detailed information about a single auth config
and transforms the response to the SDK's standardized format.

```typescript
async get(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                          |
| ----------------- | ------------------------ | ---------------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the auth config to retrieve |
| `requestOptions?` | `ComposioRequestOptions` |                                                      |

**Returns**

`Promise` — The auth config details

**Example**

```typescript
// Get an auth config by ID
const authConfig = await composio.authConfigs.get('auth_abc123');
console.log(authConfig.name); // e.g., 'GitHub Auth'
console.log(authConfig.toolkit.slug); // e.g., 'github'
```

***

### list() [#list]

Lists authentication configurations based on provided filter criteria.

This method retrieves auth configs from the Composio API, transforms them to the SDK format,
and supports filtering by various parameters.

```typescript
async list(query?: AuthConfigListParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                          |
| ----------------- | ------------------------ | ---------------------------------------------------- |
| `query?`          | `AuthConfigListParams`   | Optional query parameters for filtering auth configs |
| `requestOptions?` | `ComposioRequestOptions` |                                                      |

**Returns**

`Promise` — A paginated list of auth configurations

**Example**

```typescript
// List all auth configs
const allConfigs = await composio.authConfigs.list();

// List auth configs for a specific toolkit
const githubConfigs = await composio.authConfigs.list({
  toolkit: 'github'
});

// Search auth configs by name or id
const searchedConfigs = await composio.authConfigs.list({
  search: 'github',
  showDisabled: true
});

// List Composio-managed auth configs
const managedConfigs = await composio.authConfigs.list({
  isComposioManaged: true
});
```

***

### update() [#update]

Updates an existing authentication configuration.

This method allows you to modify properties of an auth config such as credentials,
scopes, or tool restrictions. The update type (custom or default) determines which
fields can be updated.

```typescript
async update(nanoid: string, data: AuthConfigUpdateParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                                    |
| ----------------- | ------------------------ | -------------------------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the auth config to update             |
| `data`            | `AuthConfigUpdateParams` | The data to update, which can be either custom or default type |
| `requestOptions?` | `ComposioRequestOptions` |                                                                |

**Returns**

`Promise` — The updated auth config

**Example**

```typescript
// Update a custom auth config with new credentials
const updatedConfig = await composio.authConfigs.update('auth_abc123', {
  type: 'custom',
  credentials: {
    apiKey: 'new-api-key-value'
  }
});

// Update a default auth config with new scopes
const updatedConfig = await composio.authConfigs.update('auth_abc123', {
  type: 'default',
  scopes: ['read:user', 'repo']
});
```

***

### updateStatus() [#updatestatus]

Updates the status of an authentication configuration.

This method allows you to enable or disable an auth config. When disabled,
the auth config cannot be used to create new connected accounts or authenticate
with third-party services.

```typescript
async updateStatus(status: 'ENABLED' | 'DISABLED', nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                      | Description                                 |
| ----------------- | ------------------------- | ------------------------------------------- |
| `status`          | `'ENABLED' \| 'DISABLED'` | The status to set ('ENABLED' or 'DISABLED') |
| `nanoid`          | `string`                  | The unique identifier of the auth config    |
| `requestOptions?` | `ComposioRequestOptions`  |                                             |

**Returns**

`Promise` — The updated auth config details

**Example**

```typescript
// Disable an auth config
await composio.authConfigs.updateStatus('DISABLED', 'auth_abc123');

// Enable an auth config
await composio.authConfigs.updateStatus('ENABLED', 'auth_abc123');
```

***

---
