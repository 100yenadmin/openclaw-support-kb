---
type: composio_doc
title: "Creating Custom Tools"
source: "https://docs.composio.dev/docs/tools-direct/custom-tools.md"
source_hash: "bca6a224ab34bc67b02e1b0b94903563ba125302d6e6bf68a1fba53219ed43fe"
doc_path: "tools-direct/custom-tools.md"
original_doc_path: "tools-direct/custom-tools.md"
duplicate_index: 1
---

# Creating Custom Tools (/docs/tools-direct/custom-tools)
Source: https://docs.composio.dev/docs/tools-direct/custom-tools.md


> If you're building an agent, we recommend using [sessions](/docs/configuring-sessions) instead. See [Custom Tools and Toolkits (Experimental)](/docs/toolkits/custom-tools-and-toolkits) for defining local tools that run in-process alongside remote Composio tools within a session.

Custom tools allow you to create your own tools that can be used with Composio.

1. **Standalone tools** - Simple tools that don't require any authentication
2. **Toolkit-based tools** - Tools that require authentication and can use toolkit credentials

# Creating a Custom Tool

## Standalone Tool

A standalone tool is the simplest form of custom tool. It only requires input parameters and an execute function:

**Python:**

```python
from pydantic import BaseModel, Field

from composio import Composio
from composio.types import ExecuteRequestFn

composio = Composio()

class AddTwoNumbersInput(BaseModel):
    a: int = Field(
        ...,
        description="The first number to add",
    )
    b: int = Field(
        ...,
        description="The second number to add",
    )

# function name will be used as slug
@composio.tools.custom_tool
def add_two_numbers(request: AddTwoNumbersInput) -> int:
    """Add two numbers."""
    return request.a + request.b
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { z } from 'zod/v3';
const composio = new Composio({ apiKey: 'your_api_key' });
const tool = await composio.tools.createCustomTool({
  slug: 'CALCULATE_SQUARE',
  name: 'Calculate Square',
  description: 'Calculates the square of a number',
  inputParams: z.object({
    number: z.number().describe('The number to calculate the square of'),
  }),
  execute: async input => {
    const { number } = input;
    return {
      data: { result: number * number },
      error: null,
      successful: true,
    };
  },
});
```

## Toolkit-based Tool

A toolkit-based tool has access to two ways of making authenticated requests:

**1. Using `executeToolRequest`** - The recommended way to make authenticated requests to the toolkit's API endpoints. Composio automatically handles credential injection and baseURL resolution:

**Python:**

```python
class GetIssueInfoInput(BaseModel):
    issue_number: int = Field(
        ...,
        description="The number of the issue to get information about",
    )

# function name will be used as slug
@composio.tools.custom_tool(toolkit="github")
def get_issue_info(
    request: GetIssueInfoInput,
    execute_request: ExecuteRequestFn,
    auth_credentials: dict,
) -> dict:
    """Get information about a GitHub issue."""
    response = execute_request(
        endpoint=f"/repos/composiohq/composio/issues/{request.issue_number}",
        method="GET",
        parameters=[
            {
                "name": "Accept",
                "value": "application/vnd.github.v3+json",
                "type": "header",
            },
            {
                "name": "Authorization",
                "value": f"Bearer {auth_credentials['access_token']}",
                "type": "header",
            },
        ],
    )
    return {"data": response.data}
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { z } from 'zod/v3';
const composio = new Composio({ apiKey: 'your_api_key' });
const tool = await composio.tools.createCustomTool({
  slug: 'GITHUB_STAR_COMPOSIOHQ_REPOSITORY',
  name: 'Github star composio repositories',
  toolkitSlug: 'github',
  description: 'Star any specified repo of `composiohq` user',
  inputParams: z.object({
    repository: z.string().describe('The repository to star'),
    page: z.number().optional().describe('Pagination page number'),
    customHeader: z.string().optional().describe('Custom header'),
  }),
  execute: async (input, connectionConfig, executeToolRequest) => {
    // This method makes authenticated requests to the relevant API
    // You can use relative paths!
    // Composio will automatically inject the baseURL
    const result = await executeToolRequest({
      endpoint: `/user/starred/composiohq/${input.repository}`,
      method: 'PUT',
      body: {},
      // Add custom headers or query parameters
      parameters: [
        // Add query parameters
        {
          name: 'page',
          value: input.page?.toString() || '1',
          in: 'query',
        },
        // Add custom headers
        {
          name: 'x-custom-header',
          value: input.customHeader || 'default-value',
          in: 'header',
        },
      ],
    });
    return result;
  },
});
```

**2. Using `connectionConfig`** - For making direct API calls when needed:

**Python:**

