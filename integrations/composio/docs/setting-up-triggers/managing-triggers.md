---
type: composio_doc
title: "Managing triggers"
source: "https://docs.composio.dev/docs/setting-up-triggers/managing-triggers.md"
source_hash: "be62d7b601bf7789230b4c4ed7313c490f3265124ea68e913487b5ead580cafa"
system: "composio"
kb_namespace: "composio"
doc_path: "setting-up-triggers/managing-triggers.md"
original_doc_path: "setting-up-triggers/managing-triggers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Managing triggers (/docs/setting-up-triggers/managing-triggers)
Source: https://docs.composio.dev/docs/setting-up-triggers/managing-triggers.md


After a trigger is created, you manage it over its lifecycle: list active instances, pause one with `disable()`, bring it back with `enable()`, or remove it for good with `delete()`.

# Listing active triggers [#listing-active-triggers]

List the trigger instances you've created. Results are cursor-paginated.

**Python:**

```python
from composio import Composio

composio = Composio()

active = composio.triggers.list_active(
    connected_account_ids=["ca_def456"],
)

for trigger in active.items:
    print(f"{trigger.id} ({trigger.trigger_name}) - disabled: {trigger.disabled_at is not None}")

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

# Enable / Disable triggers [#enable--disable-triggers]

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

# Deleting triggers [#deleting-triggers]

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

---
