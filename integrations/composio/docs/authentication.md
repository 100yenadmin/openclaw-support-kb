---
type: composio_doc
title: "Authentication"
source: "https://docs.composio.dev/docs/authentication.md"
source_hash: "5fdd1384e661db442e8a78a9403168b454d457bcce40ce62a1582fb028176f84"
system: "composio"
kb_namespace: "composio"
doc_path: "authentication.md"
original_doc_path: "authentication.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Authentication (/docs/authentication)
Source: https://docs.composio.dev/docs/authentication.md


Composio organizes everything around your **users**. A user is whoever your agent acts on behalf of: a person in your app, identified by a [`userID`](/docs/how-composio-works) you choose. Authentication is always per user. Each user connects their own accounts, their Gmail, their GitHub, their Slack, and Composio stores and refreshes those credentials against that `userID`.

This is the core idea: your agent runs the same tools for many people, and every tool call runs as a specific user against that user's connected accounts. User A's agent never touches user B's data. You pass the `userID` when you create a session, and Composio handles the auth from there.

Because connections are stored under the `userID`, use a stable identifier, like your database ID, never one that can change.

**userID best practices**

    * **Recommended:** database UUID or primary key (`user.id`)
    * **Acceptable:** unique username (`user.username`)
    * **Avoid:** email addresses (they can change)
    * **Never:** `default` in production (it exposes other users' data)

Your users connect their accounts through a secure [Connect Link](/reference/api-reference/connected-accounts/postConnectedAccountsLink), and Composio manages their tokens for you.

## How Composio handles authentication [#how-composio-handles-authentication]

Every session includes the [`COMPOSIO_MANAGE_CONNECTIONS`](/toolkits/meta-tools/manage_connections) meta tool. When a tool needs an account, it reads the toolkit's **auth config** (how that toolkit authenticates: method, scopes, credentials), creates a connection, and returns a secure [Connect Link](/reference/api-reference/connected-accounts/postConnectedAccountsLink). This works for all Composio managed connections, so you don't have to set up any OAuth credentials yourself.

The user signs in on the hosted link and Composio stores the resulting connected account. Credentials never pass through your app or the model, so it's safe to surface the link right in the chat.

You only need a [custom auth config](/docs/authentication/custom-app-vs-managed-app) to bring your own OAuth app, request specific scopes, or use a toolkit without managed auth.

## In-chat authentication [#in-chat-authentication]

You can also call `COMPOSIO_MANAGE_CONNECTIONS` yourself, intercept the Connect Link, and surface it wherever you need: DM it to the user, render it in your own UI, or email it. See [redirect auth links](/examples/general-agent-with-pi#redirect-auth-links) for a worked example.

### Custom callback URL [#custom-callback-url]

To send users back to your app after they connect, pass a `callback_url`:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    manage_connections={"callback_url": "https://yourapp.com/chat"},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  manageConnections: { callbackUrl: "https://yourapp.com/chat" },
});
```

## Manually triggering authentication [#manually-triggering-authentication]

Don't want to wait for the agent? Call `session.authorize()` to generate a Connect Link on demand, for onboarding, a settings page, or a pre-flight check before a task.

- [Manual auth management](/docs/authentication/manually-authenticating): Generate Connect Links yourself, check connection status, and disable in-chat prompts.

- [Multiple connected accounts](/docs/authentication/managing-multiple-connected-accounts): Let one user choose between work, personal, or other accounts.

- [Shared connections](/docs/extending-sessions/shared-connections): Share one connected account with a controlled set of users.

- [Import existing connections](/docs/authentication/importing-existing-connections): Bring credentials your application already stores into Composio.

- [Managed vs custom auth](/docs/authentication/custom-app-vs-managed-app): Decide whether to use Composio credentials or your own OAuth app.

- [Programmatic auth configs](/docs/authentication/programmatic-auth-configs): Create auth configs in code and attach them to sessions.

- [Control OAuth scopes](/docs/authentication/controlling-scopes): Choose the permissions requested when a user connects.

- [White-label authentication](/docs/authentication/white-labeling-authentication): Use your own OAuth app and remove Composio branding.

---
