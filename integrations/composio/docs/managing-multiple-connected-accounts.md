---
type: composio_doc
title: "Managing multiple connected accounts"
source: "https://docs.composio.dev/docs/managing-multiple-connected-accounts.md"
source_hash: "f53bafb8e0bdb1e1fe59fac465588c6ee317e5cc5503b6f051da59a75e1dc1da"
system: "composio"
kb_namespace: "composio"
doc_path: "managing-multiple-connected-accounts.md"
original_doc_path: "managing-multiple-connected-accounts.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Managing multiple connected accounts (/docs/managing-multiple-connected-accounts)
Source: https://docs.composio.dev/docs/managing-multiple-connected-accounts.md


Users can connect multiple accounts for the same toolkit (e.g., personal and work Gmail accounts). This guide covers how to enable multi-account mode, label accounts with aliases, and select which account to use.

# Multi-account mode [#multi-account-mode]

By default, each session uses **one account per toolkit**. Enable multi-account mode to let users connect and use multiple accounts for the same toolkit within a single session.

**Python:**

```python
session = composio.create(
    user_id="user_123",
    toolkits=["gmail"],
    multi_account={
        "enable": True,
        "max_accounts_per_toolkit": 3,
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  toolkits: ["gmail"],
  multiAccount: {
    enable: true,
    maxAccountsPerToolkit: 3,
  },
});
```

## Configuration options [#configuration-options]

| Option (TS / Python)                                      | Type      | Default | Description                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enable`                                                  | `boolean` | `false` | Enable multi-account mode for this session                                                                                                                                                                                                                                                                                                                           |
| `maxAccountsPerToolkit` / `max_accounts_per_toolkit`      | `number`  | `5`     | Maximum connected accounts per toolkit (2-10)                                                                                                                                                                                                                                                                                                                        |
| `requireExplicitSelection` / `require_explicit_selection` | `boolean` | `false` | When true and a toolkit has multiple active connected accounts, the agent must provide the `account` parameter in the tool execution call to select which account to use. `account` can be either a connected account ID or an alias (see the Aliases section below). When false, the default account (most recently connected active account) is used automatically |

When multi-account mode is disabled (the default), each session uses the most recently connected account for each toolkit.

# Connecting multiple accounts [#connecting-multiple-accounts]

Call `session.authorize()` multiple times for the same toolkit. Each call creates a separate connected account.

**Python:**

```python
session = composio.create(user_id="user_123", multi_account={"enable": True})

# Connect work account
work_auth = session.authorize("gmail", alias="work-gmail")
print(f"Connect work Gmail: {work_auth.redirect_url}")
work_connection = work_auth.wait_for_connection()

# Connect personal account
personal_auth = session.authorize("gmail", alias="personal-gmail")
print(f"Connect personal Gmail: {personal_auth.redirect_url}")
personal_connection = personal_auth.wait_for_connection()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  toolkits: ["gmail"],
  multiAccount: { enable: true },
});

// Connect work account
const workAuth = await session.authorize("gmail", { alias: "work-gmail" });
console.log(`Connect work Gmail: ${workAuth.redirectUrl}`);
const workConnection = await workAuth.waitForConnection();

// Connect personal account
const personalAuth = await session.authorize("gmail", { alias: "personal-gmail" });
console.log(`Connect personal Gmail: ${personalAuth.redirectUrl}`);
const personalConnection = await personalAuth.waitForConnection();
```

# Aliases [#aliases]

Aliases are human-readable labels for connected accounts (e.g., `"work-gmail"`, `"personal-github"`). They make it easier for agents and users to identify which account is which.

* Must be unique per user and toolkit within a project
* Can be set during connection or updated after

## Setting an alias during connection [#setting-an-alias-during-connection]

Pass `alias` to `session.authorize()`:

**Python:**

```python
session = composio.create(user_id="user_123")

connection_request = session.authorize("gmail", alias="work-gmail")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const connectionRequest = await session.authorize("gmail", { alias: "work-gmail" });
```

The direct-execution methods `connectedAccounts.initiate()` and `connectedAccounts.link()` accept the same `alias` parameter.

## Updating or clearing an alias [#updating-or-clearing-an-alias]

**Python:**

```python
# Set or update an alias
composio.connected_accounts.update("ca_abc123", alias="work-gmail")

# Clear an alias
composio.connected_accounts.update("ca_abc123", alias="")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// Set or update an alias
await composio.connectedAccounts.update("ca_abc123", { alias: "work-gmail" });

// Clear an alias
await composio.connectedAccounts.update("ca_abc123", { alias: "" });
```

# Selecting a specific account for a session [#selecting-a-specific-account-for-a-session]

Pin a session to specific accounts by passing their IDs in the session config. To retrieve connected account IDs, see [List accounts](/docs/auth-configuration/connected-accounts#list-accounts).

**Python:**

```python
session = composio.create(
    user_id="user_123",
    connected_accounts={
        "gmail": ["ca_work_gmail_id"],
        "github": ["ca_personal_github_id"],
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  connectedAccounts: {
    gmail: ["ca_work_gmail_id"],
    github: ["ca_personal_github_id"],
  },
});
```

# Viewing session's active accounts [#viewing-sessions-active-accounts]

Use `session.toolkits()` to see which accounts are currently active:

**Python:**

```python
toolkits = session.toolkits()

for toolkit in toolkits.items:
    if toolkit.connection and toolkit.connection.connected_account:
        print(f"{toolkit.name}: {toolkit.connection.connected_account.id}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const toolkits = await session.toolkits();

for (const toolkit of toolkits.items) {
  if (toolkit.connection?.connectedAccount) {
    console.log(`${toolkit.name}: ${toolkit.connection.connectedAccount.id}`);
  }
}
```

# Next [#next]

- [Shared connections](/docs/shared-connections): Make one connected account usable by multiple users with a per-user access control list

---
