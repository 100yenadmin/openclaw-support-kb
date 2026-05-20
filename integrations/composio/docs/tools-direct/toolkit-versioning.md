---
type: composio_doc
title: "Toolkit Versioning"
source: "https://docs.composio.dev/docs/tools-direct/toolkit-versioning.md"
source_hash: "e1eb47cd61ad492765987d3a23ebb54b1d821f027de567d1ab09102cf95c40bc"
system: "composio"
kb_namespace: "composio"
doc_path: "tools-direct/toolkit-versioning.md"
original_doc_path: "tools-direct/toolkit-versioning.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Toolkit Versioning (/docs/tools-direct/toolkit-versioning)
Source: https://docs.composio.dev/docs/tools-direct/toolkit-versioning.md


> If you're building an agent, we recommend using [sessions](/docs/configuring-sessions) instead. Sessions handle toolkit versions automatically so you don't have to manage them yourself.

Toolkit versioning ensures your tools behave consistently across deployments. You can pin specific versions in production, test new releases in development, and roll back when needed.

To view available versions, go to [Dashboard](https://dashboard.composio.dev) > **All Toolkits** > select a toolkit. The version dropdown shows the latest and all available versions:

<img alt="Toolkit version selector on the Composio dashboard" src={__img0} placeholder="blur" />

You can also find the latest version for each toolkit on the [Toolkits](/toolkits) page in the docs. Select a toolkit to see its current version and available tools.

> Starting from Python SDK v0.9.0 and TypeScript SDK v0.2.0, specifying versions is required for manual tool execution.

# Default version behavior

> When no version is specified, the API defaults to the base version (`00000000_00`), **not** the latest version. This means the response may contain fewer tools than what's shown on the [platform UI](https://dashboard.composio.dev). To get all available tools including ones added in newer versions, explicitly set `toolkit_versions` to `"latest"` or a specific version.

This applies to both the SDK and direct REST API calls:

```bash
# Without version — returns only tools from the base version
curl 'https://backend.composio.dev/api/v3.1/tools?toolkit_slug=googledrive' \
  -H 'x-api-key: YOUR_API_KEY'

# With version=latest — returns all tools including newer ones
curl 'https://backend.composio.dev/api/v3.1/tools?toolkit_slug=googledrive&toolkit_versions=latest' \
  -H 'x-api-key: YOUR_API_KEY'
```

# Configuration methods

Configure toolkit versions using one of three methods:

## SDK initialization

**Python:**

```python
from composio import Composio

# Pin specific versions for each toolkit
composio = Composio(
    api_key="YOUR_API_KEY",
    toolkit_versions={
        "github": "20251027_00",
        "slack": "20251027_00",
        "gmail": "20251027_00"
    }
)
```

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

// Pin specific versions for each toolkit
const composio = new Composio({
    apiKey: "YOUR_API_KEY",
    toolkitVersions: {
        github: "20251027_00",
        slack: "20251027_00",
        gmail: "20251027_00"
    }
});
```

## Environment variables

```bash
# Set versions for specific toolkits
export COMPOSIO_TOOLKIT_VERSION_GITHUB="20251027_00"
export COMPOSIO_TOOLKIT_VERSION_SLACK="20251027_00"
export COMPOSIO_TOOLKIT_VERSION_GMAIL="20251027_00"
```

## Per-execution override

**Python:**

```python
from composio import Composio

composio = Composio(api_key="YOUR_API_KEY")

# Specify version directly in execute call
result = composio.tools.execute(
    "GITHUB_LIST_STARGAZERS",
    arguments={
        "owner": "ComposioHQ",
        "repo": "composio"
    },
    user_id="user-k7334",
    version="20251027_00"  # Override version for this execution
)
print(result)
```

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: "YOUR_API_KEY" });

// Specify version directly in execute call
const result = await composio.tools.execute("GITHUB_LIST_STARGAZERS", {
    userId: "user-k7334",
    arguments: {
        owner: "ComposioHQ",
        repo: "composio"
    },
    version: "20251027_00"  // Override version for this execution
});
console.log(result);
```

# Version format

Versions follow the format `YYYYMMDD_NN`:

* `YYYYMMDD`: Release date
* `NN`: Sequential release number

```python
# Pin to a specific version
toolkit_versions = {"github": "20251027_00"}

# Always use the newest tools
toolkit_versions = {"github": "latest"}
```

# Choosing between `latest` and a pinned version

The right choice depends on how your application consumes tool outputs:

* **Use `latest`** when tool outputs are consumed by an LLM or AI agent. Agents interpret responses dynamically and adapt to changes in output structure. Using `latest` ensures your agent always has access to the newest tools and improvements without manual intervention.

* **Pin a specific version** when tool outputs are consumed programmatically — for example, if your code destructures specific fields from a response, maps outputs to a database schema, or feeds results into a typed pipeline. Schema changes in a new version could silently break these integrations.

> As a rule of thumb: if an LLM reads the output, use `latest`. If your code parses the output, pin the version.

Most agentic applications — including all [session-based](/docs/configuring-sessions) workflows — use `latest` by default and benefit from always having the most up-to-date tools. If you're building structured data pipelines or integrations with fixed response parsing, pin to a tested version and upgrade on your own schedule.

# Version resolution order

1. Per-execution version (highest priority)
2. SDK initialization version
3. Environment variable (toolkit-specific)

# Managing versions

Check available versions using:

**Python:**

```python
# Get toolkit information including available versions
toolkit = composio.toolkits.get(slug="github")

# Extract and print version information
print(f"Toolkit: {toolkit.name}")
print(f"Current Version: {toolkit.meta.version}")
print(f"Available Versions: {toolkit.meta.available_versions}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
// Get toolkit information including available versions
const toolkit = await composio.toolkits.get("github");

// Extract and print version information
console.log("Toolkit:", toolkit.name);
console.log("Available Versions:", toolkit.meta.availableVersions);
console.log("Latest Version:", toolkit.meta.availableVersions?.[0]);
```

# What to read next

- [Fetching tools](/docs/tools-direct/fetching-tools): Fetch and filter tools, inspect schemas, and search semantically

- [Executing tools](/docs/tools-direct/executing-tools): Run tools with providers, agentic frameworks, or direct execution

- [CLI](/docs/cli): Generate type-safe code from tool schemas with the Composio CLI

---
