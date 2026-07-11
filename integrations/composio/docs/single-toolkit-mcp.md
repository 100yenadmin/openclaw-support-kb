---
type: composio_doc
title: "Single Toolkit MCP"
source: "https://docs.composio.dev/docs/single-toolkit-mcp.md"
source_hash: "090f9a9fab9f13c44ec9712dbd636b1841a8c9023d1f22fb3a5254b8aca0f7c4"
system: "composio"
kb_namespace: "composio"
doc_path: "single-toolkit-mcp.md"
original_doc_path: "single-toolkit-mcp.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Single Toolkit MCP (/docs/single-toolkit-mcp)
Source: https://docs.composio.dev/docs/single-toolkit-mcp.md


> For most use cases, use a regular [session](/docs/configuring-sessions) instead. Sessions provide dynamic tool access and a much better MCP experience with context management handled by us.

# Install the SDK

**Python:**

**TypeScript:**

# Create an MCP server

### Initialize Composio

**Python:**

```python
from composio import Composio

composio = Composio(api_key="YOUR_API_KEY")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY
});
```

### Create server configuration

> **Before you begin:** [Create an auth configuration](/docs/auth-configuration/custom-auth-configs) for your toolkit.

**Python:**

```python
server = composio.mcp.create(
    name="my-gmail-server",
    toolkits=[{
        "toolkit": "gmail",
        "auth_config": "ac_xyz123"
    }],
    allowed_tools=["GMAIL_FETCH_EMAILS", "GMAIL_SEND_EMAIL"]
)

print(f"Server created: {server.id}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const server = await composio.mcp.create("my-gmail-server", {
  toolkits: [
    {
      authConfigId: "ac_xyz123",
      toolkit: "gmail"
    }
  ],
  allowedTools: ["GMAIL_FETCH_EMAILS", "GMAIL_SEND_EMAIL"]
});

console.log(`Server created: ${server.id}`);
```

> You can also create and manage MCP configs from the [Composio dashboard](https://dashboard.composio.dev/~/org/connect/clients).

### Generate user URLs

> Users must authenticate with the toolkits configured in your MCP server first. See [authentication](/docs/authentication) for details.

**Python:**

```python
instance = composio.mcp.generate(user_id="user-123", mcp_config_id=server.id)

print(f"MCP Server URL: {instance['url']}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const server = { id: 'my-gmail-server' };
const instance = await composio.mcp.generate("user-123", server.id);

console.log("MCP Server URL:", instance.url);
```

### Use with AI providers

> Pass an `x-api-key` header when connecting to Composio MCP. This is required when `require_mcp_api_key` is enabled (default for newly created organizations).

**OpenAI (Python):**

```python
from openai import OpenAI

client = OpenAI(api_key="your-openai-api-key")

mcp_server_url = "https://backend.composio.dev/v3/mcp/YOUR_SERVER_ID?user_id=YOUR_USER_ID"
mcp_headers = {"x-api-key": "YOUR_COMPOSIO_API_KEY"}

response = client.responses.create(
    model="gpt-5",
    tools=[{
        "type": "mcp",
        "server_label": "composio-server",
        "server_url": mcp_server_url,
        "headers": mcp_headers,
        "require_approval": "never",
    }],
    input="What are my latest emails?",
)

print(response.output_text)
```

**Anthropic (Python):**

```python
from anthropic import Anthropic

client = Anthropic(api_key="your-anthropic-api-key")

mcp_server_url = "https://backend.composio.dev/v3/mcp/YOUR_SERVER_ID?user_id=YOUR_USER_ID"
mcp_headers = {"x-api-key": "YOUR_COMPOSIO_API_KEY"}

response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    messages=[{"role": "user", "content": "What are my latest emails?"}],
    mcp_servers=[{
        "type": "url",
        "url": mcp_server_url,
        "name": "composio-mcp-server",
        "headers": mcp_headers,
    }],
    betas=["mcp-client-2025-04-04"]
)

print(response.content)
```

**Mastra (TypeScript):**

```typescript
import { MCPClient } from "@mastra/mcp";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

const MCP_URL = "https://backend.composio.dev/v3/mcp/YOUR_SERVER_ID?user_id=YOUR_USER_ID";
const MCP_HEADERS = { "x-api-key": "YOUR_COMPOSIO_API_KEY" };

const client = new MCPClient({
  id: "mcp-client",
  servers: {
    composio: { url: new URL(MCP_URL), headers: MCP_HEADERS },
  }
});

const agent = new Agent({
  id: "assistant",
  name: "Assistant",
  instructions: "You are a helpful assistant that can read and manage emails.",
  model: openai("gpt-5.4"),
  tools: await client.getTools()
});

const res = await agent.generate("What are my latest emails?");
console.log(res.text);
```

# Server management

## List servers

**Python:**

```python
servers = composio.mcp.list()
print(f"Found {len(servers['items'])} servers")

# Filter by toolkit
gmail_servers = composio.mcp.list(toolkits="gmail", limit=20)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const servers = await composio.mcp.list({
  toolkits: [],
  authConfigs: [],
  limit: 10,
  page: 1
});
console.log(`Found ${servers.items.length} servers`);

// Filter by toolkit
const gmailServers = await composio.mcp.list({
  toolkits: ["gmail"],
  authConfigs: [],
  limit: 20,
  page: 1
});
```

## Get server details

**Python:**

```python
server = composio.mcp.get("mcp_server_id")
print(f"Server: {server.name}")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const server = await composio.mcp.get("mcp_server_id");
console.log(`Server: ${server.name}`);
```

## Update a server

**Python:**

```python
updated = composio.mcp.update(
    server_id="mcp_server_id",
    name="updated-name",
    allowed_tools=["GMAIL_FETCH_EMAILS", "GMAIL_SEARCH_EMAILS"]
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const updated = await composio.mcp.update("mcp_server_id", {
  name: "updated-name",
  allowedTools: ["GMAIL_FETCH_EMAILS", "GMAIL_SEARCH_EMAILS"]
});
```

## Delete a server

**Python:**

```python
result = composio.mcp.delete("mcp_server_id")
if result['deleted']:
    print("Server deleted")
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const result = await composio.mcp.delete("mcp_server_id");
if (result.deleted) {
  console.log("Server deleted");
}
```

# Next

- [Providers](/docs/providers):
Use with Anthropic, OpenAI, and other frameworks

---


# Examples


---

# Build a Slack bot that can do work with you and your team (/examples/general-agent-with-pi)

The agent is the easy part. [Pi](https://github.com/earendil-works/pi/tree/main/packages/coding-agent) does the reasoning; Composio gives it 1000+ apps to act on. In three lines you have an agent that can open a PR, check a calendar, or search a Notion workspace for one user.

The work is everything around it: putting that agent in Slack, where a whole team talks to it, and making it act as *each* person while posting as one bot. That's a handful of Composio pieces:

1. **Triggers** deliver every Slack message to your server as a webhook.
2. **Sessions** give each user their own scoped toolset, so the agent acts as *them*.
3. **A shared connection** lets the bot speak as the workspace bot, with one install for everyone.
4. **Redirected auth links** keep OAuth out of the channel: when an app isn't connected, the bot DMs the user a link and resumes on approval.
5. **The proxy** reaches the Slack Web API endpoints the toolkit doesn't wrap as tools.

Below you build the whole thing from scratch: a basic agent first, then a piece at a time up to the full server, then a browse of the real source. You bring a Composio API key and an agent runtime. Composio brings the workspace.

# Setup

You need a [Composio API key](https://dashboard.composio.dev), a publicly reachable URL for your server, and [Bun](https://bun.sh).

**No public URL? Use a Cloudflare tunnel**

Composio posts webhooks to your server, so it needs a public URL. In local development, run a [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) to expose your local port:

```bash
cloudflared tunnel --url http://localhost:3000
```

Use the `https://…trycloudflare.com` URL it prints as your `APP_URL`.

```bash
bun add @composio/core @composio/experimental @earendil-works/pi-coding-agent
```

# Install the bot

A Slack bot needs a Slack app to authenticate as and a stream of events. Composio gives you both, so you never register a webhook with Slack or hold a bot token. The `slackbot` toolkit ships with Composio-managed OAuth, and you install it as one **[shared connection](/docs/shared-connections)** for the whole workspace.

This is `install.ts`, run once, built up three steps at a time:

**`install.ts` — complete file**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// The scopes the bot needs. The slackbot toolkit ships Composio-managed OAuth,
// so you never register your own Slack app.
const authConfig = await composio.authConfigs.create('slackbot', {
  type: 'use_composio_managed_auth',
  name: 'workspace-bot',
  credentials: {
    scopes: ['app_mentions:read', 'channels:history', 'chat:write', 'reactions:write', 'users:read'],
    user_scopes: ['search:read'],
  },
});

// One connection for the whole workspace: authorize it as SHARED.
const setup = await composio.create('setup:workspace-bot', {
  toolkits: ['slackbot'],
  authConfigs: { slackbot: authConfig.id },
  manageConnections: true,
});
const request = await setup.authorize('slackbot', {
  callbackUrl: `${process.env.APP_URL}/setup/callback`,
  experimental: { accountType: 'SHARED' },
});
console.log('Approve the install:', request.redirectUrl);

// On the OAuth callback: open the ACL, subscribe your webhook, create triggers.
// Persist connectedAccountId as SLACK_CONNECTION_ID for the bot server.
export async function onSetupCallback(connectedAccountId: string) {
  await composio.connectedAccounts.updateAcl(connectedAccountId, { allowAllUsers: true });
  await composio.triggers.setWebhookSubscription({ webhookUrl: `${process.env.APP_URL}/webhooks/composio` });
  await composio.triggers.create('setup:workspace-bot', 'SLACKBOT_CHANNEL_MESSAGE_RECEIVED', { triggerConfig: { is_bot_message: false } });
  await composio.triggers.create('setup:workspace-bot', 'SLACKBOT_DIRECT_MESSAGE_RECEIVED', { triggerConfig: {} });
}
```

A webhook subscription is the *pipe*; each trigger is a *tap*. Together they stream channel messages and DMs to your server. The connected account id that comes back from the OAuth callback is the `SLACK_CONNECTION_ID` the server pins into every session.

# Build the bot

`bot.ts` starts as a bare three-line agent and grows into the server, one Composio concept at a time. Each diff below is exactly what that concept adds.

## Start with a basic agent

The whole idea, before any Slack: create a session for a user, hand the Pi provider the session so it can search and execute, and run a prompt. This already acts across every app that user has connected.

**`bot.ts` — step 1: A basic agent**

```typescript
import { Composio } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// The smallest agent: one session, its tools, one prompt.
export async function runAgent(userId: string, prompt: string) {
  const session = await composio.create(userId);
  const tools = piProvider.createSessionTools({
    sessionId: session.sessionId,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
  });
  return runPi(tools, prompt);
}
```

## Put it in a Slack thread

Turn the one-shot agent into a handler. Each Slack thread gets its own [session](/docs/configuring-sessions), reused so the agent keeps context, and the reply goes back with the `SLACKBOT_SEND_MESSAGE` tool. The session is keyed to the Slack user, so when Alice asks for a GitHub issue it opens as *Alice*, against her GitHub connection.

**`bot.ts` — step 2: Wire it to Slack threads**

```typescript
import { Composio } from '@composio/core';
import type { IncomingTriggerPayload } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
  `${event.payload?.channel}:${event.payload?.thread_ts ?? event.payload?.ts}`;

async function sessionForThread(event: IncomingTriggerPayload) {
  const key = threadKey(event);
  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
  return { session, memory };
}

function toolsForSession(session) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
  });
}

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');

  const reply = await runPi(toolsForSession(session), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
    text: reply,
  });
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}
```

## Share one workspace connection

By default a connected account is **PRIVATE**: only its creator can use it. The install authorized the Slack connection as **SHARED**, so you pin it into every session. Now Alice's session has *her* GitHub connection but *the workspace's* Slack connection. It posts as the bot, and acts everywhere else as Alice.

**`bot.ts` — step 3: Share one workspace connection**

```typescript
import { Composio } from '@composio/core';
import type { IncomingTriggerPayload } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One Slack connection, shared by the whole workspace. The bot posts as this
// identity while acting in every other app as the individual user.
const SHARED_SLACK_CONNECTION_ID = process.env.SLACK_CONNECTION_ID;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
  `${event.payload?.channel}:${event.payload?.thread_ts ?? event.payload?.ts}`;

