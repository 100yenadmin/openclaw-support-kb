---
type: composio_doc
title: "Local sandbox"
source: "https://docs.composio.dev/docs/sandbox/local.md"
source_hash: "62da74d31013a5539d8250e6a818a76ce4e6aacb906a287b6dfaed1cbf933ed7"
system: "composio"
kb_namespace: "composio"
doc_path: "sandbox/local.md"
original_doc_path: "sandbox/local.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Local sandbox (/docs/sandbox/local)
Source: https://docs.composio.dev/docs/sandbox/local.md


A **local sandbox** runs your agent's code in your own infrastructure instead of Composio's hosted [remote sandbox](/docs/sandbox/remote), so code execution never leaves your security boundary.

# When to use it

Reach for a local sandbox when:

* **Sensitive code or data.** The agent runs untrusted code or touches data that can't leave your infrastructure.
* **You already run sandboxes.** You'd rather run agent code in your own VM, container, or CI worker than a hosted runtime.
* **You need your own filesystem and shell.** The task installs packages, runs a build, or shells out to local tools.

If none of that applies, use the [remote sandbox](/docs/sandbox/remote). It's the same helper surface with no infrastructure to run.

# Create a local sandbox session

A local sandbox session is a [session](/docs/how-composio-works) created with the remote sandbox turned off. Set `workbench.enable: false`, then pass the session to `experimental_createLocalWorkbenchSession` (from the `@composio/experimental` package), which returns the two pieces you run yourself.

```typescript
import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Create the session with the remote sandbox disabled, so code runs in your box.
const session = await composio.create('user_123', {
  toolkits: ['github'],
  workbench: { enable: false },
});

const { helperSource, env } = await experimental_createLocalWorkbenchSession(composio, session);
```

You get back two things:

| Field          | What it is                                                                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `helperSource` | A Python helper, as source you write into your sandbox (for example as `composio_helper.py`). It exposes the in-sandbox tool surface the agent calls. |
| `env`          | The environment variables that helper needs to reach Composio from inside your box. Pass them to the process you run the agent in.                    |

`experimental_createLocalWorkbenchSession` validates that the session is local: it throws if the session has the remote workbench enabled, because the remote sandbox and a local one can't both run for a single session. The session you pass in must have `workbench.enable: false`.

> The API ships under the `experimental_` prefix and the `@composio/experimental/workbench` entry point, so the surface may change in a future release.

# The helper contract

`helperSource` is a Python module your agent imports. It exposes the same helpers the [remote sandbox](/docs/sandbox/remote#built-in-helpers) runs, with the same signatures, so the agent calls tools without knowing that execution is local:

```python
from composio_helper import run_composio_tool, invoke_llm, web_search

response, error = run_composio_tool(
    "GITHUB_GET_A_PULL_REQUEST",
    {"owner": "composiohq", "repo": "composio", "pull_number": 1},
)
```

Every `run_composio_tool` call routes back through the Tool Router under the session's connections, so auth and discovery stay managed.

Most of the workbench helpers run in a local sandbox today. Only the file helpers, which depend on the managed `/mnt/files` mount, are remote-only:

| Helper               | What it does                                                                       | Local sandbox |
| -------------------- | ---------------------------------------------------------------------------------- | ------------- |
| `run_composio_tool`  | Execute any Composio tool                                                          | ✅             |
| `invoke_llm`         | Call an LLM                                                                        | ✅             |
| `web_search`         | Search the web                                                                     | ✅             |
| `proxy_execute`      | Call a toolkit API directly when no tool exists (needs a proxy-execute-scoped key) | ✅             |
| `upload_local_file`  | Upload generated files to storage                                                  | ❌             |
| `smart_file_extract` | Extract text from PDFs and images                                                  | ❌             |

If your agent needs one of the file helpers, use the [remote sandbox](/docs/sandbox/remote) for now.

# Security: the sandbox is your boundary

The helper reaches Composio with your project `COMPOSIO_API_KEY`, injected into the sandbox through `env`. Any code or output in the sandbox can read it, and that key acts across every connection on the project.

> The sandbox is your security boundary. Isolate it like anything else holding a project credential, and rotate `COMPOSIO_API_KEY` if a run could have leaked it.

# Next

- [What is a session?](/docs/how-composio-works): How sessions scope tools, auth, and sandbox state to a user

---
