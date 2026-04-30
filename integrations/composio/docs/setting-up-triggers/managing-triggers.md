---
type: composio_doc
title: "Managing triggers"
source: "https://docs.composio.dev/docs/setting-up-triggers/managing-triggers.md"
source_hash: "556ddfabf64878167f6ec4fb8161634daae92f985820179fdcf1af757a8dfbc9"
doc_path: "setting-up-triggers/managing-triggers.md"
original_doc_path: "setting-up-triggers/managing-triggers.md"
duplicate_index: 1
---

# Managing triggers (/docs/setting-up-triggers/managing-triggers)
Source: https://docs.composio.dev/docs/setting-up-triggers/managing-triggers.md


# Listing active triggers

List trigger instances that have been created. Results are cursor-paginated.

**Python:**

```python
from composio import Composio

composio = Composio()

active = composio.triggers.list_active(
    connected_account_ids=["ca_def456"],
)

for trigger in active.items:
    print(f"{trigger.id} ({trigger.trigger_name}) - disabled_at={trigger.disabled_at}")

# Paginate with cursor
if active.next_cursor:
    next_page = composio.triggers.list_active(cursor=active.next_cursor)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();

const active = await composio.triggers.listActive({
  connectedAccountIds: ['ca_def456'],
});

for (const trigger of active.items) {
  console.log(`${trigger.id} (${trigger.triggerName}) - disabled: ${trigger.disabledAt !== null}`);
}

// Paginate with cursor
if (active.nextCursor) {
  const nextPage = await composio.triggers.listActive({ cursor: active.nextCursor });
}
```

| Filter                                          | Description                                  |
| ----------------------------------------------- | -------------------------------------------- |
| `connected_account_ids` / `connectedAccountIds` | Array of connected account IDs               |
| `trigger_ids` / `triggerIds`                    | Array of trigger instance IDs                |
| `trigger_names` / `triggerNames`                | Array of trigger type slugs                  |
| `auth_config_ids` / `authConfigIds`             | Array of auth config IDs                     |
| `show_disabled` / `showDisabled`                | Include disabled triggers (default: `false`) |

# Enable / Disable triggers

Pause a trigger temporarily without deleting it:

**Python:**

```python
# Disable a trigger
composio.triggers.disable(trigger_id="ti_abcd123")

# Re-enable when needed
composio.triggers.enable(trigger_id="ti_abcd123")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio();
// Disable a trigger
await composio.triggers.disable('ti_abcd123');

// Re-enable when needed
await composio.triggers.enable('ti_abcd123');
```

You can also toggle triggers from the dashboard:

1. Go to [Auth Configs](https://platform.composio.dev?next_page=/auth-configs) and select your auth config
2. Navigate to **Active Triggers**
3. Toggle the trigger on or off

![Enable/disable triggers from the dashboard](/images/trigger-enable-disable.png)
*Enable/disable triggers from the dashboard*

# Deleting triggers

Permanently remove a trigger instance:

**Python:**

```python
composio.triggers.delete(trigger_id="ti_abcd123")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio();
await composio.triggers.delete('ti_abcd123');
```

> Deleting a trigger is permanent. Use `disable()` instead to temporarily stop receiving events.

# What to read next

- [Creating triggers](/docs/setting-up-triggers/creating-triggers): Create trigger instances to start receiving events from connected apps

- [Subscribing to events](/docs/setting-up-triggers/subscribing-to-events): Set up webhooks or SDK subscriptions to handle trigger events

- [Verifying webhooks](/docs/webhook-verification): Validate webhook signatures to ensure payloads are authentic

---
