---
type: composio_doc
title: "AuthConfigs"
source: "https://docs.composio.dev/reference/sdk-reference/python/auth-configs.md"
source_hash: "d31b5808dfab9f878d2cc70dd2cec8b15c5796227c6941630ec89802410c65a8"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/python/auth-configs.md"
original_doc_path: "reference/sdk-reference/python/auth-configs.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# AuthConfigs (/reference/sdk-reference/python/auth-configs)
Source: https://docs.composio.dev/reference/sdk-reference/python/auth-configs.md


## Methods [#methods]

### list() [#list]

Lists authentication configurations based on provided filter criteria.

```python
def list(query: auth_config_list_params.AuthConfigListParams = ...) -> auth_config_list_response.AuthConfigListResponse
```

**Parameters**

| Name     | Type                                           |
| -------- | ---------------------------------------------- |
| `query?` | `auth_config_list_params.AuthConfigListParams` |

**Returns**

`auth_config_list_response.AuthConfigListResponse`

***

### create() [#create]

Create a new auth config

```python
def create(toolkit: str, options: auth_config_create_params.AuthConfig) -> auth_config_create_response.AuthConfig
```

**Parameters**

| Name      | Type                                   |
| --------- | -------------------------------------- |
| `toolkit` | `str`                                  |
| `options` | `auth_config_create_params.AuthConfig` |

**Returns**

`auth_config_create_response.AuthConfig` — The created auth config.

***

### get() [#get]

Retrieves a specific authentication configuration by its ID

```python
def get(nanoid: str) -> auth_config_retrieve_response.AuthConfigRetrieveResponse
```

**Parameters**

| Name     | Type  |
| -------- | ----- |
| `nanoid` | `str` |

**Returns**

`auth_config_retrieve_response.AuthConfigRetrieveResponse` — The retrieved auth config.

***

### update() [#update]

Updates an existing authentication configuration.  This method allows you to modify properties of an auth config such as credentials, scopes, or tool restrictions. The update type (custom or default) determines which fields can be updated.

```python
def update(nanoid: str, options: auth_config_update_params.AuthConfigUpdateParams) -> Dict
```

**Parameters**

| Name      | Type                                               |
| --------- | -------------------------------------------------- |
| `nanoid`  | `str`                                              |
| `options` | `auth_config_update_params.AuthConfigUpdateParams` |

**Returns**

`Dict` — The updated auth config.

***

### delete() [#delete]

Deletes an existing authentication configuration.

```python
def delete(nanoid: str) -> Dict
```

**Parameters**

| Name     | Type  |
| -------- | ----- |
| `nanoid` | `str` |

**Returns**

`Dict` — The deleted auth config.

***

### enable() [#enable]

Enables an existing authentication configuration.

```python
def enable(nanoid: str) -> Dict
```

**Parameters**

| Name     | Type  |
| -------- | ----- |
| `nanoid` | `str` |

**Returns**

`Dict` — The enabled auth config.

***

### disable() [#disable]

Disables an existing authentication configuration.

```python
def disable(nanoid: str) -> Dict
```

**Parameters**

| Name     | Type  |
| -------- | ----- |
| `nanoid` | `str` |

**Returns**

`Dict` — The disabled auth config.

***

[View source](https://github.com/composiohq/composio/blob/next/python/composio/core/models/auth_configs.py#L18)

---
