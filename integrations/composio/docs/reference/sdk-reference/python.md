---
type: composio_doc
title: "Python SDK Reference"
source: "https://docs.composio.dev/reference/sdk-reference/python.md"
source_hash: "74b5370cec20f39d10e0a7b7d23343f1ca7ffdbb573e623aefe396779f408ff2"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/python.md"
original_doc_path: "reference/sdk-reference/python.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Python SDK Reference (/reference/sdk-reference/python)
Source: https://docs.composio.dev/reference/sdk-reference/python.md


# Python SDK Reference [#python-sdk-reference]

Complete API reference for the `composio` Python package.

## Installation [#installation]

## Classes [#classes]

| Class                                                                     | Description                                                                         |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`Composio`](/reference/sdk-reference/python/composio)                    | Composio SDK for Python.  Generic parameters: TTool: The individual tool type re... |
| [`Tools`](/reference/sdk-reference/python/tools)                          | Tools class definition  This class is used to manage tools in the Composio SDK. ... |
| [`Toolkits`](/reference/sdk-reference/python/toolkits)                    | Toolkits are a collectiono of tools that can be used to perform various tasks. T... |
| [`Triggers`](/reference/sdk-reference/python/triggers)                    | Triggers (instance) class                                                           |
| [`ConnectedAccounts`](/reference/sdk-reference/python/connected-accounts) | Manage connected accounts.  This class is used to manage connected accounts in t... |
| [`AuthConfigs`](/reference/sdk-reference/python/auth-configs)             | Manage authentication configurations.                                               |
| [`MCP`](/reference/sdk-reference/python/mcp)                              | MCP (Model Control Protocol) class. Provides enhanced MCP server operations  Thi... |
| [`Session`](/reference/sdk-reference/python/session)                      | A Composio session — the object returned by `composio.create(...)` / \`\`composi... |

## Quick Start [#quick-start]

```python
from composio import Composio

composio = Composio(api_key="your-api-key")

# Get tools for a user
tools = composio.tools.get("user-123", toolkits=["github"])

# Execute a tool
result = composio.tools.execute(
    "GITHUB_GET_REPOS",
    arguments={"owner": "composio"},
    user_id="user-123"
)
```

## Decorators [#decorators]

### before\_execute [#before_execute]

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L280)

```python
@before_execute(modifier: BeforeExecute | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

### after\_execute [#after_execute]

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L241)

```python
@after_execute(modifier: AfterExecute | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

### before\_file\_upload [#before_file_upload]

Build a `Modifier` for the file-upload hook (same scoping pattern as :func:`before_execute`).  Your callable may take **either**:  - a single `context` argument (:class:`BeforeFileUploadContext`) — the preferred form, exposes `context["source"]` (`"path"` or `"url"`), or - three positional arguments `(path, tool, toolkit)` — legacy form, kept for back-compat.  Return a new path/URL string to substitute, or `False` to abort the upload (raises :class:`~composio.exceptions.FileUploadAbortedError`).  Pass the returned `Modifier` in `modifiers=[...]` on :meth:`composio.core.models.tools.Tools.execute` or `tools.get`. Multiple such modifiers are composed in list order.

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L319)

```python
@before_file_upload(modifier: BeforeFileUploadLike | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

### schema\_modifier [#schema_modifier]

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/_modifiers.py#L377)

```python
@schema_modifier(modifier: SchemaModifier | None = ..., tools: List[str | None] = ..., toolkits: List[str | None] = ...)
def my_modifier(...):
    ...
```

---
