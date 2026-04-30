---
type: composio_doc
title: "Custom Auth Configs"
source: "https://docs.composio.dev/docs/auth-configuration/custom-auth-configs.md"
source_hash: "bd3bfac360730066ce5352de6b99235d2781cf592cd783f945c2823b9627ea3e"
doc_path: "auth-configuration/custom-auth-configs.md"
original_doc_path: "auth-configuration/custom-auth-configs.md"
duplicate_index: 1
---

# Custom Auth Configs (/docs/auth-configuration/custom-auth-configs)
Source: https://docs.composio.dev/docs/auth-configuration/custom-auth-configs.md


> If you're building an agent, we recommend using [sessions](/docs/configuring-sessions) instead. See [Using custom auth configs](/docs/using-custom-auth-configuration) for how to use custom credentials with sessions.

Auth configs control how users authenticate with a toolkit. By default, Composio provides managed credentials for many toolkits. You create a custom auth config when the defaults don't fit your needs.

# When to create a custom auth config

| Reason                           | Example                                                                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Toolkit has no managed auth**  | PostHog, Tavily, Perplexity: you must provide your own credentials                                                               |
| **White-labeling**               | Show your app name on OAuth consent screens instead of "Composio". See [White-labeling](/docs/auth-configuration/white-labeling) |
| **Rate limits and quota**        | Composio's default OAuth app shares quota across all users. Your own app gets a dedicated quota                                  |
| **Custom scopes**                | You need permissions beyond what Composio's default app has approved                                                             |
| **Custom instance or subdomain** | Connecting to a self-hosted or regional variant (e.g., custom Salesforce subdomain)                                              |

# Creating a custom auth config

To create a custom auth config, click **Create Auth Config** in your dashboard, then navigate to **Authentication management** → **Manage authentication with custom credentials**.

You'll need to customize the auth config when you want to use different values than the defaults - such as your own subdomain, base URL, client ID, client secret, etc.

**Example: PostHog:**

You may change the subdomain for the PostHog toolkit to match your own instance.

![PostHog Auth Config Settings](/images/custom-auth-posthog.png)
*PostHog Auth Config Settings*

**Example: Hubspot:**

For Hubspot you may customize everything here. For each auth scheme there is a different set of fields.

If you choose to use your own developer app for the OAuth2 scheme, you will have to provide the client ID and client secret.

![Hubspot Auth Config Settings](/images/custom-auth-hubspot.png)
*Hubspot Auth Config Settings*

Toolkits that support OAuth2 allow using your own developer app. This is the recommended approach for most cases.

> **Use your own developer app!**: We recommend using your own developer app for the OAuth2 scheme as it is more suited for production usage with many users and more granular control over scopes.

However, getting OAuth approvals takes time, so Composio provides a default developer app!

# OAuth2 Auth Configs

#### Generate the OAuth Client ID and Client Secret

To set up a custom OAuth config, you'll need the OAuth Client ID and Client Secret.

You can generate the client ID and client secret from the toolkit's OAuth configuration page.

Examples for Google and GitHub:

**Google:**

![Google OAuth Configuration](/images/google-oauth-config.png)
*Google OAuth Configuration*

**GitHub:**

![GitHub OAuth Configuration](/images/github-oauth-config.png)
*GitHub OAuth Configuration*

#### Set the Authorized Redirect URI

When creating your OAuth app, make sure to configure the Authorized Redirect URI to point to the Composio callback URL below:

```
https://backend.composio.dev/api/v3.1/toolkits/auth/callback
```

#### Create the auth config

Once you have the OAuth credentials, you can add them to the auth config in the dashboard.

    1. Select the OAuth2 scheme.
    2. Toggle on **Use your own developer credentials**.
    3. Enter the OAuth client ID and client secret for your developer app.
    4. Click Create!

![Auth Config Settings](/images/integration-step-3-0.png)
*Auth Config Settings*

This auth config is now ready to be used in your application!

**Python:**

```python
# Create a new connected account
connection_request = composio.connected_accounts.initiate(
    user_id="user_id",
    auth_config_id="ac_1234",
)
print(connection_request)

# Wait for the connection to be established
connected_account = connection_request.wait_for_connection()
print(connected_account)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const userId = 'user_123';
const connReq = await composio.connectedAccounts.initiate(userId, "ac_1234");

console.log(connReq.redirectUrl);

const connection = await composio.connectedAccounts.waitForConnection(
  connReq.id
);

console.log(connection);
```

# What to read next

- [Connected accounts](/docs/auth-configuration/connected-accounts): Manage and monitor user connections to toolkits

- [Programmatic auth configs](/docs/auth-configuration/programmatic-auth-configs): Create auth configs programmatically via the SDK

- [Authenticating tools](/docs/tools-direct/authenticating-tools): Create auth configs and connect user accounts

---
