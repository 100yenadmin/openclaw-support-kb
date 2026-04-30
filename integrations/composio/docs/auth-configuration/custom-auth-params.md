---
type: composio_doc
title: "Custom Auth Parameters"
source: "https://docs.composio.dev/docs/auth-configuration/custom-auth-params.md"
source_hash: "bd5892631e873558cba9f021411c3ff868eb08d804e4abae8731e53b8d9df0eb"
doc_path: "auth-configuration/custom-auth-params.md"
original_doc_path: "auth-configuration/custom-auth-params.md"
duplicate_index: 1
---

# Custom Auth Parameters (/docs/auth-configuration/custom-auth-params)
Source: https://docs.composio.dev/docs/auth-configuration/custom-auth-params.md


> If you're building an agent, we recommend using [sessions](/docs/configuring-sessions) instead. Sessions handle authentication automatically via [in-chat authentication](/docs/authenticating-users/in-chat-authentication) or [manual authentication](/docs/authenticating-users/manually-authenticating).

If you already manage OAuth tokens or API keys yourself and want Composio to execute tools using your credentials, you can pass them directly at execution time — no connected account or redirect flow required.

# Passing credentials directly

Pass `customAuthParams` in the `tools.execute()` call to inject your own token as a header or query parameter.

**Python:**

```python
from composio import Composio

composio = Composio()

result = composio.tools.execute(
    slug="GOOGLECALENDAR_LIST_EVENTS",
    user_id="user_123",
    arguments={},
    custom_auth_params={
        "parameters": [
            {
                "name": "Authorization",
                "value": "Bearer YOUR_ACCESS_TOKEN",
                "in": "header",
            }
        ],
    },
)
print(result)
```

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
});

const result = await composio.tools.execute(
  "GOOGLECALENDAR_LIST_EVENTS",
  {
    userId: "user_123",
    arguments: {},
    customAuthParams: {
      parameters: [
        {
          in: "header",
          name: "Authorization",
          value: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
        },
      ],
    },
  }
);

console.log(JSON.stringify(result, null, 2));
```

> This bypasses Composio's automatic token refresh. You are responsible for refreshing expired tokens yourself.

## Parameter options

Each entry in the `parameters` array accepts:

| Field   | Description                                             |
| ------- | ------------------------------------------------------- |
| `name`  | The parameter name (e.g., `Authorization`, `X-API-Key`) |
| `value` | The credential value                                    |
| `in`    | Where to inject — `"header"` or `"query"`               |

You can also set `base_url` (Python) / `baseURL` (TypeScript) to override the default API base URL for the toolkit.

# Using a beforeExecute modifier

For more control — such as conditionally injecting credentials based on toolkit or tool — use a `beforeExecute` modifier.

- [This is a Before Execute Modifier!](/docs/tools-direct/modify-tool-behavior/before-execution-modifiers): Modify tool arguments before execution

- [Authenticating tools](/docs/tools-direct/authenticating-tools): Create auth configs and connect user accounts

- [Executing tools](/docs/tools-direct/executing-tools): Run tools with providers, agentic frameworks, or direct execution

---
