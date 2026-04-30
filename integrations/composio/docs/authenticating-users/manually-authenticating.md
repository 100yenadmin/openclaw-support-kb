---
type: composio_doc
title: "Manually authenticating users"
source: "https://docs.composio.dev/docs/authenticating-users/manually-authenticating.md"
source_hash: "efe97bb90e954f9301d39a171ea76f8a77e2772869bfa07a6d61a868d0fcf03b"
doc_path: "authenticating-users/manually-authenticating.md"
original_doc_path: "authenticating-users/manually-authenticating.md"
duplicate_index: 1
---

# Manually authenticating users (/docs/authenticating-users/manually-authenticating)
Source: https://docs.composio.dev/docs/authenticating-users/manually-authenticating.md


Manual authentication lets you connect users to toolkits outside of the chat flow. Use this when you want to:

* Pre-authenticate users before they start chatting
* Build a custom connections UI in your app

# Authorize a toolkit

Use `session.authorize()` to generate a [Connect Link](/docs/tools-direct/authenticating-tools#hosted-authentication-connect-link) URL, redirect the user, and wait for them to complete:

**Python:**

```python
session = composio.create(user_id="user_123")

connection_request = session.authorize("gmail")

print(connection_request.redirect_url)
# https://connect.composio.dev/link/ln_abc123

connected_account = connection_request.wait_for_connection(60000)
print(f"Connected: {connected_account.id}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");

const connectionRequest = await session.authorize("gmail");

console.log(connectionRequest.redirectUrl);
// https://connect.composio.dev/link/ln_abc123

const connectedAccount = await connectionRequest.waitForConnection(60000);
console.log(`Connected: ${connectedAccount.id}`);
```

Redirect the user to the redirect URL. After they authenticate, they'll return to your callback URL. The connection request polls until the user completes authentication (default timeout: 60 seconds).

> If the user closes the Connect Link without completing auth, the connection remains in `INITIATED` status until it expires.

# Redirecting users after authentication

Pass a `callbackUrl` to control where users land after authenticating. You can include query parameters to carry context through the flow, for example to identify which user or session triggered the connection.

**Python:**

```python
connection_request = session.authorize(
    "gmail",
    callback_url="https://your-app.com/callback?user_id=user_123&source=onboarding"
)

print(connection_request.redirect_url)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const connectionRequest = await session.authorize("gmail", {
  callbackUrl: "https://your-app.com/callback?user_id=user_123&source=onboarding",
});

console.log(connectionRequest.redirectUrl);
```

After authentication, Composio redirects the user to your callback URL with the following parameters appended, while preserving your existing ones:

| Parameter              | Description                                   |
| ---------------------- | --------------------------------------------- |
| `status`               | `success` or `failed`                         |
| `connected_account_id` | The ID of the newly created connected account |

```
https://your-app.com/callback?user_id=user_123&source=onboarding&status=success&connected_account_id=ca_abc123
```

# Check connection status

Use `session.toolkits()` to see all toolkits in the session and their connection status:

**Python:**

```python
toolkits = session.toolkits()

for toolkit in toolkits.items:
    status = toolkit.connection.connected_account.id if toolkit.connection.is_active else "Not connected"
    print(f"{toolkit.name}: {status}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const toolkits = await session.toolkits();

toolkits.items.forEach((toolkit) => {
  console.log(`${toolkit.name}: ${toolkit.connection?.connectedAccount?.id ?? "Not connected"}`);
});
```

# Disabling in-chat auth

By default, sessions include the `COMPOSIO_MANAGE_CONNECTIONS` meta-tool that prompts users to authenticate during chat. To disable this and handle auth entirely in your UI:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    manage_connections=False,
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  manageConnections: false,
});
```

# Putting it together

A common pattern is to verify all required connections before starting the agent:

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your-api-key")

required_toolkits = ["gmail", "github"]

session = composio.create(
    user_id="user_123",
    manage_connections=False,  # Disable in-chat auth prompts
)

toolkits = session.toolkits()

connected = {t.slug for t in toolkits.items if t.connection.is_active}
pending = [slug for slug in required_toolkits if slug not in connected]

print(f"Connected: {connected}")
print(f"Pending: {pending}")

for slug in pending:
    connection_request = session.authorize(slug)
    print(f"Connect {slug}: {connection_request.redirect_url}")
    connection_request.wait_for_connection()

print(f"All toolkits connected! MCP URL: {session.mcp.url}")
```

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: "your-api-key" });

const requiredToolkits = ["gmail", "github"];

const session = await composio.create("user_123", {
  manageConnections: false, // Disable in-chat auth prompts
});

const toolkits = await session.toolkits();

const connected = toolkits.items
  .filter((t) => t.connection?.connectedAccount)
  .map((t) => t.slug);

const pending = requiredToolkits.filter((slug) => !connected.includes(slug));

console.log("Connected:", connected);
console.log("Pending:", pending);

for (const slug of pending) {
  const connectionRequest = await session.authorize(slug);
  console.log(`Connect ${slug}: ${connectionRequest.redirectUrl}`);
  await connectionRequest.waitForConnection();
}

console.log(`All toolkits connected! MCP URL: ${session.mcp.url}`);
```

# What to read next

- [Build an App Connections Dashboard](/cookbooks/app-connections-dashboard): Full working example of a connections page with OAuth and disconnect

- [In-chat authentication](/docs/authenticating-users/in-chat-authentication): Let the agent prompt users to connect accounts during conversation instead

- [White-labeling authentication](/docs/white-labeling-authentication): Use your own OAuth apps so users see your branding on consent screens

- [Managing multiple accounts](/docs/managing-multiple-connected-accounts): Handle users with multiple accounts for the same toolkit (e.g., work and personal Gmail)

---