async function sessionForThread(event: IncomingTriggerPayload) {
  const key = threadKey(event);
  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    // Pin the shared Slack connection; the session still resolves every other
    // toolkit against this user's own connections.
    connectedAccounts: { slackbot: [SHARED_SLACK_CONNECTION_ID] },
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
  return { session, memory };
}

function toolsForSession(session) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
  });
}

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');

  const reply = await runPi(toolsForSession(session), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
    text: reply,
  });
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}
```

## Reach the gaps with the proxy

Most Slack actions are `SLACKBOT_*` tools. The few that aren't, like the typing indicator and opening a DM channel, drop down to `session.proxyExecute`, which calls the Slack Web API with the pinned connection's auth so you never touch a token.

**`bot.ts` — step 4: Reach the gaps with the proxy**

```typescript
import { Composio } from '@composio/core';
import type { IncomingTriggerPayload } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One Slack connection, shared by the whole workspace. The bot posts as this
// identity while acting in every other app as the individual user.
const SHARED_SLACK_CONNECTION_ID = process.env.SLACK_CONNECTION_ID;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
  `${event.payload?.channel}:${event.payload?.thread_ts ?? event.payload?.ts}`;

async function sessionForThread(event: IncomingTriggerPayload) {
  const key = threadKey(event);
  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    // Pin the shared Slack connection; the session still resolves every other
    // toolkit against this user's own connections.
    connectedAccounts: { slackbot: [SHARED_SLACK_CONNECTION_ID] },
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
  return { session, memory };
}

// Anything the toolkit doesn't wrap as a tool, reach via the proxy: it calls the
// Slack Web API with the pinned connection's auth, so you never touch a token.
async function setStatus(session, event: IncomingTriggerPayload, status: string) {
  await session
    .proxyExecute({
      toolkit: 'slackbot',
      endpoint: 'https://slack.com/api/assistant.threads.setStatus',
      method: 'POST',
      body: { channel_id: event.payload?.channel, thread_ts: event.payload?.thread_ts, status },
    })
    .catch(() => {});
}

async function openDm(session, userId: string): Promise<string> {
  const res = await session.proxyExecute({
    toolkit: 'slackbot',
    endpoint: 'https://slack.com/api/conversations.open',
    method: 'POST',
    body: { users: userId },
  });
  return res.data?.channel?.id;
}

function toolsForSession(session) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    execute: (slug, args, options) => session.execute(slug, args, options),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
  });
}

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  await setStatus(session, event, 'Working on it…');

  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');
  const reply = await runPi(toolsForSession(session), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
    text: reply,
  });
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}
```

## Redirect auth links

The payoff. When the agent reaches for an app the user hasn't connected, the tool result carries a one-time Composio connect URL. You never want it in the channel or in the model's context. The bot extracts it, **redacts** it from the tool output, DMs it to the user privately, and the run resumes the moment they approve, because the session was created with `waitForConnections`.

**`bot.ts` — step 5: Redirect auth links**

```typescript
import { Composio } from '@composio/core';
import type { IncomingTriggerPayload } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One Slack connection, shared by the whole workspace. The bot posts as this
// identity while acting in every other app as the individual user.
const SHARED_SLACK_CONNECTION_ID = process.env.SLACK_CONNECTION_ID;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
  `${event.payload?.channel}:${event.payload?.thread_ts ?? event.payload?.ts}`;

async function sessionForThread(event: IncomingTriggerPayload) {
  const key = threadKey(event);
  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    // Pin the shared Slack connection; the session still resolves every other
    // toolkit against this user's own connections.
    connectedAccounts: { slackbot: [SHARED_SLACK_CONNECTION_ID] },
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
  return { session, memory };
}

// Anything the toolkit doesn't wrap as a tool, reach via the proxy: it calls the
// Slack Web API with the pinned connection's auth, so you never touch a token.
async function setStatus(session, event: IncomingTriggerPayload, status: string) {
  await session
    .proxyExecute({
      toolkit: 'slackbot',
      endpoint: 'https://slack.com/api/assistant.threads.setStatus',
      method: 'POST',
      body: { channel_id: event.payload?.channel, thread_ts: event.payload?.thread_ts, status },
    })
    .catch(() => {});
}

async function openDm(session, userId: string): Promise<string> {
  const res = await session.proxyExecute({
    toolkit: 'slackbot',
    endpoint: 'https://slack.com/api/conversations.open',
    method: 'POST',
    body: { users: userId },
  });
  return res.data?.channel?.id;
}

// Redirect auth links. When a tool hits an app the user hasn't connected, the
// result carries a one-time Composio connect URL. Never let the model or the
// channel see it: redact it from the tool output and DM the user privately. The
// session's manageConnections + waitForConnections resumes the run on approval.
const CONNECT_LINK = /https:\/\/(?:connect\.composio\.dev|[^\s"']*composio[^\s"']*\/link)\/[^\s"')]+/gi;

