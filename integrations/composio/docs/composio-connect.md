---
type: composio_doc
title: "Composio Connect"
source: "https://docs.composio.dev/docs/composio-connect.md"
source_hash: "6184d676616d126a5ddf8d3f41f4244257fc15ef9399f9f3612773e29e037e7f"
system: "composio"
kb_namespace: "composio"
doc_path: "composio-connect.md"
original_doc_path: "composio-connect.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Composio Connect (/docs/composio-connect)
Source: https://docs.composio.dev/docs/composio-connect.md


Use Composio Connect when you already have an MCP-compatible client and want the shared Composio MCP URL, without creating an SDK session. Connect it to `https://connect.composio.dev/mcp`.

If you use Codex or Claude Code and did not explicitly choose MCP, install the native [Composio agent plugin](/docs/agent-plugins) instead. The plugin uses the Composio CLI and is the shortest path for those agents.

If you are building an application, start with the [SDK Quickstart](/docs/quickstart) or create a [session MCP endpoint](/docs/sessions-via-mcp) instead.

## How Composio Connect works [#how-composio-connect-works]

Composio Connect is an MCP server at `https://connect.composio.dev/mcp` that gives your AI agent access to 1000+ apps, including Gmail, Notion, Slack, GitHub, Linear, HubSpot, and Strava, through a single connection.

Rather than exposing every app tool directly, Composio exposes **7 meta-tools** that let the agent discover what's available, authorize apps on demand, and execute tools across apps in parallel. The first time your agent needs an app, Composio generates an OAuth link you approve in your browser; after that the connection persists across sessions. See [Available MCP tools](#available-mcp-tools) for the full list.

To get started, pick your client below.

## Claude Code

#### Ask Claude Code to install Composio

Paste this prompt into Claude Code:

```
Install the Composio CLI: curl -fsSL https://composio.dev/install | sh, then run composio login.
```

## Claude Cowork (Claude Desktop)

#### Open the Connectors menu

Click the &#x2A;*+** button in the message box, then choose **Connectors > Add connector > Add custom connector**.

#### Add the Composio MCP server

Name it **Composio**, paste `https://connect.composio.dev/mcp`, then click **Add**.

#### Authorize in your browser

Claude opens a browser window. Sign in to authorize Composio.

## ChatGPT

#### Enable Developer mode

In ChatGPT, open **Settings > Security and login**, then turn on **Developer mode**. This requires ChatGPT Plus, Pro, Business, Enterprise, or Edu.

#### Add the MCP server

On the **Plugins*&#x2A; page, click &#x2A;*+**, choose **New Plugin**, paste `https://connect.composio.dev/mcp` into **Server URL**, then click **Create**.

#### Authorize in your browser

Sign in in the browser window ChatGPT opens.

#### Enable Composio in a chat

For each new chat, click &#x2A;*+**, choose **More**, then select **Composio** to enable its tools.

## Cursor

#### Install the Composio plugin

