---
type: composio_doc
title: "SessionContextImpl"
source: "https://docs.composio.dev/reference/sdk-reference/python/session-context-impl.md"
source_hash: "eff471674a16694b32a6a24ffcf2513674b2c3717fe3f4a85474246ab2c9b3af"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/python/session-context-impl.md"
original_doc_path: "reference/sdk-reference/python/session-context-impl.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# SessionContextImpl (/reference/sdk-reference/python/session-context-impl)
Source: https://docs.composio.dev/reference/sdk-reference/python/session-context-impl.md


# Properties

| Name      | Type  | Description                          |
| --------- | ----- | ------------------------------------ |
| `user_id` | `str` | The user ID for the current session. |

# Methods

## execute()

Execute any tool from within a custom tool.  Routes to sibling local tools in-process when available, otherwise delegates to the backend API.  Returns the same response model as `session.execute()`.

```python
def execute(tool_slug: str, arguments: Dict[str, Any]) -> SessionExecuteResponse
```

**Parameters**

| Name        | Type             |
| ----------- | ---------------- |
| `tool_slug` | `str`            |
| `arguments` | `Dict[str, Any]` |

**Returns**

`SessionExecuteResponse`

***

## proxy\_execute()

Proxy API calls through Composio's auth layer.  Returns the same response model as `session.proxy_execute()`.

```python
def proxy_execute(toolkit: str, endpoint: str, method: Literal['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], body: Any = ..., parameters: List[Dict[str, Any | None]] = ...) -> SessionProxyExecuteResponse
```

**Parameters**

| Name          | Type                                               |
| ------------- | -------------------------------------------------- |
| `toolkit`     | `str`                                              |
| `endpoint`    | `str`                                              |
| `method`      | `Literal['GET', 'POST', 'PUT', 'DELETE', 'PATCH']` |
| `body?`       | `Any`                                              |
| `parameters?` | `List[Dict[str, Any \| None]]`                     |

**Returns**

`SessionProxyExecuteResponse`

***

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/session_context.py#L92)

---