```python
import requests

@composio.tools.custom_tool(toolkit="github")
def get_issue_info_direct(
    request: GetIssueInfoInput,
    execute_request: ExecuteRequestFn,
    auth_credentials: dict,
) -> dict:
    """Get information about a GitHub issue."""
    response = requests.get(
        f"https://api.github.com/repos/composiohq/composio/issues/{request.issue_number}",
        headers={
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"Bearer {auth_credentials['access_token']}",
        },
    )
    return {"data": response.json()}
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { z } from 'zod/v3';
const composio = new Composio({ apiKey: 'your_api_key' });
const tool = await composio.tools.createCustomTool({
  slug: 'GITHUB_DIRECT_API',
  name: 'Direct GitHub API Call',
  description: 'Makes direct calls to GitHub API',
  toolkitSlug: 'github',
  inputParams: z.object({
    repo: z.string().describe('Repository name'),
  }),
  execute: async (input, connectionConfig, executeToolRequest) => {
    // Use connectionConfig for direct API calls
    if (!connectionConfig || connectionConfig.authScheme !== 'OAUTH2') {
      throw new Error('OAuth2 connection required');
    }
    const result = await fetch(`https://api.github.com/repos/${input.repo}`, {
      headers: {
        Authorization: `Bearer ${connectionConfig.val.access_token}`,
      },
    });

    return {
      data: await result.json(),
      error: null,
      successful: true,
    };
  },
});
```

## Using Custom Headers and Query Parameters

You can add custom headers and query parameters to your toolkit-based tools using the `parameters` option in `executeToolRequest`:

**Python:**

```python
@composio.tools.custom_tool(toolkit="github")
def get_issue_info(
    request: GetIssueInfoInput,
    execute_request: ExecuteRequestFn,
    auth_credentials: dict,
) -> dict:
    """Get information about a GitHub issue."""
    response = execute_request(
        endpoint=f"/repos/composiohq/composio/issues/{request.issue_number}",
        method="GET",
        parameters=[
            {
                "name": "Accept",
                "value": "application/vnd.github.v3+json",
                "type": "header",
            },
            {
                "name": "Authorization",
                "value": f"Bearer {auth_credentials['access_token']}",
                "type": "header",
            },
            {
                "name": 'X-Custom-Header',
                "value": 'custom-value',
                "type": 'header',
            },
        ],
    )
    return {"data": response.data}
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
import { z } from 'zod/v3';
const composio = new Composio({ apiKey: 'your_api_key' });
const tool = await composio.tools.createCustomTool({
  slug: 'GITHUB_SEARCH_REPOSITORIES',
  name: 'Search GitHub Repositories',
  description: 'Search for repositories with custom parameters',
  toolkitSlug: 'github',
  inputParams: z.object({
    query: z.string().describe('Search query'),
    perPage: z.number().optional().describe('Results per page'),
    acceptType: z.string().optional().describe('Custom accept header'),
  }),
  execute: async (input, connectionConfig, executeToolRequest) => {
    const result = await executeToolRequest({
      endpoint: '/search/repositories',
      method: 'GET',
      parameters: [
        // Add query parameters for pagination
        {
          name: 'q',
          value: input.query,
          in: 'query',
        },
        {
          name: 'per_page',
          value: (input.perPage || 30).toString(),
          in: 'query',
        },
        // Add custom headers
        {
          name: 'Accept',
          value: input.acceptType || 'application/vnd.github.v3+json',
          in: 'header',
        },
        {
          name: 'X-Custom-Header',
          value: 'custom-value',
          in: 'header',
        },
      ],
    });
    return result;
  },
});
```

# Executing Custom Tools

You can execute custom tools just like any other tool:

**Python:**

```python
response = composio.tools.execute(
    user_id="default",
    slug="TOOL_SLUG", # For the tool above you can use `get_issue_info.slug`
    arguments={"issue_number": 1},
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const result = await composio.tools.execute('TOOL_SLUG', {
  arguments: {
    // Tool input parameters
  },
  userId: 'user-id',
  connectedAccountId: 'optional-account-id', // Required for toolkit-based tools
});
```

# Best Practices

1. Use descriptive names and slugs for your tools
2. Always provide descriptions for input parameters using `describe()`
3. Handle errors gracefully in your execute function
4. For toolkit-based tools:
  * Prefer `executeToolRequest` over direct API calls when possible
  * Use relative paths with `executeToolRequest` - Composio will automatically inject the correct baseURL
  * Use the `parameters` option to add custom headers or query parameters:
```typescript
parameters: [
  { name: 'page', value: '1', in: 'query' }, // Adds ?page=1 to URL
  { name: 'x-custom', value: 'value', in: 'header' }, // Adds header
];
```
  * Remember that `executeToolRequest` can only call tools from the same toolkit
  * Use `executeToolRequest` to leverage Composio's automatic credential handling
  * Only use `connectionConfig` when you need to make direct API calls or interact with different services
5. Chain multiple toolkit operations using `executeToolRequest` for better maintainability

# Limitations

1. Custom tools are stored in memory and are not persisted
2. They need to be recreated when the application restarts
3. Toolkit-based tools require a valid connected account with the specified toolkit
4. `executeToolRequest` can only execute tools from the same toolkit that the custom tool belongs to
5. Each toolkit-based tool can only use one connected account at a time

# What to read next

- [Executing tools](/docs/tools-direct/executing-tools): Run tools with providers, agentic frameworks, or direct execution

- [Fetching tools](/docs/tools-direct/fetching-tools): Fetch and filter tools, inspect schemas, and search semantically

- [Authenticating tools](/docs/tools-direct/authenticating-tools): Create auth configs and connect user accounts

---
