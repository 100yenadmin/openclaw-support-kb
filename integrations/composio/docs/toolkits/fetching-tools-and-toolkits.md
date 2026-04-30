---
type: composio_doc
title: "Fetching tools and toolkits"
source: "https://docs.composio.dev/docs/toolkits/fetching-tools-and-toolkits.md"
source_hash: "0b3bb87befd7de370313dfa48c3af0f9e0d15c7d3bf179094973346b91c87fb3"
doc_path: "toolkits/fetching-tools-and-toolkits.md"
original_doc_path: "toolkits/fetching-tools-and-toolkits.md"
duplicate_index: 1
---

# Fetching tools and toolkits (/docs/toolkits/fetching-tools-and-toolkits)
Source: https://docs.composio.dev/docs/toolkits/fetching-tools-and-toolkits.md


# Fetching for a session

When using sessions, fetch tools through the session object.

## List enabled toolkits

`session.toolkits()` returns toolkits enabled for your session, sorted by popularity. By default, it returns the top 20. Each toolkit includes its `slug`, `name`, `logo`, and connection status.

**Python:**

```python
session = composio.create(user_id="user_123")

result = session.toolkits()

for toolkit in result.items:
    print(f"{toolkit.name}: connected={toolkit.connection.is_active if toolkit.connection else 'n/a'}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");

const result = await session.toolkits();

for (const toolkit of result.items) {
  console.log(`${toolkit.name}: connected=${toolkit.connection?.isActive ?? 'n/a'}`);
}
```

You can filter to only show connected toolkits:

**Python:**

```python
connected = session.toolkits(is_connected=True)  # Only connected
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const connected = await session.toolkits({ isConnected: true });  // Only connected
```

To fetch all toolkits, paginate through the results:

**Python:**

```python
all_toolkits = []
cursor = None

while True:
    result = session.toolkits(limit=20, next_cursor=cursor)
    all_toolkits.extend(result.items)
    cursor = result.next_cursor
    if not cursor:
        break
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const allToolkits: any[] = [];
let cursor: string | undefined;

do {
  const { items, nextCursor } = await session.toolkits({ limit: 20, nextCursor: cursor });
  allToolkits.push(...items);
  cursor = nextCursor;
} while (cursor);
```

## Get meta tools

`session.tools()` returns the [meta tools](/reference/meta-tools) formatted for your configured provider (OpenAI, Anthropic, etc.):

**Python:**

```python
# Get all meta tools
tools = session.tools()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
// Get all meta tools
const tools = await session.tools();
```

To restrict which toolkits or tools are discoverable by the meta tools, configure them when [creating the session](/docs/toolkits/enable-and-disable-toolkits).

# Browsing the catalog

Before configuring a session, you may want to explore what toolkits and tools are available. You can browse visually at [platform.composio.dev](https://platform.composio.dev) or in the [docs](/toolkits), or fetch programmatically:

**Python:**

```python
# List toolkits
toolkits = composio.toolkits.get()

# List tools within a toolkit (top 20 by default)
tools = composio.tools.get("user_123", toolkits=["GITHUB"])
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const userId = 'user_123';
// List toolkits
const toolkits = await composio.toolkits.get();

// List tools within a toolkit (top 20 by default)
const tools = await composio.tools.get(userId, { toolkits: ["GITHUB"] });
```

## Get a tool's schema

To inspect a tool's input parameters and types without needing a user context, use `getRawComposioToolBySlug`:

**Python:**

```python
tool = composio.tools.get_raw_composio_tool_by_slug("GMAIL_SEND_EMAIL")
print(tool.name)
print(tool.description)
print(tool.input_parameters)
print(tool.output_parameters)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const tool = await composio.tools.getRawComposioToolBySlug("GMAIL_SEND_EMAIL");
console.log(tool.name);
console.log(tool.description);
console.log(tool.inputParameters);
console.log(tool.outputParameters);
```

# What to read next

- [Enable & disable toolkits](/docs/toolkits/enable-and-disable-toolkits): Control which toolkits and individual tools are available in sessions

- [Tools and toolkits](/docs/tools-and-toolkits): How meta tools discover, authenticate, and execute tools at runtime

- [Browse toolkits](/toolkits): Explore all available toolkits and their tools

---
