---
type: composio_doc
title: "Controlling scopes"
source: "https://docs.composio.dev/docs/controlling-scopes.md"
source_hash: "35a3eb9c73f78fea227b203b65a62d1cdfebe6be5c4d4248f813c4021a2185da"
system: "composio"
kb_namespace: "composio"
doc_path: "controlling-scopes.md"
original_doc_path: "controlling-scopes.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Controlling scopes (/docs/controlling-scopes)
Source: https://docs.composio.dev/docs/controlling-scopes.md


Scopes are the permissions an OAuth toolkit grants your app: read email, write to a repo, manage calendar events. Composio requests a sensible set of default scopes for each toolkit, so most apps never set scopes at all. Override them when the defaults grant too much or too little: to follow least privilege, or to reach an API the defaults don't cover.

You control scopes on an [auth config](/docs/authentication#behind-the-scenes), then [pass that auth config to a session](#use-the-auth-config-in-a-session) so the session requests your scopes when users connect.

> Scopes apply to OAuth toolkits. Toolkits that authenticate with API keys or bearer tokens don't have scopes to set.

# Set scopes with Composio managed auth

Pass a `scopes` field in `credentials` to override the defaults while still using Composio's managed OAuth app. Give scopes as a comma-separated string.

**Python:**

```python
from composio import Composio

composio = Composio()

auth_config = composio.auth_configs.create(
    toolkit="hubspot",
    options={
        "type": "use_composio_managed_auth",
        "name": "HubSpot",
        "credentials": {"scopes": "sales-email-read,tickets"},
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const authConfig = await composio.authConfigs.create('hubspot', {
  type: 'use_composio_managed_auth',
  name: 'HubSpot',
  credentials: { scopes: 'sales-email-read,tickets' },
});
```

# Set scopes with your own OAuth app

When you bring your own OAuth credentials, put `scopes` alongside the client ID and secret. Make sure your OAuth app has those scopes approved in the provider's portal.

**Python:**

```python
import os

auth_config = composio.auth_configs.create(
    toolkit="github",
    options={
        "type": "use_custom_auth",
        "auth_scheme": "OAUTH2",
        "name": "GitHub",
        "credentials": {
            "client_id": os.environ["GITHUB_CLIENT_ID"],
            "client_secret": os.environ["GITHUB_CLIENT_SECRET"],
            "scopes": "repo,read:org",
        },
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const authConfig = await composio.authConfigs.create('github', {
  type: 'use_custom_auth',
  authScheme: 'OAUTH2',
  name: 'GitHub',
  credentials: {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    scopes: 'repo,read:org',
  },
});
```

# Update scopes on an existing config

Change the scopes on an auth config you already created without recreating it.

**Python:**

```python
composio.auth_configs.update(
    "ac_1234",
    {"type": "default", "scopes": "repo,read:org,read:user"},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
await composio.authConfigs.update('ac_1234', {
  type: 'default',
  scopes: 'repo,read:org,read:user',
});
```

> Changing scopes affects new connections only. Users with an existing [connected account](/docs/authentication#behind-the-scenes) keep the scopes they already granted until they reconnect. To apply new scopes to a current user, have them re-authenticate.

# Use the auth config in a session

Setting scopes on an auth config does nothing until a session uses it. Pass the auth config ID to `authConfigs` (keyed by toolkit) when you create the session, and the session requests your scopes when the user connects that toolkit.

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={"github": auth_config.id},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const authConfig = { id: 'ac_your_github_config' };
const session = await composio.sessions.create('user_123', {
  authConfigs: { github: authConfig.id },
});
```

# Next

- [White-labeling authentication](/docs/white-labeling-authentication): Remove Composio branding from your auth flows

---
