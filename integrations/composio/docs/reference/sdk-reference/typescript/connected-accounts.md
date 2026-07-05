---
type: composio_doc
title: "ConnectedAccounts"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts.md"
source_hash: "8becb33e9a3e84cf879375d393ae480cdfec605ff9333398beb8039b87e949a7"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/connected-accounts.md"
original_doc_path: "reference/sdk-reference/typescript/connected-accounts.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# ConnectedAccounts (/reference/sdk-reference/typescript/connected-accounts)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts.md


# Usage

Access this class through the `composio.connectedAccounts` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.connectedAccounts.list();
```

# Methods

## delete()

Deletes a connected account.

This method permanently removes a connected account from the Composio platform.
This action cannot be undone and will revoke any access tokens associated with the account.

```typescript
async delete(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                              |
| ----------------- | ------------------------ | -------------------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the connected account to delete |
| `requestOptions?` | `ComposioRequestOptions` |                                                          |

**Returns**

`Promise` — The deletion response

**Example**

```typescript
// Delete a connected account
await composio.connectedAccounts.delete('conn_abc123');
```

***

## disable()

Disable a connected account

```typescript
async disable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                |
| ----------------- | ------------------------ | ------------------------------------------ |
| `nanoid`          | `string`                 | Unique identifier of the connected account |
| `requestOptions?` | `ComposioRequestOptions` |                                            |

**Returns**

`Promise` — Updated connected account details

**Example**

```typescript
// Disable a connected account
const disabledAccount = await composio.connectedAccounts.disable('conn_abc123');
console.log(disabledAccount.isDisabled); // true

// You can also use updateStatus with a reason
// const disabledAccount = await composio.connectedAccounts.updateStatus('conn_abc123', {
//   enabled: false,
//   reason: 'No longer needed'
// });
```

***

## enable()

Enable a connected account

```typescript
async enable(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                |
| ----------------- | ------------------------ | ------------------------------------------ |
| `nanoid`          | `string`                 | Unique identifier of the connected account |
| `requestOptions?` | `ComposioRequestOptions` |                                            |

**Returns**

`Promise` — Updated connected account details

**Example**

```typescript
// Enable a previously disabled connected account
const enabledAccount = await composio.connectedAccounts.enable('conn_abc123');
console.log(enabledAccount.isDisabled); // false
```

***

## get()

Retrieves a specific connected account by its ID.

This method fetches detailed information about a single connected account
and transforms the response to the SDK's standardized format.

```typescript
async get(nanoid: string, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                     | Description                                    |
| ----------------- | ------------------------ | ---------------------------------------------- |
| `nanoid`          | `string`                 | The unique identifier of the connected account |
| `requestOptions?` | `ComposioRequestOptions` |                                                |

**Returns**

`Promise` — The connected account details

**Example**

```typescript
// Get a connected account by ID
const account = await composio.connectedAccounts.get('conn_abc123');
console.log(account.status); // e.g., 'ACTIVE'
console.log(account.toolkit.slug); // e.g., 'github'
```

***

## initiate()

Compound function to create a new connected account.
This function creates a new connected account and returns a connection request.
Users can then wait for the connection to be established using the `waitForConnection` method.

**Deprecated for Composio-managed OAuth (OAuth1, OAuth2, DCR\_OAUTH).**
The legacy `POST /api/v3/connected_accounts` endpoint that this method
wraps is being retired for Composio-managed auth configs on redirectable
schemes. The cutover is **2026-05-08** for new organizations and
**2026-07-03** for all remaining organizations. After your org's cutover,
this method will throw ComposioLegacyConnectedAccountsEndpointRetiredError
for that specific combination.

Use ConnectedAccounts.link for Composio-managed OAuth — it works for
every redirectable scheme regardless of whether the auth config is
Composio-managed or custom, and the return shape is the same.

Custom auth configs (your own OAuth app) and non-OAuth schemes (API key,
bearer token, basic auth) are unaffected and continue to work on
`initiate()`. See [https://docs.composio.dev/docs/changelog/2026/04/24](https://docs.composio.dev/docs/changelog/2026/04/24)

```typescript
async initiate(userId: string, authConfigId: string, options?: CreateConnectedAccountOptions, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                            | Description                                  |
| ----------------- | ------------------------------- | -------------------------------------------- |
| `userId`          | `string`                        | User ID of the connected account             |
| `authConfigId`    | `string`                        | Auth config ID of the connected account      |
| `options?`        | `CreateConnectedAccountOptions` | Options for creating a new connected account |
| `requestOptions?` | `ComposioRequestOptions`        |                                              |

**Returns**

`Promise` — Connection request object

**Example**

```typescript
// For OAuth2 authentication
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'auth_config_123',
  {
    callbackUrl: 'https://your-app.com/callback',
    config: AuthScheme.OAuth2({
      access_token: 'your_access_token',
      token_type: 'Bearer'
    })
  }
);

// For API Key authentication
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'auth_config_123',
  {
    config: AuthScheme.ApiKey({
      api_key: 'your_api_key'
    })
  }
);

// For Basic authentication
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'auth_config_123',
  {
    config: AuthScheme.Basic({
      username: 'your_username',
      password: 'your_password'
    })
  }
);
```

***

## link()

```typescript
async link(userId: string, authConfigId: string, options?: CreateConnectedAccountLinkOptions, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                                | Description                                                                               |
| ----------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `userId`          | `string`                            | \{string} - The external user ID to create the connected account for.                     |
| `authConfigId`    | `string`                            | \{string} - The auth config ID to create the connected account for.                       |
| `options?`        | `CreateConnectedAccountLinkOptions` | \{CreateConnectedAccountLinkOptions} - Options for creating a new connected account link. |
| `requestOptions?` | `ComposioRequestOptions`            |                                                                                           |

**Returns**

`Promise` — Connection request object

**Example**

```typescript
// create a connection request and redirect the user to the redirect url
const connectionRequest = await composio.connectedAccounts.link('user_123', 'auth_config_123');
const redirectUrl = connectionRequest.redirectUrl;
console.log(`Visit: ${redirectUrl} to authenticate your account`);

// Wait for the connection to be established
const connectedAccount = await connectionRequest.waitForConnection()
```

```typescript
// create a connection request and redirect the user to the redirect url
const connectionRequest = await composio.connectedAccounts.link('user_123', 'auth_config_123', {
  callbackUrl: 'https://your-app.com/callback'
});
const redirectUrl = connectionRequest.redirectUrl;
console.log(`Visit: ${redirectUrl} to authenticate your account`);

// Wait for the connection to be established
const connectedAccount = await composio.connectedAccounts.waitForConnection(connectionRequest.id);
```

***

## list()

Lists all connected accounts based on provided filter criteria.

This method retrieves connected accounts from the Composio API with optional filtering.

```typescript
async list(query?: ConnectedAccountListParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                         | Description                                                |
| ----------------- | ---------------------------- | ---------------------------------------------------------- |
| `query?`          | `ConnectedAccountListParams` | Optional query parameters for filtering connected accounts |
| `requestOptions?` | `ComposioRequestOptions`     |                                                            |

**Returns**

`Promise` — A paginated list of connected accounts

**Example**

```typescript
// List all connected accounts
const allAccounts = await composio.connectedAccounts.list();

// List accounts for a specific user
const userAccounts = await composio.connectedAccounts.list({
  userIds: ['user123']
});

// List accounts for a specific toolkit
const githubAccounts = await composio.connectedAccounts.list({
  toolkitSlugs: ['github']
});
```

***

## refresh()

Refreshes a connected account's authentication credentials.

This method attempts to refresh OAuth tokens or other credentials associated with
the connected account. This is useful when a token has expired or is about to expire.

```typescript
async refresh(nanoid: string, options?: ConnectedAccountRefreshOptions, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                             | Description                                               |
| ----------------- | -------------------------------- | --------------------------------------------------------- |
| `nanoid`          | `string`                         | The unique identifier of the connected account to refresh |
| `options?`        | `ConnectedAccountRefreshOptions` |                                                           |
| `requestOptions?` | `ComposioRequestOptions`         |                                                           |

**Returns**

`Promise` — The response containing the refreshed account details

**Example**

```typescript
// Refresh a connected account's credentials
const refreshedAccount = await composio.connectedAccounts.refresh('conn_abc123');
```

***

## update()

Enable or disable a connected account. Accepts `{ enabled: boolean }`.

Use `updateAcl()` for ACL writes on SHARED connections.

```typescript
async update(nanoid: string, params: UpdateConnectedAccountParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                           | Description                                    |
| ----------------- | ------------------------------ | ---------------------------------------------- |
| `nanoid`          | `string`                       | The unique identifier of the connected account |
| `params`          | `UpdateConnectedAccountParams` | The update parameters                          |
| `requestOptions?` | `ComposioRequestOptions`       |                                                |

**Returns**

`Promise` — The update response

**Example**

```typescript
// Disable an account
await composio.connectedAccounts.update('ca_abc123', { enabled: false });
```

***

## updateAcl()

Update the per-user ACL on a SHARED connected account.
**Experimental — shape may change in future releases.**

Only meaningful for SHARED connections — calling this on a PRIVATE
connection raises `ComposioAclOnlyForSharedError` (400). ACL writes
require the connection's creator or an API key.

PATCH semantics: omit a field to leave it unchanged; pass an empty
array to clear an allow/deny list. At least one field must be
provided.

```typescript
async updateAcl(nanoid: string, params: UpdateConnectedAccountAclParams): Promise
```

**Parameters**

| Name     | Type                              | Description                                    |
| -------- | --------------------------------- | ---------------------------------------------- |
| `nanoid` | `string`                          | The unique identifier of the connected account |
| `params` | `UpdateConnectedAccountAclParams` | The ACL fields to patch                        |

**Returns**

`Promise` — The PATCH response

**Example**

```typescript
// Allow every userId to use this SHARED connection
await composio.connectedAccounts.updateAcl('ca_abc123', { allowAllUsers: true });

// Targeted allow list
await composio.connectedAccounts.updateAcl('ca_abc123', {
  allowedUserIds: ['user_alice', 'user_bob'],
});

// Clear the allow list (back to deny-by-default unless allowAllUsers is true)
await composio.connectedAccounts.updateAcl('ca_abc123', { allowedUserIds: [] });
```

***

## updateStatus()

Update the status of a connected account

```typescript
async updateStatus(nanoid: string, params: ConnectedAccountUpdateStatusParams, requestOptions?: ComposioRequestOptions): Promise
```

**Parameters**

| Name              | Type                                 | Description                                |
| ----------------- | ------------------------------------ | ------------------------------------------ |
| `nanoid`          | `string`                             | Unique identifier of the connected account |
| `params`          | `ConnectedAccountUpdateStatusParams` | Parameters for updating the status         |
| `requestOptions?` | `ComposioRequestOptions`             |                                            |

**Returns**

`Promise` — Updated connected account details

**Example**

```typescript
// Enable a connected account
const updatedAccount = await composio.connectedAccounts.updateStatus('conn_abc123', {
  enabled: true
});

// Disable a connected account with a reason
const disabledAccount = await composio.connectedAccounts.updateStatus('conn_abc123', {
  enabled: false,
  reason: 'Token expired'
});
```

***

## waitForConnection()

Waits for a connection request to complete and become active.

This method continuously polls the Composio API to check the status of a connection
until it either becomes active, enters a terminal error state, or times out.

```typescript
async waitForConnection(connectedAccountId: string, timeout?: number): Promise
```

**Parameters**

| Name                 | Type     | Description                                                |
| -------------------- | -------- | ---------------------------------------------------------- |
| `connectedAccountId` | `string` | The ID of the connected account to wait for                |
| `timeout?`           | `number` | Maximum time to wait in milliseconds (default: 60 seconds) |

**Returns**

`Promise` — The finalized connected account data

**Example**

```typescript
// Wait for a connection to complete with default timeout
const connectedAccount = await composio.connectedAccounts.waitForConnection('conn_123abc');

// Wait with a custom timeout of 2 minutes
const connectedAccount = await composio.connectedAccounts.waitForConnection('conn_123abc', 120000);
```

***

---
