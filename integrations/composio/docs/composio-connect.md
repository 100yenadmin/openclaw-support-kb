---
type: composio_doc
title: "Composio Connect"
source: "https://docs.composio.dev/docs/composio-connect.md"
source_hash: "5198c0b4d72bc420245b8c421e5072dc8d0e2762c9c20edd9ab55fb6ff939751"
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


Give any AI agent the ability to act across 1000+ apps. Bring your agent to where you work.

# How Composio Connect works

Composio Connect is an MCP server at `https://connect.composio.dev/mcp` that gives your AI agent access to 1000+ apps — Gmail, Notion, Slack, GitHub, Linear, HubSpot, Strava, and more — through a single connection.

Rather than exposing every app tool directly, Composio exposes **7 meta-tools** that let the agent discover what's available, authorize apps on demand, and execute tools across apps in parallel. The first time your agent needs an app, Composio generates an OAuth link you approve in your browser; after that the connection persists across sessions. See [Available MCP tools](#available-mcp-tools) for the full list.

To get started, pick your client below.

## Claude Code

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Run the setup command

Run this in your terminal to add the Composio MCP server to Claude Code.

```bash
claude mcp add --scope user --transport http composio https://connect.composio.dev/mcp --header "x-consumer-api-key: YOUR_API_KEY"
```

#### Verify the connection

Type `/mcp` in Claude Code to open the MCP server manager and confirm Composio appears and is enabled.

## Codex

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Open your Codex config

Open `~/.codex/config.toml` in your editor. Create the file if it doesn't exist.

#### Add the Composio server

```toml title="~/.codex/config.toml"
[mcp_servers.composio]
url = "https://connect.composio.dev/mcp"
http_headers = { "x-consumer-api-key" = "YOUR_API_KEY" }
```
#### Verify the connection

Run `codex mcp list` to confirm Composio appears as a registered MCP server.

## OpenClaw

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Add the MCP server via prompt

Copy this prompt and paste it into OpenClaw:

```
Add a new MCP server called "composio" with transport type HTTP.
Use the URL https://connect.composio.dev/mcp and add the header
"x-consumer-api-key: YOUR_API_KEY".
```
## Claude Desktop

#### Open Connectors settings

In Claude Desktop, go to **Settings**, then click **Connectors**.

#### Add the Composio MCP server

Click **Add custom connector** and paste the Composio MCP server URL.

```
https://connect.composio.dev/mcp
```
#### Authorize in your browser

A browser window will open automatically. Sign in to authorize Claude Desktop to access your Composio account.

## ChatGPT

#### Enable Developer Mode

In ChatGPT, go to **Settings > Apps > Advanced settings** and toggle on **Developer Mode**. Requires ChatGPT Plus, Pro, Business, Enterprise, or Edu.

#### Add the MCP server

Click **Create app** and paste the Composio MCP server URL.

```
https://connect.composio.dev/mcp
```
#### Authorize in your browser

A browser window will open automatically. Sign in to authorize ChatGPT to access your Composio account.

## Cursor

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Add the Composio server

Open `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` for global config) and add:

```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "composio": {
      "url": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```
#### Restart Cursor

Restart Cursor. Composio tools are now available in Composer and Agent mode.

## Notion

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Create a custom agent

In Notion, open the AI agent builder and click **Create Blank** to start a new agent.

#### Add a connection

Click **Add Connection**, then select **Custom MCP**.

#### Configure the server

Enter the MCP server URL:

```
https://connect.composio.dev/mcp
```
Select **API Key** as the authentication type. Set the key to `x-consumer-api-key` and paste your API key as the value.

## VS Code

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Add the Composio server

Open or create `.vscode/mcp.json` in your project root and add the following. Requires VS Code 1.99+ with GitHub Copilot.

```json title=".vscode/mcp.json"
{
  "servers": {
    "composio": {
      "type": "http",
      "url": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```
Note: VS Code uses `"servers"` instead of `"mcpServers"`.

#### Open a Copilot chat

Open a GitHub Copilot chat. Composio tools are now available.

## Windsurf

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Open your MCP config

Open `~/.codeium/windsurf/mcp_config.json`, or go to **Windsurf > Settings > MCP Configuration**.

#### Add the Composio server

```json title="mcp_config.json"
{
  "mcpServers": {
    "composio": {
      "serverUrl": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```
Note: Windsurf uses `"serverUrl"` instead of `"url"`.

