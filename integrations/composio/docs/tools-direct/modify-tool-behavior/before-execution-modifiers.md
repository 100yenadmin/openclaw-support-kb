---
type: composio_doc
title: "Before Execution Modifiers"
source: "https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers.md"
source_hash: "11e9f40a95ca6f4f9243bd335938a6c87889c47c1ef027507f033c7d11048099"
doc_path: "tools-direct/modify-tool-behavior/before-execution-modifiers.md"
original_doc_path: "tools-direct/modify-tool-behavior/before-execution-modifiers.md"
duplicate_index: 1
---

# Before Execution Modifiers (/docs/tools-direct/modify-tool-behavior/before-execution-modifiers)
Source: https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers.md


> If you're building an agent, we recommend using [sessions](/docs/configuring-sessions) instead. See [Tools and toolkits](/docs/tools-and-toolkits#meta-tools) for how sessions handle tool discovery and execution automatically.

Before execution modifiers are part of Composio SDK's powerful middleware capabilities that allow you to customize and extend the behavior of tools.

These modifiers are called before the tool is executed by the LLM. This allows you to modify the arguments called by the LLM before they are executed by Composio.

**Useful for:**

* Injecting an argument into the tool execution
* Overriding the arguments emitted by the LLM

![Before Execution Modifier](/images/before-execute.png)

> Below we use the `beforeExecute` modifier to modify the number of posts returned by `HACKERNEWS_GET_LATEST_POSTS`.

# With Chat Completions

Since completion providers don't have a function execution step, Composio executes the tool call directly. The modifier is configured on the `tools.execute` method.

**Python:**

```python
from openai import OpenAI
from composio import Composio, before_execute
from composio.types import ToolExecuteParams

composio = Composio()
openai_client = OpenAI()
user_id = "user@email.com"

@before_execute(tools=["HACKERNEWS_GET_LATEST_POSTS"])
def before_execute_modifier(
    tool: str,
    toolkit: str,
    params: ToolExecuteParams,
) -> ToolExecuteParams:
    params["arguments"]["size"] = 1
    return params

# Get tools
tools = composio.tools.get(user_id=user_id, slug="HACKERNEWS_GET_LATEST_POSTS")

# Get response from the LLM
response = openai_client.chat.completions.create(
    model="gpt-5.4",
    tools=tools,
    messages=[{"role": "user", "content": "Fetch latest posts from hackernews"}],
)
print(response)

# Execute the function calls
result = composio.provider.handle_tool_calls(
    response=response,
    user_id="default",
    modifiers=[
        before_execute_modifier,
    ],
)
print(result)
```

**TypeScript:**

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-5.4",
  messages,
  tools,
  tool_choice: "auto",
});

const { tool_calls } = response.choices[0].message;
console.log(tool_calls);

if (tool_calls) {
  const {
    function: { arguments: toolArgs },
  } = tool_calls[0];

  const result = await composio.tools.execute(
    "HACKERNEWS_GET_LATEST_POSTS",
    {
      userId,
      arguments: JSON.parse(toolArgs),
    },
    {
      beforeExecute: ({ toolSlug, toolkitSlug, params }) => {
        if (toolSlug === "HACKERNEWS_GET_LATEST_POSTS") {
          params.arguments.size = 1;
        }
        console.log(params);
        return params;
      },
    }
  );
  console.log(JSON.stringify(result, null, 2));
}
```

# With Agentic Frameworks

Agentic providers have a function execution step. The modifier is configured on the `tools.get` method which modifies the execution logic within the framework.

**Python:**

```python
from composio import Composio, before_execute
from composio.types import ToolExecuteParams
from composio_crewai import CrewAIProvider

composio = Composio(provider=CrewAIProvider())

@before_execute(tools=["LINEAR_CREATE_LINEAR_ISSUE"])
def modify_linear_project_id(
    tool: str,
    toolkit: str,
    params: ToolExecuteParams,
) -> ToolExecuteParams:
    params["arguments"]["project_id"] = "1234567890"
    return params

tools = composio.tools.get(
    user_id="default",
    tools=[
        "HACKERNEWS_GET_LATEST_POSTS",
        "HACKERNEWS_GET_USER",
        "LINEAR_CREATE_LINEAR_ISSUE",
    ],
    modifiers=[
        modify_linear_project_id,
    ]
)
```

**TypeScript:**

```typescript
import { Composio } from "@composio/core";
import { MastraProvider } from "@composio/mastra";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new MastraProvider(),
});

const userId = "user@acme.com";

const agenticTools = await composio.tools.get(
  userId,
  {
    tools: [
      "HACKERNEWS_GET_LATEST_POSTS",
      "HACKERNEWS_GET_USER",
      "LINEAR_CREATE_LINEAR_ISSUE",
    ],
  },
  {
    beforeExecute: ({toolSlug, toolkitSlug, params}) => {
      if (toolSlug === "LINEAR_CREATE_LINEAR_ISSUE") {
        params.arguments.project_id = "1234567890";
      }
      return params;
    },
  }
);
```

# Before file upload (Python)

For tools with `file_uploadable` parameters, the SDK can read a local path and upload the file before calling the Composio API. To audit, rewrite, or block those paths, use the [`@before_file_upload`](/reference/sdk-reference/python/index#before_file_upload) decorator and pass the decorated callables in `modifiers` to `tools.get`, `tools.execute`, or a tool router session’s `tools(modifiers=...)`.

See [Executing tools: security for local file paths](/docs/tools-direct/executing-tools#security-for-local-file-paths) for constructor options, errors, and a full tabbed example.

The hook takes either a single `context` argument (preferred) or the legacy
3-arg `(path, tool, toolkit)` form. The context object exposes
`context["source"]` — `"path"` for local filesystem inputs and `"url"` for
`http(s)://...` inputs — so you can scope audits to just local paths:

```python
from composio import Composio, before_file_upload

@before_file_upload(tools=["GOOGLEDRIVE_UPLOAD_FILE"])
def audit_path(ctx) -> str | bool:
    # ctx = {"path": ..., "source": "path" | "url", "tool": ..., "toolkit": ...}
    if ctx["source"] != "path":
        return ctx["path"]  # let URLs through untouched
    # return a new path string, or False to abort the upload
    return ctx["path"]

composio = Composio()
composio.tools.execute(
    "GOOGLEDRIVE_UPLOAD_FILE",
    {"file_to_upload": "/path/to/document.pdf"},
    user_id="user_123",
    modifiers=[audit_path],
)
```

* **Composition:** `before_file_upload`-type modifiers in the `modifiers` list are applied in **list order** (after filtering by each modifier’s `tools` / `toolkits` scope). Chaining works like a pipeline: each hook receives the path produced by the previous one.
* **Relative to `before_execute`:** automatic file substitution runs **before** `before_execute` modifiers, matching TypeScript behavior (including tool router `execute_meta`).

# What to read next

- [After execution modifiers](/docs/tools-direct/modify-tool-behavior/after-execution-modifiers): Transform tool results after execution

- [Schema modifiers](/docs/tools-direct/modify-tool-behavior/schema-modifiers): Customize how tools appear to agents

- [Executing tools](/docs/tools-direct/executing-tools): Run tools with providers, agentic frameworks, or direct execution

---
