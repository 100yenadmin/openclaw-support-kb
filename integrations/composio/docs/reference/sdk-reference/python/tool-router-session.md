---
type: composio_doc
title: "ToolRouterSession"
source: "https://docs.composio.dev/reference/sdk-reference/python/tool-router-session.md"
source_hash: "3a8d5e8cceb11bd48aec42a56c2e6023b42923129def7bb55161270128d6cfda"
doc_path: "reference/sdk-reference/python/tool-router-session.md"
original_doc_path: "reference/sdk-reference/python/tool-router-session.md"
duplicate_index: 1
---

# ToolRouterSession (/reference/sdk-reference/python/tool-router-session)
Source: https://docs.composio.dev/reference/sdk-reference/python/tool-router-session.md


# Properties

| Name           | Type                              |
| -------------- | --------------------------------- |
| `session_id`   | `str`                             |
| `mcp`          | `Any`                             |
| `experimental` | `'ToolRouterSessionExperimental'` |

# Methods

## tools()

Get provider-wrapped tools for execution with your AI framework.  Returns tools configured for this session, wrapped in the format expected by your AI provider (OpenAI, Anthropic, LangChain, etc.).  When custom tools are bound to the session, execution of COMPOSIO\_MULTI\_EXECUTE\_TOOL is intercepted: local tools are executed in-process, remote tools are sent to the backend.

```python
def tools(modifiers: 'Modifiers' | None = ...) -> TToolCollection
```

**Parameters**

| Name         | Type                  |
| ------------ | --------------------- |
| `modifiers?` | `'Modifiers' \| None` |

**Returns**

`TToolCollection`

***

## authorize()

Authorize a toolkit for the user and get a connection request.  Initiates the OAuth flow and returns a ConnectionRequest with redirect URL.

```python
def authorize(toolkit: str, callback_url: str | None = ..., alias: str | None = ...) -> ConnectionRequest
```

**Parameters**

| Name            | Type          |
| --------------- | ------------- |
| `toolkit`       | `str`         |
| `callback_url?` | `str \| None` |
| `alias?`        | `str \| None` |

**Returns**

`ConnectionRequest`

***

## toolkits()

Get toolkit connection states for the session.

```python
def toolkits(toolkits: List[str | None] = ..., next_cursor: str | None = ..., limit: int | None = ..., is_connected: bool | None = ..., search: str | None = ...) -> ToolkitConnectionsDetails
```

**Parameters**

| Name            | Type                |
| --------------- | ------------------- |
| `toolkits?`     | `List[str \| None]` |
| `next_cursor?`  | `str \| None`       |
| `limit?`        | `int \| None`       |
| `is_connected?` | `bool \| None`      |
| `search?`       | `str \| None`       |

**Returns**

`ToolkitConnectionsDetails`

***

## search()

Search for tools by semantic use case.  Returns relevant tools for the given query with schemas and guidance.

```python
def search(query: str, model: str | None = ...) -> SessionSearchResponse
```

**Parameters**

| Name     | Type          |
| -------- | ------------- |
| `query`  | `str`         |
| `model?` | `str \| None` |

**Returns**

`SessionSearchResponse`

***

## execute()

Execute a tool within the session.  For custom tools, accepts the original slug (e.g. "GREP") or the full slug (e.g. "LOCAL\_GREP"). Custom tools are executed in-process; remote tools are sent to the Composio backend.  Both paths return a `SessionExecuteResponse` with `data`, `error`, and `log_id` attributes.

```python
def execute(tool_slug: str, arguments: Dict[str, Any | None] = ...) -> SessionExecuteResponse
```

**Parameters**

| Name         | Type                     |
| ------------ | ------------------------ |
| `tool_slug`  | `str`                    |
| `arguments?` | `Dict[str, Any \| None]` |

**Returns**

`SessionExecuteResponse`

***

## custom\_tools()

List all custom tools registered in this session.  Returns tools with their final slugs, schemas, and resolved toolkit.

```python
def custom_tools(toolkit: str | None = ...) -> List[RegisteredCustomTool]
```

**Parameters**

| Name       | Type          |
| ---------- | ------------- |
| `toolkit?` | `str \| None` |

**Returns**

`List[RegisteredCustomTool]` — Array of registered custom tools

***

## custom\_toolkits()

List all custom toolkits registered in this session.  Returns toolkits with their tools showing final slugs.

```python
def custom_toolkits() -> List[RegisteredCustomToolkit]
```

**Returns**

`List[RegisteredCustomToolkit]`

***

## proxy\_execute()

Proxy an API call through Composio's auth layer.

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

`SessionProxyExecuteResponse` — Proxied API response

***

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/tool_router_session.py#L53)

---
