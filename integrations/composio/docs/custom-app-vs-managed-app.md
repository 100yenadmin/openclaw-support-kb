---
type: composio_doc
title: "Managed vs custom auth"
source: "https://docs.composio.dev/docs/custom-app-vs-managed-app.md"
source_hash: "35ccecc4b546681de463a279a599e1c686daa1012589bfd8a4cdd6032583f03e"
system: "composio"
kb_namespace: "composio"
doc_path: "custom-app-vs-managed-app.md"
original_doc_path: "custom-app-vs-managed-app.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Managed vs custom auth (/docs/custom-app-vs-managed-app)
Source: https://docs.composio.dev/docs/custom-app-vs-managed-app.md


Composio supports two ways to authenticate users with toolkits.

* **[Composio managed apps](/toolkits/managed-auth)**: Composio registers and maintains OAuth apps for popular toolkits (GitHub, Gmail, Slack, etc.). Zero setup, works out of the box.
* **Custom auth configs**: You provide your own OAuth app, API key, bearer token, or other credentials and tell Composio to use them for a toolkit.

This page covers when to use each, how to create a custom auth config, and how to wire it into a session.

# When to use Composio managed apps

Managed apps are the default. Every toolkit that supports OAuth has a Composio managed app ready to go. Use them when:

* **You're building and iterating.** No OAuth app registration, no credentials to manage. Create a session and start testing immediately.
* **Default scopes cover your needs.** Composio requests sensible defaults for each toolkit.
* **Branding on consent screens doesn't matter yet.** Users will see "Composio wants to access your account" during OAuth. Fine for internal tools, prototypes, and development. You can still [white-label the Connect Link page](/docs/white-labeling-authentication#customizing-the-connect-link) with your logo and app title without needing your own OAuth app.

# When to use a custom auth config

Bring your own credentials when any of these apply:

* **Your users see OAuth consent screens.** In production, users should see your app name, not "Composio." This is the most common reason to switch.
* **You need custom scopes.** Composio's default scopes may not include everything you need (e.g., write access to a specific Google API).
* **You're hitting rate limits.** Managed apps share quota across all Composio users. Your own app gets a dedicated quota.
* **You need faster polling triggers.** Managed auth enforces a 15-minute minimum polling interval; your own app can use shorter polling intervals where supported.
* **You're connecting to a custom instance.** Self-hosted or regional variants (e.g., a private Salesforce subdomain) need their own OAuth app.
* **Enterprise customers require your branding end-to-end.**

# Create a custom auth config

To check whether a toolkit already has a Composio managed app, see the [managed auth toolkit list](/toolkits/managed-auth). You can still create a custom auth config for branding, scopes, rate limits, polling intervals, or custom instances.

The steps below use the dashboard. To create auth configs in code instead, for example one per customer, see [Programmatic auth configs](/docs/programmatic-auth-configs).

#### Create the auth config in the Composio dashboard

In the [Composio dashboard](https://dashboard.composio.dev/~/project/auth-configs):

    1. Click **Create Auth Config**
    2. Select the toolkit
    3. Choose the auth scheme (OAuth2, API Key, Bearer Token, etc.)
    4. Follow the dashboard instructions for the required credential fields

For OAuth toolkits, the dashboard shows the redirect URI to add in the provider's developer portal.

#### Collect credentials from the provider

For OAuth toolkits, register an app in the provider's developer portal and add the redirect URI from the dashboard. Then copy the **Client ID** and **Client Secret** back into Composio.

For API key, bearer token, basic auth, or other auth schemes, collect the credential fields the toolkit requires and enter them in the dashboard.

Step-by-step OAuth guides: [Google](https://composio.dev/auth/googleapps) | [GitHub](https://composio.dev/auth/github) | [Slack](https://composio.dev/auth/slack) | [HubSpot](https://composio.dev/auth/hubspot) | [All toolkits](https://composio.dev/auth)

#### Save and copy the auth config ID

After you enter the required credentials, click **Create** and copy the auth config ID (for example, `ac_1234abcd`).

#### Pass the auth config ID in your session

Creating the auth config isn't enough on its own. A session uses your config only when you pass its ID to `authConfigs`, keyed by toolkit. Toolkits you leave out keep using Composio managed auth.

**Python:**

```python
from composio import Composio

composio = Composio()
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        # toolkits not listed here still use Composio managed auth
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const session = await composio.sessions.create("user_123", {
  authConfigs: {
    github: "ac_your_github_config",
    // toolkits not listed here still use Composio managed auth
  },
});
```

# Mixing per toolkit

You don't have to pick one approach for all toolkits. Use your own credentials for toolkits where users see consent screens (GitHub, Google, Slack) and Composio managed auth for the rest. Each toolkit gets its own auth config independently.

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        "google": "ac_your_google_config",
        # everything else uses Composio managed auth automatically
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio();
const session = await composio.sessions.create("user_123", {
  authConfigs: {
    github: "ac_your_github_config",
    google: "ac_your_google_config",
    // everything else uses Composio managed auth automatically
  },
});
```

## Toolkits without managed auth

Some toolkits don't have Composio managed auth. For these, the setup is the same as above, except the provider may ask for API keys or instance details instead of OAuth credentials. Browse the full list on the [managed auth page](/toolkits/managed-auth) or check individual toolkit pages on the [toolkits page](/toolkits).

# Next

- [Programmatic auth configs](/docs/programmatic-auth-configs): Create auth configs in code and pass them to a session

---
