---
type: composio_doc
title: "Tools and toolkits"
source: "https://docs.composio.dev/docs/tools-and-toolkits.md"
source_hash: "3b313a85f63db4c632be7463ebd7375478df84006c20b57ee5356a12b2f1f4d3"
doc_path: "tools-and-toolkits.md"
original_doc_path: "tools-and-toolkits.md"
duplicate_index: 1
---

# Tools and toolkits (/docs/tools-and-toolkits)
Source: https://docs.composio.dev/docs/tools-and-toolkits.md


Composio offers 1000+ toolkits, but loading all the tools into context would overwhelm your agent. Instead, your agent has access to meta tools that discover, authenticate, and execute the right tools at runtime.

# Meta tools

When you create a session, your agent gets these meta tools:

| Meta tool                                                                 | What it does                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`COMPOSIO_SEARCH_TOOLS`](/reference/meta-tools/search_tools)             | Discover relevant tools across 500+ apps with execution plans |
| [`COMPOSIO_GET_TOOL_SCHEMAS`](/reference/meta-tools/get_tool_schemas)     | Retrieve complete input schemas for specific tools            |
| [`COMPOSIO_MULTI_EXECUTE_TOOL`](/reference/meta-tools/multi_execute_tool) | Execute up to 50 tools in parallel                            |
| [`COMPOSIO_MANAGE_CONNECTIONS`](/reference/meta-tools/manage_connections) | Handle OAuth, API key, and other authentication methods       |
| [`COMPOSIO_REMOTE_WORKBENCH`](/reference/meta-tools/remote_workbench)     | Run Python code in a [persistent sandbox](/docs/workbench)    |
| [`COMPOSIO_REMOTE_BASH_TOOL`](/reference/meta-tools/remote_bash_tool)     | Execute bash commands for file and data processing            |

See the [Meta Tools Reference](/reference/meta-tools) for complete input/output schemas and details.

Meta tool calls in a session are correlated using a `session_id`, allowing them to share context. The tools can also store useful information (like IDs and relationships discovered during execution) in memory for subsequent calls.

## How it works

```
User: "Create a GitHub issue for this bug"
    ↓
1. Agent calls COMPOSIO_SEARCH_TOOLS
   → Returns GITHUB_CREATE_ISSUE with input schema
   → Returns connection status: "not connected"
   → Returns execution plan and tips
    ↓
2. Agent calls COMPOSIO_MANAGE_CONNECTIONS (because not connected)
   → Returns auth link for GitHub
   → User clicks link and authenticates
    ↓
3. Agent calls COMPOSIO_MULTI_EXECUTE_TOOL
   → Executes GITHUB_CREATE_ISSUE with arguments
   → Returns the created issue details
    ↓
Done. (For large results, agent can use REMOTE_WORKBENCH to process)
```

## What SEARCH\_TOOLS returns

`COMPOSIO_SEARCH_TOOLS` returns:

* **Tools with schemas** - Matching tools with their slugs, descriptions, and input parameters
* **Connection status** - Whether the user has already authenticated with each toolkit
* **Execution plan** - Recommended steps and common pitfalls for the task
* **Related tools** - Prerequisites, alternatives, and follow-up tools

## Processing large results

For most tasks, `COMPOSIO_MULTI_EXECUTE_TOOL` returns results directly. But when dealing with large responses or bulk operations, your agent uses the workbench tools:

* **`COMPOSIO_REMOTE_WORKBENCH`** - Run Python code in a [persistent sandbox](/docs/workbench). Use for bulk operations (e.g., labeling 100 emails), complex data transformations, or when results need further analysis with helper functions like `invoke_llm`.

* **`COMPOSIO_REMOTE_BASH_TOOL`** - Execute bash commands for simpler file operations and data extraction using tools like `jq`, `awk`, `sed`, and `grep`.

# Toolkits and tools

A **toolkit** is a collection of related tools for a service. For example, the `github` toolkit contains tools for creating issues, managing pull requests, and starring repositories.

A **tool** is an individual action your agent can execute. Each tool has an input schema (required and optional parameters) and an output schema (what it returns). Tools follow a `{TOOLKIT}_{ACTION}` naming pattern, like `GITHUB_CREATE_ISSUE`.

> If you know exactly which tools you need, you can [execute them directly](/docs/tools-direct/executing-tools) without meta tools.

You can also add local in-process tools to a session using the experimental custom tools and custom toolkits API. See [Custom tools and toolkits](/docs/toolkits/custom-tools-and-toolkits).

# Default toolkit access

**What toolkits can my agent access by default?**

All of them. When you create a session without specifying a `toolkits` parameter, every toolkit in the Composio catalog is discoverable through `COMPOSIO_SEARCH_TOOLS`. The agent searches for relevant tools at runtime — it doesn't load them all into context at once.

To restrict which toolkits are available, pass `toolkits` when creating the session. See [Enable and disable toolkits](/docs/toolkits/enable-and-disable-toolkits).

# Authentication

Tools execute with the user's authenticated credentials. When a user connects their GitHub account, all GitHub tools run with their permissions.

If a tool requires authentication and the user hasn't connected yet, the agent can use `COMPOSIO_MANAGE_CONNECTIONS` to prompt them.

- [Authentication](/docs/authentication): Persistent Python sandbox for bulk operations and data processing

- [Browse toolkits](/toolkits): Explore all available toolkits

- [Fetching tools](/docs/toolkits/fetching-tools-and-toolkits): Browse the catalog and fetch tools for sessions

- [Direct tool execution](/docs/tools-direct/executing-tools): Execute tools without meta tools for deterministic workflows

---
