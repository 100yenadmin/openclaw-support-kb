---
type: composio_doc
title: "Migrating from initiate() to link()"
source: "https://docs.composio.dev/docs/auth-configuration/migrating-initiate-to-link.md"
source_hash: "50ce9012a3c5f81c0139f480cdf4d3f401c97a5c89d5df09ba6fef66e66ee984"
system: "composio"
kb_namespace: "composio"
doc_path: "auth-configuration/migrating-initiate-to-link.md"
original_doc_path: "auth-configuration/migrating-initiate-to-link.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Migrating from initiate() to link() (/docs/auth-configuration/migrating-initiate-to-link)
Source: https://docs.composio.dev/docs/auth-configuration/migrating-initiate-to-link.md


`composio.connected_accounts.initiate()` (Python) and `composio.connectedAccounts.initiate()` (TypeScript) wrap `POST /api/v3/connected_accounts`. That endpoint is being retired for **Composio-managed auth configs on redirectable OAuth schemes** (OAuth1, OAuth2, DCR\_OAUTH):

* **2026-05-08, 00:00 UTC** — organizations created on or after this date are blocked.
* **2026-07-03, 00:00 UTC** — all remaining organizations are blocked.

After your org's cutover, calling `initiate()` for the affected combination raises `ComposioLegacyConnectedAccountsEndpointRetiredError` (TS) / `composio.exceptions.ComposioLegacyConnectedAccountsEndpointRetiredError` (Python). The replacement is `link()` — same return shape, same `redirectUrl` / `redirect_url`, same `waitForConnection()` / `wait_for_connection()` helper.

> **Who this affects:** developers using a Composio-managed (default) auth config on OAuth1, OAuth2, or DCR\_OAUTH. If you brought your own OAuth client credentials (custom auth config) or use a non-OAuth scheme (API key, bearer, basic), your `initiate()` calls keep working — no migration needed.

# Why

When a connection is initiated through a default (Composio-managed) auth config, a Composio-owned OAuth application is acting on behalf of your integration. The end user should explicitly understand and acknowledge, at the moment of connection, that they are granting a third-party application access to their account on the external service. The `link()` flow enforces that consent step; the legacy `initiate()` path could bypass it when credentials were passed in directly. Concentrating Composio-managed OAuth on `link()` aligns the user experience with that consent guarantee.

# Migration at a glance

The signatures are the same shape — only the method name changes for the OAuth case.

**Python:**

**Before:**

```python
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_abc",
)
print(connection_request.redirect_url)
connected_account = connection_request.wait_for_connection()
```

**After:**

```python
connection_request = composio.connected_accounts.link(
    user_id="user_123",
    auth_config_id="ac_abc",
)
print(connection_request.redirect_url)
connected_account = connection_request.wait_for_connection()
```

**TypeScript:**

**Before:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const connectionRequest = await composio.connectedAccounts.initiate(
  'user_123',
  'ac_abc'
);
console.log(connectionRequest.redirectUrl);
const connectedAccount = await connectionRequest.waitForConnection();
```

**After:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const connectionRequest = await composio.connectedAccounts.link(
  'user_123',
  'ac_abc'
);
console.log(connectionRequest.redirectUrl);
const connectedAccount = await connectionRequest.waitForConnection();
```

`callback_url` / `callbackUrl` and `alias` work the same way on both methods.

# What changes between the two methods

| Concern                                                                     | `initiate()`                                                           | `link()`                                                                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Underlying endpoint                                                         | `POST /api/v3/connected_accounts`                                      | `POST /api/v3/connected_accounts/link`                                                      |
| Return shape                                                                | `ConnectionRequest` with `id`, `redirect_url`, `wait_for_connection()` | Same                                                                                        |
| `callback_url` / `callbackUrl`                                              | ✓                                                                      | ✓                                                                                           |
| `alias`                                                                     | ✓                                                                      | ✓                                                                                           |
| Pre-filled connection state (`config`)                                      | ✓ — for non-OAuth schemes                                              | Not needed — OAuth uses redirect; non-OAuth users keep `initiate()`                         |
| `allow_multiple` / `allowMultiple`                                          | ✓ — guards against duplicates                                          | ✓ — same default (`False`), same exception ([since 2026-04-28](/docs/changelog/2026/04/28)) |
| Affected by the 2026-05-08 / 2026-07-03 retirement (Composio-managed OAuth) | Yes                                                                    | No                                                                                          |

# How to know which auth config is which

If you maintain a mix of Composio-managed and custom auth configs and aren't sure which path to take per call, look at the auth config record. The dashboard shows whether each config is "Default (Composio-managed)" or "Custom". Programmatically, the auth config retrieve response includes an `is_composio_managed` (Python) / `isComposioManaged` (TS) boolean. Route the call based on that field:

**Python:**

```python
auth_config = composio.auth_configs.get("ac_abc")

if auth_config.is_composio_managed:
    request = composio.connected_accounts.link(
        user_id="user_123",
        auth_config_id="ac_abc",
    )
else:
    request = composio.connected_accounts.initiate(
        user_id="user_123",
        auth_config_id="ac_abc",
    )
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const authConfig = await composio.authConfigs.get('ac_abc');

const request = authConfig.isComposioManaged
  ? await composio.connectedAccounts.link('user_123', 'ac_abc')
  : await composio.connectedAccounts.initiate('user_123', 'ac_abc');
```

For most integrations the auth config is hard-coded per integration, so you'll know up front which path to use and can drop the branching.

# Related

* [Connected accounts → Multiple accounts](/docs/auth-configuration/connected-accounts#multiple-accounts) — using `link()` for multi-account flows
* [Authenticating tools → Hosted Authentication](/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link) — the canonical `link()` flow
* [Changelog: Link Auth Migration](/docs/changelog/2026/04/24) — the announcement

---
