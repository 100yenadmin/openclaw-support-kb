---
type: composio_doc
title: "Creating triggers"
source: "https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md"
source_hash: "f4d1941d857eeabd58d5fa16e8df270f419fbe64f091bc4463d0cd38be8db95f"
system: "composio"
kb_namespace: "composio"
doc_path: "setting-up-triggers/creating-triggers.md"
original_doc_path: "setting-up-triggers/creating-triggers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Creating triggers (/docs/setting-up-triggers/creating-triggers)
Source: https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md


A trigger watches for one event (like `GITHUB_COMMIT_EVENT`) on one user's connected account. Create one, and events start flowing to your [subscription or webhook URL](/docs/setting-up-triggers/subscribing-to-events). For the bigger picture, see [Triggers](/docs/triggers).

The user needs a [connected account](/docs/authentication) for the toolkit you want to monitor. See [Authentication](/docs/authentication) if you haven't set that up.

# Inspect the trigger type [#inspect-the-trigger-type]

Each trigger type declares the config it needs. Check it before you create, so you pass the right fields.

**Python:**

```python
from composio import Composio

composio = Composio()

trigger_type = composio.triggers.get_type("GITHUB_COMMIT_EVENT")
print(trigger_type.config)
# {"properties": {"owner": {...}, "repo": {...}}, "required": ["owner", "repo"]}
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();

const triggerType = await composio.triggers.getType('GITHUB_COMMIT_EVENT');
console.log(triggerType.config);
// {"properties": {"owner": {...}, "repo": {...}}, "required": ["owner", "repo"]}
```

# Create the trigger [#create-the-trigger]

Pass the user, the trigger slug, and the config the type requires.

**Python:**

```python
from composio import Composio

composio = Composio()
user_id = "user-id-123435"

# The user needs a connected account for this toolkit before this runs.
# Set it up first. See /docs/authentication.
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id=user_id,
    trigger_config={"owner": "your-repo-owner", "repo": "your-repo-name"},
)
print(f"Trigger created: {trigger.trigger_id}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();
const userId = 'user-id-123435';

// The user needs a connected account for this toolkit before this runs.
// Set it up first. See /docs/authentication.
const trigger = await composio.triggers.create(userId, 'GITHUB_COMMIT_EVENT', {
  triggerConfig: { owner: 'your-repo-owner', repo: 'your-repo-name' },
});
console.log(`Trigger created: ${trigger.triggerId}`);
```

You only pass a `user_id`. Composio resolves that user's connected account for the toolkit automatically.

## Targeting a specific connected account [#targeting-a-specific-connected-account]

If a user has more than one connected account for the toolkit, Composio uses the first active connection for the user and the trigger's toolkit. Pass a connected account ID to pick exactly which account the trigger watches.

**Python:**

```python
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id=user_id,
    connected_account_id="ca_def456",
    trigger_config={"owner": "your-repo-owner", "repo": "your-repo-name"},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio();
const userId = 'user-id-123435';
const trigger = await composio.triggers.create(userId, 'GITHUB_COMMIT_EVENT', {
  connectedAccountId: 'ca_def456',
  triggerConfig: { owner: 'your-repo-owner', repo: 'your-repo-name' },
});
```

Trigger instances default to the `'latest'` toolkit version. If you parse payloads against a fixed schema, [pin a version](/docs/tools-direct/toolkit-versioning#choosing-between-latest-and-a-pinned-version) at SDK initialization.

That's it. The trigger is active. Next, [receive its events](/docs/setting-up-triggers/subscribing-to-events).

# Next [#next]

- [Receiving events](/docs/setting-up-triggers/subscribing-to-events): Get trigger events locally with the SDK or in production over your webhook URL

---
