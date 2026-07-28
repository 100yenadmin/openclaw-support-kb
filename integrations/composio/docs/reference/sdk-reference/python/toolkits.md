---
type: composio_doc
title: "Toolkits"
source: "https://docs.composio.dev/reference/sdk-reference/python/toolkits.md"
source_hash: "dfa7ab45d92173b7fc587dc0a92bfef66b2f1a16e3f13bbcba186f7ac6758351"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/python/toolkits.md"
original_doc_path: "reference/sdk-reference/python/toolkits.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Toolkits (/reference/sdk-reference/python/toolkits)
Source: https://docs.composio.dev/reference/sdk-reference/python/toolkits.md


# Methods [#methods]

## list() [#list]

List all toolkits.

```python
def list(category: str | None = ..., cursor: str | None = ..., limit: float | None = ..., sort_by: Literal['usage', 'alphabetically' | None] = ..., managed_by: Literal['composio', 'all', 'project' | None] = ...) -> toolkit_list_response.ToolkitListResponse
```

**Parameters**

| Name          | Type                                            |
| ------------- | ----------------------------------------------- |
| `category?`   | `str \| None`                                   |
| `cursor?`     | `str \| None`                                   |
| `limit?`      | `float \| None`                                 |
| `sort_by?`    | `Literal['usage', 'alphabetically' \| None]`    |
| `managed_by?` | `Literal['composio', 'all', 'project' \| None]` |

**Returns**

`toolkit_list_response.ToolkitListResponse`

***

## get() [#get]

```python
def get(slug: str | None = ..., query: toolkit_list_params.ToolkitListParams | None = ...) -> Union[toolkit_retrieve_response.ToolkitRetrieveResponse, ...
```

**Parameters**

| Name     | Type                                            |
| -------- | ----------------------------------------------- |
| `slug?`  | `str \| None`                                   |
| `query?` | `toolkit_list_params.ToolkitListParams \| None` |

**Returns**

`Union[toolkit_retrieve_response.ToolkitRetrieveResponse, ...`

***

## list\_categories() [#list_categories]

List all categories of toolkits.

```python
def list_categories()
```

***

## authorize() [#authorize]

Authorize a user to a toolkit  If auth config is not found, it will be created using composio managed auth.

```python
def authorize(user_id: str, toolkit: str)
```

**Parameters**

| Name      | Type  |
| --------- | ----- |
| `user_id` | `str` |
| `toolkit` | `str` |

***

## get\_connected\_account\_initiation\_fields() [#get_connected_account_initiation_fields]

Get the required property for a given toolkit and auth scheme.

```python
def get_connected_account_initiation_fields(toolkit: str, auth_scheme: AuthSchemeL, required_only: bool = ...) -> AuthFieldsT
```

**Parameters**

| Name             | Type          |
| ---------------- | ------------- |
| `toolkit`        | `str`         |
| `auth_scheme`    | `AuthSchemeL` |
| `required_only?` | `bool`        |

**Returns**

`AuthFieldsT`

***

## get\_auth\_config\_creation\_fields() [#get_auth_config_creation_fields]

Get the required property for a given toolkit and auth scheme.

```python
def get_auth_config_creation_fields(toolkit: str, auth_scheme: AuthSchemeL, required_only: bool = ...) -> AuthFieldsT
```

**Parameters**

| Name             | Type          |
| ---------------- | ------------- |
| `toolkit`        | `str`         |
| `auth_scheme`    | `AuthSchemeL` |
| `required_only?` | `bool`        |

**Returns**

`AuthFieldsT`

***

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/toolkits.py#L26)

---
