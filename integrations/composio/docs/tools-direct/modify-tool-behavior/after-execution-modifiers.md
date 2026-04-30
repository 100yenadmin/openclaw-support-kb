---
type: composio_doc
title: "After Execution Modifiers"
source: "https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers.md"
source_hash: "a6f336c1abbbf451da864c2e519b99c57e3f82bb0da439f5918f56d8bc642bbb"
doc_path: "tools-direct/modify-tool-behavior/after-execution-modifiers.md"
original_doc_path: "tools-direct/modify-tool-behavior/after-execution-modifiers.md"
duplicate_index: 1
---

# After Execution Modifiers (/docs/tools-direct/modify-tool-behavior/after-execution-modifiers)
Source: https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers.md


> If you're building an agent, we recommend using [sessions](/docs/configuring-sessions) instead. See [Tools and toolkits](/docs/tools-and-toolkits#meta-tools) for how sessions handle tool discovery and execution automatically.

After execution modifiers are part of Composio SDK's powerful middleware capabilities that allow you to customize and extend the behavior of tools.

These modifiers are called after the tool is executed. This allows you to modify the result of the tool before it is returned to the agent.

**Useful for:**

* Modifying or truncating the output of the tool
* Converting the output to a different format before returning it to the agent

![After Execution Modifier](/images/after-execute.png)

> Below we use the `afterExecute` modifier to truncate the output of `HACKERNEWS_GET_USER` and only return the karma of the user.

# With Chat Completions

Since completion providers don't have a function execution step, Composio executes the tool call directly. The modifier is configured on the `tools.execute` method.

**Python:**

```python
from composio import Composio, after_execute
from composio.types import ToolExecutionResponse

@after_execute(tools=["HACKERNEWS_GET_USER"])
def after_execute_modifier(
    tool: str,
    toolkit: str,
    response: ToolExecutionResponse,
) -> ToolExecutionResponse:
    return {
        **response,
        "data": {
            "karma": response["data"]["karma"],
        },
    }

tools = composio.tools.get(user_id=user_id, slug="HACKERNEWS_GET_USER")

# Get response from the LLM
response = openai_client.chat.completions.create(
    model="gpt-5.4",
    tools=tools,
    messages=messages,
)
print(response)

# Execute the function calls
result = composio.provider.handle_tool_calls(
  response=response,
  user_id="default",
  modifiers=[
     after_execute_modifier,
  ]
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
    "HACKERNEWS_GET_USER",
    {
      userId,
      arguments: JSON.parse(toolArgs),
    },
    {
      afterExecute: ({ toolSlug, toolkitSlug, result }) => {
        if (toolSlug === "HACKERNEWS_GET_USER") {
          const { data } = result;
          const { karma } = data.response_data as { karma: number };
          return {
            ...result,
            data: { karma },
          };
        }
        return result;
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
from composio import Composio, after_execute
from composio.types import ToolExecutionResponse
from composio_crewai import CrewAIProvider

composio = Composio(provider=CrewAIProvider())

@after_execute(tools=["HACKERNEWS_GET_USER"])
def after_execute_modifier(
    tool: str,
    toolkit: str,
    response: ToolExecutionResponse,
) -> ToolExecutionResponse:
    return {
        **response,
        "data": {
            "karma": response["data"]["karma"],
        },
    }

tools = composio.tools.get(
    user_id="default",
    slug="HACKERNEWS_GET_USER",
    modifiers=[
        after_execute_modifier,
    ]
)
```

**TypeScript:**

```typescript
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import { v4 as uuidv4 } from "uuid";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new VercelProvider(),
});

const userId = uuidv4();

const agenticTools = await composio.tools.get(
  userId,
  {
    tools: ["HACKERNEWS_GET_USER"],
  },
  {
    afterExecute: ({ toolSlug, toolkitSlug, result }) => {
      if (toolSlug === "HACKERNEWS_GET_USER") {
        const {
          data: { response_data: { karma } = {} } = {},
        } = result;
        return {
          ...result,
          data: { karma },
        };
      }
      return result;
    },
  }
);
```

# What to read next

- [Before execution modifiers](/docs/tools-direct/modify-tool-behavior/before-execution-modifiers): Modify tool arguments before execution

- [Schema modifiers](/docs/tools-direct/modify-tool-behavior/schema-modifiers): Customize how tools appear to agents

- [Executing tools](/docs/tools-direct/executing-tools): Run tools with providers, agentic frameworks, or direct execution

---
