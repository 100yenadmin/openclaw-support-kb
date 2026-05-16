---
type: composio_doc
title: "Custom Tools and Toolkits (Experimental)"
source: "https://docs.composio.dev/docs/toolkits/custom-tools-and-toolkits.md"
source_hash: "98042561926249c85be60ce3acd3658fa1f760a51471a92aa588823e026c3245"
system: "composio"
kb_namespace: "composio"
doc_path: "toolkits/custom-tools-and-toolkits.md"
original_doc_path: "toolkits/custom-tools-and-toolkits.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Custom Tools and Toolkits (Experimental) (/docs/toolkits/custom-tools-and-toolkits)
Source: https://docs.composio.dev/docs/toolkits/custom-tools-and-toolkits.md


> Custom tool APIs are experimental and may change in future releases.

> Custom tools work with **native tools** (`session.tools()`). MCP support is coming soon. Custom tools are not available via the MCP server URL yet.

Custom tools let you define tools that run in-process alongside remote Composio tools within a session. There are three patterns:

* **Standalone tools** - for internal app logic that doesn't need Composio auth (DB lookups, in-memory data, business rules)
* **Extension tools** - wrap a Composio toolkit's API with custom business logic via `extendsToolkit` / `extends_toolkit`, using `ctx.proxyExecute()` / `ctx.proxy_execute()` for authenticated requests
* **Custom toolkits** - group related standalone tools under a namespace

> Choose your integration type · [Use this guide to decide](/docs/native-tools-vs-mcp)

### Standalone Tool

**Install**

**TypeScript:**

```bash
npm install @composio/core zod
```

**Python:**

```bash
pip install composio
```

**Initialize the client**

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: "your_api_key" });
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")
```

**Create the tool**

A standalone tool handles internal app logic that doesn't need Composio auth. `ctx.userId` identifies which user's session is running.

**TypeScript:**

```typescript
import { Composio, experimental_createTool } from "@composio/core";
import { z } from "zod/v3";

const profiles: Record<string, { name: string; email: string; tier: string }> = {
  "user_1": { name: "Alice Johnson", email: "alice@myapp.com", tier: "enterprise" },
  "user_2": { name: "Bob Smith", email: "bob@myapp.com", tier: "free" },
};

const getUserProfile = experimental_createTool("GET_USER_PROFILE", {
  name: "Get user profile",
  description: "Retrieve the current user's profile from the internal directory",
  inputParams: z.object({}),
  execute: async (_input, ctx) => {
    const profile = profiles[ctx.userId];
    if (!profile) throw new Error(`No profile found for user "${ctx.userId}"`);
    return profile;
  },
});
```

**Python:**

```python
from pydantic import BaseModel, Field

from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

class UserLookupInput(BaseModel):
    user_id: str = Field(description="User ID")

USERS = {
    "user_1": {"name": "Alice Johnson", "email": "alice@myapp.com", "tier": "enterprise"},
    "user_2": {"name": "Bob Smith", "email": "bob@myapp.com", "tier": "free"},
}

@composio.experimental.tool()
def get_user_profile(input: UserLookupInput, ctx):
    """Retrieve the current user's profile from the internal directory."""
    profile = USERS.get(input.user_id)
    if not profile:
        raise ValueError(f'No profile found for user "{input.user_id}"')
    return profile
```

**Bind to a session**

Pass custom tools via the `experimental` option. `session.tools()` returns both remote Composio tools and your custom tools.

**TypeScript:**

```typescript
import { Composio, experimental_createTool } from "@composio/core";
import { z } from "zod/v3";

declare const getUserProfile: ReturnType<typeof experimental_createTool>;
const composio = new Composio({ apiKey: "your_api_key" });

const session = await composio.create("user_1", {
  experimental: {
    customTools: [getUserProfile],
  },
});

const tools = await session.tools();
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")

session = composio.create(
    user_id="user_1",
    experimental={
        "custom_tools": [get_user_profile],
    },
)

tools = session.tools()
```

### Extension Tool

**Install**

**TypeScript:**

```bash
npm install @composio/core zod
```

**Python:**

```bash
pip install composio
```

**Initialize the client**

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: "your_api_key" });
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")
```

**Create the tool**