function redactLinks(value: T): T {
  if (typeof value === 'string') return value.replace(CONNECT_LINK, '[connection link sent via DM]') as T;
  if (Array.isArray(value)) return value.map(redactLinks) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redactLinks(v)])) as T;
  }
  return value;
}

async function handleAuthLinks(session, event: IncomingTriggerPayload, value: T): Promise {
  const links = [...new Set([...JSON.stringify(value ?? '').matchAll(CONNECT_LINK)].map((m) => m[0]))];
  if (links.length > 0) {
    const dm = await openDm(session, event.userId);
    for (const url of links) {
      await session.execute('SLACKBOT_SEND_MESSAGE', {
        channel: dm,
        text: `*Connection needed.* Approve access and I'll continue automatically:\n<${url}|Connect>`,
      });
    }
  }
  return redactLinks(value); // hand the model a result with the raw URL stripped
}

function toolsForSession(session, event: IncomingTriggerPayload) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    // Every tool result passes through handleAuthLinks: connect URLs get DM'd to
    // the user and redacted before the model ever sees them.
    execute: async (slug, args, options) => handleAuthLinks(session, event, await session.execute(slug, args, options)),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        await handleAuthLinks(session, event, request.redirectUrl);
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
  });
}

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  await setStatus(session, event, 'Working on it…');

  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');
  const reply = await runPi(toolsForSession(session, event), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
    text: reply,
  });
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}
```

## Serve the webhook

Verify each trigger's signature with `composio.triggers.verifyWebhook`, then hand the payload to `handleSlackMessage` off the response path so a slow handler doesn't get retried. That's the whole server.

**`bot.ts` — step 6: Serve the webhook**

```typescript
import { Composio } from '@composio/core';
import type { IncomingTriggerPayload } from '@composio/core';
import { PiProvider } from '@composio/experimental';
import { createAgentSession, SessionManager } from '@earendil-works/pi-coding-agent';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const piProvider = new PiProvider();
const callbackUrl = `${process.env.APP_URL}/connections/callback`;

// One Slack connection, shared by the whole workspace. The bot posts as this
// identity while acting in every other app as the individual user.
const SHARED_SLACK_CONNECTION_ID = process.env.SLACK_CONNECTION_ID;

// One session per Slack thread, reused so the agent keeps context, with a short
// transcript for memory across turns.
const threads = new Map<string, { sessionId: string; history: { role: string; content: string }[] }>();
const threadKey = (event: IncomingTriggerPayload) =>
  `${event.payload?.channel}:${event.payload?.thread_ts ?? event.payload?.ts}`;

async function sessionForThread(event: IncomingTriggerPayload) {
  const key = threadKey(event);
  const existing = threads.get(key);
  if (existing) return { session: await composio.use(existing.sessionId), memory: existing };

  const session = await composio.create(event.userId, {
    // Pin the shared Slack connection; the session still resolves every other
    // toolkit against this user's own connections.
    connectedAccounts: { slackbot: [SHARED_SLACK_CONNECTION_ID] },
    manageConnections: { enable: true, callbackUrl, waitForConnections: true },
  });
  const memory = { sessionId: session.sessionId, history: [] as { role: string; content: string }[] };
  threads.set(key, memory);
  return { session, memory };
}

// Anything the toolkit doesn't wrap as a tool, reach via the proxy: it calls the
// Slack Web API with the pinned connection's auth, so you never touch a token.
async function setStatus(session, event: IncomingTriggerPayload, status: string) {
  await session
    .proxyExecute({
      toolkit: 'slackbot',
      endpoint: 'https://slack.com/api/assistant.threads.setStatus',
      method: 'POST',
      body: { channel_id: event.payload?.channel, thread_ts: event.payload?.thread_ts, status },
    })
    .catch(() => {});
}

async function openDm(session, userId: string): Promise<string> {
  const res = await session.proxyExecute({
    toolkit: 'slackbot',
    endpoint: 'https://slack.com/api/conversations.open',
    method: 'POST',
    body: { users: userId },
  });
  return res.data?.channel?.id;
}

// Redirect auth links. When a tool hits an app the user hasn't connected, the
// result carries a one-time Composio connect URL. Never let the model or the
// channel see it: redact it from the tool output and DM the user privately. The
// session's manageConnections + waitForConnections resumes the run on approval.
const CONNECT_LINK = /https:\/\/(?:connect\.composio\.dev|[^\s"']*composio[^\s"']*\/link)\/[^\s"')]+/gi;

function redactLinks(value: T): T {
  if (typeof value === 'string') return value.replace(CONNECT_LINK, '[connection link sent via DM]') as T;
  if (Array.isArray(value)) return value.map(redactLinks) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redactLinks(v)])) as T;
  }
  return value;
}

async function handleAuthLinks(session, event: IncomingTriggerPayload, value: T): Promise {
  const links = [...new Set([...JSON.stringify(value ?? '').matchAll(CONNECT_LINK)].map((m) => m[0]))];
  if (links.length > 0) {
    const dm = await openDm(session, event.userId);
    for (const url of links) {
      await session.execute('SLACKBOT_SEND_MESSAGE', {
        channel: dm,
        text: `*Connection needed.* Approve access and I'll continue automatically:\n<${url}|Connect>`,
      });
    }
  }
  return redactLinks(value); // hand the model a result with the raw URL stripped
}

function toolsForSession(session, event: IncomingTriggerPayload) {
  return piProvider.createSessionTools({
    sessionId: session.sessionId,
    callbackUrl,
    search: (params) => session.search(params),
    // Every tool result passes through handleAuthLinks: connect URLs get DM'd to
    // the user and redacted before the model ever sees them.
    execute: async (slug, args, options) => handleAuthLinks(session, event, await session.execute(slug, args, options)),
    connections: {
      getToolkitStates: (toolkits) => session.toolkits({ toolkits }),
      authorizeToolkit: async (toolkit) => {
        const request = await session.authorize(toolkit, { callbackUrl });
        await handleAuthLinks(session, event, request.redirectUrl);
        return { status: 'needs_connection', redirectUrl: request.redirectUrl };
      },
      isConnected: (state) => state.connection?.isActive ?? false,
    },
  });
}

// Run the Pi agent over a session's tools and return its final text.
async function runPi(tools: unknown, prompt: string) {
  const { session: pi } = await createAgentSession({
    sessionManager: SessionManager.inMemory(process.cwd()),
    customTools: tools,
    tools: ['composio_search_tools', 'composio_manage_connections', 'composio_execute_tool'],
  });
  let reply = '';
  pi.subscribe((e) => {
    if (e.type === 'message_update' && e.assistantMessageEvent.type === 'text_delta') {
      reply += e.assistantMessageEvent.delta;
    }
  });
  await pi.prompt(prompt);
  pi.dispose();
  return reply;
}

