---
type: composio_doc
title: "Creating triggers"
source: "https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md"
source_hash: "bfc3dc20659aaf95aa409e670edb43e7c8ff1867cea7cdb59663e3e7afc40be3"
doc_path: "setting-up-triggers/creating-triggers.md"
original_doc_path: "setting-up-triggers/creating-triggers.md"
duplicate_index: 1
---

# Creating triggers (/docs/setting-up-triggers/creating-triggers)
Source: https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md


Create a trigger to start receiving events. A trigger watches for a specific event (e.g., `GITHUB_COMMIT_EVENT`) on a specific user's connected account. For an overview of how triggers work, see [Triggers](/docs/triggers).

> **Prerequisites**: Before creating triggers, ensure you have:

  * An [auth config](/docs/authentication#how-composio-manages-authentication) for the toolkit you want to monitor
  * A connected account for the user whose events you want to capture

You can create triggers using the [SDK](#using-the-sdk) or the Composio [dashboard](#using-the-dashboard).

# Using the SDK

Before creating a trigger, inspect the trigger type to see what configuration it requires. Then create the trigger with the required config.

> When you pass a `user_id`, the SDK automatically finds the user's connected account for the relevant toolkit. If the user has multiple connected accounts for the same toolkit, it uses the most recently created one. You can also pass a `connected_account_id`/`connectedAccountId` directly if you need more control.

**Python:**

```python
from composio import Composio

composio = Composio()
user_id = "user-id-123435"

# Check what configuration is required
trigger_type = composio.triggers.get_type("GITHUB_COMMIT_EVENT")
print(trigger_type.config)
# Returns: {"properties": {"owner": {...}, "repo": {...}}, "required": ["owner", "repo"]}

# Create trigger with the required config
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

// Check what configuration is required
const triggerType = await composio.triggers.getType("GITHUB_COMMIT_EVENT");
console.log(triggerType.config);
// Returns: {"properties": {"owner": {...}, "repo": {...}}, "required": ["owner", "repo"]}

// Create trigger with the required config
const trigger = await composio.triggers.create(
    userId,
    'GITHUB_COMMIT_EVENT',
    {
        triggerConfig: {
            owner: 'your-repo-owner',
            repo: 'your-repo-name'
        }
    }
);
console.log(`Trigger created: ${trigger.triggerId}`);
```

> Trigger instances default to the `'latest'` toolkit version. If your code parses trigger payloads programmatically against a fixed schema, you can pin a specific version at SDK initialization. See [Toolkit Versioning](/docs/tools-direct/toolkit-versioning#choosing-between-latest-and-a-pinned-version) for details.

# Using the dashboard

1. Navigate to [Auth Configs](https://platform.composio.dev?next_page=%2Fauth-configs) and select the auth config for the relevant toolkit
2. Navigate to **Active Triggers** and click **Create Trigger**
3. Select the connected account for which you want to create a trigger
4. Choose a trigger type and fill in the required configuration
5. Click **Create Trigger**

# What to read next

- [Subscribing to events](/docs/setting-up-triggers/subscribing-to-events): Receive trigger events via webhooks or SDK subscriptions

- [Managing triggers](/docs/setting-up-triggers/managing-triggers): List, enable, disable, and delete trigger instances

---