An extension tool wraps a Composio toolkit's API with custom business logic. It inherits auth via `extendsToolkit` / `extends_toolkit`, so `ctx.proxyExecute()` / `ctx.proxy_execute()` handles credentials automatically.

Prefer relative `endpoint` values in proxy calls. They resolve against the toolkit base URL. Absolute URLs are only accepted when they stay on the same scheme and registrable domain as that base URL.

**TypeScript:**

```typescript
import { Composio, experimental_createTool } from "@composio/core";
import { z } from "zod/v3";

const sendPromoEmail = experimental_createTool("SEND_PROMO_EMAIL", {
  name: "Send promo email",
  description: "Send the standard promotional email to a recipient",
  extendsToolkit: "gmail",
  inputParams: z.object({
    to: z.string().describe("Recipient email address"),
  }),
  execute: async (input, ctx) => {
    const subject = "You're invited to try MyApp Pro";
    const body = "Hi there,\n\nWe'd love for you to try MyApp Pro — free for 14 days.\n\nBest,\nThe MyApp Team";
    const raw = btoa(`To: ${input.to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${body}`);

    const res = await ctx.proxyExecute({
      toolkit: "gmail",
      endpoint: "/gmail/v1/users/me/messages/send",
      method: "POST",
      body: { raw },
    });
    return { status: res.status, to: input.to };
  },
});
```

**Python:**

```python
import base64

from pydantic import BaseModel, Field

from composio import Composio

composio = Composio(api_key="your_api_key")

class PromoEmailInput(BaseModel):
    to: str = Field(description="Recipient email address")

@composio.experimental.tool(extends_toolkit="gmail")
def send_promo_email(input: PromoEmailInput, ctx):
    """Send the standard promotional email to a recipient."""
    subject = "You're invited to try MyApp Pro"
    body = (
        "Hi there,\n\n"
        "We'd love for you to try MyApp Pro — free for 14 days.\n\n"
        "Best,\nThe MyApp Team"
    )
    raw_msg = (
        f"To: {input.to}\r\n"
        f"Subject: {subject}\r\n"
        "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
        f"{body}"
    )
    raw = base64.urlsafe_b64encode(raw_msg.encode()).decode().rstrip("=")

    res = ctx.proxy_execute(
        toolkit="gmail",
        endpoint="/gmail/v1/users/me/messages/send",
        method="POST",
        body={"raw": raw},
    )
    return {"status": res.status, "to": input.to}
```

**Bind to a session**

Pass custom tools via the `experimental` option. Extension tools inherit auth from the toolkit specified in `extendsToolkit`.

**TypeScript:**

```typescript
import { Composio, experimental_createTool } from "@composio/core";
import { z } from "zod/v3";

declare const sendPromoEmail: ReturnType<typeof experimental_createTool>;
const composio = new Composio({ apiKey: "your_api_key" });

const session = await composio.create("user_1", {
  toolkits: ["gmail"],
  experimental: {
    customTools: [sendPromoEmail],
  },
});

const tools = await session.tools();
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")

session = composio.create(
    user_id="user_1",
    toolkits=["gmail"],
    experimental={
        "custom_tools": [send_promo_email],
    },
)

tools = session.tools()
```

### Custom Toolkit

**Install**

**TypeScript:**

```bash
npm install @composio/core zod
```

**Python:**

```bash
pip install composio
```

**Initialize the client**

**TypeScript:**

```typescript
import { Composio } from "@composio/core";

const composio = new Composio({ apiKey: "your_api_key" });
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")
```

**Create the toolkit**

A custom toolkit groups related standalone tools under a namespace. Tools inside a toolkit cannot use `extendsToolkit`.

**TypeScript:**

```typescript
import {
  Composio,
  experimental_createTool,
  experimental_createToolkit,
} from "@composio/core";
import { z } from "zod/v3";

const userManagement = experimental_createToolkit("USER_MANAGEMENT", {
  name: "User management",
  description: "Manage user roles and permissions",
  tools: [
    experimental_createTool("ASSIGN_ROLE", {
      name: "Assign role",
      description: "Assign a role to a user in the internal system",
      inputParams: z.object({
        user_id: z.string().describe("Target user ID"),
        role: z.enum(["admin", "editor", "viewer"]).describe("Role to assign"),
      }),
      execute: async ({ user_id, role }) => ({ user_id, role, assigned: true }),
    }),
  ],
});
```

**Python:**

```python
from pydantic import BaseModel, Field

from composio import Composio

composio = Composio(api_key="your_api_key")

user_management = composio.experimental.Toolkit(
    slug="USER_MANAGEMENT",
    name="User management",
    description="Manage user roles and permissions",
)

class AssignRoleInput(BaseModel):
    user_id: str = Field(description="Target user ID")
    role: str = Field(description="Role to assign")

@user_management.tool()
def assign_role(input: AssignRoleInput, ctx):
    """Assign a role to a user in the internal system."""
    return {"user_id": input.user_id, "role": input.role, "assigned": True}
```

**Bind to a session**

Pass custom toolkits via the `experimental` option. `session.tools()` returns both remote Composio tools and your custom toolkit's tools.

**TypeScript:**

```typescript
import { Composio, experimental_createToolkit } from "@composio/core";
import { z } from "zod/v3";

declare const userManagement: ReturnType<typeof experimental_createToolkit>;
const composio = new Composio({ apiKey: "your_api_key" });

const session = await composio.create("user_1", {
  experimental: {
    customToolkits: [userManagement],
  },
});

const tools = await session.tools();
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")

session = composio.create(
    user_id="user_1",
    experimental={
        "custom_toolkits": [user_management],
    },
)

tools = session.tools()
```

# Preloading custom tools

Custom tools are searchable by default. Set `preload: true` / `preload=True` on a
custom tool when it should be returned directly from `session.tools()`. Toolkit
preload applies to all tools in that toolkit; set `preload: false` /
`preload=False` on one tool to opt it out.

**TypeScript:**

```typescript
import { Composio, experimental_createTool } from "@composio/core";
import { OpenAIAgentsProvider } from "@composio/openai-agents";
import { z } from "zod/v3";

const composio = new Composio({
  apiKey: "your_api_key",
  provider: new OpenAIAgentsProvider(),
});

const replyGuide = experimental_createTool("GET_REPLY_STYLE_GUIDE", {
  name: "Get reply style guide",
  description: "Return the team's email reply style guide",
  preload: true,
  inputParams: z.object({
    topic: z.string().describe("Email topic"),
  }),
  execute: async ({ topic }) => ({ topic, tone: "concise and helpful" }),
});

const session = await composio.create("user_1", {
  experimental: {
    customTools: [replyGuide],
  },
});

const tools = await session.tools();
console.log(tools.map((tool) => tool.name));
// LOCAL_GET_REPLY_STYLE_GUIDE
// COMPOSIO_SEARCH_TOOLS
// ... other default meta tools
```

**Python:**

```python
from pydantic import BaseModel, Field

from composio import Composio
from composio_openai_agents import OpenAIAgentsProvider

composio = Composio(
    api_key="your_api_key",
    provider=OpenAIAgentsProvider(),
)

class ReplyGuideInput(BaseModel):
    topic: str = Field(description="Email topic")

@composio.experimental.tool(preload=True)
def get_reply_style_guide(input: ReplyGuideInput, ctx):
    """Return the team's email reply style guide."""
    return {"topic": input.topic, "tone": "concise and helpful"}

session = composio.create(
    user_id="user_1",
    experimental={
        "custom_tools": [get_reply_style_guide],
    },
)

tools = session.tools()
print([tool.name for tool in tools])
# LOCAL_GET_REPLY_STYLE_GUIDE
# COMPOSIO_SEARCH_TOOLS
# ... other default meta tools
```

# Meta tools integration

Custom tools work automatically with Composio's meta tools:

| Meta tool                     | Behavior                                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `COMPOSIO_SEARCH_TOOLS`       | Includes custom tools in search results, with slight priority for tools that don't require auth             |
| `COMPOSIO_GET_TOOL_SCHEMAS`   | Returns schemas for custom tools alongside remote tools                                                     |
| `COMPOSIO_MULTI_EXECUTE_TOOL` | Runs custom tools in-process while remote tools go to the backend, merging results transparently            |
| `COMPOSIO_MANAGE_CONNECTIONS` | Handles auth for extension tools. If a tool extends `gmail`, the agent can prompt the user to connect Gmail |

> Custom tools are not supported in Workbench.

# Context object (`ctx`)

Every custom tool's `execute` function receives `(input, ctx)`. Use `ctx` to access the current user, make authenticated API requests, or call other Composio tools.

**TypeScript:**

| Property / Method                                                     | Description                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `ctx.userId`                                                          | The user ID for the current session                           |
| `ctx.proxyExecute({ toolkit, endpoint, method, body?, parameters? })` | Make an authenticated HTTP request via Composio's auth layer  |
| `ctx.execute(toolSlug, args)`                                         | Execute any Composio native tool from within your custom tool |

**Python:**

| Property / Method                                                        | Description                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `ctx.user_id`                                                            | The user ID for the current session                           |
| `ctx.proxy_execute(toolkit, endpoint, method, body=None, parameters=[])` | Make an authenticated HTTP request via Composio's auth layer  |
| `ctx.execute(tool_slug, arguments)`                                      | Execute any Composio native tool from within your custom tool |

See the full API in the SDK reference: [TypeScript](/reference/sdk-reference/typescript/session-context-impl) | [Python](/reference/sdk-reference/python/session-context-impl)

# Verifying registration

Use these methods to list registered tools and toolkits. Slugs include their final `LOCAL_` prefix, and toolkit-scoped tools also include the toolkit slug.

**TypeScript:**

```typescript
import { Composio } from "@composio/core";
const composio = new Composio({ apiKey: "your_api_key" });
const session = await composio.create("user_1");
const customTools = session.customTools();
const customToolkits = session.customToolkits();
```

**Python:**

```python
custom_tools = session.custom_tools()
custom_toolkits = session.custom_toolkits()
```

# Reusing a session with custom tools

When [reusing a session](/docs/users-and-sessions#reusing-a-session) via `composio.use()`, you can attach custom tools at the same time:

**TypeScript:**

```typescript
import { Composio, experimental_createTool } from "@composio/core";
import { z } from "zod/v3";

declare const getUserProfile: ReturnType<typeof experimental_createTool>;
const composio = new Composio({ apiKey: "your_api_key" });

const session = await composio.use("session_id", {
  customTools: [getUserProfile],
});
```

**Python:**

```python
from composio import Composio

composio = Composio(api_key="your_api_key")

session = composio.use(
    "session_id",
    custom_tools=[get_user_profile],
)
```

# Programmatic execution

Use `session.execute()` to run custom tools directly, outside of an agent loop. Custom tools execute in-process; remote tools are sent to the backend automatically.

**TypeScript:**

```typescript
import { Composio } from "@composio/core";
const composio = new Composio({ apiKey: "your_api_key" });
const session = await composio.create("user_1");
const result = await session.execute("GET_USER_PROFILE");
```

**Python:**

```python
result = session.execute("GET_USER_PROFILE")
```

# Best practices

## Naming and descriptions

The agent relies on your tool's name and description to decide when to call it. Be specific: "Send weekly promo email" is better than "Send email". Include what the tool does, when to use it, and what it returns.

In TypeScript, use uppercase slugs like `SEND_PROMO_EMAIL`. In Python, slugs are inferred from the function name, so `snake_case` produces clean defaults. You can also pass `slug` and `name` explicitly.

## Accessing authenticated APIs

If your tool needs to call an API that requires user credentials (Gmail, GitHub, etc.), set `extendsToolkit` / `extends_toolkit` to the toolkit name. Composio will handle authentication automatically, and the agent can prompt users to connect their account if needed.

## Defining inputs in Python

Your tool's first parameter must be a Pydantic `BaseModel`. The field descriptions become what the agent sees as the input schema, and the function's docstring becomes the tool description. You can override this by passing `description` explicitly.

## Tool names get prefixed

Slugs exposed to the agent are automatically prefixed with `LOCAL_` and the toolkit name (if applicable):

* `GET_USER_PROFILE` becomes `LOCAL_GET_USER_PROFILE`
* `ASSIGN_ROLE` in `USER_MANAGEMENT` becomes `LOCAL_USER_MANAGEMENT_ASSIGN_ROLE`

Your slugs cannot start with `LOCAL_`. This prefix is reserved.

For more best practices, see [How to Build Tools for AI Agents: A Field Guide](https://composio.dev/blog/how-to-build-tools-for-ai-agents-a-field-guide).

---