// Reply to one Slack message as the user who sent it.
async function handleSlackMessage(event: IncomingTriggerPayload) {
  const { session, memory } = await sessionForThread(event);
  await setStatus(session, event, 'Working on it…');

  const prompt = [...memory.history.map((m) => `${m.role}: ${m.content}`), `user: ${event.payload?.text}`].join('\n');
  const reply = await runPi(toolsForSession(session, event), prompt);

  await session.execute('SLACKBOT_SEND_MESSAGE', {
    channel: event.payload?.channel,
    thread_ts: event.payload?.thread_ts,
    text: reply,
  });
  memory.history.push({ role: 'user', content: event.payload?.text ?? '' }, { role: 'assistant', content: reply });
}

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'POST' && url.pathname === '/webhooks/composio') {
      const { payload } = await composio.triggers.verifyWebhook({
        payload: await req.text(),
        secret: process.env.COMPOSIO_WEBHOOK_SECRET,
        id: req.headers.get('webhook-id'),
        timestamp: req.headers.get('webhook-timestamp'),
        signature: req.headers.get('webhook-signature'),
      });
      void handleSlackMessage(payload);
      return Response.json({ ok: true });
    }
    return new Response('Not found', { status: 404 });
  },
});
```

# The whole project

The two files above are the spine. The real project rounds them out with grouped auth-link DMs, per-user routing, message chunking, reaction acks, and durable storage. Here's a slice of the actual source, with the Composio touch-points highlighted. Browse the tree, read the files:

> The complete project is on GitHub: [composio-slack-bot](https://github.com/ComposioHQ/composio-slack-bot).

The complete project lives on GitHub: [composio-slack-bot](https://github.com/ComposioHQ/composio-slack-bot).

# Run it

Run `bun install.ts` once to set up the bot, start the server with `bun bot.ts`, then `@mention` the bot in any channel. It opens a session as you, finds the tool it needs, runs it against your connections, and replies in thread as the workspace bot, usually within a few seconds. Ask it to do something in an app you haven't connected yet and it DMs you a link first, then continues once you approve.

- [Configuring sessions](/docs/configuring-sessions): Everything a session can scope: toolkits, tools, connections, and limits

- [Shared connections](/docs/shared-connections): SHARED vs PRIVATE accounts and the per-user ACL

---

# iMessage custom toolkit with eve (/examples/imessage-agent)

Most Composio toolkits call a remote API. Some capabilities only exist on one machine, and iMessage is the classic case: there's no iMessage cloud API, so the agent has to run on your Mac and drive Messages.app directly.

This example builds exactly that: a terminal agent that **texts on your behalf from your own Mac** and reaches the rest of your apps (Gmail, Calendar, GitHub, Slack) through the Composio catalog in the same breath.

```
you  ›  read my last email and text Shams a summary
you  ›  text mom i'm running 10 min late
you  ›  what did Lena and I last text about?
```

The pattern is the takeaway, not iMessage specifically. It comes together from a handful of Composio pieces:

1. **A custom toolkit** wraps local iMessage (send, contacts, history, memory) as Composio tools.
2. **In-process execution** runs each tool right on your Mac through `session.execute`, with no remote API.
3. **One session** puts those local tools on the same surface as the 1000+ app catalog.
4. **The eve provider** turns `session.tools()` into [eve](https://github.com/vercel/eve)-native tools, so `eve dev` can call them.
5. **Triggers** let an outside event wake the agent and reach your phone, with in-chat auth through `COMPOSIO_MANAGE_CONNECTIONS` for any app you haven't connected.

Below you build the integration core: the custom toolkit first, then the wiring that puts it on a session, then triggers, then a browse of the relevant source. You bring a Composio API key and a Mac. Composio brings the catalog.

# Setup

You need a [Composio API key](https://dashboard.composio.dev) and macOS (the iMessage tools drive Messages.app, Contacts.app, and the local `chat.db`).

**Install**

```bash
npm install @composio/core @composio/experimental eve
```

**Configure**

```txt title=".env.local"
COMPOSIO_API_KEY=xxxxxxxxx
```
**Grant macOS permissions** (prompted on first use): Automation for Messages, Contacts access, and Full Disk Access to read `chat.db`.

# The custom toolkit

A custom toolkit is a named group of custom tools. Each tool declares an input schema and an `execute` that runs locally. Here is `SEND`, which shells out to AppleScript to drive Messages.app:

**`imessage/send-message.ts` — complete file**

```typescript
import { experimental_createTool } from '@composio/core';
import { z } from 'zod/v3';
import { runAppleScript, SEND_SCRIPT } from './applescript';

export const sendMessage = experimental_createTool('SEND', {
  name: 'Send iMessage',
  description: 'Send an iMessage from your Mac to a phone number or iMessage email.',
  preload: true,
  inputParams: z.object({
    to: z.string().describe('Phone number or iMessage email.'),
    text: z.string().describe('Message body to send.'),
  }),
  execute: async ({ to, text }) => {
    await runAppleScript(SEND_SCRIPT, [to, text]);
    return { sent: true, to };
  },
});
```
Group your tools into a toolkit. The full project also ships `FIND_CONTACT` (fuzzy contact lookup over Contacts.app), `READ_MESSAGES` (recent messages from `chat.db`), and `RECALL`/`REMEMBER` (per-contact memory), each built the same way:

```ts title="imessage/index.ts"
// @noErrors
import { experimental_createToolkit } from '@composio/core';
import { sendMessage } from './send-message';
import { findContact } from './find-contact';
import { readMessages } from './read-messages';
import { recallContact, rememberContact } from './memory-tools';

export function createImessageToolkit() {
  return experimental_createToolkit('IMESSAGE', {
    name: 'iMessage',
    description:
      "Send and read iMessages, look up contacts, and remember people, locally on the user's Mac.",
    tools: [sendMessage, findContact, readMessages, recallContact, rememberContact],
  });
}
```
The toolkit depends only on `@composio/core`, so it drops into any Composio agent. Custom tools execute in-process through `session.execute`, which is why they aren't on the MCP URL yet.

# Wire it up

Set the [eve provider](/docs/providers/eve) on the client and register the toolkit on the session. `composio.ts` grows in three steps, one Composio concept each:

## Create the client with the eve provider

The provider is what makes `session.tools()` return eve-native tools instead of raw Composio tools. Its approval policy pauses every iMessage send before the local AppleScript runs.

**`composio.ts` — step 1: Client with the eve provider**

```typescript
import { Composio } from '@composio/core';
import { EveProvider, requireApprovalForTools } from '@composio/experimental/eve';

export const composio = new Composio({
  provider: new EveProvider({
    needsApproval: requireApprovalForTools('LOCAL_IMESSAGE_SEND'),
  }),
});
```
## Scope a session to the user

`sessions.create` gives this user their own toolset, already wired to the full Composio catalog.

**`composio.ts` — step 2: A session for the user**

```typescript
import { Composio } from '@composio/core';
import { EveProvider, requireApprovalForTools } from '@composio/experimental/eve';

export const composio = new Composio({
  provider: new EveProvider({
    needsApproval: requireApprovalForTools('LOCAL_IMESSAGE_SEND'),
  }),
});

export const session = composio.sessions.create('user_123');
```
## Register the local toolkit

Pass the custom toolkit through `experimental.customToolkits`, and the local iMessage tools join the catalog on the same session.

**`composio.ts` — step 3: Register the local toolkit**

```typescript
import { Composio } from '@composio/core';
import { EveProvider, requireApprovalForTools } from '@composio/experimental/eve';
import { createImessageToolkit } from './imessage';

export const composio = new Composio({
  provider: new EveProvider({
    needsApproval: requireApprovalForTools('LOCAL_IMESSAGE_SEND'),
  }),
});

export const session = composio.sessions.create('user_123', {
  experimental: { customToolkits: [createImessageToolkit()] },
});
```
Now hand that session to eve. eve discovers tools from files, so `defineComposioTools(session)` returns the resolver that exposes `session.tools()`. One line:

```ts title="agent/tools/composio.ts"
// @noErrors
import { defineComposioTools } from '@composio/experimental/eve';
import { session } from '../../composio';

export default defineComposioTools(session);
```
```ts title="agent/agent.ts"
// @noErrors
import { defineAgent } from 'eve';

export default defineAgent({
  model: 'google/gemini-2.5-flash',
});
```
That's the whole integration. Run `eve dev` and talk to it. The agent can text a contact, read a thread, and act across every connected app, with auth handled in chat through `COMPOSIO_MANAGE_CONNECTIONS`.

# Extend it: triggers

The agent can text, so anything that can wake the agent can reach your phone. Composio **triggers** turn an external event into an agent run: subscribe to an app event, point Composio's webhook at your app, and act on each event with the same iMessage tools.

For example, surface a Linear assignment and ask the user whether to inspect it. The first turn contains no issue title or body, so third-party text does not cross into the agent prompt before the user opts in:

```ts title="agent/channels/triggers.ts"
// @noErrors
import { defineChannel, POST } from 'eve/channels';
import { composio } from '../../composio';

export default defineChannel({
  routes: [
    POST('/webhook', async (req, { send }) => {
      const { payload: event } = await composio.triggers.parse(req, {
        verifySecret: process.env.COMPOSIO_WEBHOOK_SECRET,
      });
      if (event.userId !== 'user_123' || event.triggerSlug !== 'LINEAR_ISSUE_ASSIGNED') {
        return new Response(null, { status: 202 });
      }
      await send(
        `A verified Linear assignment event arrived. Ask whether I want to inspect it. ` +
          `Do not call tools in this turn. Event reference: ${event.uuid}.`,
        {
          auth: {
            authenticator: 'composio-webhook',
            principalType: 'service',
            principalId: event.userId,
            attributes: { triggerSlug: event.triggerSlug },
          },
          continuationToken: event.uuid,
        }
      );
      return new Response(null, { status: 202 });
    }),
  ],
});
```
Point Composio at your webhook and create the trigger, once each. Reuse the same `composio` client from `composio.ts`:

```ts title="agent/setup-triggers.ts"
// @noErrors
import { composio } from '../composio';

// Register the webhook URL once per project; store the returned
// secret as COMPOSIO_WEBHOOK_SECRET.
const subscription = await composio.triggers.setWebhookSubscription({
  webhookUrl: `${process.env.APP_URL}/webhook`,
});