Open the [Composio plugin in the Cursor marketplace](https://cursor.com/marketplace/composio), click **Install Composio Plugin for Cursor**, and authorize in your browser.

## OpenClaw

#### Ask OpenClaw to install Composio

```
Install the Composio CLI: curl -fsSL https://composio.dev/install | sh, then run composio login.
```

## Hermes

#### Ask Hermes to install Composio

```
Install the Composio CLI: curl -fsSL https://composio.dev/install | sh, then run composio login.
```

## Notion

#### Create a custom agent

In Notion's AI agent builder, click **Create Blank**.

#### Add the Composio connection

Choose **Add Connection > Custom MCP**, enter `https://connect.composio.dev/mcp`, name the connection **Composio**, and complete the OAuth authorization in your browser.

## Codex

#### Ask Codex to install Composio

```
Install the Composio CLI: curl -fsSL https://composio.dev/install | sh, then run composio login.
```

## Warp

#### Install from the Warp marketplace

Open `warp://settings/mcp?autoinstall=composio` in Warp to install the MCP server, then authorize in your browser. If Warp does not open, add it under **Settings > Agents > MCP servers**.

## Grok

#### Open Grok connectors

Go to [Grok Connectors](https://grok.com/connectors), click **New Connector**, then choose **Custom**. Custom connectors require a paid tier.

#### Add Composio and authorize

Paste `https://connect.composio.dev/mcp`, save, and authorize Composio in the sign-in window.

## Gemini CLI

#### Ask Gemini CLI to install Composio

```
Install the Composio CLI: curl -fsSL https://composio.dev/install | sh, then run composio login.
```

## VS Code

#### Install from the GitHub MCP registry

Open [Composio in the GitHub MCP registry](https://github.com/mcp/ComposioHQ/composio), click **Install in VS Code**, and authorize when prompted.

## Devin Desktop (Windsurf)

#### Install Composio in one click

Open `windsurf://windsurf-mcp-registry?serverName=composio` in Devin Desktop to install Composio. Your team needs MCP access enabled.

#### Or configure it manually

Open `~/.codeium/windsurf/mcp_config.json` or **Settings > MCP Configuration**, then add:

```json title="mcp_config.json"
{
  "mcpServers": {
    "composio": {
      "serverUrl": "https://connect.composio.dev/mcp"
    }
  }
}
```
Restart Devin Desktop and click **Authorize** next to Composio.

## Antigravity

#### Open your MCP config

In Antigravity, choose **Settings > Customizations > Open MCP Config**.

#### Add the Composio server

Antigravity uses `serverUrl` for remote HTTP servers:

```json title="mcp_config.json"
{
  "mcpServers": {
    "composio": {
      "serverUrl": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_CONSUMER_KEY"
      }
    }
  }
}
```
Save the file, then refresh the **Installed MCP Servers** list.

## OpenAI Agent Builder (Agent Builder)

#### Open Agent Builder

Open [OpenAI Agent Builder](https://platform.openai.com/agent-builder) and create a new agent.

#### Add Composio as an MCP server

In the sidebar, choose **MCP > + Server**. Paste `https://connect.composio.dev/mcp`, choose **Custom headers**, then set `x-consumer-api-key` to `YOUR_CONSUMER_KEY`.

## n8n

#### Add an MCP Client node

In your n8n workflow, add an **MCP Client** node or MCP Client Tool sub-node.

#### Configure Composio

Set the connection type to **HTTP Streamable** and URL to `https://connect.composio.dev/mcp`. Select **Header Auth**, create a credential with header name `x-consumer-api-key`, and use `YOUR_CONSUMER_KEY` as its value.

## Generic MCP URL

#### Add the Composio server

Use `https://connect.composio.dev/mcp` with streamable HTTP and this header:

```json
{
  "mcpServers": {
    "composio": {
      "url": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_CONSUMER_KEY"
      }
    }
  }
}
```

## Connect your apps [#connect-your-apps]

Your agent will prompt you to connect apps when needed. If you want to connect an app ahead of time, ask your agent to start the connection and complete the OAuth flow it opens.

## Available MCP tools [#available-mcp-tools]

Composio Connect exposes 7 meta-tools that orchestrate access to all supported apps. Your agent uses these to discover, connect, and execute upstream tools — you don't need to call them directly.

* **`COMPOSIO_SEARCH_TOOLS`** — Search the Composio catalog and return relevant tools for a user request, along with a suggested execution plan.
* **`COMPOSIO_GET_TOOL_SCHEMAS`** — Fetch full input schemas for tool slugs returned by search.
* **`COMPOSIO_MULTI_EXECUTE_TOOL`** — Execute one or more discovered tools in parallel across connected apps (up to 50 per call).
* **`COMPOSIO_MANAGE_CONNECTIONS`** — Create, list, rename, or remove OAuth connections to upstream apps.
* **`COMPOSIO_WAIT_FOR_CONNECTIONS`** — Wait for a user to complete an OAuth flow before the agent continues.
* **`COMPOSIO_REMOTE_WORKBENCH`** — Run Python in a remote sandbox for bulk operations or processing large tool responses.
* **`COMPOSIO_REMOTE_BASH_TOOL`** — Run bash in a remote sandbox for file processing and large data handling.

## Troubleshooting [#troubleshooting]

### Tools aren't appearing in my agent [#tools-arent-appearing-in-my-agent]

1. Confirm the MCP server is connected. In Claude Desktop, go to **Settings > Connectors** and check that Composio shows a `CUSTOM` badge. In Claude Code, run `/mcp` and confirm Composio is enabled.
2. Clear the connector cache. In Claude Desktop: click the &#x2A;*⋮** next to Composio and select **Clear cache**.
3. If the issue persists, disconnect and re-add the connector:
  * **Claude Desktop*&#x2A; — click **⋮ > Disconnect**, then **Remove**. Re-add via **Add custom connector**.
  * **Claude Code** — re-run the setup command from the Claude Code section above.

### The OAuth link expired or didn't open [#the-oauth-link-expired-or-didnt-open]

OAuth links are short-lived. If the browser window doesn't open or the link has expired, ask your agent to retry the action — Composio will generate a fresh link.

### An app action is failing with an auth error [#an-app-action-is-failing-with-an-auth-error]

1. Ask your agent to inspect the app connection.
2. If the connection is unhealthy, disconnect and reconnect it when prompted.
3. Retry the action.

### I want to remove or reconnect an app [#i-want-to-remove-or-reconnect-an-app]

Ask your agent to manage the connection. It can prompt you to disconnect, delete, or re-authorize an app.

### I still need help [#i-still-need-help]

Reach out at [support@composio.dev](mailto:support@composio.dev) or join the [Composio Discord](https://discord.com/invite/cNruWaAhQk).

---
