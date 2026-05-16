---
type: composio_doc
title: "Migrating from Experimental Tool Router"
source: "https://docs.composio.dev/docs/migration-guide/tool-router-beta.md"
source_hash: "cf839fd134787c25165291fb3885b0b16cac823710291b4a560939ed86d7be75"
system: "composio"
kb_namespace: "composio"
doc_path: "migration-guide/tool-router-beta.md"
original_doc_path: "migration-guide/tool-router-beta.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Migrating from Experimental Tool Router (/docs/migration-guide/tool-router-beta)
Source: https://docs.composio.dev/docs/migration-guide/tool-router-beta.md


This guide is for users who adopted the **experimental tool router** (`composio.experimental.tool_router`) during its beta period. The tool router has now graduated to a stable, first-class feature called **sessions** — with a simpler API, better auth handling, and full framework support.

If you never used `composio.experimental.tool_router`, you can skip this guide and head straight to the [Quickstart](/docs/quickstart).

# The basics

#### Upgrade composio package

Upgrade to the latest stable version:

**Python:**

```bash
pip install --upgrade composio
```

**TypeScript:**

```bash
npm install @composio/core@latest
```

#### Update session creation

**Python:**

```python
# Beta (before)
session = composio.experimental.tool_router.create_session(
    user_id="user@example.com"
)

# Stable (after)
session = composio.create(
    user_id="user@example.com"
)
```

**TypeScript:**

```typescript
// Beta (before)
const session = await composio.experimental.toolRouter.createSession('user_123');

// Stable (after)
const session = await composio.create('user_123');
```

#### Moving users (optional)

If you have existing users on tool router and you don't want them to authenticate again:

    * Tool Router will auto-detect auth configs and connected accounts it created (from the beta version).
    * If you have custom auth configs (not created by Tool Router):
      * Search for the Auth config for that connected account. See [Connected Accounts](/docs/auth-configuration/connected-accounts) to fetch existing accounts programmatically.
      * While creating a session configure to use this Auth config.
      * You need to repeat this for each toolkit you want to enable for that session.

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        "slack": "ac_your_slack_config"
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create('user_123',
    {
        authConfigs: {
            github: "ac_your_github_config",
            slack: "ac_your_slack_config",
        },
    }
);
```

# Get started

- [Quickstart](/docs/quickstart): Build your first agent with the stable sessions API

- [Configuring Sessions](/docs/configuring-sessions): Restrict toolkits, set auth configs, and select connected accounts

---