// Use the exact slug from the Composio triggers catalog.
const trigger = await composio.triggers.create('user_123', 'LINEAR_ISSUE_ASSIGNED');
console.log(`Trigger created: ${trigger.triggerId}`);
```
Run it once with `npx tsx agent/setup-triggers.ts`, and the webhook handler above takes over from there.

Swap the trigger and the prompt to create another reflex. Keep the first turn content-free, then fetch third-party content only after the user asks to continue.

# More reflexes

The prompt is where each reflex earns its keep, but the webhook should not turn untrusted content into instructions. Here is the same two-step gate for Gmail:

```ts title="agent/channels/triggers.ts"
// @noErrors
import { defineChannel, POST } from 'eve/channels';
import { composio } from '../../composio';

export default defineChannel({
  routes: [
    POST('/webhook', async (req, { send }) => {
      const { payload: event } = await composio.triggers.parse(req, {
        verifySecret: process.env.COMPOSIO_WEBHOOK_SECRET,
      });
      if (event.userId !== 'user_123' || event.triggerSlug !== 'GMAIL_NEW_GMAIL_MESSAGE') {
        return new Response(null, { status: 202 });
      }
      await send(
        `A verified Gmail event arrived. Ask whether I want to inspect the email. ` +
          `Do not call tools in this turn. Event reference: ${event.uuid}.`,
        {
          auth: {
            authenticator: 'composio-webhook',
            principalType: 'service',
            principalId: event.userId,
            attributes: { triggerSlug: event.triggerSlug },
          },
          continuationToken: event.uuid,
        }
      );
      return new Response(null, { status: 202 });
    }),
  ],
});
```

If the user continues, the agent can fetch the email in a separate turn and require approval before any side effect. A few more patterns worth wiring up with the same gate:

* **Stand-up nudge.** A calendar event ten minutes out texts you the agenda and the meeting link, pulled straight from the invite.
* **Review request.** A new GitHub review request texts you the PR title and a one-line read of the diff, so you can reply "approve" from your phone.
* **Money in.** A successful Stripe payment texts you the amount and the customer, no dashboard required.
* **Cover for me.** A Slack mention while you're away texts a teammate and asks them to take a look.

Use the exact slug from the Composio triggers catalog for each. Signature verification proves the event came through Composio; it does not make an email subject, issue title, or other third-party text trustworthy. Reject unexpected users and trigger slugs, keep external content out of the initial prompt, and require approval before side effects such as sending a message.

# Browse the project

The key files, in one place. The custom toolkit and the session wiring carry the integration, the eve provider is imported from `@composio/experimental/eve`, and the rest is local macOS glue.

> The iMessage code browser is an implementation slice, not a standalone fixture. The complete runnable project will be published in the Composio examples repo.

The complete, runnable project will be published in the Composio examples repo.

# Run it

The browser above is an implementation slice, not a standalone fixture: it omits the project's package manifest and supporting `handles`, `chat-db`, and `memory` modules. The complete runnable project will be published in the Composio examples repo. Until then, use the provider walkthrough on this page in an existing eve app and treat the iMessage source as a reference for the local toolkit. The first send or contact lookup prompts for macOS permission, and the first time the agent needs an app you haven't connected, it returns an auth link in chat through `COMPOSIO_MANAGE_CONNECTIONS`.

- [eve provider](/docs/providers/eve): EveProvider, the defineComposioTools resolver, and the (ctx, next) hooks.

- [Custom tools and toolkits](/docs/extending-sessions/custom-tools-and-toolkits): Build and register your own in-process Composio tools.

---

# Examples (/examples)

End-to-end builds that wire Composio into working agents. Each one is a complete project you can read top to bottom and run.

- [General agent with Pi](/examples/general-agent-with-pi): Build a Pi + Composio agent and drop it into Slack: triggers, per-user sessions, a shared connection, redirected auth links, and the proxy.

- [Daily standup bot](/examples/standup-slackbot): A Slack bot that drafts each teammate's standup from their own connected tools: your own Slack app, tool-router sessions, manual tool execution, the proxy, and per-member auth links.

- [Local sandbox PR reviewer](/examples/local-sandbox-pr-reviewer): Run a PR reviewer in your own sandbox while it calls GitHub tools through a Composio session.

- [iMessage custom toolkit with eve](/examples/imessage-agent): An agent that texts on your behalf from your own Mac: a custom toolkit wraps local iMessage in-process, and the eve provider puts it on the same session as the whole Composio catalog.

---

# Review pull requests in a sandbox you own (/examples/local-sandbox-pr-reviewer)

Composio usually runs your tools for you. A **local sandbox** is for the times you need to run them yourself: your filesystem, your shell, your security boundary. You still get [managed auth](/docs/authentication) and 1000+ apps; you just keep the code execution.

This example builds a GitHub PR reviewer that does exactly that: it clones a pull request into a sandbox *you* own, runs the repo's real checks there, and posts one grounded comment. The sandbox here is E2B, but E2B is just the sample. The same pattern works with your own VM, container, Kubernetes job, or internal sandbox service.

It comes down to a handful of Composio pieces:

1. **A local sandbox session** is a [Composio session](/docs/how-composio-works) with [code execution turned off](/docs/configuring-sessions#disabling-the-sandbox). Composio still does [discovery](/docs/how-composio-works#meta-tools) and auth; it just won't run code for you.
2. **The helper contract** is what comes back: a Python helper exposing the same [`run_composio_tool`, `invoke_llm`, and `web_search`](/docs/sandbox/remote) tools Composio's managed sandbox runs for you, plus the `env` it needs. You inject it into your sandbox and the agent calls it.
3. **Your sandbox is the boundary.** Tool *execution* happens in a box you control. E2B is the replaceable sample runner; the contract it honors is the real interface.

> **The sandbox holds your project API key**: The `env` that `experimental_createLocalWorkbenchSession` returns includes your **project** `COMPOSIO_API_KEY`, and you inject that `env` into the sandbox. Anything running there can read it, including the untrusted PR code you clone and build. Treat the sandbox as your trust boundary: run it on infrastructure you control, give the reviewer a key scoped to only what it needs, and rotate the key if a run could have leaked it.

Below you build the host orchestration from scratch: a bare client first, then a piece at a time up to the full run loop, then a browse of the real source. You bring a Composio API key and a place to run code. Composio brings the tools.

# Setup

You need a [Composio API key](https://dashboard.composio.dev), an OpenAI API key for the reviewer agent, a GitHub connection for your `COMPOSIO_USER_ID`, and [Bun](https://bun.sh).

**No sandbox provider? Use the E2B sample runner**

The host writes the Composio helper into a sandbox and runs the agent there, so it needs *somewhere* to run code. This example ships an [E2B](https://e2b.dev) runner in `src/sandbox/e2b.ts` so you can run it today with just an `E2B_API_KEY`. E2B is a hosted sandbox provider: that key provisions an isolated microVM to run the agent in, so you don't have to stand up a VM or container yourself. It's still real infrastructure, just E2B's to manage rather than yours.

E2B is deliberately isolated to that one file. To run on your own VM, container, or CI worker, replace `createE2bSandbox` with anything that honors the same contract: create a directory, write `helperSource` into it, pass `env` to the process, stream stdout and stderr back, and tear down on your schedule.

```bash
bun add @composio/core @composio/experimental e2b @openai/agents
```

Connect GitHub once for the user id you'll review as, then keep that same id for the review run:

```bash
bun run connect
```

# Build the host

`src/runner.ts` is the host: it owns orchestration, never tool execution. It starts as a bare Composio client and grows into the full run loop, one concept at a time. Each diff below is exactly what that concept adds.

## Create the Composio client

The whole thing acts as one stable user, against the connections they own. Start there.

**`src/runner.ts` — step 1: Create the Composio client**

```typescript
import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';
import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';
```

## Check the GitHub connection

A local sandbox still leans on Composio for auth and [tool discovery](/docs/how-composio-works#meta-tools); only code execution moves to your side. So before booting any infrastructure, confirm this user actually has [GitHub connected](/docs/authentication), and hand them a connect link if not.

**`src/runner.ts` — step 2: Check the GitHub connection**

```typescript
import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';
import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';

// Composio runs tools as a user. Before anything else, make sure this user has
// an active GitHub connection. There's no point booting a sandbox without one.
async function requireGithubConnection() {
  const list = await composio.connectedAccounts.list({
    userIds: [userId],
    toolkitSlugs: ['github'],
    statuses: ['ACTIVE'],
  });
  if (list.items?.[0]) return;

  const request = await composio.toolkits.authorize(userId, 'github');
  throw new Error(`Connect GitHub first: ${request.redirectUrl}`);
}
```

## Create the local sandbox session

The core of the integration. You create a [Composio session](/docs/configuring-sessions#creating-a-session) yourself with code execution off (`workbench.enable: false`, so Composio will not run code for you), then hand that session to `experimental_createLocalWorkbenchSession`. The helper validates the session is local (it errors if the session has the remote workbench enabled, because the managed workbench and a local sandbox can't both run for one session) and returns the pieces you run yourself: a `helperSource` (a Python helper with `run_composio_tool`, `invoke_llm`, and `web_search`) and the `env` that helper needs to reach Composio from inside your box.

**`src/runner.ts` — step 3: Create the local sandbox session**

```typescript
import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';
import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';

