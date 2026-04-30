---
type: composio_doc
title: "Using custom auth configuration"
source: "https://docs.composio.dev/docs/using-custom-auth-configuration.md"
source_hash: "fcd3e683d1e721eec2e88491af4ad7310f3379abdc6b5dc431878d95b5f6c09b"
doc_path: "using-custom-auth-configuration.md"
original_doc_path: "using-custom-auth-configuration.md"
duplicate_index: 1
---

# Using custom auth configuration (/docs/using-custom-auth-configuration)
Source: https://docs.composio.dev/docs/using-custom-auth-configuration.md


You create a custom auth config when you need to provide your own credentials for a toolkit. Common reasons:

* **Toolkit has no managed auth**: PostHog, Tavily, Perplexity, etc. require your own credentials
* **White-labeling**: Show your app name on OAuth consent screens instead of "Composio". See [White-labeling authentication](/docs/white-labeling-authentication)
* **Rate limits**: Composio's default OAuth app shares quota across all users. Your own app gets a dedicated quota
* **Faster polling triggers**: Composio managed auth enforces a 15-minute minimum polling interval. Your own OAuth app can use shorter polling intervals where supported
* **Custom scopes**: You need permissions beyond what Composio's default app has approved
* **Custom instance**: Connecting to a self-hosted or regional variant (e.g., custom Salesforce subdomain)

#### Check if a toolkit needs custom credentials

In the [Composio platform](https://platform.composio.dev), go to "All Toolkits" and select the toolkit. If it shows no Composio managed auth schemes, you'll need to create an auth config. You can also browse the full list on the [managed auth page](/toolkits/managed-auth).

#### Create an auth config

    1. Go to **Authentication management** in the [dashboard](https://platform.composio.dev)
    2. Click **Create Auth Config**
    3. Select the toolkit
    4. Choose the auth scheme (OAuth2, API Key, etc.)
    5. Enter your credentials (client ID, client secret, API key, etc.)
    6. Click **Create**

Copy the auth config ID (e.g., `ac_1234abcd`).

> Step-by-step guides for popular toolkits: [Google](https://composio.dev/auth/googleapps) | [GitHub](https://composio.dev/auth/github) | [Slack](https://composio.dev/auth/slack) | [HubSpot](https://composio.dev/auth/hubspot) | [All toolkits](https://composio.dev/auth)

#### Use in your session

Pass your auth config ID when creating a session:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={
        "posthog": "ac_your_posthog_config"
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  authConfigs: {
    posthog: "ac_your_posthog_config",
  },
});
```

Your session will now use this auth config when users connect to this toolkit.

# What to read next

- [When to use your own developer credentials](/docs/custom-app-vs-managed-app): Decide when to use Composio managed auth and when to bring your own

- [White-labeling authentication](/docs/white-labeling-authentication): Use your own OAuth apps so users see your branding on consent screens

- [Authentication overview](/docs/authentication): Connect Links, OAuth, API keys, and how Composio manages auth

- [Configuring sessions](/docs/configuring-sessions): Pass auth configs, connected accounts, and toolkit restrictions to sessions

---