#### Restart Windsurf

Restart Windsurf. Composio tools are now available in Cascade.

## Cline

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Open MCP settings

In VS Code with Cline installed, click the **MCP Servers** icon in the Cline navigation bar. Click the **Configure** tab, then click **Configure MCP Servers** to open the JSON config file.

#### Add the Composio server

```json title="cline_mcp_settings.json"
{
  "mcpServers": {
    "composio": {
      "url": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_API_KEY"
      },
      "disabled": false
    }
  }
}
```
#### Save

Save the configuration. Composio tools are now available in Cline.

## Agent Builder

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Create a new agent

Open the [OpenAI Agent Builder](https://platform.openai.com/agent-builder) and create a new agent.

#### Add MCP Server

Click **MCP** in the sidebar, then click **+ Server**. Paste the URL:

```
https://connect.composio.dev/mcp
```
Select **Custom headers**. Add a header with name `x-consumer-api-key` and paste your API key as the value.

## n8n

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Add an MCP Client node

In your n8n workflow, add an **MCP Client** node or MCP Client Tool sub-node for AI agent chains.

#### Configure the connection

Set the connection type to **HTTP Streamable** and paste the server URL:

```
https://connect.composio.dev/mcp
```
Select **Header Auth** and create a new credential. Set the header name to `x-consumer-api-key` and paste your API key as the value.

## MCP URL

#### Get your API key

Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **AI Clients** in the sidebar. Select your client and copy your API key.

#### Add to your client config

Use this config with any MCP-compatible client:

```json
{
  "mcpServers": {
    "composio": {
      "url": "https://connect.composio.dev/mcp",
      "headers": {
        "x-consumer-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```

# Connect your apps

Your agent will prompt you to connect apps when needed. If you want to connect apps ahead of time, open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **Connect Apps** in the sidebar.

# Available MCP tools

Composio Connect exposes 7 meta-tools that orchestrate access to all supported apps. Your agent uses these to discover, connect, and execute upstream tools — you don't need to call them directly.

* **`COMPOSIO_SEARCH_TOOLS`** — Search the Composio catalog and return relevant tools for a user request, along with a suggested execution plan.
* **`COMPOSIO_GET_TOOL_SCHEMAS`** — Fetch full input schemas for tool slugs returned by search.
* **`COMPOSIO_MULTI_EXECUTE_TOOL`** — Execute one or more discovered tools in parallel across connected apps (up to 50 per call).
* **`COMPOSIO_MANAGE_CONNECTIONS`** — Create, list, rename, or remove OAuth connections to upstream apps.
* **`COMPOSIO_WAIT_FOR_CONNECTIONS`** — Wait for a user to complete an OAuth flow before the agent continues.
* **`COMPOSIO_REMOTE_WORKBENCH`** — Run Python in a remote sandbox for bulk operations or processing large tool responses.
* **`COMPOSIO_REMOTE_BASH_TOOL`** — Run bash in a remote sandbox for file processing and large data handling.

# Troubleshooting

## Tools aren't appearing in my agent

1. Confirm the MCP server is connected. In Claude Desktop, go to **Settings > Connectors** and check that Composio shows a `CUSTOM` badge. In Claude Code, run `/mcp` and confirm Composio is enabled.
2. Clear the connector cache. In Claude Desktop: click the **⋮** next to Composio and select **Clear cache**.
3. If the issue persists, disconnect and re-add the connector:
  * **Claude Desktop** — click **⋮ > Disconnect**, then **Remove**. Re-add via **Add custom connector**.
  * **Claude Code** — re-run the setup command from the Claude Code section above.

## The OAuth link expired or didn't open

OAuth links are short-lived. If the browser window doesn't open or the link has expired, ask your agent to retry the action — Composio will generate a fresh link. You can also open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect), click **Connect Apps**, and start the flow manually.

## An app action is failing with an auth error

1. Open the [Composio dashboard](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **Connect Apps**.
2. Find the app in question. If the connection is unhealthy, click **Disconnect** and reconnect.
3. Retry the action in your agent.

## I want to remove or reconnect an app

Open [dashboard.composio.dev](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=docs-composio-connect) and click **Connect Apps**. From there you can disconnect, delete, or re-authorize any app.

## I still need help

Reach out at [tech@composio.dev](mailto:tech@composio.dev) or join the [Composio Discord](https://discord.com/invite/cNruWaAhQk).

---