// Composio runs tools as a user. Before anything else, make sure this user has
// an active GitHub connection. There's no point booting a sandbox without one.
async function requireGithubConnection() {
  const list = await composio.connectedAccounts.list({
    userIds: [userId],
    toolkitSlugs: ['github'],
    statuses: ['ACTIVE'],
  });
  if (list.items?.[0]) return;

  const request = await composio.toolkits.authorize(userId, 'github');
  throw new Error(`Connect GitHub first: ${request.redirectUrl}`);
}

// The local sandbox session. Create a normal Composio session yourself with
// `workbench.enable: false` (Composio won't run code for you), then hand that
// session to the helper, which validates it's local and gives you the pieces to
// run code yourself, wherever you choose.
async function createWorkbench() {
  const session = await composio.create(userId, {
    toolkits: ['github'],
    workbench: { enable: false },
  });
  return experimental_createLocalWorkbenchSession(composio, session);
  // returns { helperSource, env }:
  //   helperSource: a Python helper exposing run_composio_tool / invoke_llm / web_search
  //   env:          the variables that helper needs to reach Composio from inside your box
}
```

## Start your sandbox, inject the helper

Boot a box you control, write `helperSource` into it as `composio_helper.py`, and pass `env` to the process. That helper is the *only* Composio-specific thing your sandbox has to carry. E2B is the sample runner; swap it for anything that honors the same contract.

**`src/runner.ts` — step 4: Start your sandbox, inject the helper**

```typescript
import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';
import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';

// Composio runs tools as a user. Before anything else, make sure this user has
// an active GitHub connection. There's no point booting a sandbox without one.
async function requireGithubConnection() {
  const list = await composio.connectedAccounts.list({
    userIds: [userId],
    toolkitSlugs: ['github'],
    statuses: ['ACTIVE'],
  });
  if (list.items?.[0]) return;

  const request = await composio.toolkits.authorize(userId, 'github');
  throw new Error(`Connect GitHub first: ${request.redirectUrl}`);
}

// The local sandbox session. Create a normal Composio session yourself with
// `workbench.enable: false` (Composio won't run code for you), then hand that
// session to the helper, which validates it's local and gives you the pieces to
// run code yourself, wherever you choose.
async function createWorkbench() {
  const session = await composio.create(userId, {
    toolkits: ['github'],
    workbench: { enable: false },
  });
  return experimental_createLocalWorkbenchSession(composio, session);
  // returns { helperSource, env }:
  //   helperSource: a Python helper exposing run_composio_tool / invoke_llm / web_search
  //   env:          the variables that helper needs to reach Composio from inside your box
}

export async function runReview(repo: string, pr: number) {
  await requireGithubConnection();
  const workbench = await createWorkbench();

  // Start a sandbox you own, inject the helper, and pass the env. E2B is just
  // the sample runner; swap createE2bSandbox for any box that honors the same
  // contract: write a file, set env, run a command, stream output, tear down.
  const sandbox = await createE2bSandbox({
    apiKey: process.env.E2B_API_KEY,
    helperSource: workbench.helperSource, // written as composio_helper.py
    env: workbench.env,
  });
}
```

## Run the reviewer and stream output

Run the agent inside the sandbox and stream its output back. Whenever the agent calls `run_composio_tool`, the helper routes that GitHub action back through Composio under this user's connection. Tool *execution* happens in your box; discovery and auth stay managed.

**`src/runner.ts` — step 5: Run the reviewer and stream output**

```typescript
import { Composio } from '@composio/core';
import { experimental_createLocalWorkbenchSession } from '@composio/experimental/workbench';
import { createE2bSandbox } from './sandbox/e2b';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const userId = process.env.COMPOSIO_USER_ID ?? 'local-pr-reviewer-user';

// Composio runs tools as a user. Before anything else, make sure this user has
// an active GitHub connection. There's no point booting a sandbox without one.
async function requireGithubConnection() {
  const list = await composio.connectedAccounts.list({
    userIds: [userId],
    toolkitSlugs: ['github'],
    statuses: ['ACTIVE'],
  });
  if (list.items?.[0]) return;

  const request = await composio.toolkits.authorize(userId, 'github');
  throw new Error(`Connect GitHub first: ${request.redirectUrl}`);
}

// The local sandbox session. Create a normal Composio session yourself with
// `workbench.enable: false` (Composio won't run code for you), then hand that
// session to the helper, which validates it's local and gives you the pieces to
// run code yourself, wherever you choose.
async function createWorkbench() {
  const session = await composio.create(userId, {
    toolkits: ['github'],
    workbench: { enable: false },
  });
  return experimental_createLocalWorkbenchSession(composio, session);
  // returns { helperSource, env }:
  //   helperSource: a Python helper exposing run_composio_tool / invoke_llm / web_search
  //   env:          the variables that helper needs to reach Composio from inside your box
}

