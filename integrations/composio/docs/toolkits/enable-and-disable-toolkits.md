---
type: composio_doc
title: "Enable and disable toolkits"
source: "https://docs.composio.dev/docs/toolkits/enable-and-disable-toolkits.md"
source_hash: "4e1971e7d496896314f83502ac1106f9bcb20b8b472ea9bff8b6e0789895a7c9"
doc_path: "toolkits/enable-and-disable-toolkits.md"
original_doc_path: "toolkits/enable-and-disable-toolkits.md"
duplicate_index: 1
---

# Enable and disable toolkits (/docs/toolkits/enable-and-disable-toolkits)
Source: https://docs.composio.dev/docs/toolkits/enable-and-disable-toolkits.md


When creating a session, you can control which toolkits are available to your agent. By default, all 1000+ toolkits are discoverable, but you can restrict or exclude specific ones.

# Enabling specific toolkits

To limit your session to only specific toolkits, pass an array of toolkit slugs:

**Python:**

```python
from composio import Composio

composio = Composio()

# Only GitHub and Gmail will be available
session = composio.create(
    user_id="user_123",
    toolkits=["github", "gmail"]
)

# Or use the explicit enable syntax
session = composio.create(
    user_id="user_123",
    toolkits={"enable": ["github", "gmail"]}
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// Only GitHub and Gmail will be available
const session = await composio.create("user_123", {
  toolkits: ["github", "gmail"]
});

// Or use the explicit enable syntax
const session2 = await composio.create("user_123", {
  toolkits: { enable: ["github", "gmail"] }
});
```

# Disabling specific toolkits

To make all toolkits available except certain ones, use the `disable` syntax:

**Python:**

```python
# All toolkits available except Linear and Jira
session = composio.create(
    user_id="user_123",
    toolkits={"disable": ["linear", "jira"]}
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// All toolkits available except Linear and Jira
const session = await composio.create("user_123", {
  toolkits: { disable: ["linear", "jira"] }
});
```

# Enabling or disabling specific tools

You can also control which individual tools are available within a toolkit using the `tools` configuration. The key is the toolkit slug and the value specifies which tools to enable or disable.

## Enable specific tools

**Python:**

```python
session = composio.create(
    user_id="user_123",
    tools={
        # Only these Gmail tools will be available
        "gmail": {"enable": ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"]},
        # Only issue-related GitHub tools
        "github": {"enable": ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]}
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  tools: {
    // Only these Gmail tools will be available
    gmail: { enable: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"] },
    // Only issue-related GitHub tools
    github: { enable: ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"] }
  }
});
```

You can also use the shorthand array syntax which is equivalent to `enable`:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    tools={
        "gmail": ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"],
        "github": ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  tools: {
    gmail: ["GMAIL_SEND_EMAIL", "GMAIL_FETCH_EMAILS"],
    github: ["GITHUB_CREATE_ISSUE", "GITHUB_GET_ISSUE"]
  }
});
```

## Disable specific tools

**Python:**

```python
session = composio.create(
    user_id="user_123",
    tools={
        # All Slack tools except delete
        "slack": {"disable": ["SLACK_DELETE_MESSAGE"]},
        # All GitHub tools except destructive ones
        "github": {"disable": ["GITHUB_DELETE_REPO", "GITHUB_DELETE_BRANCH"]}
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  tools: {
    // All Slack tools except delete
    slack: { disable: ["SLACK_DELETE_MESSAGE"] },
    // All GitHub tools except destructive ones
    github: { disable: ["GITHUB_DELETE_REPO", "GITHUB_DELETE_BRANCH"] }
  }
});
```

# Filtering tools by tags

Tools can be filtered by their behavior tags. Available tags are:

| Tag               | Description                                 |
| ----------------- | ------------------------------------------- |
| `readOnlyHint`    | Tools that only read data                   |
| `destructiveHint` | Tools that modify or delete data            |
| `idempotentHint`  | Tools that can be safely retried            |
| `openWorldHint`   | Tools that operate in an open world context |

## Global tag filtering

Apply tag filters to all toolkits:

**Python:**

```python
# Only include read-only and idempotent tools
session = composio.create(
    user_id="user_123",
    tags=["readOnlyHint", "idempotentHint"]
)

# Enable some tags, disable others
session = composio.create(
    user_id="user_123",
    tags={
        "enable": ["readOnlyHint"],
        "disable": ["destructiveHint"]
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// Only include read-only and idempotent tools
const session = await composio.create("user_123", {
  tags: ["readOnlyHint", "idempotentHint"]
});

// Enable some tags, disable others
const sessionWithTagConfig = await composio.create("user_123", {
  tags: {
    enable: ["readOnlyHint"],
    disable: ["destructiveHint"]
  }
});
```

## Per-toolkit tag filtering

Override global tags for specific toolkits:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    # Global: only read-only tools
    tags=["readOnlyHint"],
    tools={
        # Override for GitHub: allow all tools except destructive
        "github": {"tags": {"disable": ["destructiveHint"]}},
        # Override for Gmail: only read-only tools (explicit)
        "gmail": {"tags": ["readOnlyHint"]}
    }
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  // Global: only read-only tools
  tags: ["readOnlyHint"],
  tools: {
    // Override for GitHub: allow all tools except destructive
    github: { tags: { disable: ["destructiveHint"] } },
    // Override for Gmail: only read-only tools (explicit)
    gmail: { tags: ["readOnlyHint"] }
  }
});
```

# What to read next

- [Fetching tools and toolkits](/docs/toolkits/fetching-tools-and-toolkits): List enabled toolkits, get meta tools, and browse the catalog

- [Configuring sessions](/docs/configuring-sessions): Auth configs, connected accounts, and other session options

- [Tools and toolkits](/docs/tools-and-toolkits): How meta tools discover, authenticate, and execute tools at runtime

---