export async function runReview(repo: string, pr: number) {
  await requireGithubConnection();
  const workbench = await createWorkbench();

  // Start a sandbox you own, inject the helper, and pass the env. E2B is just
  // the sample runner; swap createE2bSandbox for any box that honors the same
  // contract: write a file, set env, run a command, stream output, tear down.
  const sandbox = await createE2bSandbox({
    apiKey: process.env.E2B_API_KEY,
    helperSource: workbench.helperSource, // written as composio_helper.py
    env: workbench.env,
  });

  // Run the reviewer agent inside the sandbox and stream its output back. The
  // agent calls run_composio_tool from composio_helper.py, which routes GitHub
  // actions back through Composio under this user's connection.
  const task = `Review PR #${pr} on ${repo}. Run the repo's real checks in this sandbox.`;
  try {
    await sandbox.run('npx --yes tsx agent.ts', {
      env: { ...workbench.env, TASK: task, OPENAI_API_KEY: process.env.OPENAI_API_KEY },
      onStdout: (chunk) => process.stdout.write(chunk),
      onStderr: (chunk) => process.stderr.write(chunk),
    });
  } finally {
    await sandbox.teardown();
  }
}
```

# The whole project

The file above is the spine. The real project rounds it out with a CLI, a smoke/dry-run path, the E2B runner behind the sandbox contract, the reviewer agent and its review policy, and the `composio_helper.py` the helper source compiles to. Here's a slice of the actual source, with the Composio touch-points highlighted. Browse the tree, read the files:

> The complete project is on GitHub: [composio-slack-bot](https://github.com/ComposioHQ/composio-slack-bot).

The complete project lives on GitHub: [local-pr-reviewer](https://github.com/ComposioHQ/local-pr-reviewer).

# Run it

Dry-run first to validate your input with no credentials, network calls, or sandbox startup, then run it for real:

```bash
bun run review -- --repo ComposioHQ/composio --pr 123 --dry-run
bun run review -- --repo ComposioHQ/composio --pr 123
```

The host opens a local sandbox session, boots the sandbox, and runs the repo's real checks inside it, then posts one grounded comment, or nothing if it can't build the PR.

---

# Daily standup bot (/examples/standup-slackbot)

Standup is a crucial part of running an effective engineering team, and also oh so tedious: every morning, everyone digs back through what they did and writes it up. It's worse for teams spread across timezones, where there's no shared standup to anchor the day, so it's easy to just forget.

But the work you did *is* there: the PRs in  GitHub, the docs in  Notion, the decisions in  Slack threads. If it's all recorded somewhere, an agent should be able to at least draft it. [Composio sessions](/docs/configuring-sessions) make this *incredibly easy for agents*: a session hands the agent everything it needs, [search](/docs/how-composio-works#meta-tools) to find the right tool, [parallel execute](/docs/how-composio-works#meta-tools) to run many at once, a [sandbox](/docs/sandbox/remote) and [volumes](/docs/sandbox/remote#files-and-mounts). It uses Composio to extract, parse, and cross-reference data across all those sources and write clean summaries of the real work your team shipped. All you have to do is create a session for your teammate and let it cook.

![The daily standup reminder in Slack](/images/standup-slackbot/slack-reminder.png)
*The daily reminder, with Draft and Connect more tools buttons*

![A generated standup draft in Slack](/images/standup-slackbot/slack-draft.png)
*The draft the agent writes, delivered to a teammate in Slack*

So we built a Slack bot that does exactly that. Once a day, at a set time in each teammate's own timezone, it reminds them to post in the daily standup thread in a central channel. With one button click, they can run a subagent that uses their Composio connections to generate a clean, consolidated draft to review and post. We'll build it step by step.

> **Is this the right example for you?**: This is a deliberately advanced, opinionated build. It's a strong reference for five things:

  * **Background-agent sessions**: the draft agent runs on a schedule, not in a conversation. It works from the tools a member already connected and never pauses to ask for auth.
  * **Manual execution for deterministic workflows**: outside the draft, the bot doesn't let an agent decide. It runs a fixed flow, calling tools directly with [manual execution](/docs/tools-direct/executing-tools), so a button always triggers the same exact steps.
  * **Manual, pre-connected auth**: members connect their tools ahead of time using [manual connections](/docs/manually-authenticating), and the agent just uses whatever is there.
  * **White-labelling** (advanced): your own Slack app and bot identity, via [white-labelling](/docs/white-labeling-authentication). This is *not* the easy path. We'd recommend Composio's managed apps, which require no additional configuration. Only do this if you specifically want your own branding.
  * **The proxy** (advanced): using [`proxyExecute`](/docs/extending-sessions/proxy-execute) to call Slack API endpoints Composio doesn't wrap as tools.

It is **not** an example of [in-chat or dynamic auth](/docs/authentication) (asking a user to connect a tool mid-run), and it's more setup than many bots need. If you'd rather have a Slack bot with zero setup (Composio's managed app) or in-chat auth, start with the [general Slack bot](/examples/general-agent-with-pi) instead.

The Slack bot itself follows a deterministic flow: the same menu every day. When a member taps a button, it launches a subagent with a Composio session to produce the draft. Here's the shape of it:

# Setup

You need a [Composio API key](https://dashboard.composio.dev/~/project/settings/api-keys), a Slack workspace you can install an app into, and Node with [tsx](https://nodejs.org). The finished bot deploys to [Vercel](https://vercel.com) as two serverless functions, a cron and an interactivity handler, so there's no long-running server.

# Make your custom Slack bot

This bot doesn't post as "Composio". It posts as *my* app, with its own name, icon, and (frankly ridiculous) face:

![The Daily Standup Bot avatar](/images/standup-slackbot/bot-avatar.png)
*Create the app from scratch and name it*

**Add the Bot Token Scopes.** Under **OAuth & Permissions**, add: `chat:write`, `im:write`, `channels:history`, `channels:read`, `users:read`, `users:read.email`, `team:read`. Then turn on **Interactivity** and point its Request URL at your deployment's `/api/interactivity`.

![Adding bot token scopes under OAuth & Permissions](/images/standup-slackbot/bot-scopes.png)
*Add the bot token scopes*

**Grab the app credentials.** On **Basic Information**, copy the **Client ID** and **Client Secret**. Composio drives the OAuth as your app with these.

![The app's Client ID and Secret under Basic Information](/images/standup-slackbot/app-credentials.png)
*Copy the Client ID and Secret*

# Auth the bot

The Slack app exists; now connect it through Composio so your code can act as it. You create one `slackbot` auth config from your credentials, then a setup script does the OAuth once with Composio's [manual authentication](/docs/manually-authenticating) flow.

> **`slackbot` vs `slack`**: Composio has two Slack toolkits, and this bot uses both:

  * **`slackbot`** authenticates a Slack *app* and acts as the **bot** (a bot token). It posts the reminders and drafts as "Daily Standup Bot," and it's the one you white-label here.
  * **`slack`** authenticates an individual **user** and acts as *them* (a user token). Each teammate connects this so the bot can post their standup under their own name and read their activity for context.

Rule of thumb: posting *as the bot* uses `slackbot`; doing something *as a person* uses `slack`.

**Create an auth config and pick the `Slackbot` toolkit.** In the [Composio dashboard](https://dashboard.composio.dev/~/project/auth-configs), click **Create Auth Config** and search `slackbot`. Choose **Slackbot**, *not* `Slack`: `Slackbot` posts as the bot identity, while `Slack` acts as an individual user.

![Choosing the Slackbot toolkit, not Slack](/images/standup-slackbot/auth-config-slackbot.png)
*Pick Slackbot, not Slack*

**Use your own credentials.** Pick **OAuth 2.0**, then **Your Own Credentials**, and paste the Client ID and Secret from before. Add `team:read` to the user token scopes. This is the white-label step: your app, your name, your face.

![Selecting Your Own Credentials and entering the Client ID and Secret](/images/standup-slackbot/auth-config-credentials.png)
*Use your own credentials*

**Save the auth config id.** Once created, copy its `ac_...` id into `COMPOSIO_SLACKBOT_AUTH_CONFIG_ID`. This is the one auth config your app uses to take actions on behalf of your bot.

![The created slackbot auth config with its ac_ id](/images/standup-slackbot/auth-config-created.png)
*The created auth config and its ac_ id*

**Run the setup script to connect the bot.** For this bot, we first need to connect the bot itself to Composio, which only needs to be done once. The script creates an OAuth link for you to connect your *Slack bot* to Composio, which lets you use Composio to send messages on behalf of your bot.

**`scripts/setup.ts` — complete file**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
const AUTH_CONFIG = process.env.COMPOSIO_SLACKBOT_AUTH_CONFIG_ID!;

// Connect the bot's own Slack app once, so it can post and DM as the bot.
async function main() {
  const session = await composio.create('default', {
    authConfigs: { slackbot: AUTH_CONFIG },
  });

  const toolkits = await session.toolkits({ toolkits: ['slackbot'] });
  const active = toolkits.items.find((t) => t.slug === 'slackbot')?.connection?.isActive;
  if (active) {
    console.log('Bot already connected.');
    return;
  }

  // Not connected: print the Connect Link, then wait for the user to finish.
  const connectionRequest = await session.authorize('slackbot');
  console.log('Authorize the bot:', connectionRequest.redirectUrl);

  const account = await connectionRequest.waitForConnection();
  console.log('Bot connected:', account.id);
}

main();
```

The first run prints a link and waits:

```text
╭─────────────────────────────────────────────────────────╮
│  Daily Standup Bot: One-Time Setup                       │
╰─────────────────────────────────────────────────────────╯
  ✅ Auth config has the required user scopes.
  ·  Bot is not connected yet. Generating an authorization link…

  Open this URL in your browser to authorize the bot:

    https://backend.composio.dev/s/AbC123xy

  Waiting for you to complete the OAuth flow (Ctrl+C to abort)…
  ✅ Bot connected to Slack.

──────────────────────────────────────────────────────────────────────
  🎉 Setup complete. Invite the bot to your standup channel and
     point your Slack app's Interactivity Request URL at
     https://<your-deployment>/api/interactivity
──────────────────────────────────────────────────────────────────────
```

Open that link to approve the bot, and the connection goes live:

![Approving the bot's OAuth connection](/images/standup-slackbot/oauth-approve.png)
*Approve the bot in Slack*

![Composio successfully connected to Slackbot](/images/standup-slackbot/connected.png)
*Connected*

The script is idempotent and repeatable. Forgot a scope, or hit an issue? No stress, just re-run it with `--reconnect`.

# Talk to Slack

To send and update messages in our deterministic bot workflow, we use Composio's `SLACKBOT_SEND_MESSAGE` and `SLACKBOT_UPDATES_A_MESSAGE` tools via [manual tool execution](/docs/tools-direct/executing-tools). `SLACKBOT_SEND_MESSAGE` takes Block Kit `blocks`, so a message with interactive buttons can go through a tool too.

**`api/_utils/slack.ts` — step 1: Send and update with named tools**

```typescript
import { composio } from './composio';

const BOT_USER = 'default';

// Sending a message is a named tool, even when it carries interactive buttons:
// SLACKBOT_SEND_MESSAGE takes markdown_text for prose, or Block Kit `blocks`.
export async function postMessage(channel: string, text: string, blocks?: unknown[]) {
  const res = await composio.tools.execute('SLACKBOT_SEND_MESSAGE', {
    userId: BOT_USER,
    arguments: blocks ? { channel, blocks } : { channel, markdown_text: text },
  });
  return res.data as { ts?: string };
}

// Updating the draft after an edit is a tool too: SLACKBOT_UPDATES_A_MESSAGE.
export async function updateMessage(channel: string, ts: string, blocks: unknown[]) {
  await composio.tools.execute('SLACKBOT_UPDATES_A_MESSAGE', {
    userId: BOT_USER,
    arguments: { channel, ts, blocks },
  });
}
```

When a Slack action has no tool, like opening a modal (`views.open`), it drops to [`proxyExecute`](/docs/extending-sessions/proxy-execute): the escape hatch for anything the named tools don't cover, hitting any Slack Web API endpoint as a connected account with no token in your code.

**`api/_utils/slack.ts` — step 2: The proxy for the one thing without a tool**

```typescript
import { composio } from './composio';

const BOT_USER = 'default';

// Sending a message is a named tool, even when it carries interactive buttons:
// SLACKBOT_SEND_MESSAGE takes markdown_text for prose, or Block Kit `blocks`.
export async function postMessage(channel: string, text: string, blocks?: unknown[]) {
  const res = await composio.tools.execute('SLACKBOT_SEND_MESSAGE', {
    userId: BOT_USER,
    arguments: blocks ? { channel, blocks } : { channel, markdown_text: text },
  });
  return res.data as { ts?: string };
}

// Updating the draft after an edit is a tool too: SLACKBOT_UPDATES_A_MESSAGE.
export async function updateMessage(channel: string, ts: string, blocks: unknown[]) {
  await composio.tools.execute('SLACKBOT_UPDATES_A_MESSAGE', {
    userId: BOT_USER,
    arguments: { channel, ts, blocks },
  });
}

// Opening a modal (views.open) has no Composio tool, so it drops to the proxy.
// proxyExecute hits the raw endpoint as the bot's connected account, the escape
// hatch for anything the named tools don't cover.
export async function openModal(triggerId: string, view: unknown) {
  const { items } = await composio.connectedAccounts.list({
    userIds: [BOT_USER],
    toolkitSlugs: ['slackbot'],
    statuses: ['ACTIVE'],
  });
  await composio.tools.proxyExecute({
    endpoint: '/views.open',
    method: 'POST',
    body: { trigger_id: triggerId, view },
    connectedAccountId: items[0]?.id,
  });
}
```

# Make the buttons work

Our StandUp bot gives the user two options every morning: **Draft** or **Connect more tools**. Each message uses [Block Kit](https://api.slack.com/block-kit) to create those buttons. For each button we define an `action_id` that lets us recognise which button was clicked.

```ts
declare const memberEmail: string, dmChannel: string, dmTs: string;
// the reminder's Draft button
const draftButton = {
  type: 'button',
  style: 'primary',
  text: { type: 'plain_text', text: '📝 Draft' },
  action_id: 'draft',
  value: JSON.stringify({ memberEmail, dmChannel, dmTs }),
};
```

![The daily standup reminder in Slack](/images/standup-slackbot/slack-reminder.png)
*The daily reminder, with Draft and Connect more tools buttons*

When it's clicked, Slack POSTs to your `/api/interactivity` handler. Verify the request, ack within Slack's 3-second window, then route on the `action_id`:

**`api/interactivity.ts` — complete file**

```typescript
import { verifySlackSignature, readRawBody, updateMessage, postAsMember } from './_utils/slack';
import { generateDraft } from './_utils/agent';
import { draftMessage, connectMenu } from './_utils/blocks';

// Slack POSTs here every time someone clicks a button. Verify it really came
// from Slack, then ack within 3 seconds (Slack retries if you're slow).
export default async function handler(req: Request, res: Response) {
  const body = await readRawBody(req);
  if (!verifySlackSignature(body, req.headers)) return res.status(401).end();

  const payload = JSON.parse(new URLSearchParams(body).get('payload') ?? '{}');
  res.status(200).end();        // ack immediately
  await handleClick(payload);   // then do the slow work
}

// Each button carried its context in `value`, so the handler knows exactly what
// to do. No model decides anything here: the flow is fixed.
async function handleClick(payload: any) {
  const action = payload.actions?.[0];
  const ctx = JSON.parse(action?.value ?? '{}');

  if (action?.action_id === 'draft') {
    const draft = await generateDraft(ctx.memberEmail);   // launch the subagent
    await updateMessage(ctx.dmChannel, ctx.dmTs, draftMessage(draft, ctx));
  } else if (action?.action_id === 'connect') {
    await updateMessage(ctx.dmChannel, ctx.dmTs, connectMenu(ctx));
  } else if (action?.action_id === 'confirm') {
    await postAsMember(ctx.memberEmail, ctx.channel, ctx.draft, ctx.threadTs);
  }
}
```

**Connect more tools** generates a per-member OAuth link for each toolkit the member hasn't connected, so they can add a source without leaving Slack:

![The connect-more-tools menu in Slack](/images/standup-slackbot/slack-connect.png)
*Connect more tools, each button a per-member OAuth link*

**Edit** opens a modal (`views.open` through the proxy), and **Confirm** posts the draft into the day's thread as the member.

# Draft the standup

Now this is the cool and magical part, and the easy part: all the background agent needs is a tool-router session and a prompt. When a member taps **Draft**, you spin up a session scoped to the toolkit catalogue and let the agent research and write.

## A session writes the draft

A [tool-router session](/docs/configuring-sessions) gives the agent its tools. Pass the member's email and your full list of toolkits, hand the tools to the model, and let it investigate and write. You don't have to check which ones the member set up: the session only exposes tools for the accounts they've actually connected, and ignores the rest.

**`api/_utils/agent.ts` — step 1: A tool-router session writes the draft**

```typescript
import { Composio } from '@composio/core';
import { VercelProvider } from '@composio/vercel';
import { generateText, stepCountIs } from 'ai';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new VercelProvider(),
});

// The toolkits the bot can draft from. A member only has some of these connected,
// and that's fine: the session just uses whatever they've actually authorized.
const TOOLKITS = ['github', 'linear', 'notion', 'googlecalendar', 'slack'];

// Spin up a tool-router session for one member and let the agent research and
// write their standup. session.tools() returns Composio's research meta-tools
// (search / execute / workbench), scoped to those toolkits.
export async function generateDraft(memberEmail: string) {
  const session = await composio.create(memberEmail, { toolkits: TOOLKITS });
  const tools = await session.tools();

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4-5',
    system: "Write a concise daily standup from the member's recent activity.",
    prompt: 'Research and write the standup update.',
    tools,
    stopWhen: stepCountIs(40),
  });
  return text.trim();
}
```

## Use what's connected, nothing more

The router can also *manage* connections, asking the user to authorize any toolkits they haven't connected yet. During a draft you don't want that: if the agent reaches for a tool the member hasn't connected, it should skip it, not prompt them to log in. `manageConnections: false` removes those meta-tools, so the agent drafts from exactly what's already connected.

**`api/_utils/agent.ts` — step 2: Keep the agent from connecting mid-draft**

```typescript
import { Composio } from '@composio/core';
import { VercelProvider } from '@composio/vercel';
import { generateText, stepCountIs } from 'ai';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new VercelProvider(),
});

// The toolkits the bot can draft from. A member only has some of these connected,
// and that's fine: the session just uses whatever they've actually authorized.
const TOOLKITS = ['github', 'linear', 'notion', 'googlecalendar', 'slack'];

// Spin up a tool-router session for one member and let the agent research and
// write their standup. session.tools() returns Composio's research meta-tools
// (search / execute / workbench), scoped to those toolkits.
export async function generateDraft(memberEmail: string) {
  // manageConnections:false strips the connection meta-tools. The agent drafts
  // from whatever the member already connected and never starts an OAuth flow
  // mid-draft: if a tool needs auth, it's simply not in the session.
  const session = await composio.create(memberEmail, {
    toolkits: TOOLKITS,
    manageConnections: false,
  });
  const tools = await session.tools();

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4-5',
    system: "Write a concise daily standup from the member's recent activity.",
    prompt: 'Research and write the standup update.',
    tools,
    stopWhen: stepCountIs(40),
  });
  return text.trim();
}
```

The bot posts the result back as a draft the member can confirm or edit:

![A generated standup draft in Slack with Confirm and Edit buttons](/images/standup-slackbot/slack-draft.png)
*The draft the agent writes, delivered to a teammate in Slack*

# The whole project

> The complete project is on GitHub: [composio-slack-bot](https://github.com/ComposioHQ/composio-slack-bot).

# Run it

Edit `standup.config.ts` with your team (each member's Slack email and timezone, plus your channel and GitHub org), set your four environment variables, run `npx tsx scripts/setup.ts` once to connect your bot, then `vercel deploy`.

- [Configuring sessions](/docs/configuring-sessions): What a session can scope: toolkits, tools, connections, and connection management

- [White-labeling authentication](/docs/white-labeling-authentication): Ship a bot under your own app's name, icon, and credentials

- [Custom vs managed auth](/docs/custom-app-vs-managed-app): Bring-your-own Slack app versus a Composio-managed connection

- [Triggers](/docs/triggers): Run agents in response to events: schedules, webhooks, and app activity

---


# API Reference


---
