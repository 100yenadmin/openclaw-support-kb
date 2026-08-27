---
type: composio_doc
title: "Single Toolkit MCP"
source: "https://docs.composio.dev/docs/single-toolkit-mcp.md"
source_hash: "35f7671bd7d5ac09ec909e9acc3ea0b2b37ec2ec3991e1b01130bfa0fea337a2"
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

## Install the SDK [#install-the-sdk]

**Python:**

**TypeScript:**

## Create an MCP server [#create-an-mcp-server]

#### Initialize Composio [#initialize-composio]

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

#### Create server configuration [#create-server-configuration]

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

> You can also create and manage MCP configs from the [Composio dashboard](https://dashboard.composio.dev/~/org/connect/clients?utm_source=docs\&utm_medium=content\&utm_campaign=docs-single-toolkit-mcp).

#### Generate user URLs [#generate-user-urls]

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

#### Use with AI providers [#use-with-ai-providers]

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

## Server management [#server-management]

### List servers [#list-servers]

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

### Get server details [#get-server-details]

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

### Update a server [#update-a-server]

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

### Delete a server [#delete-a-server]

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

## Next [#next]

- [Providers](/docs/providers):
Use with Anthropic, OpenAI, and other frameworks

---


# Knowledge Hub navigation


---

- https://docs.composio.dev/kb
- https://docs.composio.dev/kb/search
- https://docs.composio.dev/kb/topic/authentication-and-connected-accounts
- https://docs.composio.dev/kb/topic/tools-actions-and-execution
- https://docs.composio.dev/kb/topic/triggers-and-workflows
- https://docs.composio.dev/kb/topic/sdk-api-and-mcp
- https://docs.composio.dev/kb/topic/account-billing-and-security
- https://docs.composio.dev/kb/toolkits
- https://docs.composio.dev/kb/toolkit/gmail
- https://docs.composio.dev/kb/toolkit/github
- https://docs.composio.dev/kb/toolkit/googlecalendar
- https://docs.composio.dev/kb/toolkit/notion
- https://docs.composio.dev/kb/toolkit/googlesheets
- https://docs.composio.dev/kb/toolkit/slack
- https://docs.composio.dev/kb/toolkit/supabase
- https://docs.composio.dev/kb/toolkit/outlook
- https://docs.composio.dev/kb/toolkit/perplexityai
- https://docs.composio.dev/kb/toolkit/twitter
- https://docs.composio.dev/kb/toolkit/googledrive
- https://docs.composio.dev/kb/toolkit/googledocs
- https://docs.composio.dev/kb/toolkit/hubspot
- https://docs.composio.dev/kb/toolkit/linear
- https://docs.composio.dev/kb/toolkit/airtable
- https://docs.composio.dev/kb/toolkit/serpapi
- https://docs.composio.dev/kb/toolkit/jira
- https://docs.composio.dev/kb/toolkit/firecrawl
- https://docs.composio.dev/kb/toolkit/tavily
- https://docs.composio.dev/kb/toolkit/youtube
- https://docs.composio.dev/kb/toolkit/slackbot
- https://docs.composio.dev/kb/toolkit/canvas
- https://docs.composio.dev/kb/toolkit/googletasks
- https://docs.composio.dev/kb/toolkit/discord
- https://docs.composio.dev/kb/toolkit/figma
- https://docs.composio.dev/kb/toolkit/reddit
- https://docs.composio.dev/kb/toolkit/wrike
- https://docs.composio.dev/kb/toolkit/snowflake
- https://docs.composio.dev/kb/toolkit/microsoft_teams
- https://docs.composio.dev/kb/toolkit/asana
- https://docs.composio.dev/kb/toolkit/shopify
- https://docs.composio.dev/kb/toolkit/linkedin
- https://docs.composio.dev/kb/toolkit/google_maps
- https://docs.composio.dev/kb/toolkit/one_drive
- https://docs.composio.dev/kb/toolkit/docusign
- https://docs.composio.dev/kb/toolkit/discordbot
- https://docs.composio.dev/kb/toolkit/salesforce
- https://docs.composio.dev/kb/toolkit/calendly
- https://docs.composio.dev/kb/toolkit/trello
- https://docs.composio.dev/kb/toolkit/apollo
- https://docs.composio.dev/kb/toolkit/posthog
- https://docs.composio.dev/kb/toolkit/clickup
- https://docs.composio.dev/kb/toolkit/stripe
- https://docs.composio.dev/kb/toolkit/klaviyo
- https://docs.composio.dev/kb/toolkit/mailchimp
- https://docs.composio.dev/kb/toolkit/attio
- https://docs.composio.dev/kb/toolkit/googlemeet
- https://docs.composio.dev/kb/toolkit/zoho
- https://docs.composio.dev/kb/toolkit/dropbox
- https://docs.composio.dev/kb/toolkit/confluence
- https://docs.composio.dev/kb/toolkit/ahrefs
- https://docs.composio.dev/kb/toolkit/googlebigquery
- https://docs.composio.dev/kb/toolkit/monday
- https://docs.composio.dev/kb/toolkit/pipedrive
- https://docs.composio.dev/kb/toolkit/whatsapp
- https://docs.composio.dev/kb/toolkit/zendesk
- https://docs.composio.dev/kb/toolkit/googlesuper
- https://docs.composio.dev/kb/toolkit/browser_tool
- https://docs.composio.dev/kb/toolkit/rocketlane
- https://docs.composio.dev/kb/toolkit/zoom
- https://docs.composio.dev/kb/toolkit/servicenow
- https://docs.composio.dev/kb/toolkit/googleads
- https://docs.composio.dev/kb/toolkit/pagerduty
- https://docs.composio.dev/kb/toolkit/share_point
- https://docs.composio.dev/kb/toolkit/launch_darkly
- https://docs.composio.dev/kb/toolkit/netsuite
- https://docs.composio.dev/kb/toolkit/zoho_books
- https://docs.composio.dev/kb/toolkit/facebook
- https://docs.composio.dev/kb/toolkit/canva
- https://docs.composio.dev/kb/toolkit/webflow
- https://docs.composio.dev/kb/toolkit/google_analytics
- https://docs.composio.dev/kb/toolkit/ynab
- https://docs.composio.dev/kb/toolkit/kommo
- https://docs.composio.dev/kb/toolkit/gong
- https://docs.composio.dev/kb/toolkit/xero
- https://docs.composio.dev/kb/toolkit/zoho_mail
- https://docs.composio.dev/kb/toolkit/intercom
- https://docs.composio.dev/kb/toolkit/databricks
- https://docs.composio.dev/kb/toolkit/daytona
- https://docs.composio.dev/kb/toolkit/digital_ocean
- https://docs.composio.dev/kb/toolkit/excel
- https://docs.composio.dev/kb/toolkit/fathom
- https://docs.composio.dev/kb/toolkit/gemini
- https://docs.composio.dev/kb/toolkit/gitlab
- https://docs.composio.dev/kb/toolkit/google_classroom
- https://docs.composio.dev/kb/toolkit/googleslides
- https://docs.composio.dev/kb/toolkit/granola_mcp
- https://docs.composio.dev/kb/toolkit/instagram
- https://docs.composio.dev/kb/toolkit/instantly
- https://docs.composio.dev/kb/toolkit/kickbox
- https://docs.composio.dev/kb/toolkit/marketstack
- https://docs.composio.dev/kb/toolkit/onenote
- https://docs.composio.dev/kb/toolkit/odoo
- https://docs.composio.dev/kb/toolkit/openai
- https://docs.composio.dev/kb/toolkit/quickbooks
- https://docs.composio.dev/kb/toolkit/ramp
- https://docs.composio.dev/kb/toolkit/snapchat
- https://docs.composio.dev/kb/toolkit/spotify
- https://docs.composio.dev/kb/toolkit/strava
- https://docs.composio.dev/kb/toolkit/telegram
- https://docs.composio.dev/kb/toolkit/ticktick
- https://docs.composio.dev/kb/toolkit/tiktok
- https://docs.composio.dev/kb/toolkit/workday

---


# Knowledge Base


---

# Knowledge Base (/kb)

Verified troubleshooting guides, operational answers, and known-good patterns from Composio support.

---

# Consumer and Developer Project Boundaries (/kb/guide/consumer-project-boundaries-and-auth-selection)

Composio organizations have separate developer and consumer project surfaces. The developer dashboard/API shows developer projects. The consumer dashboard and consumer MCP / Composio MCP / Composio For You clients use a separate consumer project that customers usually do not see directly.

Developer-project auth configs and connected accounts are not available in the consumer project. Consumer-project connections are not available in the developer project. If you created an auth config or connected an account in the developer dashboard but cannot use it in Claude, ChatGPT, Codex, Cursor, Composio For You, or another consumer MCP client, connect the account through the consumer flow instead.

Consumer MCP auth has two common paths:

1. Use the consumer MCP URL directly. If the MCP client supports auth, it can trigger the Composio auth flow, open a popup, let the customer authenticate, and let them select the organization.

2. Use the consumer API key when the MCP client does not support auth and only supports API keys/headers. Copy the key from the consumer dashboard and pass it as the `x-consumer-api-key` header.

Under the hood, a consumer-scoped MCP session is created for the specific user and allowed tools.

The For You connection flow uses the auth config in the consumer project. Its current behavior is:

1. When a Composio-managed auth app is available, the app uses that managed config and does not expose provider credentials for editing.

2. When no managed app is available, **Manage Auth** appears for toolkits with editable customer-owned credentials or multiple auth schemes. Enter the provider client ID/secret or other required fields there and register the callback URI shown by the current form.

3. Provider scopes are determined by the selected auth scheme and its current config. A managed app is limited to its approved scope set; customer-owned apps must configure and verify their scopes with the provider.

## Rotate the Connect MCP consumer key [#rotate-the-connect-mcp-consumer-key]

These steps apply to a Connect consumer key with the `ck_*` prefix, sent as `x-consumer-api-key`. They do not apply to a Platform Project API key with the `ak_*` prefix. Reconnecting Gmail, Calendar, or another individual app does not rotate the consumer key.

1. Open For You / Connect.
2. Select **Settings** in the left sidebar.
3. Open **Sessions & API Key**.
4. Select **Regenerate** next to “Your API Key” and confirm.
5. Update every MCP client that uses `https://connect.composio.dev/mcp` with the new `x-consumer-api-key` value.

Regeneration immediately invalidates the old consumer key. If the button is missing even though you are in the correct workspace with write access, or you need help investigating suspicious usage, contact Composio support for account-level assistance.

## Workspace members do not automatically share For You connections [#workspace-members-do-not-automatically-share-for-you-connections]

In the normal For You/Connect MCP flow, connected accounts belong to the member who authorized them. Another teammate using their own Connect MCP endpoint or `ck_*` consumer key resolves to their own connected accounts, not yours.

* Admins can manage workspace settings and members, but their own Connect MCP session does not automatically use another member's accounts.
* Members can connect and use their own accounts.
* Viewers cannot connect or invoke tools from the For You surface.

Raw `ak_*` Project API keys are different from `ck_*` consumer keys and must be treated as privileged project secrets. Explicitly shared or pinned connections are also a separate configuration from ordinary member-scoped connections.

## Shared connections must be explicitly allowed and pinned [#shared-connections-must-be-explicitly-allowed-and-pinned]

A normal `PRIVATE` connection belongs to the user who created it. A `SHARED`
connection can be used by other user IDs only when its ACL allows them and the
connection is explicitly pinned into the session by connected-account ID.
Shared connections are deny-by-default and are never selected implicitly.

Follow the [Shared Connections guide](https://docs.composio.dev/docs/shared-connections#shared-vs-private)
for the current ACL and session configuration.

---

# Delete a Composio organization (/kb/guide/dashboard-account-deletion)

## Organization admins can use Delete this organization [#organization-admins-can-use-delete-this-organization]

In Platform, open **Settings → Organization Settings → General**. In For You,
open **Settings → General**. Under **Delete this organization**, select **Delete
organization** and complete the confirmation shown by the dashboard.

The control is disabled for non-admins. A non-admin should contact an
organization admin. The current warning states that deletion permanently
removes the organization, its projects, connected accounts, API keys, and logs,
so confirm the organization before proceeding.

If upstream provider credentials also need to be invalidated, revoke the
connected accounts where supported and remove the app or rotate the credential
in the provider's own settings when necessary. Never send credentials to
Composio support.

---

# Manage Platform auth configs (/kb/guide/dashboard-auth-configs-navigation)

## Create an auth config from the selected Platform project [#create-an-auth-config-from-the-selected-platform-project]

Open **Platform → Auth Configs → Create Auth Config**, choose the toolkit and
supported authentication method, then select managed authentication when it is
available or enter customer-owned credentials. For custom OAuth, register the
exact callback URI shown by the current dashboard in the provider app; do not
copy a callback URI from an old example.

Auth configs belong to one Platform project. If a config or connection is
missing, verify the selected organization and project before recreating it.

## Connect Account on an auth config is a Playground test connection [#connect-account-on-an-auth-config-is-a-playground-test-connection]

Open an auth config and select **Connect Account** to authenticate the
project's Playground user for testing. This control does not ask for an
application user ID. To connect an actual application user, create a hosted
connection link through the SDK or API with that application's stable
`user_id` and the intended auth config.

## Manage Config changes future authentication behavior [#manage-config-changes-future-authentication-behavior]

Use **Manage Config** to inspect the enabled state, credentials, and available
scope or execution settings for that config type. Changing credentials or
scopes can require users to create a fresh connection before the change is
reflected in their provider grant. Review dependent connections, sessions, and
triggers before disabling or deleting a config.

---

# Composio For You navigation (/kb/guide/dashboard-for-you-navigation)

## Use Connect Apps for provider accounts and Connect my agent for clients [#use-connect-apps-for-provider-accounts-and-connect-my-agent-for-clients]

The current For You sidebar contains **Home**, **Connect Apps**, **Connect my
agent**, and **Help**.

* Open **Connect Apps**, select an app, and choose **Connect** to authenticate a
provider account.
* Open **Connect my agent** and select the target agent or MCP client for the
current setup instructions. Copy the MCP URL, header, or key shown on that
page rather than transferring configuration syntax from another client.
* Open **Help** when the user needs the support route rather than self-service
product guidance.

## For You settings include Sessions & API Key [#for-you-settings-include-sessions--api-key]

For You settings currently contain **General**, **Members**, **Sessions & API
Key**, and **Billing**. Use **Sessions & API Key** to inspect the current
consumer connection instructions or regenerate the consumer key. Regeneration
invalidates the previous key, so update every client that uses it. Never ask a
customer to paste the key into a support conversation.

For project auth configs, project users, triggers, logs, or `ak_...` project API
keys, switch to Platform instead.

---

# Dashboard Log Storage (/kb/guide/dashboard-log-storage)

## “Don't store data” removes new payload content, not the audit row [#dont-store-data-removes-new-payload-content-not-the-audit-row]

New tool executions can still appear in Tool Logs with audit metadata such as tool, status, timestamp, duration, and related identifiers. With **Don't store data** enabled, their request arguments and response payload content are not stored in those rows.

Changing the setting does not retroactively erase older payloads. Run a new test after changing it and inspect that new row. If new request or response content remains visible, contact support with the timestamp and log reference.

This setting does not define every contractual retention or deletion window. Use Composio's approved security and privacy documentation for those questions.

---

# Dashboard MFA Setup (/kb/guide/dashboard-login-restrictions)

Use this when a user cannot complete authenticator-app enrollment from the QR
code in Account Settings.

## Use the manual setup key when QR scanning does not complete [#use-the-manual-setup-key-when-qr-scanning-does-not-complete]

The MFA setup screen shows a QR code and a **View setup key** option. If the QR
code cannot be scanned or the setup screen expires, open **View setup key** and
enter that key manually in the authenticator app. Then enter the resulting
six-digit passcode in Composio to finish enrollment.

After enrollment is complete, resetting the setup key requires removing or
resetting the MFA factor and enrolling the authenticator again.

---

# Composio dashboard navigation (/kb/guide/dashboard-navigation-overview)

## Choose Platform for developer projects and For You for personal agent connections [#choose-platform-for-developer-projects-and-for-you-for-personal-agent-connections]

**Platform** contains developer projects, Playground, project API keys,
toolkits, skills, users, sessions, auth configs, triggers, logs, and project
settings. **For You** connects a person's apps to supported agents and MCP
clients. Resources in one surface do not automatically appear in the other.

Use the product switcher when a user is looking for a personal app connection
inside Platform or for project resources inside For You.

## Current Platform project navigation [#current-platform-project-navigation]

The Platform project sidebar contains **Getting Started**, **Playground**,
**API Keys**, **Toolkits**, **Skills**, **Users**, **Sessions**, **Auth Configs**,
**Triggers**, and **Logs**. Pinned destinations include **Support**,
**Documentation**, and **Settings**.

* Use **Playground** to test a session with selected toolkits, tools, auth
configs, and connected accounts.
* Use **Toolkits** to inspect current toolkit versions, tool and trigger schemas,
and supported auth schemes.
* Use **Users** and **Sessions** to correlate a project user with connections,
executions, and session restrictions.
* Use **Logs** for the request, response, error, version, and Log ID of a tool or
trigger execution.

## Organization and project settings are separate [#organization-and-project-settings-are-separate]

Project settings include **General**, **API Keys**, **Webhooks**, **White
Labeling**, and **Usage**. Organization settings include **General**,
**Members**, **Billing**, **Usage**, and **Account Settings**. Verify the page
heading before changing or deleting a resource.

---

# Organization Members and Administrators (/kb/guide/dashboard-org-members)

## Transfer organization control to another user [#transfer-organization-control-to-another-user]

Transfer organization control by assigning the **Admin** role:

1. Open **Organization Settings → Team Members**.
2. Invite the new user and assign the **Admin** role.
3. Have the new user accept the invitation and sign in.
4. If the previous admin should no longer have control, the new admin can lower or remove that person afterward.

A user cannot normally remove or change their own Team Members row. If the existing administrator cannot access the organization, the invitation or role selector fails, or the change could leave the organization without an administrator, contact support.

Removing the previous user does not delete the organization, but API keys owned by that removed account can stop working. Rotate or replace those keys before removal when necessary.

---

# Platform project settings (/kb/guide/dashboard-project-settings-navigation)

## Project settings control one project [#project-settings-control-one-project]

Open **Platform → Settings** for the selected project. The current project
settings pages are **General**, **API Keys**, **Webhooks**, **White Labeling**,
and **Usage**.

* **API Keys** creates or revokes project keys and manages any key-level IP
allowlist. Copy a newly created secret into the customer's secret manager;
never ask for it in support.
* **Webhooks** manages the project webhook endpoint and signing secret.
* **White Labeling** controls the hosted authentication screen. Provider OAuth
consent-screen branding still requires the customer's own provider app.
* **Usage** shows project-level usage rather than organization-wide usage.

## Organization settings control the organization [#organization-settings-control-the-organization]

The organization settings pages are **General**, **Members**, **Billing**,
**Usage**, and **Account Settings**. Use them for organization identity,
membership, plan and usage information, account security, and organization
deletion. Confirm whether the customer intends to change one project or the
whole organization before directing them to a destructive control.

---

# Debug Platform tools, triggers, users, and sessions (/kb/guide/dashboard-tool-trigger-logs-navigation)

## Use Logs for execution evidence [#use-logs-for-execution-evidence]

Open **Platform → Logs** and choose the tool or trigger log view. Filter by the
smallest known non-secret identifier, then open the row to inspect its status,
toolkit, action or trigger, version, user, connection, request/response or
provider error, timing, and correlation IDs.

Use a **Log ID** for a tool execution, a **Trigger ID** plus Log ID for a
trigger event, and a **Session ID** for session behavior. Never request API
keys, access or refresh tokens, provider client secrets, webhook secrets, or
passwords.

## Use Users and Sessions to explain retrieval and execution context [#use-users-and-sessions-to-explain-retrieval-and-execution-context]

Open **Users** to find a project user and its connected accounts, triggers,
sessions, and filtered logs. Open **Sessions** to inspect session toolkits,
connection behavior, and execution timeline. An active connection elsewhere in
the organization does not prove it was eligible for this session: project,
`user_id`, toolkit restrictions, auth-config selection, and explicit connected
account selection all affect resolution.

## Disable a trigger when the goal is to pause it [#disable-a-trigger-when-the-goal-is-to-pause-it]

Open **Triggers** to inspect status and related logs. Disable a trigger when it
should pause temporarily; delete it only when the subscription should be
removed. Before recreating a trigger, verify the selected project, user,
connected account, trigger type, and current provider event support.

---

# Current Support FAQs (/kb/guide/faqs)

## Request a toolkit, tool, trigger, or partnership [#request-a-toolkit-tool-trigger-or-partnership]

The same public request board covers all three request types:

* a new toolkit or integration;
* a missing tool or action in an existing toolkit;
* a missing trigger or event in an existing toolkit.

Submit any of these requests at [https://request.composio.dev/boards/tool-requests](https://request.composio.dev/boards/tool-requests). Include the provider or toolkit, the exact tool/action/API endpoint or trigger/event, and your use case. The request board is the source of truth for status; an ETA is not guaranteed.

If your company wants its own product added to Composio, apply with a company
work email and product details at [https://composio.dev/partnerships#apply](https://composio.dev/partnerships#apply). The
public partnership form asks for company, product, and proposed-journey context.

## Security, privacy, data-retention, and compliance information [#security-privacy-data-retention-and-compliance-information]

Use [https://trust.composio.dev/](https://trust.composio.dev/) for general security, privacy, data-retention, audit, and compliance information. If the Trust Center does not answer your question, contact Composio support. Use the documented Dashboard self-service path for ordinary organization deletion. Report potential vulnerabilities privately through the security-reporting channels below; direct legal requests, data-erasure requests beyond the self-service flow, and account-specific access questions to Composio support.

## Security reporting [#security-reporting]

If you believe you have found a potential security vulnerability in Composio,
please report it privately through the channels in our
[security policy](https://github.com/ComposioHQ/composio/security/policy). A
private GitHub Security Advisory is the preferred route, with
`security@composio.dev` available as an email alternative.

Include enough detail to help the team reproduce and assess the finding, but do
not include customer data, credentials, or other secrets.

## Google `access_not_configured` requires a Workspace for Education administrator [#google-access_not_configured-requires-a-workspace-for-education-administrator]

Google documents `400 access_not_configured` as a Workspace for Education app
access-policy error. The institution's Workspace administrator must configure
access for the app; changing Composio scopes or repeatedly reconnecting does not
resolve that policy decision.

If the organization allows users to request access, the user can submit the
request from Google's error page. An administrator with the required Security
settings privilege can review pending requests or configure the exact OAuth
client under **Security → Access and data control → API controls → Manage
App Access**. The administrator should use the access level and organizational
unit appropriate for the institution. Google says policy changes can take up to
24 hours, though they usually apply sooner.

Do not generalize this code to every Google Workspace account. Distinguish it
from `admin_policy_enforced`, `access_denied`, and unverified-app errors before
giving instructions.

---

# Hermes MCP (/kb/guide/mcp-mcp-hermes)

Use these checks to troubleshoot Composio MCP connection failures in Hermes / Nous Hermes Agent.

## Production MCP API paths and direct transport tests [#production-mcp-api-paths-and-direct-transport-tests]

Use HTTPS and the full production API path:

```text
https://backend.composio.dev/api/v3.1/mcp/servers
https://backend.composio.dev/api/v3.1/mcp/<mcp_server_id>
```

Pass the Project API key in `x-api-key`. Avoid an HTTP URL, staging hosts, or a trailing slash on `/servers`, which can produce redirects. For a no-auth server, still pass `auth_config_ids: []` explicitly with `no_auth_apps`.

When testing the returned MCP transport directly, include the Project API key, either `user_id` or `connected_account_id`, and `Accept: application/json, text/event-stream`. A redirect from the returned URL to the current Streamable HTTP endpoint is expected when the client follows it.

## Auth configs are project-scoped [#auth-configs-are-project-scoped]

A hosted For You/consumer MCP session cannot reuse a custom auth config created in a separate Platform developer project. The session resolves configs only in its own project.

For a customer-created Platform Tool Router session, bind a same-project config with its real `ac_*` ID. A display name is not the auth-config ID, and cross-project binding is unsupported.

---

# Tool Router Files (/kb/guide/mcp-tool-router-files)

## Session paths are not `FileUploadable` storage keys [#session-paths-are-not-fileuploadable-storage-keys]

Tool Router session files and toolkit `FileUploadable` inputs are different abstractions. Do not pass `/workspace/output/...`, `/mnt/files/...`, a local machine path, or an old/foreign `file_...` handle directly as `s3key`.

When workbench/meta tools are available:

* For a file already under `/mnt/files`, use `get_mount_file_s3_key("file.ext")`.
* For another sandbox path, use `upload_local_file("/path/to/file.ext")`.
* Pass the returned key to the toolkit action as `{ "name": "file.ext", "mimetype": "...", "s3key": "<returned key>" }`.

In SDK/API flows, upload or stage the file first and pass the fresh returned file object.

If an action reports `Failed to download file with s3key ... storage returned HTTP 404`, it failed while resolving the Composio-staged file, before the provider received it. Re-stage the file and retry with the fresh object.

---

# Tool Router Sessions (/kb/guide/mcp-tool-router-sessions)

## Create Tool Router sessions through the SDK or API [#create-tool-router-sessions-through-the-sdk-or-api]

There is no normal dashboard toggle required to enable Tool Router. Create a session through the SDK or the REST API.

* [Quickstart](https://docs.composio.dev/docs/quickstart)
* [Configuring sessions](https://docs.composio.dev/docs/configuring-sessions)
* [Create a Tool Router session API](https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSession)

If you receive an actual 403 or an error saying Tool Router is not enabled for the account, do not keep repeating the setup steps. Contact Composio support for account-level checking and include the exact error body plus the request or code snippet.

## Session lifetime and deletion [#session-lifetime-and-deletion]

Tool Router sessions are long-lived records and do not currently have a time-based expiration. This is separate from temporary workbench files, live sandbox retention, and short response-cache lifetimes.

Reuse an existing TypeScript session with `composio.use(sessionId)`. Delete a session either from the instance or by ID:

```text
await session.delete();
await composio.sessions.delete(sessionId);
```

Deletion takes effect immediately. A deleted, missing, or inaccessible session returns 404 when retrieved; deleting a session does not delete its users, auth configs, or connected accounts.

## Select among multiple accounts with an alias or account ID [#select-among-multiple-accounts-with-an-alias-or-account-id]

When a toolkit has multiple connected accounts, assign clear aliases such as `work`, `personal`, or `primary`, then pass the alias as the execution `account`. Without an alias, use the generated account ID returned by connection discovery.

Do not rely on fuzzy phrases such as “office email” unless a matching alias exists. If explicit account selection is disabled and no `account` is supplied, the session can fall back to its first/default account.

## The session user must match the connected-account user [#the-session-user-must-match-the-connected-account-user]

An account can be active in the dashboard but unavailable to Tool Router when the session uses a different `user_id`. Private accounts resolve for their owning user; explicitly shared or pinned accounts follow the session configuration.

Create the session and connection with the same stable user ID. If a particular account must be used, pass its allowed connected-account override in the session configuration.

## Connected-account selection is live unless pinned [#connected-account-selection-is-live-unless-pinned]

When `connectedAccounts` is omitted, Tool Router resolves currently active accounts for the session user at execution time, including accounts connected after session creation. When `connectedAccounts` is supplied, it is an exact toolkit override and Tool Router does not fall back to another active account for that toolkit.

Adding another account later does not change an explicit pin. Update or recreate the session when the pinned account should change; omit the override when you want live account discovery.

## Toolkit allowlists are enforced before connection lookup [#toolkit-allowlists-are-enforced-before-connection-lookup]

When a session has a non-empty `toolkits.enabled` list, every other toolkit is blocked. A `toolkits.disabled` list does the inverse: listed toolkits are blocked while the rest remain eligible. This restriction is checked before auth configs and connected accounts.

If Tool Router reports `[Session Restriction] Toolkit '<name>' is not allowed`, update or recreate the session's toolkit configuration first. Only then debug whether that toolkit has an auth config and connection.

## A fresh task context is a new session runtime, not model memory [#a-fresh-task-context-is-a-new-session-runtime-not-model-memory]

Every `create()` call returns a new session ID. A session scopes the user,
toolkit and tool access, auth and account selection, and session runtime
resources such as sandbox files. It is not the model's conversation memory.

Reuse a stored session with `composio.use(sessionId)` when a conversation or
workflow should retain the same session configuration and runtime context.
Create a new session for a different user or materially different setup. A new
session for the same user can still resolve that user's eligible connected
accounts, but it does not inherit the old session's sandbox state.

## Auth links create project- and user-scoped connected accounts [#auth-links-create-project--and-user-scoped-connected-accounts]

`session.authorize()` and `COMPOSIO_MANAGE_CONNECTIONS` create a Connect Link
for the session user and selected auth config. After authentication, the
connected account belongs to that project/user rather than only to the session
that produced the link. Later unpinned sessions for the same stable user can
resolve it; an explicit connected-account pin remains unchanged until the
session is updated or recreated.

## Toolkit filters do not preload every matching tool [#toolkit-filters-do-not-preload-every-matching-tool]

By default, a session exposes meta tools that discover and load app tools at
runtime. Enabling a toolkit limits what the session can discover and execute;
it does not put every tool from that toolkit into the initial schema set.

Use an explicit `preload.tools` list when the agent must receive known tools
directly. Use the direct-tools preset or `preload.tools = "all"` only with a
narrow positive filter; broad preload sets are capped and increase agent
context.

## SDK custom tools and Custom MCP toolkits have different runtimes [#sdk-custom-tools-and-custom-mcp-toolkits-have-different-runtimes]

An SDK-defined custom tool runs inside the customer's application process. Its
function body is not uploaded into Composio and is not automatically callable
from a remote session MCP URL or Remote Workbench.

To expose customer-owned functionality remotely, host it as an MCP server and
register it as a Custom MCP toolkit. The resulting remote tools remain subject
to the session's toolkit and connection restrictions.

## Enhanced Control requires client support for MCP elicitation [#enhanced-control-requires-client-support-for-mcp-elicitation]

For You's Enhanced Control approval flow relies on MCP elicitation. It works
only with clients that advertise and implement that capability. If a client
does not support elicitation, use a supported client, set an applicable
**Always Allow** policy, or disable Enhanced Control under **For You → Settings
→ General** and reconnect the client.

## Pin the intended auth config when a toolkit has multiple auth schemes [#pin-the-intended-auth-config-when-a-toolkit-has-multiple-auth-schemes]

Tool Router first uses the auth config explicitly mapped in the session. When
the toolkit supports multiple schemes, map the intended `ac_...` ID rather than
depending on automatic selection. The selected config must belong to the same
project and be enabled for Tool Router. An explicit connected-account override
is an exact toolkit selection and does not fall back to another active account.

---

# Compliance, Data Retention, and Model Training (/kb/guide/platform-compliance-data-handling)

## Canonical public sources [#canonical-public-sources]

* The [security overview](https://docs.composio.dev/docs/security/overview) describes Composio's security controls, including organization and project isolation, encryption for credentials and keys, TLS in transit, token redaction, and webhook signing.
* The [data-retention documentation](https://docs.composio.dev/docs/security/data-retention) explains tool-call log retention, per-project log-storage controls, returned-file URL lifetime, and where data flows during execution.
* The [Composio Trust Center](https://trust.composio.dev) provides current compliance reports and sub-processor information.

## Zero data retention and no-training requirements [#zero-data-retention-and-no-training-requirements]

Standard plans do not guarantee end-to-end zero data retention or zero training. The per-project **Don't store data** setting reduces what Composio stores, but it does not govern data retained or processed by third-party providers.

Customers who require contractual zero-data-retention, no-training, DPA, or security-review terms should use the Enterprise track so the requirements can be scoped explicitly.

## Model training [#model-training]

Do not infer a blanket no-training guarantee. Features that use third-party providers are also governed by those providers' terms. For an end-to-end contractual no-training requirement, use the Enterprise track.

## FedRAMP [#fedramp]

Composio is not FedRAMP authorized.

## Third-party providers [#third-party-providers]

Some toolkit executions and browser automation rely on third-party providers or sub-processors. Data can flow to those providers during execution, and their data and training terms can differ. Use the Trust Center and data-retention documentation for current public details.

---

# Connected Accounts (/kb/guide/platform-connected-accounts)

Use this for Composio connected-account status, refresh, and identity debugging.

## Prefer a new auth link session when a user must reconnect [#prefer-a-new-auth-link-session-when-a-user-must-reconnect]

Create a new auth link session when a user must authenticate again. Redirect the user to the returned hosted link and wait for the resulting connected account to become active. The older `POST /connected_accounts/{nanoid}/refresh` re-initiation endpoint is deprecated; it did not perform Composio's internal background token refresh.

If the user completes that auth flow successfully, the connected account can return to `ACTIVE`.

Example response:

```text
This starts a new authentication flow. For OAuth connections, the user must open the hosted link and complete provider consent. Once the OAuth flow succeeds, use the newly active connected account.
```

## Same user ID does not prove same upstream account [#same-user-id-does-not-prove-same-upstream-account]

Do not assume multiple connected accounts under the same `clientUniqueUserId` are duplicates of the same upstream account. A single Composio user ID can legitimately connect personal, work, and business accounts.

If the root-cause hypothesis depends on repeated reconnects to the same upstream Google/Microsoft/etc. account, verify the upstream identity first. Use a safe profile/current-user action for each connected account, customer-provided labels, or another non-sensitive identity signal.

## Hosted connect links expire after 10 minutes [#hosted-connect-links-expire-after-10-minutes]

A hosted connect link/session is short-lived. If the initial authentication flow is not completed within 10 minutes, the link can show wording such as “We couldn't verify the session associated with the link” or “Validation error while processing request.” The dashboard may briefly continue to show the connection as initializing.

Generate a fresh connect link for the same user and open it immediately. If the new link also fails immediately, contact Composio support with its generation timestamp and the exact error. Do not keep retrying an older link.

## Connection status describes a lifecycle, not credential validity [#connection-status-describes-a-lifecycle-not-credential-validity]

* `INITIALIZING`: the connection row and hosted flow were created.
* `INITIATED`: the user opened or advanced the authentication flow.
* `ACTIVE`: the connection flow completed and its credential data was stored.
* `EXPIRED`: the flow timed out or the connection can no longer refresh/use its authorization. Read `statusReason` to distinguish those cases.

`Connection initiation did not complete within 10 minutes` means the original flow timed out; it is not a background token-refresh failure. Generate a fresh link and wait for `ACTIVE` before treating its connected-account ID as usable.

## OAuth refresh failures have multiple causes [#oauth-refresh-failures-have-multiple-causes]

An OAuth connection may expire when the provider rejects its refresh token, the user or admin revokes the app, provider security policy invalidates the grant, a rotating-token chain is interrupted, or customer-owned OAuth credentials change. Reconnecting obtains a new grant. If connections repeatedly expire across users, contact Composio support with redacted connection IDs and timestamps instead of repeatedly reconnecting.

## Provider tokens are redacted from connected-account responses [#provider-tokens-are-redacted-from-connected-account-responses]

Connected-account APIs do not return raw access or refresh tokens. Use Composio
tool execution or [Proxy Execute](https://docs.composio.dev/docs/proxy-execute)
when a workflow needs to call a provider API through an existing connection. Do
not build a workflow that depends on reading provider tokens from connected-
account data.

## Revoke provider credentials before removing a connection when required [#revoke-provider-credentials-before-removing-a-connection-when-required]

Use the connected-account revoke operation when the toolkit supports
programmatic provider revocation. When provider-side revocation is unavailable,
remove Composio's access in the provider's connected-app settings or rotate the
API key in the provider dashboard. Never send access tokens, refresh tokens, API
keys, or private-key material to Composio support.

---

# Custom Connection Data Field Names (/kb/guide/platform-custom-connection-data-fields)

Use this when a customer creates a custom/API-key style connected account and tool execution fails with `No authentication provided`, 401/403 provider errors, or a provider-specific auth error even though the credential itself works directly against the upstream API.

## Field names are toolkit-specific [#field-names-are-toolkit-specific]

Do not assume every API-key or bearer-token toolkit accepts `custom_connection_data.val.api_key`. The required field name is toolkit-specific. For example, this shape is incorrect for Crowdin:

```json
{
  "val": {
    "api_key": "<token>"
  }
}
```

Crowdin expected:

```json
{
  "val": {
    "bearer_token": "<token>"
  }
}
```

To verify the required field names, inspect toolkit metadata:

```bash
curl --location 'https://backend.composio.dev/api/v3.1/toolkits/<toolkit_slug>' \
  --header 'x-api-key: '
```

Look under:

```text
auth_config_details[].fields.connected_account_initiation.required
```

If the mismatch continues, share a request ID or log ID with Composio support. If no request ID is available, share how `custom_connection_data` is being constructed, with secrets removed.

Example response:

```text
Could you share the `custom_connection_data` shape you're sending, with the secret value removed?

The field name is toolkit-specific. For example, some toolkits expect `bearer_token` rather than `api_key`. We can verify the required field from the toolkit metadata and make sure the credential is landing in the right field.
```

---

# File Download Storage and Expiry (/kb/guide/platform-file-storage)

## Composio file URLs are short-lived staged downloads [#composio-file-urls-are-short-lived-staged-downloads]

When a hosted tool returns a file URL such as `data.file.s3url`, Composio normally stages the bytes in Composio-managed object storage and returns a signed download URL rather than the provider's original URL.

The default signed-URL lifetime is one hour and can be configured for a project through its File TTL setting. Staged files are cleaned up after 24 hours. URL expiry and file cleanup are separate: rerun the tool or download the file again to obtain a fresh URL.

There is no single customer-facing maximum that applies to every tool. Provider limits, the action implementation, runtime memory, and timeouts can impose lower limits, so check the exact action before quoting a hard cap.

---

# Google OAuth setup and consent (/kb/guide/platform-google-oauth)

## An unapproved Google OAuth scope can block consent [#an-unapproved-google-oauth-scope-can-block-consent]

Google can block sign-in when an OAuth app requests a sensitive or restricted
scope that is not approved for that app. Use the scopes already available on
the selected Composio auth config, or create a customer-owned Google OAuth app
and complete Google's required verification before requesting additional
scopes. After changing scopes, create a fresh connection so the user grants the
new scope set.

Google's current verification requirements are documented in its
[OAuth 2.0 policies](https://developers.google.com/identity/protocols/oauth2/policies)
and [sensitive-scope verification guide](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification).

## A customer-owned OAuth app controls the provider consent-screen brand [#a-customer-owned-oauth-app-controls-the-provider-consent-screen-brand]

Use a customer-owned Google OAuth app when the Google consent screen should
show the customer's app name and branding. To avoid showing a Composio domain
in the redirect path as well, route the callback through the customer's domain
as described in [white-labeling authentication](https://docs.composio.dev/docs/white-labeling-authentication#routing-the-callback-through-your-domain).

The OAuth app's authorized redirect URI must still match the callback URI
shown by Composio. Provider consent-screen branding and the URL to which the
customer's application sends a user after authentication are separate settings.

---

# Platform Health Endpoints (/kb/guide/platform-health-endpoints)

Use this only for Composio on-prem / self-hosted customers who ask whether they can monitor their Composio instance in real time. These endpoints are not general public-cloud customer endpoints.

Requests must include the Composio admin token header:

```http
x-composio-admin-token:
```

## Apollo [#apollo]

Basic liveness:

```bash
curl -i "$COMPOSIO_BASE_URL/api/healthz" \
  -H "x-composio-admin-token: $COMPOSIO_ADMIN_TOKEN"
```

Success:

```json
{
  "status": "ok"
}
```

This only confirms that Apollo can serve the request. It does not check downstream dependencies.

Deep dependency health:

```bash
curl -sS "$COMPOSIO_BASE_URL/api/deep_healthz" \
  -H "x-composio-admin-token: $COMPOSIO_ADMIN_TOKEN" | jq
```

Example:

Apollo deep health checks:

* `postgres`: `SELECT 1` through Prisma.

* `redis`: Redis `PING`.

* `thermos`: generated Thermos client `getHealthcheck()`, which calls Thermos `GET /api`.

* active object storage backend: response key is either `s3` or `azure_blob_storage`; Apollo writes a zero-byte probe object and deletes it best-effort.

Important: Apollo deep health returns HTTP `200` for GET requests even when one or more dependencies are unreachable. Monitors should inspect `data.<service>.reachable`, not just HTTP status.

## Thermos [#thermos]

Basic liveness:

```bash
curl -i "$THERMOS_BASE_URL/api" \
  -H "x-composio-admin-token: $COMPOSIO_ADMIN_TOKEN"
```

Example:

```json
{
  "status": "ok",
  "time": "2026-06-19T05:37:25Z"
}
```

Deep dependency health:

```bash
curl -sS "$THERMOS_BASE_URL/api/health/deep" \
  -H "x-composio-admin-token: $COMPOSIO_ADMIN_TOKEN" | jq
```

Example:

Required services are `database`, `toolkit_registry_database`, and `temporal`.

Thermos status behavior:

* `healthy`: required services are not in `error`.

* `unhealthy`: required service `database`, `toolkit_registry_database`, or `temporal` is in `error`.

Thermos returns HTTP `503` only when overall status is `unhealthy`; otherwise it returns HTTP `200`.

---

# Microsoft OAuth scopes and tenant consent (/kb/guide/platform-microsoft-oauth)

## Request `offline_access` when a delegated connection needs refresh tokens [#request-offline_access-when-a-delegated-connection-needs-refresh-tokens]

Microsoft's v2 OAuth endpoint requires an explicit `offline_access` request to
return refresh tokens. Composio's standard Microsoft delegated OAuth scope sets
include it. For a customer-owned Microsoft app, include `offline_access` in the
app and Composio auth-config scopes before creating a new connection.

Microsoft documents this behavior in
[Scopes and permissions in the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc#the-offline_access-scope).

## Some Microsoft tenant policies and permissions require administrator consent [#some-microsoft-tenant-policies-and-permissions-require-administrator-consent]

A work or school account can show **Needs Admin Approval** or **Admin approval
required** when the tenant prevents users from approving the app or when the
requested permission is administrator-restricted. A tenant administrator must
approve the selected Composio-managed app or the customer's own app and its
requested permissions. The affected user should then start a fresh connection.

Adding a permission to an Entra app registration does not itself grant tenant
consent. Microsoft explains the distinction in its
[permissions and consent overview](https://learn.microsoft.com/en-us/entra/identity-platform/permissions-consent-overview).

This guidance applies across Microsoft toolkits that use delegated Microsoft
OAuth, including Outlook, Microsoft Teams, OneDrive, OneNote, Excel, Power BI,
and Dynamics 365. SharePoint REST and app-only/S2S flows may
also require resource-specific permissions and administrator consent.

---

# Platform Pagination (/kb/guide/platform-pagination)

## Pagination limits are endpoint-specific [#pagination-limits-are-endpoint-specific]

Composio does not have one global page-size limit. Resource lists, catalogs, Tool Router, logs, and billing endpoints can define different limits, while toolkit actions also inherit provider-specific rules. Check the exact endpoint schema and live behavior before quoting a maximum.

## Auth-config list pages return at most 50 items [#auth-config-list-pages-return-at-most-50-items]

`GET /api/v3/auth_configs` and `GET /api/v3.1/auth_configs` currently return at most 50 auth configs per page. Read `next_cursor` from each response and pass it as `cursor` until it is empty.

Some generated descriptions may advertise a larger limit; the deployed endpoint still clamps the page to 50. Treat that documentation/runtime mismatch as a product issue, not as a reason to skip cursor pagination.

---

# Move a Composio Integration from Prototype to Production (/kb/guide/platform-production-readiness)

## Replace example user IDs with stable application user IDs [#replace-example-user-ids-with-stable-application-user-ids]

Create sessions and connected accounts with a stable identifier from the
application database, such as a UUID or primary key. Do not use an email
address that can change, and never use `default` in production. Composio uses
the user ID to isolate connections and tool calls, so each application user
must resolve to the same Composio user ID across sessions.

* [Authentication and user IDs](https://docs.composio.dev/docs/authentication)
* [How Composio sessions work](https://docs.composio.dev/docs/how-composio-works)

## Isolate environments with separate Composio projects when needed [#isolate-environments-with-separate-composio-projects-when-needed]

A Composio project scopes its API keys, connected accounts, auth configs, and
webhooks. Use separate projects for development, staging, and production when
those resources must not overlap. Use the API key for the intended project in
each deployment, and create environment-specific auth configs when the OAuth
apps, scopes, or provider credentials differ.

* [Composio glossary: Project](https://docs.composio.dev/reference/glossary#project)
* [Configure authentication](https://docs.composio.dev/docs/tools-direct/authenticating-tools)

## Switch from managed auth only when production requirements call for it [#switch-from-managed-auth-only-when-production-requirements-call-for-it]

Composio managed auth is suitable for development, internal tools, and early
prototypes. Create a custom auth config when users must see the application's
own OAuth brand, the integration needs custom scopes or a dedicated provider
quota, polling requirements differ, or the provider uses a custom instance.
Pass the resulting auth config ID to the session; creating the config alone
does not make the session use it.

* [Managed vs custom auth](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app)
* [Controlling OAuth scopes](https://docs.composio.dev/docs/authentication/controlling-scopes)

## Restrict the production session to the capabilities the agent needs [#restrict-the-production-session-to-the-capabilities-the-agent-needs]

Set toolkit, tool, and behavior-tag filters when creating the session. For a
sensitive or deterministic workflow, prefer an explicit allowlist of exact
tool slugs. For a broader read-only agent, filter on `readOnlyHint` and disable
`destructiveHint`, then inspect the resulting tool set before rollout.

* [Configure session tool access](https://docs.composio.dev/docs/configuring-sessions)
* [Create read-only and restricted sessions](/kb/guide/platform-session-tool-policies)

## Reuse a stored session until the user or configuration changes [#reuse-a-stored-session-until-the-user-or-configuration-changes]

Store the session ID and restore it with `composio.use(session_id)` instead of
creating a new session for every turn. Create a new session for a different
user or a materially different setup, such as a new tool policy or auth-config
mapping. A session preserves its scoped runtime state, but it is not the
language model's conversation memory.

* [Reuse a session](https://docs.composio.dev/docs/how-composio-works#how-sessions-behave)

## Test production trigger handling through the real webhook path [#test-production-trigger-handling-through-the-real-webhook-path]

The local `subscribe()` stream is useful for inspecting events, but it bypasses
the production webhook handler and signature verification. Before rollout,
forward events to the real local handler or use a tunnel, verify the signed
payload with `parse()`, and then register the production HTTPS webhook URL for
the production project.

* [Receive trigger events locally and in production](https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events)

---

# Project API Key Permissions (/kb/guide/platform-project-api-key-permissions)

## Proxy Execute requires an explicitly allowed Project API key [#proxy-execute-requires-an-explicitly-allowed-project-api-key]

Create a scoped Project API key in the Dashboard and enable **Proxy Execute**
during key creation before calling the v3.1 Proxy Execute API. If a request is
denied, verify the key's scope before debugging the provider connection. Use a
fresh request ID from the correctly scoped key when contacting Composio support is still necessary.

## Tool Router session creation requires Sessions write access [#tool-router-session-creation-requires-sessions-write-access]

For scoped Project API keys, creating a session through `composio.sessions.create(...)` or `POST /api/v3.1/tool_router/session` requires the Sessions permission with write or read/write access.

A key can successfully call `GET /api/v3.1/toolkits` with Toolkits read access and still be unable to create a session. The SDK can surface a scoped-permission denial as a generic 401 `Invalid API key`.

Create a new Project API key with Sessions set to Read and write, or use an appropriate full-access Project API key, then retry session creation.

## Tool execution requires Tool execution write access [#tool-execution-requires-tool-execution-write-access]

For a scoped Project API key, `composio.tools.execute()` and the tool-execute API require Tool execution set to Write or Read and write. A key without that permission can surface a generic 401 `Invalid API key` even when the key exists and is active.

Create a correctly scoped Project API key or use an appropriate full-access Project API key, then retry. The current API may return a generic permission error, so diagnose this behavior from the key's permissions.

---

# Platform API Rate Limits (/kb/guide/platform-rate-limits)

## Organization API limits and 429 handling [#organization-api-limits-and-429-handling]

Composio applies a shared API budget per organization across authenticated endpoints. Current published limits are Starter and Hobby: 2,000 requests per minute; Growth: 10,000 per minute; Enterprise: custom. Check the [current rate-limit documentation](https://docs.composio.dev/reference/rate-limits) before quoting a plan limit, and do not describe Enterprise as unlimited.

Rate-limit responses include remaining/window information, and a 429 includes `Retry-After`. Honor `Retry-After` before retrying. Provider quotas such as Google API limits are separate and can throttle a tool even when the Composio organization has capacity.

If an upgraded organization still sees its old 2,000-per-minute ceiling, share the error time and response rate-limit headers with support.

---

# Support Routing (/kb/guide/platform-routing)

Use these routes when a request is not primarily a support or debugging issue.

## Hiring [#hiring]

Direct hiring inquiries to Composio's public careers channel.

## DPA, enterprise data handling, and compliance [#dpa-enterprise-data-handling-and-compliance]

Contractual data-handling requirements such as zero data retention, no-training terms, a DPA, or a security review belong in the Composio Enterprise track. See [Compliance, Data Retention, and Model Training](/kb/guide/platform-compliance-data-handling) for the approved public guidance.

## Tool or toolkit feature requests [#tool-or-toolkit-feature-requests]

Submit requests through the [Composio request board](https://request.composio.dev).

---

# Self-hosted Helm (/kb/guide/platform-self-hosted-helm)

Use these checks to troubleshoot Composio self-hosted or on-prem Helm deployments.

## Apollo S3 with IRSA / ServiceAccount credentials needs no static S3 secret keys [#apollo-s3-with-irsa--serviceaccount-credentials-needs-no-static-s3-secret-keys]

For IRSA / ServiceAccount-based S3 access, `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` should not be populated in the Apollo container. These secret keys are optional. If the keys are removed from `composio-composio-secrets`, Apollo can fall back to the configured pod ServiceAccount / AWS SDK credential chain.

Do not set placeholder S3 credential values for IRSA deployments. Values such as `dummy-value` or a literal string `null` are treated as credentials and can make S3 pre-signed URLs fail with provider errors such as:

```text
InvalidAccessKeyId: The AWS Access Key Id you provided does not exist in our records.
InvalidToken: The provided token is malformed or otherwise invalid.
```

For AWS IRSA, configure the Apollo ServiceAccount annotation and object storage backend, then leave static S3 credential secret keys absent:

```yaml
apollo:
  serviceAccount:
    enabled: true
    name: "composio-apollo"
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam:::role/"
  objectStorage:
    backend: "s3"
```

Debug checks:

```bash
kubectl exec -n composio deploy/composio-apollo -- env | grep -E "^S3_|^AWS_"
kubectl logs -n composio deploy/composio-apollo --tail=200
```

If using pod/container credentials, the Helm storage doc says the Kubernetes secret credential section can be skipped. Verify that `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are not present with dummy/static values in Apollo's runtime environment.

Example response:

```text
This looks like Apollo is still receiving static S3 credential env vars, so the AWS SDK is using those instead of falling back to the ServiceAccount/IRSA credentials.

For IRSA, `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` should be absent from the Apollo container. Those secrets are optional; if you remove those keys from `composio-composio-secrets`, Apollo should use the configured ServiceAccount. Placeholder values like `dummy-value` or literal `null` are treated as real credentials and can cause S3 signing errors such as `InvalidAccessKeyId` or `InvalidToken`.

The immediate fix is to remove `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` from `composio-composio-secrets`, then confirm the Apollo pod environment no longer includes those values.
```

## Disable social login explicitly for self-hosted deployments [#disable-social-login-explicitly-for-self-hosted-deployments]

`NEXT_PUBLIC_DISABLE_SOCIAL_LOGIN` controls whether social login buttons such as Google/GitHub appear on the frontend login page. For self-hosted customers that should hide social login, set the Helm values override as a string:

```yaml
apollo:
  nextPublicDisableSocialLogin: "true"
```

This makes the generated Apollo ConfigMap render an explicit value instead of an empty/null value and should remove repeated ArgoCD diffs immediately.

Customers can apply the override directly to unblock the deployment.

Example response:

````text
`NEXT_PUBLIC_DISABLE_SOCIAL_LOGIN` controls whether the Google/GitHub social login buttons show up on the frontend login page. For your setup, I'd set it explicitly to `"true"` in the Helm values override:

```yaml
apollo:
nextPublicDisableSocialLogin: "true"
```
This should make the generated Apollo ConfigMap render the explicit value and stop ArgoCD from diffing null vs empty string immediately.

The override above can be applied directly; no release-specific promise is required.
````

---

# Create Read-Only and Restricted Composio Sessions (/kb/guide/platform-session-tool-policies)

## Filter a broad read-only session with behavior tags [#filter-a-broad-read-only-session-with-behavior-tags]

Use session-level behavior tags when the agent may discover tools across
multiple toolkits but should only receive tools marked as read-only. The same
filters are enforced when the session executes tools.

**Python**

```python
session = composio.sessions.create(
    user_id="user_123",
    tags={
        "enable": ["readOnlyHint"],
        "disable": ["destructiveHint"],
    },
)
```

**TypeScript**

```text
const session = await composio.create("user_123", {
  tags: {
    enable: ["readOnlyHint"],
    disable: ["destructiveHint"],
  },
});
```

Behavior tags describe tool behavior. Inspect the tools the session exposes
before rollout, especially when a workflow handles sensitive data.

* [Filter tools by tags](https://docs.composio.dev/docs/configuring-sessions#filtering-tools-by-tags)

## Use exact tool allowlists for the narrowest policy [#use-exact-tool-allowlists-for-the-narrowest-policy]

For a workflow with a known set of operations, allow only the exact tool slugs
it requires. An allowlist avoids admitting a newly added tool merely because it
shares a toolkit or behavior tag.

**Python**

```python
session = composio.sessions.create(
    user_id="user_123",
    tools={
        "gmail": {"enable": ["GMAIL_FETCH_EMAILS"]},
        "github": {"enable": ["GITHUB_GET_AN_ISSUE"]},
    },
)
```

**TypeScript**

```text
const session = await composio.create("user_123", {
  tools: {
    gmail: { enable: ["GMAIL_FETCH_EMAILS"] },
    github: { enable: ["GITHUB_GET_AN_ISSUE"] },
  },
});
```

* [Enable and disable specific tools](https://docs.composio.dev/docs/configuring-sessions#enabling-or-disabling-specific-tools)

## Combine provider scopes with session tool restrictions [#combine-provider-scopes-with-session-tool-restrictions]

OAuth scopes control what the provider grants to a connected account. Session
filters control which Composio tools the agent can discover and execute. Use
both layers for least privilege: request only the provider scopes the use case
needs, then restrict the session to the intended tools.

Changing an auth config's scopes affects new connections only. Existing users
keep their prior grants until they reconnect. Pass the intended auth config ID
to the session, keyed by toolkit, or the session will not request those scopes.

* [Control OAuth scopes](https://docs.composio.dev/docs/authentication/controlling-scopes)
* [Select an auth config in a session](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app#create-a-custom-auth-config)

## Apply toolkit-specific exceptions without widening every toolkit [#apply-toolkit-specific-exceptions-without-widening-every-toolkit]

Set a global tag policy and override it only for a named toolkit. This is safer
than relaxing the global policy for the entire session.

**Python**

```python
session = composio.sessions.create(
    user_id="user_123",
    tags=["readOnlyHint"],
    tools={
        "github": {"tags": {"disable": ["destructiveHint"]}},
        "gmail": {"tags": ["readOnlyHint"]},
    },
)
```

**TypeScript**

```text
const session = await composio.create("user_123", {
  tags: ["readOnlyHint"],
  tools: {
    github: { tags: { disable: ["destructiveHint"] } },
    gmail: { tags: ["readOnlyHint"] },
  },
});
```

* [Toolkit-specific tag filters](https://docs.composio.dev/docs/configuring-sessions#filtering-tools-by-tags)

## Disable the session sandbox when the workflow does not need code execution [#disable-the-session-sandbox-when-the-workflow-does-not-need-code-execution]

Session tool filters govern app tools. Sessions also include remote sandbox
tools by default. Disable the sandbox for a tightly constrained workflow that
does not need Python, shell, file processing, or remote workbench execution.

**Python**

```python
session = composio.sessions.create(
    user_id="user_123",
    tags=["readOnlyHint"],
    sandbox={"enable": False},
)
```

**TypeScript**

```text
const session = await composio.create("user_123", {
  tags: ["readOnlyHint"],
  sandbox: { enable: false },
});
```

* [Disable the session sandbox](https://docs.composio.dev/docs/configuring-sessions#disabling-the-sandbox)

---

# Tool Router Workbench Retention (/kb/guide/platform-tool-router-workbench)

Use this when customers ask whether Tool Router workbench state persists forever, or whether personal data used in the remote workbench is retained indefinitely.

## A “fresh” client label can still reuse the same sandbox [#a-fresh-client-label-can-still-reuse-the-same-sandbox]

Workbench and sandbox reuse follows the actual Tool Router session, not an arbitrary client-side session label. Reusing the same `trs_*` session or MCP URL can reuse the same cached workbench and sandbox.

Create a new Tool Router session and use its newly returned MCP URL when a
workflow requires an independent sandbox rather than reused session state.

---

# Triggers (/kb/guide/platform-triggers)

## Find every toolkit that currently supports triggers [#find-every-toolkit-that-currently-supports-triggers]

Do not rely on a dashboard count as the complete trigger catalog because availability changes and list views can be partial.

* Call `GET /api/v3.1/triggers_types` to list trigger types and their parent toolkits. Use `toolkit_slugs` to narrow the result when needed.
* Or call `GET /api/v3.1/toolkits` and select toolkits whose `triggers_count` is greater than zero.
* Follow pagination through every result page before calculating a total or claiming the list is complete.
* Each trigger type declares its required configuration and may be webhook/event-driven or polling-based.

References: [trigger types API](https://docs.composio.dev/reference/api-reference/triggers/getTriggersTypes), [toolkits API](https://docs.composio.dev/reference/api-reference/toolkits/getToolkits), and [creating triggers](https://docs.composio.dev/docs/setting-up-triggers/creating-triggers).

## Trigger webhook delivery is at-least-once [#trigger-webhook-delivery-is-at-least-once]

A receiver can occasionally see the same trigger webhook more than once, including the same `log_id` or provider event/message ID, when an outbound delivery attempt is retried. This does not necessarily mean Composio ingested the provider event twice.

Webhook handlers should be idempotent and deduplicate on a stable identifier such as `log_id`, the provider message/event ID, or the webhook event ID. If duplicates continue beyond normal retry behavior, contact Composio support with the relevant IDs and receipt timestamps.

---

# Tool Execution Retries (/kb/guide/sdk-tool-execution-retries)

## Current SDKs do not automatically retry non-idempotent tool executions [#current-sdks-do-not-automatically-retry-non-idempotent-tool-executions]

Python SDK 0.16.0 and TypeScript SDK 0.14.0 changed tool execution and Proxy Execute so non-idempotent writes are not automatically retried after timeouts, rate limits, or server errors. Upgrade to at least those versions before diagnosing duplicate sends or writes as current SDK retry behavior.

An ambiguous client timeout still does not prove that the provider-side action failed. Before manually retrying a send, create, update, or delete action, inspect the execution log or provider state to determine whether the first attempt completed. If duplicates persist on a current SDK, collect the SDK version, execution log IDs, and timestamps for support.

Suggested guidance:

```text
Current Composio SDKs do not automatically retry non-idempotent tool executions. A timeout can still be ambiguous, so check the execution log or provider state before manually retrying an action that may have completed.
```

---

# TypeScript Tool Schema Definitions (/kb/guide/sdk-tool-schemas)

## Upgrade when `$ref` is present but root `$defs` is missing [#upgrade-when-ref-is-present-but-root-defs-is-missing]

Older `@composio/core` releases through 0.11.0 could preserve a nested `$ref` while stripping the root `$defs` or `definitions` block from raw tool schemas. Downstream schema parsers then see a dangling reference.

The shared fix shipped in `@composio/core` 0.12.0. Upgrade core to 0.12.0 or later and use a compatible provider-package version. That release line is ESM-only and requires Node.js 22.22.3 or later, so confirm runtime and provider compatibility before upgrading.

After upgrading, fetch the exact tool again and verify every internal `$ref` has a matching root definition.

---

# Ahrefs (/kb/guide/toolkits-ahrefs)

## Ahrefs actions must call api.ahrefs.com, not ahrefs.com [#ahrefs-actions-must-call-apiahrefscom-not-ahrefscom]

Ahrefs API calls should use the API host `https://api.ahrefs.com/v3`. If Ahrefs actions or connection checks are hitting `https://ahrefs.com/v3` and returning 404 HTML, treat it as a connector base-URL configuration problem rather than an API-key or request-payload issue. Confirm the failing request is using api.ahrefs.com; if it is not, contact Composio support with the redacted request or log ID for connector review.

---

# Airtable (/kb/guide/toolkits-airtable)

Use this guide to connect Airtable, discover and execute current tools, and configure metadata triggers.

## Connect and authenticate Airtable [#connect-and-authenticate-airtable]

**Connect Airtable to Claude through MCP.** Airtable can be connected to Claude through Composio MCP. Create or use an MCP server with Airtable tools selected, add the MCP server configuration to Claude, and complete the Airtable account connection from the MCP/connect flow.

**Use custom OAuth credentials for additional scopes.** For additional Airtable scopes, use your own Airtable OAuth developer app. Configure the required scopes in Airtable, enable/use custom OAuth credentials in Composio, and create a new integration/auth config with those credentials and scopes. If an existing integration was created before the scope change, create a new one and retry the connection.

**Restart connection flows that exceed ten minutes.** The expiry reason "Connection initiation did not complete within 10 minutes" means the user opened or initiated the connection but did not finish the authentication flow within ten minutes. It is a generic connected-account timeout across toolkits, not an Airtable-specific error. Start a fresh connection/initiation link and complete the OAuth flow within the allowed window.

## Discover and execute Airtable tools [#discover-and-execute-airtable-tools]

**Increase list limits and use a current toolkit version.** If Airtable tools appear missing, first increase the tools list limit or paginate
because the response may contain only the first page. Explicitly request the
latest toolkit version when a pinned version lacks a current action. Old names
such as `create_multiple_records` and `create_record` were deprecated in favor
of current uppercase slugs such as `AIRTABLE_CREATE_RECORDS`.

**Batch updates in groups of ten records.** `AIRTABLE_UPDATE_MULTIPLE_RECORDS` can update a maximum of 10 Airtable records at a time. For larger updates, split the records into batches of 10 and execute multiple calls while respecting Airtable's API rate limits.

## Configure Airtable metadata triggers [#configure-airtable-metadata-triggers]

**Choose an event from the current trigger catalog.** The current Airtable toolkit exposes triggers for base metadata changes, base schema changes, user profile changes, and view creation, deletion, or metadata changes. Fetch the current trigger catalog before implementation and use the exact returned slug. If the needed event is not in that catalog, submit that Airtable event through the Composio request portal.

---

# Apollo (/kb/guide/toolkits-apollo)

## Apollo 403s on search/enrichment endpoints can be key-permission or plan-access gated [#apollo-403s-on-searchenrichment-endpoints-can-be-key-permission-or-plan-access-gated]

For Apollo 403 errors on search/enrichment-style endpoints, first confirm whether your Apollo API key has the relevant endpoint enabled or has **Set as master key** turned on. Apollo documents People API Search as requiring a master API key, and Apollo API keys can be created with either individual endpoint access or master-key access. Apollo also gates advanced API access by plan, so a 403 can be Apollo-side endpoint permission, master-key, credit/API-access, or plan gating even when other Apollo tools work.

Checks to isolate the cause:

* Confirm the Composio credential field is `generic_api_key`.

* Run the exact upstream Apollo endpoint directly with the same key and compare the redacted status and response body.

* If `APOLLO_GET_AUTH_STATUS` or `APOLLO_VIEW_API_USAGE_STATS` succeeds but search/enrichment endpoints fail, do not say the key is definitely invalid. Phrase it as Apollo endpoint permission / master-key / plan-access gating.

* If you contact Composio support, include the failing Composio log ID, upstream endpoint, and whether the Apollo key was created with **Set as master key** or per-endpoint permissions.

## Apollo people enrichment and bulk enrichment can behave differently [#apollo-people-enrichment-and-bulk-enrichment-can-behave-differently]

Apollo's single people enrichment and bulk people enrichment APIs do not behave identically. `APOLLO_PEOPLE_ENRICHMENT` and `APOLLO_BULK_PEOPLE_ENRICHMENT` call different upstream Apollo endpoints, and the bulk endpoint may require more complete or different unique person details. If single enrichment works but bulk enrichment does not, compare against Apollo's official bulk people enrichment API behavior before treating it as a Composio response transformation issue. Composio does not intentionally modify the upstream Apollo response.

## Apollo search results may mirror Apollo's official API behavior [#apollo-search-results-may-mirror-apollos-official-api-behavior]

When Apollo search returns unexpected results, compare the Composio tool call with the equivalent Apollo official API request using the same query parameters and API key. If Apollo's official endpoint returns the same response, the behavior is upstream from Apollo rather than a Composio transformation. Use the direct Apollo API curl as the baseline for debugging search filters and response differences.

---

# Asana (/kb/guide/toolkits-asana)

## Use `ASANA_GET_STORIES_FOR_TASK` and pass the task ID as a string [#use-asana_get_stories_for_task-and-pass-the-task-id-as-a-string]

Asana represents task comments as stories. Use `ASANA_GET_STORIES_FOR_TASK` to retrieve the comments and activity for a task, and pass the task ID as a string rather than an integer. For custom toolkit-based tools, set the Asana base URL to `https://app.asana.com/api/1.0` and include the required Authorization header.

## Use the current Asana task triggers [#use-the-current-asana-task-triggers]

The current Asana toolkit exposes triggers for task creation, updates, comments, attachments, tags, and moves between sections. Fetch the trigger catalog before implementation and use the exact returned slug, such as `ASANA_TASK_COMMENT_ADDED` or `ASANA_TASK_UPDATED`.

---

# Attio (/kb/guide/toolkits-attio)

## Use $contains for partial text matching in ATTIO\_FIND\_RECORD filters [#use-contains-for-partial-text-matching-in-attio_find_record-filters]

For partial matching on text attributes in ATTIO\_FIND\_RECORD, structure the filter with the attribute slug mapped to a $contains condition, for example \{"name": \{"$contains": "John"}}. If you receive exact-match behavior instead, verify the specific attribute and filter shape, then try the contains-style filter first.

## Use custom tools when an Attio API object is not built into Composio yet [#use-custom-tools-when-an-attio-api-object-is-not-built-into-composio-yet]

If an Attio endpoint is not covered by the built-in toolkit, create a custom tool and request the missing tool through the Composio request portal. Custom tools can use Composio-managed auth, so you do not need to build the entire OAuth/token-storage layer yourself.

## Top-level $ parameter names were fixed for LLM provider compatibility in the latest schema version [#top-level--parameter-names-were-fixed-for-llm-provider-compatibility-in-the-latest-schema-version]

For schema failures caused by top-level $-prefixed parameter names, update to the latest tool schema/toolkit version. The root cause was corrected for top-level $ prefixes, and compatibility was verified across OpenAI, Claude, Gemini, and Vercel AI SDK. Nested $ prefixes were accepted by the major providers tested, while broader parameter naming conventions may still need case-specific review.

## Attio toolkit defaults can stay on the base pinned version unless a version is explicitly selected [#attio-toolkit-defaults-can-stay-on-the-base-pinned-version-unless-a-version-is-explicitly-selected]

Do not assume Attio calls use the latest toolkit definition automatically. Composio can default to an older base pinned version because latest versions can change. If you need updated Attio tool descriptions or fixes, explicitly set the Attio toolkit version in your SDK or environment and then retest.

---

# Browser Tool (/kb/guide/toolkits-browser-tool)

## Browser Tool profiles do not work in Zero Data Retention projects [#browser-tool-profiles-do-not-work-in-zero-data-retention-projects]

Browser Tool requires persistent browser profiles to maintain session state, so it is incompatible with projects configured for Zero Data Retention or removal of execution data. Move the Browser Tool usage to a project without ZDR enabled, or change the project's log/data visibility setting from removing execution data to storing/showing all logs where policy allows. The dashboard path is Project Settings / Log storage configuration, and the API setting is `log_visibility_setting: show_all`.

---

# Calendly (/kb/guide/toolkits-calendly)

## Use CALENDLY\_POST\_INVITEE instead of deprecated CALENDLY\_CREATE\_EVENT\_INVITEE [#use-calendly_post_invitee-instead-of-deprecated-calendly_create_event_invitee]

For Calendly invitee creation flows, prefer `CALENDLY_POST_INVITEE` instead of the legacy `CALENDLY_CREATE_EVENT_INVITEE`. New implementations and migration guidance should point customers to `CALENDLY_POST_INVITEE`.

---

# Canva (/kb/guide/toolkits-canva)

## Use Canva autofill jobs when content must be populated into a design [#use-canva-autofill-jobs-when-content-must-be-populated-into-a-design]

For Canva workflows that need content inserted into a generated design, do not rely on the create-design endpoint/tool. `CANVA_CREATE_CANVA_DESIGN_WITH_OPTIONAL_ASSET` is deprecated and should be replaced with `CANVA_POST_DESIGNS`, but both the old and new create-design flows create a blank design by default and do not accept arbitrary content in the request. Use `CANVA_INITIATE_CANVA_DESIGN_AUTOFILL_JOB` for the content-population use case, because that flow is built around Canva's autofill capability.

---

# Canvas (/kb/guide/toolkits-canvas)

Use this guide to configure Canvas authentication and permissions, set up triggers, run Canvas actions, and troubleshoot course or toolkit-version issues.

## Configure Canvas authentication and permissions [#configure-canvas-authentication-and-permissions]

**Check action-level scopes when Canvas returns 401 or unauthorized.** Compare the auth configs and verify that the failing Canvas connection has the scope required by the action. `CANVAS_GET_USER_PROFILE` requires `url:GET|/api/v1/users/:user_id/profile`. If scopes are missing, update the auth config settings; newly created connected accounts will get the updated scopes from that point onward.

**Match OAuth credentials to the configured Canvas base URL.** For Canvas OAuth, the client ID and client secret must belong to the same Canvas base URL configured on the connection/auth config. A mismatch between the Canvas domain, base URL, and OAuth credentials can cause auth failures even if the credentials are otherwise valid.

**Use an administrator for account-level endpoints.** Canvas account-level endpoints require account administrator permissions in Canvas. Use `CANVAS_LIST_MANAGEABLE_ACCOUNTS` to list accounts the connected user can manage, and `CANVAS_GET_SINGLE_ACCOUNT` when the account ID is already known. If you get an authorization error, confirm that the connected Canvas user has account-level admin permissions before treating it as a Composio-side failure.

## Set up Canvas triggers [#set-up-canvas-triggers]

**Select courses by their Canvas IDs.** Canvas triggers are available. For a course-based setup flow, first call `CANVAS_LIST_COURSES` or the relevant get-courses action, show the course IDs with their course names to the user, and then redirect the user to the trigger configuration page with the selected course context.

**Target users visible to the connected bearer-token user.** Canvas trigger behavior is tied to the user represented by the bearer token on the connected account. A trigger should work for users visible through `CANVAS_GET_ALL_USERS` for the relevant account. The user field cannot be removed entirely because Composio cannot infer every logged-in Canvas user from the provider token without a configured target.

**Use a Teacher account for Assignment Graded.** For Canvas Assignment Graded, the trigger can work for Teacher accounts but not Student accounts because of Canvas permission behavior. If the same connected account also has token-expiry symptoms, execute a Canvas action on that connected account to separate permission behavior from connection/auth issues.

**Distinguish Canvas and Composio user IDs in payloads.** Canvas trigger payloads now separate the Canvas-side user identifier from Composio's user identifier. Use `canvas_user_id` for the Canvas LMS user and `user_id` for the Composio/project user. This avoids ambiguity when both identifiers are present in the same payload.

## Execute Canvas actions and handle provider behavior [#execute-canvas-actions-and-handle-provider-behavior]

**Follow Canvas field descriptions for calendar events.** For `CANVAS_CREATE_CALENDAR_EVENT`, a Canvas user ID can be used where accepted by the Canvas API. Composio keeps Canvas API field names to stay consistent with the provider API, so rely on each field description for accepted values when the field name is ambiguous.

**Paginate list and fetch endpoints with `per_page`.** Canvas list endpoints follow Canvas API pagination behavior. Where supported, pass `per_page` to control how many records are returned in a response. If a Canvas action appears capped or returns a smaller page, check whether the relevant tool version supports `per_page` and upgrade if needed.

**Use `only_announcements` to request discussion topics and announcements separately.** For Canvas discussion topics, use `only_announcements: false` or omit it when calling the discussion-topic flow. For announcements, use `only_announcements: true`. Canvas cannot return both discussion topics and announcements in one combined call for this case, so make two separate API calls and merge the results client-side if both are needed.

**Use unprefixed keys for quiz matching answers.** For Canvas quiz matching question answers, use `comments_html`, `text`, `weight`, `match_left`, and `match_right`. Do not use `answer_comments_html`, `answer_text`, `answer_weight`, `answer_match_left`, or `answer_match_right` for this payload.

## Troubleshoot Canvas courses and toolkit versions [#troubleshoot-canvas-courses-and-toolkit-versions]

**Verify the course before diagnosing analytics 404s.** For Canvas course-level participation or analytics actions, first verify the course ID by listing courses or fetching the course by ID with `CANVAS_LIST_COURSES` or `CANVAS_GET_SINGLE_COURSE`. If the course ID is valid but the analytics endpoint still 404s, the Canvas analytics activity endpoint may simply not be available on that Canvas instance.

**Upgrade instead of patching older toolkit versions.** Composio cannot patch older toolkit versions in place. If a Canvas behavior or schema fix is released in a newer version, the path is to upgrade the toolkit version. Customers can compare differences between toolkit versions in the dashboard before upgrading.

---

# ClickUp (/kb/guide/toolkits-clickup)

## ClickUp supports managed OAuth, custom OAuth, and API-key credentials [#clickup-supports-managed-oauth-custom-oauth-and-api-key-credentials]

Use Composio-managed OAuth for the standard connection flow. Use a custom
ClickUp OAuth app or API-key credentials when you need greater control.
In newer SDK/API flows, use the v3 auth config nano ID (`ac_...`) rather than
older v1/v2 integration assumptions.

## ClickUp custom OAuth should use the Composio callback URL registered in the ClickUp app [#clickup-custom-oauth-should-use-the-composio-callback-url-registered-in-the-clickup-app]

For ClickUp custom OAuth, make sure the redirect URL in the ClickUp app matches the callback shown by the current Composio auth-config flow. A mismatch between the current auth config and an old callback copied from a legacy SDK example is a common cause of setup failure.

## ClickUp folders and tasks are supported through `CLICKUP_GET_FOLDERS` and `CLICKUP_GET_TASKS` [#clickup-folders-and-tasks-are-supported-through-clickup_get_folders-and-clickup_get_tasks]

For ClickUp folder/task-list workflows, use supported tools such as `CLICKUP_GET_FOLDERS` and `CLICKUP_GET_TASKS`. If a more specific ClickUp endpoint is missing, request that tool through the standard tool-request flow.

---

# Confluence (/kb/guide/toolkits-confluence)

Use this guide to configure Confluence OAuth, execute tools with the correct account, and read, update, or download Confluence content.

## Configure Confluence OAuth [#configure-confluence-oauth]

**Align custom OAuth scopes with the endpoint type.** For Confluence custom OAuth, keep Atlassian scopes aligned with the scopes Composio expects. Classic and granular scopes differ depending on whether the underlying Confluence endpoint is v1 or v2. Incorrect substitutions such as using an irrelevant space scope can cause tool execution errors even if OAuth completes.

**Add `offline_access` when refresh tokens are needed.** For Confluence OAuth, include the `offline_access` scope in the auth config and then create a new connected account. `offline_access` enables token refresh, and adding it to an existing auth config only affects new connections after users reconnect.

**Use the same redirect URI in Composio and Atlassian.** The redirect URI in the Composio auth config and the Atlassian OAuth app must match. Copy the callback shown by the current auth-config flow or documentation; do not reuse legacy v1 or v3 callback paths from older examples.

## Execute Confluence tools with the correct account [#execute-confluence-tools-with-the-correct-account]

**Pass the connected account ID, not the auth config ID.** For Confluence tool execution, pass the connected account ID. Do not pass the auth config ID/integration ID in the connected account field. Older SDK versions may also require the UUID form rather than the nano ID, so verify the SDK version and expected ID format.

**Read supported scopes from MCP tool annotations.** For supported MCP deployments, Confluence scopes can be retrieved from the `annotations` field in the `listTools` API response.

## Read and update Confluence pages [#read-and-update-confluence-pages]

**Retrieve page content by page ID.** Use `CONFLUENCE_GET_PAGE_BY_ID` to retrieve Confluence page content by page ID. This is the tool support shared for page body retrieval.

**Fetch the latest page version before an update.** Confluence page updates require the correct page version. Pair `CONFLUENCE_UPDATE_PAGE` with `CONFLUENCE_GET_PAGE_VERSIONS` so the agent can fetch the latest required version and then update the page. By default, the agent should update over the latest version unless a specific version is requested.

## Download Confluence attachments [#download-confluence-attachments]

Use `CONFLUENCE_GET_ATTACHMENTS` to list attachments and get the attachment ID, then pass that ID to `CONFLUENCE_DOWNLOAD_ATTACHMENT` to download the file.

---

# Databricks (/kb/guide/toolkits-databricks)

## Databricks OAuth client and secret setup reference [#databricks-oauth-client-and-secret-setup-reference]

For Databricks OAuth client and secret setup, follow the [official Databricks OAuth application guide](https://docs.databricks.com/aws/en/agents/mcp/connect-clients). An account administrator creates the OAuth application, configures its redirect URL and scopes, and securely records the generated client ID and client secret.

## Enter Databricks API key credentials during connected account linking [#enter-databricks-api-key-credentials-during-connected-account-linking]

The Databricks API key credentials are entered during the connection flow. In code, point customers to `composio.connected_accounts.link()` for creating the connected account and entering the API key details.

---

# DigitalOcean authentication (/kb/guide/toolkits-digital-ocean)

## DigitalOcean supports managed OAuth2, custom OAuth2, or a personal access token [#digitalocean-supports-managed-oauth2-custom-oauth2-or-a-personal-access-token]

The current `digital_ocean` toolkit supports OAuth2 and API-key authentication.
Use Composio-managed OAuth for the standard connection flow. Use a custom
DigitalOcean OAuth app when you need control over provider settings;
register the exact callback URI shown by the current Composio flow.

For API-key authentication, provide a DigitalOcean Personal Access Token in the
`bearer_token` connection field. If OAuth fails before consent, compare the
authorization request with your custom app registration and use the API-key path
only when it matches your security requirements.

---

# Discord (/kb/guide/toolkits-discord)

## Discord OAuth credentials do not have a fixed expiration period [#discord-oauth-credentials-do-not-have-a-fixed-expiration-period]

Discord OAuth2 client credentials do not have a fixed expiration period. If a
customer-owned credential suddenly fails, it may have been manually revoked,
reset, or regenerated in Discord. Verify the current Discord developer-app
credentials and create a fresh connection before treating the failure as a
broader provider or Composio issue.

---

# Discord Bot (/kb/guide/toolkits-discordbot)

## Discord and DiscordBot use different token types [#discord-and-discordbot-use-different-token-types]

Discord has two different authorization models: a user token represents an individual Discord user, while a bot token represents a bot account inside Discord. Composio separates these into different toolkits because the credentials and API behavior are different. Use the Discord toolkit for user-authorized actions and DiscordBot when the workflow needs to act as a Discord bot.

## Verify Discord auth config scopes when bot actions do not respond [#verify-discord-auth-config-scopes-when-bot-actions-do-not-respond]

For DiscordBot behavior that does not respond as expected, verify that the Discord auth config includes the necessary scopes and permissions for the action being tested. Discord's OAuth2 documentation should be used as the source for the required scopes. If scopes look correct and the issue persists, collect the connected account ID or log ID for debugging.

---

# DocuSign (/kb/guide/toolkits-docusign)

## DocuSign auth guide URL [#docusign-auth-guide-url]

Use the DocuSign authentication guide at [https://composio.dev/auth/docusign](https://composio.dev/auth/docusign) for the current Composio DocuSign setup instructions.

---

# Dropbox (/kb/guide/toolkits-dropbox)

## Allow the Composio auth-app redirect URL in the Dropbox app [#allow-the-composio-auth-app-redirect-url-in-the-dropbox-app]

For Dropbox OAuth setup, configure the Dropbox app with the exact callback shown by the current Composio auth-config flow. Do not use the legacy v1 auth-app callback from older examples.

## Dropbox connections use Dropbox native OAuth, not Microsoft/Azure/Outlook login [#dropbox-connections-use-dropbox-native-oauth-not-microsoftazureoutlook-login]

The Dropbox integration uses Dropbox's native OAuth2 flow, so users authenticate through Dropbox's login page. Composio cannot add Microsoft, Azure, or Outlook as alternative identity providers for Dropbox because the authentication method is controlled by Dropbox's API. If the customer's Dropbox Business tenant has SSO configured with Microsoft/Azure AD, that SSO behavior must be configured in Dropbox, not in Composio.

## For Dropbox upload, `path` is the Dropbox destination and `content` is the local file path [#for-dropbox-upload-path-is-the-dropbox-destination-and-content-is-the-local-file-path]

For the Dropbox upload action, `path` is the destination path inside Dropbox,
while `content` is the local file path that should be uploaded. Provide the
local file path in `content`.

## Pass file paths to SDK attachment arguments rather than base64/file metadata objects [#pass-file-paths-to-sdk-attachment-arguments-rather-than-base64file-metadata-objects]

When using the SDK attachment argument for supported email tools, pass a file path rather than an object containing filename, data, and content type. The SDK handles the file path. If the source file is available at a Dropbox-backed path, pass that Dropbox file path directly in the attachment argument.

## Use DROPBOX\_GET\_ABOUT\_ME to confirm which Dropbox account is connected [#use-dropbox_get_about_me-to-confirm-which-dropbox-account-is-connected]

If Dropbox files or folders appear to be missing after a successful operation, confirm the connected Dropbox account before deeper debugging. Use `DROPBOX_GET_ABOUT_ME` to inspect the account tied to the active Composio connection and compare it with the Dropbox account the user is checking manually.

---

# Excel (/kb/guide/toolkits-excel)

Use this guide to pass valid Excel workbook inputs, operate on SharePoint-backed files, and keep Microsoft auth and tool schemas current.

## Pass valid inputs to Excel workbook actions [#pass-valid-inputs-to-excel-workbook-actions]

**Send range values as a two-dimensional array.** Pass values as a two-dimensional array, where the outer list represents rows and each inner list contains the cell values for that row. Even a single cell must be wrapped twice, for example \{"values": \[\["92"]]}.

**Use structured workbook data for uploads.** Use the revamped Excel tool shape that accepts structured data through worksheet\_names and worksheet\_data lists/dicts. The tool generates the .xlsx file before upload, instead of requiring the caller or LLM to provide binary workbook content directly.

**Check the worksheet name and workbook item ID when `EXCEL_GET_RANGE` fails.** If get range appears to fail while the tool itself is working, verify that the workbook actually has the requested worksheet name, such as Sheet1, and that the item\_id being passed is the correct file ID for that workbook.

**Use Excel actions for SharePoint-backed workbook operations.** For workbook operations, use the Excel toolkit actions because they are Excel APIs. Support identified EXCEL\_CLOSE\_SESSION, EXCEL\_DELETE\_WORKSHEET, EXCEL\_UPDATE\_WORKSHEET, and EXCEL\_UPDATE\_RANGE as already supported for the remaining Excel use cases.

## Configure Excel authentication and current tool schemas [#configure-excel-authentication-and-current-tool-schemas]

**Use the shared Microsoft auth guide.** For Excel auth setup, use the Microsoft auth guide published at [https://composio.dev/auth/outlook](https://composio.dev/auth/outlook). The same guide applies to SharePoint, Microsoft Teams, Outlook, and Excel.

**Upgrade schemas that expose dollar-sign parameters.** Upgrade to the latest available release when an older Excel schema exposes dollar-sign parameter names that the model provider rejects. The current schema no longer uses those invalid top-level parameter names.

**Use current versions for column formatting and wrapping.** Generic column wrapping and related sheet operations are available in the current Excel toolkit. If they are missing from the action schema, switch to the latest toolkit version.

---

# Facebook (/kb/guide/toolkits-facebook)

## FACEBOOK\_DELETE\_POST failure can be fixed by using the latest Facebook toolkit version [#facebook_delete_post-failure-can-be-fixed-by-using-the-latest-facebook-toolkit-version]

If `FACEBOOK_DELETE_POST` fails on an older pinned toolkit version, try the latest Facebook toolkit version first. Remove the historical pin or pass `latest` according to the SDK/API path being used.

## Meta OAuth issues can require adding the Composio redirect URI in the Meta app settings [#meta-oauth-issues-can-require-adding-the-composio-redirect-uri-in-the-meta-app-settings]

For Meta/Facebook OAuth failures, verify that the Composio redirect URI is added to the correct redirect URI field in the Meta developer app settings. If the app is using custom credentials, the redirect URI in Meta must match the Composio callback URI used by that auth config. After adding it, retry the connection flow.

## Facebook or Instagram connections authenticate the account selected in Meta's picker and cannot be repointed server-side [#facebook-or-instagram-connections-authenticate-the-account-selected-in-metas-picker-and-cannot-be-repointed-server-side]

If the wrong Facebook/Page/Instagram account is connected, remove the existing Composio/Meta app authorization from Facebook's Business Integrations or business tools settings, sign out of other Facebook accounts or use a clean browser profile, then reconnect and choose the correct account/Page/Instagram asset in Meta's picker. Composio cannot manually switch the underlying account for an already-issued Meta token.

## WhatsApp connections require WABA ID as generic\_id, with bearer\_token for API-key auth [#whatsapp-connections-require-waba-id-as-generic_id-with-bearer_token-for-api-key-auth]

For WhatsApp, OAuth2 connection initiation requires `generic_id`, which is the WABA ID. API-key auth requires both `bearer_token` (System User Token) and `generic_id` (WABA ID). Customers can find the WABA ID in the Facebook developer app's WhatsApp API setup, or through Meta APIs such as `/me/businesses` followed by `/{business_id}/owned_whatsapp_business_accounts`. To avoid hardcoding, use hosted auth links so the user can enter required fields during connection.

---

# Fathom (/kb/guide/toolkits-fathom)

## Fathom and granola\_mcp are supported meeting transcription toolkits; request unsupported tools separately [#fathom-and-granola_mcp-are-supported-meeting-transcription-toolkits-request-unsupported-tools-separately]

The `fathom` and `granola_mcp` toolkits are supported. If a requested meeting transcriber is not available, such as Otter, direct the customer to submit the request at `https://request.composio.dev/`.

## OAuth authorization URLs are provider-specific [#oauth-authorization-urls-are-provider-specific]

Authorization URLs depend on the provider/toolkit involved in the connection flow. When troubleshooting OAuth redirects, check which provider the auth config and connection flow resolve to before treating a provider-specific authorization domain as inherently incorrect.

---

# Figma (/kb/guide/toolkits-figma)

Use this guide to configure Figma authentication, discover available tools, and work with design tokens and components.

## Configure Figma authentication for production [#configure-figma-authentication-for-production]

**Let Composio handle Bearer authorization.** For Figma, customers can provide the supported credentials/token through the toolkit's auth mode, and Composio handles the Bearer authorization header internally. They should not need to manually create a separate Bearer-token auth scheme for normal Figma tool use.

**Use customer-owned credentials for production rate limits.** If Figma returns 429, verify the response is coming from Figma and review Figma's rate-limit docs. Composio's default Figma app is fine for testing, but production use should use the customer's own Figma credentials to avoid shared-app pressure and to control scopes/rate limits.

**Remove deprecated scopes before reconnecting.** If a Figma auth config contains the deprecated `file_read` scope, remove it and initiate a new connection.

## Discover and run Figma tools across auth modes [#discover-and-run-figma-tools-across-auth-modes]

Figma tools should be usable regardless of whether the connection uses Composio-managed OAuth, a custom OAuth app, or token/API-key auth. If you cannot find a tool, fetch available tools dynamically and check the auth scopes required by that tool.

## Work with Figma design tokens and components [#work-with-figma-design-tokens-and-components]

**Check plan access when extracting variables.** Some Figma API features are plan-limited. If `FIGMA_EXTRACT_DESIGN_TOKENS` fails when `include_variables` is enabled, verify your Figma plan/API access. As a workaround, set `include_variables` to false.

**Use current design-token and component actions.** For Figma design-token and component workflows, use `FIGMA_EXTRACT_DESIGN_TOKENS`, `FIGMA_DESIGN_TOKENS_TO_TAILWIND`, and `FIGMA_GET_FILE_NODES`. The older `FIGMA_GET_COMPONENT` action is deprecated. If a needed Figma tool is missing, submit it through the Composio request portal.

---

# Firecrawl (/kb/guide/toolkits-firecrawl)

Use this guide to connect Firecrawl with an API key, discover and run its tools, configure scrape endpoints and timeouts, and use it through Connect MCP.

## Connect Firecrawl with an API key [#connect-firecrawl-with-an-api-key]

**Use API-key auth instead of OAuth.** Firecrawl does not use a Composio-managed OAuth/test connector flow. It is an API-key toolkit, so you need a Firecrawl API key and, in many cases, your own Firecrawl subscription/account. If an MCP client does not prompt for the key, provide it through the connection flow or explicitly tell the agent/client to use the Firecrawl API key for authentication.

**Create the connected account with `generic_api_key`.** For Firecrawl API-key auth, create the connected account with `authScheme: "API_KEY"` and a value object containing `status: "ACTIVE"` and `generic_api_key: "fc-..."`. The exact required key names can be checked from the toolkit metadata/connection initiation fields.

## Discover and run Firecrawl tools [#discover-and-run-firecrawl-tools]

**Increase the tool-list limit when actions are missing.** If `FIRECRAWL_SEARCH` or other Firecrawl tools are missing from a tools list, increase the list limit or paginate. The default list can return only the first 20 tools, so request a higher limit such as `limit=1000` when fetching Firecrawl tools.

**Choose the retrieval tool that matches the task.** For website content retrieval with Firecrawl, use `FIRECRAWL_SCRAPE` to scrape page content or `FIRECRAWL_EXTRACT` for extraction-style workflows. For broader web search, Composio Search may be a better fit depending on the use case.

## Configure endpoints and scrape timeouts [#configure-endpoints-and-scrape-timeouts]

**Batch fewer URLs or raise the timeout for long scrape jobs.** For Firecrawl scrape timeouts, reduce the number of links per request, such as batching 1-2 links at a time for complex pages, or increase the scrape timeout if the tool call supports it. A useful starting value is `timeout: 120000` for roughly a 2-minute timeout.

**Use the Firecrawl v1 API base URL.** The Firecrawl API base URL is `https://api.firecrawl.dev/v1`. If you must manually enter a base URL to unblock a connection or custom call, use that value. If the toolkit should have supplied it automatically, contact Composio support with the connection details.

## Use Firecrawl with Connect MCP [#use-firecrawl-with-connect-mcp]

**Connect Firecrawl separately for each consumer account.** For Connect MCP on the For You side, each user's MCP session is tied to their own Composio consumer account, not the shared workspace context. A Firecrawl connection created under one user's account/workspace will not automatically appear for colleagues in Claude. Each colleague should create/connect their own Firecrawl account connection for their individual Connect MCP session.

---

# Gemini (/kb/guide/toolkits-gemini)

Use this guide to choose supported Gemini models, handle generated media, connect through MCP, and troubleshoot provider compatibility.

## Choose supported models and handle generated media [#choose-supported-models-and-handle-generated-media]

**Use current Gemini model names.** If Gemini tool calls fail with older model names, switch to a currently supported Gemini model. For example, use `gemini-2.5-flash` instead of the older `gemini-1.5-flash`; model availability changes over time.

**Choose a supported Veo model for video generation.** For Gemini video generation, use supported Veo models such as `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview`, `veo-3.0-generate-001`, or `veo-3.0-fast-generate-001`. If the default model fails, explicitly pass a current supported Veo model.

**Wait for asynchronous video generation to complete.** Gemini video generation is asynchronous. Pass the `operation_name` returned by `GEMINI_GENERATE_VIDEOS` to `GEMINI_WAIT_FOR_VIDEO`, which polls for completion and returns the generated video file. The older `GEMINI_GET_VIDEOS_OPERATION` action is deprecated.

**Disable automatic file handling when outputs should remain as URLs or content.** Composio SDKs automatically handle file upload/download by default. For Gemini generated images or similar file outputs, disable automatic file handling with `autoUploadDownloadFiles: false` / `auto_upload_download_files=False` where supported, or update to a version that supports that option.

## Connect Gemini through MCP and frameworks [#connect-gemini-through-mcp-and-frameworks]

**Use Tool Router with any compatible MCP client.** Tool Router can be used with any MCP client or framework/LLM that supports tool calling or MCP. For Gemini, initialize Composio with `GeminiProvider`, create a session, then connect to the session MCP URL and headers using a streamable HTTP MCP client.

**Isolate Gemini CLI-specific MCP failures.** If a Composio MCP server URL returns tools but Gemini CLI still fails, the issue may be in the Gemini client. Try the latest Gemini CLI version and, if needed, compare with another MCP client to isolate whether the failure is client-specific.

**Use LangChain MCP tools with any capable model.** Composio MCP tools with LangChain are not limited to OpenAI. They can work with any LLM/framework path that supports LangChain function calling capabilities, including Gemini and Claude.

## Check provider compatibility and tool-call accounting [#check-provider-compatibility-and-tool-call-accounting]

**Account for no-auth toolkit calls like regular tool calls.** Gemini no-auth toolkit calls are logged like other toolkit calls and can be tracked in Composio tool logs. Confirm the current plan's tool-call accounting when answering billing questions because pricing can change.

**Check Google's schema limitations when otherwise-valid tools fail.** Gemini models/providers can have schema compatibility issues because Gemini uses OpenAPI-style schema handling rather than full JSON Schema support in some paths. If a schema works in OpenAI/Claude but fails in Gemini, check provider schema limitations and upgrade Composio/provider SDKs where fixes exist.

**Verify current language-specific provider support.** Composio supports Google Gemini and Vertex AI providers. Verify the current SDK version and provider documentation when answering implementation-specific questions because language-specific support changes over time.

---

# GitHub (/kb/guide/toolkits-github)

## GitHub V2 triggers do not require creating a webhook endpoint first [#github-v2-triggers-do-not-require-creating-a-webhook-endpoint-first]

GitHub V2 trigger setup does not require a separate webhook endpoint creation step. The webhook URL is automatically provisioned when the trigger instance is created. Skip the `/webhook_endpoints` call and create or update the trigger directly through `/trigger_instances/{slug}/upsert`.

## List GitHub organizations and repositories for the authenticated user [#list-github-organizations-and-repositories-for-the-authenticated-user]

Use `GITHUB_LIST_ORGANIZATIONS_FOR_THE_AUTHENTICATED_USER` to list organizations available to the authenticated GitHub user. Then use `GITHUB_LIST_ORGANIZATION_REPOSITORIES` to list repositories for a selected organization. During connection, the user should be able to choose the organization they want to grant access to.

## GitHub connected-account tokens are redacted from API responses [#github-connected-account-tokens-are-redacted-from-api-responses]

Provider tokens are redacted from connected-account API responses for both Composio-managed and customer-owned auth configs. Use Composio tool execution or Proxy Execute when a workflow needs to call GitHub; do not build a flow that reads the OAuth token from connected-account data.

## GitHub organization access can require approval from an organization owner [#github-organization-access-can-require-approval-from-an-organization-owner]

If a GitHub connection works for personal repositories but cannot access an
organization, check whether that organization restricts OAuth app access. The
user can open GitHub **Settings → Applications → Authorized OAuth Apps**, select
the OAuth app, and request access for the organization. An organization owner
must approve the request in GitHub; reconnecting in Composio does not bypass the
organization's policy.

GitHub documents the member request flow at
[https://docs.github.com/en/account-and-profile/how-tos/organization-membership/requesting-organization-approval-for-oauth-apps](https://docs.github.com/en/account-and-profile/how-tos/organization-membership/requesting-organization-approval-for-oauth-apps)
and the owner approval flow at
[https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization).

## Session-level tool allowlists are enforced server-side at execution time [#session-level-tool-allowlists-are-enforced-server-side-at-execution-time]

Session-level restrictions are enforced server-side at execution time. When a session is configured with `toolkits`, `tools`, or `tags`, every execution request is validated against the enabled or disabled toolkit list, per-toolkit tool list, and tag filters. Disabled tools are filtered from search results, and execution is blocked before the provider API call if the tool fails validation.

## Use custom OAuth credentials for branded GitHub consent and redirect flows [#use-custom-oauth-credentials-for-branded-github-consent-and-redirect-flows]

Composio supports white-labeling the hosted auth page by customizing the logo and app name in Project Settings > Auth Screen. For provider OAuth consent screens such as GitHub, use your own OAuth app credentials so the provider consent screen shows your brand instead of Composio's shared OAuth app. Redirect URLs can also be routed through your own domain so users do not see a Composio domain during the redirect path.

---

# Gmail (/kb/guide/toolkits-gmail)

Use this guide to configure Gmail authentication, send and fetch messages, work with attachments and labels, and set up new-message triggers.

## Configure Gmail OAuth, scopes, and toolkit versions [#configure-gmail-oauth-scopes-and-toolkit-versions]

**Use `latest` or v3.1 for newer Gmail settings tools.** The v3 execute endpoint can default to base toolkit version `00000000_00` when no version is specified. For newer Gmail tools like `GMAIL_PATCH_SEND_AS`, `GMAIL_LIST_SEND_AS`, and `GMAIL_GET_VACATION_SETTINGS`, pass `version: "latest"` in the execute body or use the v3.1 endpoint, which defaults to latest.

**Create the auth config before initiating a connection.** Create the Gmail auth config first with the custom OAuth credentials, then initiate a connected account using that auth config. The callback URL is supplied during connection initiation, while the OAuth client ID/secret and redirect URI live on the auth config.

**Choose scopes based on the actions and data required.** When creating the Gmail auth config, pass the desired Gmail scopes in `credentials.scopes`, typically as a comma-joined string. Example scopes include `gmail.send`, `gmail.readonly`, `gmail.compose`, `gmail.modify`, and `gmail.labels`.

Gmail filter creation maps to the Gmail API `users.settings.filters.create` endpoint: `POST /gmail/v1/users/{userId}/settings/filters`. Google lists `https://www.googleapis.com/auth/gmail.settings.basic` as the required OAuth scope for this endpoint, and the current Composio `GMAIL_CREATE_FILTER` action declares the same single required scope. Google must approve this scope for the OAuth app used by the connection. If the consent screen blocks an unverified scope, use an OAuth app that is verified for `gmail.settings.basic` and reconnect.

`https://www.googleapis.com/auth/gmail.send` can send messages, but it is a granular sensitive scope and requires Google verification. The broader `https://mail.google.com/` scope gives full mailbox access and can cover send use cases, but it is broader than many customers want.

The Gmail metadata scope cannot be used when requesting full email content. Remove `https://www.googleapis.com/auth/gmail.metadata` and use a scope that allows message content access, such as `https://mail.google.com/`, when full payload/body data is needed.

**Use Google Super for one Google connection across services.** Google Super owns the canonical multi-service authentication guidance. See [Google Super is a unified Google Workspace toolkit](/kb/guide/toolkits-googlesuper).

## Address and send Gmail messages [#address-and-send-gmail-messages]

**Use `me` for the authenticated user.** For Gmail tool calls, `me` can be used as the `user_id` to refer to the authenticated connected account.

**Provide at least one recipient channel.** `GMAIL_SEND_EMAIL` no longer needs a single required recipient field. At least one recipient channel such as `to` / `recipient_email`, `cc`, or `bcc` can be supplied, which keeps the tool flexible for different email composition flows.

For hosted MCP / Tool Router calls through `COMPOSIO_MULTI_EXECUTE_TOOL`, put recipient fields inside the nested tool `arguments` object. Prefer `recipient_email` for the first To recipient and `extra_recipients` for additional To recipients unless the current schema explicitly exposes another shape.

If the connection is active but the action returns `At least one of 'to' (or 'recipient_email'), 'cc', or 'bcc' must be provided`, the tool did not receive a recipient channel and failed before Gmail API execution. Retry with the exact nested `recipient_email` shape; if it still fails, provide a fresh request ID for investigation.

**Select a send-as alias with `from_email`.** Use the `from_email` parameter on `GMAIL_SEND_EMAIL` to choose the Gmail send-as alias.

## Send attachments safely [#send-attachments-safely]

**Upload files before tool execution.** Temporary S3/file instances are short-lived. Use `files.upload` before tool execution via the SDK or MCP flow, then pass the resulting `FileUploadable`/uploaded file object to the agent/tool call.

**Verify a timed-out send before retrying.** `GMAIL_SEND_EMAIL` accepts attachments as uploaded Composio file references, not signed URLs or JSON strings. The action downloads the uploaded file, builds the MIME message, base64-url encodes it, and posts it to Gmail. Attachment sends can therefore take materially longer than small text-only sends.

Current Python and TypeScript SDKs do not automatically retry non-idempotent tool executions. However, a client timeout can still occur after Gmail accepted the message. If `GMAIL_SEND_EMAIL` hangs or creates duplicate sends with attachments:

* If the log is a fast 400 validation error, verify the `attachment` argument is an object/list with `name`, `mimetype`, and `s3key`.
* If the client timed out, inspect the Composio execution log or Gmail Sent folder before retrying manually.
* If the client is older than Python SDK 0.16.0 or TypeScript SDK 0.14.0, upgrade before investigating SDK-level automatic retries.

## Fetch messages and manage labels [#fetch-messages-and-manage-labels]

**Reduce fetch payload size.** For Gmail fetch/list flows, set `include_payload=false` and `verbose=false` where supported. For very lightweight flows, use `only_ids=true` and then fetch selected messages separately. Also use `max_results` and Gmail `query` filters to keep result sets small.

**Use label IDs for label operations.** For Gmail label operations and trigger label filters that require IDs, pass the label ID rather than the display name. Use `GMAIL_LIST_LABELS` to retrieve IDs.

**Use accepted Gmail color values when patching labels.** To patch a label color, use the label ID and pass background color as an object field such as `{ "background_color": "#FFFF0000" }`. Gmail only accepts specific label color values from the Gmail API reference.

## Configure Gmail new-message trigger filters [#configure-gmail-new-message-trigger-filters]

Use a Gmail query such as `label:sent OR label:category_personal` to filter matching messages. This avoids depending on label IDs for that trigger path.

---

# Gong (/kb/guide/toolkits-gong)

## Gong base URL differs by customer and should be provided at connection time [#gong-base-url-differs-by-customer-and-should-be-provided-at-connection-time]

Gong's base URL can differ per user/customer. Avoid hardcoding a single Gong base URL in a shared auth config for all users; collect and pass the user's `gong_url`/base URL when initiating the connected account.

## Gong connection initiation can use Basic auth fields: access key, access key secret, and Gong URL [#gong-connection-initiation-can-use-basic-auth-fields-access-key-access-key-secret-and-gong-url]

For Gong Basic auth, collect the access key as username, access key secret as password, and the customer's Gong URL/base URL. Pass those fields when initiating the connected account; hosted auth can also collect required fields for the customer instead of manually building the frontend form.

## Gong MCP tool scopes can be read from tool annotations in the tools API [#gong-mcp-tool-scopes-can-be-read-from-tool-annotations-in-the-tools-api]

For Gong MCP tools, scopes are exposed through the `annotations` field from the `listTools` API per the newer MCP spec. To determine Gong scopes, inspect tool annotations from the tools API instead of relying only on static docs.

---

# Google Analytics (/kb/guide/toolkits-google-analytics)

## Use latest toolkit version when Google Analytics tools return ToolNotFound or only a few tools [#use-latest-toolkit-version-when-google-analytics-tools-return-toolnotfound-or-only-a-few-tools]

If Google Analytics tools return `ToolNotFound` or the tools API only returns a small subset of Google Analytics tools, pass the latest toolkit version. For tools listing, use query params like `toolkit_versions=latest&toolkit_slug=google_analytics&limit=1000`. Older pinned/default versions can expose far fewer tools than the latest version.

## Add Google Analytics to an MCP config as a selected tool/toolkit [#add-google-analytics-to-an-mcp-config-as-a-selected-tooltoolkit]

To use Google Analytics through MCP, create an MCP config with Google Analytics selected, or edit an existing MCP config and add Google Analytics as a tool/toolkit. Then follow the MCP quickstart to connect and use the generated MCP configuration.

## Empty Google Analytics reports may be provider data availability rather than Composio failure [#empty-google-analytics-reports-may-be-provider-data-availability-rather-than-composio-failure]

If Google Analytics report tools return no data or unexpected data, compare the same property, date range, dimensions, and metrics through Google Analytics itself or a Proxy Execute request. If the provider returns the same empty result, it is likely a data-availability or query issue. If the equivalent provider request works but the Composio tool does not, contact Composio support with the log ID and a redacted comparison. Never extract or share a token from connected-account data.

---

# Google Calendar (/kb/guide/toolkits-google-calendar)

Use this guide to connect Google Calendar, work with event data and availability, configure triggers, and troubleshoot version-specific behavior.

## Connect a Google Calendar account [#connect-a-google-calendar-account]

Create a Google Calendar integration/auth config, connect the account, and then use the Google Calendar toolkit's tools and triggers through that connected account.

Ensure the connected account has `https://www.googleapis.com/auth/calendar.events` when calling event-list or event-fetch tools that require event access.

## Work with events and availability [#work-with-events-and-availability]

**Update RSVP status with the attendee-list limitation in mind.** Google Calendar can limit RSVP/status updates when an event has multiple attendees. Update the authenticated user's RSVP and then re-add the attendees, or resend the attendee list with the updated status.

**Use Find Free Slots for processed availability.** Query-free/busy returns provider data without extra processing such as timezone handling, so callers using free/busy may need to process it themselves.

**Use `primary` as the calendar ID.** For Google Calendar tools, use a calendar ID such as `primary`; `me` is not a valid Google Calendar ID.

**Read generated meeting links from `hangout_link`.** After creating or updating a calendar event with conferencing, read the generated meeting URL from the response's `hangout_link` field.

## Configure Google Calendar triggers [#configure-google-calendar-triggers]

**Handle canceled or deleted events.** `GOOGLECALENDAR_EVENT_CANCELED_DELETED_TRIGGER` sends a payload when an event is canceled or deleted.

**Create separate trigger instances for separate calendars.** Multiple triggers for the same trigger slug and user are supported when each trigger is configured for a different `calendarId`.

**Expect full event data from newer triggers.** The newer Google Calendar new-event trigger payload includes complete event data rather than only the event ID. Google Calendar trigger behavior moved from webhook-style delivery toward polling so payloads can include more detail and require less follow-up processing. Existing trigger flows were preserved while polling could be introduced separately where needed.

**Retrieve trigger metadata programmatically.** Use the trigger-types endpoint to retrieve Google Calendar trigger metadata programmatically, and use the triggers documentation for setup guidance.

## Troubleshoot ignored event filters [#troubleshoot-ignored-event-filters]

Older pinned Google Calendar toolkit versions can drop or remap filters such as `timeMin` and `timeMax` before the request reaches Google. Use the latest toolkit version or v3.1/latest behavior when filter changes produce identical results.

---

# Google Classroom (/kb/guide/toolkits-google-classroom)

Use this guide to choose managed or customer-owned Google OAuth for Google Classroom and troubleshoot consent, scope, or token failures.

## Configure Google OAuth for Google Classroom [#configure-google-oauth-for-google-classroom]

**Follow the Google Apps credential setup guide for custom OAuth.** For a step-by-step guide to creating and configuring Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

**Enable the Google Classroom API for custom OAuth.** Enable the Google Classroom API in the Google Cloud project that owns the credentials. After enabling it under **APIs & Services**, wait a few minutes and retry.

**Choose managed or customer-owned OAuth.** Use Composio-managed OAuth for the standard connection flow. Use a custom Google OAuth app when you need control over scopes, consent-screen branding, or Google Cloud project policy. For custom OAuth, configure the app name and branding in that project and use the redirect URL shown by Composio's current auth-config flow.

## Troubleshoot Google Classroom OAuth and tool calls [#troubleshoot-google-classroom-oauth-and-tool-calls]

**Remove unverified scopes when Google reports “App is blocked.”** This error usually means the OAuth client is requesting scopes that Google has not verified for that client. Remove additional scopes beyond the defaults, or use a custom OAuth app and submit the scopes for verification.

**Validate scopes when OAuth returns `Error 400: invalid_scope`.** Verify the requested scopes and their formatting against the [Google OAuth scopes documentation](https://developers.google.com/identity/protocols/oauth2).

**Reconnect when tool calls return 401.** A 401 usually means the access token is no longer valid. The user may have revoked access, changed password or two-factor settings, been affected by an administrator policy, or exceeded Google's refresh-token limit. Re-authenticate the connected account and retry.

---

# Google Maps (/kb/guide/toolkits-google-maps)

## Maps Embed API requires API-key authentication [#maps-embed-api-requires-api-key-authentication]

`GOOGLE_MAPS_MAPS_EMBED_API` requires API-key authentication. Use an auth config whose auth mode is `api-key`, or pass the `api_key` parameter directly when making the tool call.

## Google Maps OAuth can be blocked by sensitive cloud-platform scope [#google-maps-oauth-can-be-blocked-by-sensitive-cloud-platform-scope]

Check whether the OAuth app requests the sensitive `https://www.googleapis.com/auth/cloud-platform` scope. If the Google OAuth app has not been verified, users who are not listed as test users and are outside the registering organization can be blocked by Google. Either complete Google verification or ensure the affected users are allowed test/org users for that OAuth app.

## Validate Places `includedTypes` against Google's supported place types [#validate-places-includedtypes-against-googles-supported-place-types]

For Google Maps Places requests, `includedTypes` must use values supported by Google's Places API. If a request fails with an invalid argument around `includedTypes`, compare the value against Google's supported place type lists and replace unsupported values before retrying.

## Deprecated `GEOCODING_API` is not the Google Maps toolkit tool to use [#deprecated-geocoding_api-is-not-the-google-maps-toolkit-tool-to-use]

`GEOCODING_API` belongs to a different toolkit and has been deprecated. Do not require it as part of normal `google_maps` toolkit usage; use the current Google Maps toolkit tool slugs instead.

## Google Maps APIs may require billing and quota management in GCP [#google-maps-apis-may-require-billing-and-quota-management-in-gcp]

Most Google APIs used through Composio are generally free to access, but Google Maps is an exception: Maps APIs can require billing on the Google Cloud project. If usage exceeds limits, customers may need to request higher limits in their own Google project.

---

# Google Ads (/kb/guide/toolkits-googleads)

## Google Ads developer token now belongs on the auth config, not connection initiation [#google-ads-developer-token-now-belongs-on-the-auth-config-not-connection-initiation]

Google Ads was changed so the developer token lives on the auth config itself, not on each connection initiation request. Older auth configs created before this change do not have the developer token field, and new connections through those auth configs can fail because the token is no longer accepted at the connection level. Create a new Google Ads authConfig with the developer token included, then create a fresh connection through that authConfig.

## Google Ads API requires both OAuth access token and developer token [#google-ads-api-requires-both-oauth-access-token-and-developer-token]

Google Ads API requests require both an OAuth access token and a Google Ads developer token. For production reliability and isolated provider quota, customers should use their own Google Ads developer token where possible.

## Google Ads toolkit versions should be passed without the dashboard `v` prefix [#google-ads-toolkit-versions-should-be-passed-without-the-dashboard-v-prefix]

The SDK expects toolkit version strings without the dashboard's leading `v`. If the dashboard shows `v<version>`, pass `<version>` in `toolkitVersions` or per-execution `version`. `dangerouslySkipVersionCheck` is a per-execution option inside the `tools.execute()` payload, not a constructor option. Sessions can manage toolkit versions automatically if the customer migrates to session-based execution.

## Google Ads MCC/sub-account customer ID targeting is supported [#google-ads-mccsub-account-customer-id-targeting-is-supported]

The Google Ads toolkit now correctly supports an optional per-call `customer_id` for customer-scoped tools.

* Pass the child/subaccount customer ID as `customer_id`; it becomes the target account in the Google Ads request path.
* If `customer_id` is omitted, the tool falls back to the Customer ID stored on the connection.
* When the requested customer differs from the connection Customer ID, the connection Customer ID can supply the MCC/manager context for Google's `login-customer-id` header unless that header is already present.
* `GOOGLEADS_LIST_ACCESSIBLE_CUSTOMERS` is for account discovery. It can return accessible IDs, but later customer-scoped tools still need a selected target customer ID.

If the request still fails, contact Composio support with the exact tool, request/log ID, manager/MCC customer ID, child customer ID, and Google error. The customer-ID override is already supported, so do not troubleshoot this as a pending feature.

## Campaign mutate 400s can be caused by unsupported inline Campaign fields [#campaign-mutate-400s-can-be-caused-by-unsupported-inline-campaign-fields]

`GOOGLEADS_MUTATE_CAMPAIGNS` may fail with Google Ads 400 `INVALID_ARGUMENT` errors such as `Unknown name "dailyBudget" at operations[0].update` or `Unknown name "targetedLocations" ... Cannot find field`. These failures happen when the request includes fields that are not valid inline Campaign resource fields.

Do not treat these as OAuth failures. Check the tool execution log for rejected payload fields. Google Ads does not accept `daily_budget`, `targeted_locations`, `exclusion_locations`, and related date/budget/location fields directly on the Campaign mutate body.

Remove those inline fields and treat the error as a request-shape issue rather than an OAuth failure. A real daily budget requires a CampaignBudget resource (`campaignBudgets:mutate`) and then passing the CampaignBudget resource name through `campaign_budget`. Location targeting belongs in CampaignCriterion mutations, not inline Campaign fields.

Example response: "The failure is in the Google Ads campaign-mutate payload shape, not your connection. Some inline campaign fields are being sent in a form that Google Ads rejects. Use CampaignBudget and CampaignCriterion mutations for budget and location targeting instead."

## Google Ads OAuth callback token-exchange failures usually point to incorrect credentials [#google-ads-oauth-callback-token-exchange-failures-usually-point-to-incorrect-credentials]

The `OAuth callback failed during token exchange` error usually means the credentials used to complete the auth flow are incorrect, most often the client secret. Re-enter or update the client secret in the Google Ads auth config, make sure there are no leading/trailing spaces, and initiate a new connection.

## Custom Google OAuth apps need callback routing through the customer's domain for branded consent [#custom-google-oauth-apps-need-callback-routing-through-the-customers-domain-for-branded-consent]

For Google toolkits, creating a new authConfig with the customer's OAuth app credentials is not enough for full white-label consent. They also need to route the callback through their own domain using their own redirect URI so Google displays the configured consent screen for that OAuth app.

---

# Google BigQuery (/kb/guide/toolkits-googlebigquery)

## BigQuery supports managed OAuth2, custom OAuth2, and service-account auth [#bigquery-supports-managed-oauth2-custom-oauth2-and-service-account-auth]

Use Composio-managed OAuth for the standard connection flow. Use a custom Google
OAuth app when you need control over scopes, consent-screen branding,
or Google Cloud project policy. Service-account authentication is also available;
grant the service account only the BigQuery permissions required by the intended
tools.

If Google blocks an OAuth consent flow, check the OAuth app's verification,
test-user, organizational-policy, and requested-scope settings before treating
the failure as a Composio problem. Generate a fresh auth link after correcting
the Google Cloud configuration.

---

# Google Docs (/kb/guide/toolkits-googledocs)

Use this guide to create and edit Google Docs content, configure Google OAuth, manage accounts and sessions, and connect through the correct Composio surface.

## Create and edit Google Docs content [#create-and-edit-google-docs-content]

**Create documents from Markdown or HTML tables.** `GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN` accepts GitHub-Flavored Markdown. Markdown tables should work, and HTML tables can also be passed in the markdown payload when a table shape is needed.

**Use the tab-aware tools for reading and editing.** Google Docs tab-level access is supported. For reading tabs, use `GOOGLEDOCS_GET_DOCUMENT_BY_ID` or `GOOGLEDOCS_GET_DOCUMENT_PLAINTEXT`. For editing specific tabs, use `GOOGLEDOCS_REPLACE_ALL_TEXT`, `GOOGLEDOCS_REPLACE_IMAGE`, or `GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT`.

## Configure Google OAuth [#configure-google-oauth]

**Choose managed or customer-owned OAuth2.** Use Composio-managed OAuth for the standard connection flow. Create a custom auth config with your Google OAuth app when you need control over scopes, consent-screen branding, or Google Cloud project policy. A Composio Project API key authenticates SDK/API calls to Composio; it is not a replacement for the user's Google OAuth grant.

**Verify sensitive scopes for production use.** Google may block OAuth consent when an app requests unverified sensitive scopes. For production Google Docs or Workspace usage with sensitive scopes, use a verified OAuth app and complete the required Google verification or CASA process where applicable. Without verification, users may see warnings or app-blocked errors.

**Execute through Composio instead of reading provider tokens.** Provider tokens are redacted from connected-account API responses. Use Composio tool execution or Proxy Execute instead of reading access or refresh tokens from connected-account data.

## Manage accounts, sessions, and auth configs [#manage-accounts-sessions-and-auth-configs]

**Select explicitly when a user has multiple Google accounts.** Composio can keep multiple connected accounts for the same toolkit and user. Enable multi-account behavior for the session when needed, give each account a clear alias, and select the intended alias or connected-account ID during execution rather than relying on an implicit default.

**Keep Tool Router v2 accounts under the same user or entity.** Tool Router v2 sessions are scoped to a single `user_id`. Every connected account passed into that session must belong to the same entity, otherwise validation fails with `ToolRouterV2_InvalidConnectedAccountIds`. Reconnect the outlier Google account under the same `user_id` or create a separate session.

**Specify auth config IDs when creating the session.** When creating a Composio session, pass `auth_configs` keyed by toolkit slug, such as `gmail`, `googledrive`, or `googlecalendar`. If specified, Manage Connection uses those auth configs directly instead of picking a default config.

## Connect through Platform or Connect MCP [#connect-through-platform-or-connect-mcp]

**Connect the app separately on each surface.** Connections created on Platform (`dashboard.composio.dev`) are isolated from For You / Connect MCP and do not carry over. To use Google Docs, Sheets, or Workspace through Connect MCP, ask the MCP server to connect the app from the client flow and complete that OAuth flow.

---

# Google Drive (/kb/guide/toolkits-googledrive)

Use this guide to upload and download Google Drive files, choose an execution path, configure OAuth and webhooks, and troubleshoot account or session issues.

## Upload and download Google Drive files [#upload-and-download-google-drive-files]

**Pass local paths or URLs through SDK auto file handling.** For tools that support file-upload parameters such as `s3key`, `mimetype`, and `name`, the SDK can rewrite those parameters automatically. The caller can pass a local file path or URL string, and the SDK reads the file, uploads it to Composio-managed storage, and constructs the provider payload before executing the tool. For `GOOGLEDRIVE_UPLOAD_FILE`, passing `file_to_upload: "/path/to/file.pdf"` is the intended SDK pattern when auto file handling is enabled.

**Plan for temporary download URLs and storage.** Downloaded files are staged in temporary S3-backed storage and exposed through presigned URLs. The default presigned URL TTL is 1 hour, and that URL expiration can be customized in Project Settings -> File TTL. The staged files themselves are short lived and are deleted from Composio storage after about 24 hours / one day.

**Disable auto file handling when raw output is required.** If the SDK is converting downloaded file output into a local path and the application needs the raw URL or file payload, disable automatic file handling for the execution path. Use the documented `auto_upload_download_files=False` / disabling-auto-file-handling option, and make sure the relevant Composio SDK packages are upgraded to a version that supports that behavior.

## Choose MCP or direct execution [#choose-mcp-or-direct-execution]

**Discover less common Connect MCP tools with meta-tools.** Connect MCP exposes a curated direct tool set so the assistant does not load hundreds or thousands of tools into context. Less common or higher-risk Google Drive actions, including `GOOGLEDRIVE_GOOGLE_DRIVE_DELETE_FOLDER_OR_FILE_ACTION`, should be discovered at runtime with `COMPOSIO_SEARCH_TOOLS` and executed with `COMPOSIO_MULTI_EXECUTE_TOOL`.

**Prefer direct execution for a deterministic file-browser UI.** Using Composio MCP for a Google Drive file browser is feasible, but MCP servers are designed primarily for AI assistant integrations. For a product UI or deterministic file browser, prefer Direct Tool Execution through the Composio SDK or APIs so the application controls the tool calls, arguments, and rendering flow directly.

## Configure Google OAuth, scopes, and webhooks [#configure-google-oauth-scopes-and-webhooks]

**Use a public endpoint for watch and change webhooks.** Google Drive webhook payloads need to be delivered to a public domain or publicly reachable endpoint. A private-domain listener is not sufficient for Composio's server to send the webhook payload.

**Use customer-owned OAuth credentials with verified scopes.** Google can block the OAuth flow when the OAuth app is not verified for the requested sensitive or restricted scope. Configure and verify the required scope on the customer's Google Cloud OAuth app, then use those credentials in the Composio auth config. Also verify that the auth config requests only the intended scopes.

**Choose the narrowest scope that supports the workflow.** The `drive.file` scope allows access to files the app creates or that the user
explicitly grants to it. A workflow that needs broader full-drive access may
require the `drive` scope on the customer's Google OAuth app. Configure and
verify only the scopes the product actually needs.

## Troubleshoot account, toolkit, and session execution [#troubleshoot-account-toolkit-and-session-execution]

**Check for an invalid toolkit version when a tool is missing.** If a Google Drive tool appears missing, check whether the request is pinned to a toolkit version that exists. Passing an invalid version such as a non-existent dated version can make tools unavailable. Retry with a valid Google Drive toolkit version, or use the latest version when a pinned version is not required.

**Confirm the connected identity with `GOOGLEDRIVE_GET_ABOUT`.** Run `GOOGLEDRIVE_GET_ABOUT` for the connected account ID to confirm the email address and identity of the Google Drive account being used. This is the quickest check when actions appear to affect a different Drive account than expected.

**Include an `arguments` object in execution requests.** When calling tool execution APIs such as `GOOGLEDRIVE_FIND_FILE`, include the `arguments` object in the request body. If the tool does not need arguments for that call, send an empty object such as `"arguments": {}` along with the connected account, user/entity ID, and version fields.

**Keep every Tool Router v2 account under the same entity.** Tool Router v2 sessions are scoped to a single entity/user ID. Every connected account included in a session must belong to that same entity, otherwise validation can fail with `ToolRouterV2_InvalidConnectedAccountIds`. Reconnect Google Drive under the same user/entity as the Gmail and Calendar accounts before combining them in one session. If needed, specify auth config IDs while creating the session so Manage Connection uses the intended auth config for each toolkit.

---

# Google Meet (/kb/guide/toolkits-googlemeet)

## Use Google Super tool slugs with a Google Super connected account [#use-google-super-tool-slugs-with-a-google-super-connected-account]

Google Super is a separate toolkit with its own tool slugs. If the connected account was created for Google Super, run the corresponding GOOGLESUPER\_\* tool, such as GOOGLESUPER\_CREATE\_MEET, instead of the GOOGLEMEET\_\* slug. A separate Google Meet auth config or connected account is not required when the workflow is intentionally using Google Super.

## Configure Meet scopes and enable the Google Meet API before creating Meet spaces [#configure-meet-scopes-and-enable-the-google-meet-api-before-creating-meet-spaces]

For Meet space creation/settings through Google Super, include the Meet scopes `https://www.googleapis.com/auth/meetings.space.created` and `https://www.googleapis.com/auth/meetings.space.settings` in the auth config, then initiate a new connection so the new scopes are granted. Also enable the Google Meet API in the Google Cloud Console project backing the OAuth app.

## Fetch transcript entries by first resolving the conference record [#fetch-transcript-entries-by-first-resolving-the-conference-record]

Start with `GOOGLEMEET_LIST_CONFERENCE_RECORDS`. It can filter conference records by meeting code, space name, or time range. Use the resulting conference record ID with `GOOGLEMEET_GET_TRANSCRIPTS_BY_CONFERENCE_RECORD_ID`, then call `GOOGLEMEET_LIST_TRANSCRIPT_ENTRIES` with the transcript resource to retrieve the spoken segments.

## 403 permission errors usually mean the conference resource is inaccessible or missing [#403-permission-errors-usually-mean-the-conference-resource-is-inaccessible-or-missing]

For a Google Meet API error like "Permission denied on resource Conference (or it might not exist)", verify that the signed-in connected account has access to the conference/artifact and that the conference record exists. Compare the provider response through a least-privileged Composio tool or Proxy Execute call; provider tokens are redacted from connected-account responses and should not be copied into a support workflow.

## Recordings and transcripts require an eligible Google Workspace edition and enabled feature [#recordings-and-transcripts-require-an-eligible-google-workspace-edition-and-enabled-feature]

Google Meet recordings and transcripts are available on several eligible Google
Workspace editions, not only Enterprise. The meeting host must have the feature,
the organization's administrator must allow it, and recording or transcription
must have been started for the meeting. Free personal accounts do not provide
the same artifact availability.

Check Google's current [Meet feature matrix](https://support.google.com/meet/answer/10459644)
and [transcript requirements](https://support.google.com/meet/answer/12849897)
when diagnosing a missing recording or transcript.

---

# Google Sheets (/kb/guide/toolkits-googlesheets)

Use this guide to connect Google Sheets, discover and run the current tools, and configure Google authentication and quotas.

## Connect Google Sheets and discover tools [#connect-google-sheets-and-discover-tools]

**Connect separately through Platform and Connect MCP.** Connections made on the Platform side (`dashboard.composio.dev`) are isolated from the For You / `connect.composio.dev/mcp` flow. A Google Sheets connection created on Platform will not automatically appear in Connect MCP. To use Sheets through Connect MCP, ask the MCP server from the client to connect Google Sheets, complete the surfaced auth link, then retry discovery/execution.

**Increase the tool-list limit when needed.** `get_raw_composio_tools` returns 20 tools by default. Pass a larger `limit` to fetch the full Google Sheets tool set, for example `.get_raw_composio_tools(toolkits=["GOOGLESHEETS"], limit=1000)`.

**Use the spreadsheet ID for MCP operations.** The Google Sheets MCP flow does not search through spreadsheets by name. Provide the spreadsheet ID directly in the chat/tool call when asking for operations such as getting sheet names.

## Update and populate spreadsheets [#update-and-populate-spreadsheets]

**Choose the current values tool for the operation.** Use `GOOGLESHEETS_VALUES_UPDATE` for one range, `GOOGLESHEETS_UPDATE_VALUES_BATCH` for multiple ranges, or `GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND` to append rows. To create and populate a new spreadsheet, call `GOOGLESHEETS_CREATE_GOOGLE_SHEET1` and then one of the current values-update actions. `GOOGLESHEETS_BATCH_UPDATE` and `GOOGLESHEETS_SHEET_FROM_JSON` are deprecated.

**Execute tools with the exact current slug.** When executing Google Sheets tools, pass the exact current slug directly as the tool identifier, for example `composio.tools.execute("GOOGLESHEETS_GET_SHEET_NAMES", executePayload)`. If a wrapper parameter like `params.toolIdentifier` is used, verify it resolves to the exact tool slug. The older `GOOGLESHEETS_LIST_TABLES` action is deprecated.

## Configure Google authentication, versions, and quotas [#configure-google-authentication-versions-and-quotas]

**Update old placeholder toolkit versions.** If Google Sheets actions fail with permission errors and logs show the base version `00000000_00`, switch to the latest Google Sheets toolkit version and check the toolkit versioning documentation.

**Use Google Super for one shared Google connection.** For the canonical guidance on using one connection across Google Workspace services, see [Google Super is a unified Google Workspace toolkit](/kb/guide/toolkits-googlesuper).

**Enter complete Google OAuth scope URLs.** When configuring Google scopes manually, use the full scope URL. For Drive access, use `https://www.googleapis.com/auth/drive` rather than shorthand values like `/drive`.

**Treat Google provider quotas separately from Composio plan limits.** A Google Sheets 429 can come from Google's API quotas even when the Composio
account has remaining tool calls. Google currently documents 300 read requests
and 300 write requests per minute per project, plus 60 reads and 60 writes per
minute per user per project. Apply exponential backoff and check
[Google's current Sheets API limits](https://developers.google.com/workspace/sheets/api/limits)
before relying on those numbers.

---

# Google Slides (/kb/guide/toolkits-googleslides)

Use this guide to discover, read, create, and connect Google Slides presentations in Composio.

## Discover and read Google Slides presentations [#discover-and-read-google-slides-presentations]

**Discover presentations through Google Drive.** Google Slides does not offer a dedicated endpoint to list all presentations through the Slides toolkit. Use `GOOGLEDRIVE_FIND_FILE` and filter Drive files with `q`, for example `mimeType = 'application/vnd.google-apps.presentation'`, then pass the returned presentation ID into the Google Slides tool.

**Pass the presentation ID to `GOOGLESLIDES_PRESENTATIONS_GET`.** `GOOGLESLIDES_PRESENTATIONS_GET` should be called with the Google Slides presentation ID. Get that ID from the presentation URL, or use the ID returned by `GOOGLEDRIVE_FIND_FILE` when discovering presentations through Drive.

**Use the same Google account for discovery and reading.** When a workflow discovers presentations with `GOOGLEDRIVE_FIND_FILE` and then reads them with `GOOGLESLIDES_PRESENTATIONS_GET`, make sure the connected Google Drive and Google Slides accounts are the same account. Otherwise the ID may be valid in Drive discovery but inaccessible to the Slides connection.

## Create and connect Google Slides workflows [#create-and-connect-google-slides-workflows]

**Create presentations through Google Super.** Google Slide creation tools were added to the Google Super toolkit. For slide creation workflows, use the relevant Google Super tools rather than trying to create a native Slides file through generic Drive text upload.

**Verify custom OAuth apps for sensitive scopes.** When using a custom Google developer app for Google Slides, the app must be verified for the sensitive Google scopes it requests. Without verification, Google may block or warn on the OAuth consent flow.

**Use the supported Google Slides trigger.** Google Slides is listed as a trigger-capable toolkit in Composio with one supported trigger.

---

# Google Super (/kb/guide/toolkits-googlesuper)

Use this guide to configure a Google Super connection and run Google Workspace actions with the required scopes and efficient filters.

## Configure Google Super access and consent [#configure-google-super-access-and-consent]

**Use one connection across supported Google Workspace services.** Google Super is a unified/superset toolkit for Google Workspace services. It can cover tools across Gmail, Google Calendar, Google Meet, and related Google APIs through one Google Super connection when the required scopes are configured.

**Remove unneeded scopes and tools carefully.** Google Super can cover all Google services including Gmail, but customers can remove scopes and tools they do not want as part of the Google Super auth/tool configuration. Make sure the remaining scopes still cover the tools the customer expects to use.

**Treat a 10-minute initiation timeout as incomplete consent.** If expired connections share status reason `Connection initiation did not complete within 10 minutes`, the OAuth flow was initiated but the user did not complete consent within the 10-minute window. No provider tokens were issued in that case, so it is not a 1-2 week refresh token expiry problem.

**Account for scopes users deselect during consent.** Google lets users selectively deselect scopes during consent. Composio marks the connection active as long as token exchange succeeds, even if the final granted scopes are a subset of the auth config's requested scopes. The auth config scopes are the blueprint, but the final permissions are decided by the end user on the consent screen.

## Enable service-specific scopes and APIs [#enable-service-specific-scopes-and-apis]

**Configure Meet scopes and enable the Google Meet API.** To use Google Meet tools through Google Super, configure `https://www.googleapis.com/auth/meetings.space.created` and `https://www.googleapis.com/auth/meetings.space.settings` in the Google Super auth config, create a new connection for the scope changes to apply, and enable the Google Meet API in Google Cloud Console.

**Include the Gmail settings scope for filter creation.** Google Super uses the same underlying Gmail API requirement for filter creation. See the canonical Gmail guidance: [Creating Gmail filters requires `gmail.settings.basic`](/kb/guide/toolkits-gmail).

**Check spreadsheet identity, access, and scope when Sheets returns 404.** For Google Super Sheets 404s, first verify the spreadsheet ID, confirm the sheet is shared with the connected Google account, and ensure the connection has `https://www.googleapis.com/auth/spreadsheets`. If those are all correct and only one tool fails, contact Composio support with the redacted request/response payload and log ID.

## Query Gmail efficiently through Google Super [#query-gmail-efficiently-through-google-super]

**Avoid label-detail fan-out when it is unnecessary.** For `GOOGLESUPER_LIST_LABELS`, setting `include_details=true` fans out into one Gmail API call per label. Accounts with many labels can become slow because the calls happen sequentially. Set `include_details=false` or omit the parameter to return to a single API call and much lower latency.

**Use the thread result estimate from current versions.** The current Gmail thread-listing response includes `resultSizeEstimate`. If it is absent through an older pinned Google Super toolkit version, compare its schema with the latest version before changing application logic.

**Filter messages with Gmail queries and label IDs.** Gmail/Google Super tools are wrappers over Google APIs, so use Gmail-style `query` filters or `label_ids` where supported to filter messages, including sent-mail style queries. If the exact filter is not exposed, submit the endpoint or parameter through the Composio request portal.

---

# Google Tasks (/kb/guide/toolkits-googletasks)

Use this guide to choose managed or customer-owned Google OAuth for Google Tasks and troubleshoot consent, scope, or token failures.

## Configure Google OAuth for Google Tasks [#configure-google-oauth-for-google-tasks]

**Follow the Google Apps credential setup guide for custom OAuth.** For a step-by-step guide to creating and configuring Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

**Enable the Google Tasks API for custom OAuth.** Enable the Google Tasks API in the Google Cloud project that owns the credentials. After enabling it under **APIs & Services**, wait a few minutes and retry.

**Choose managed or customer-owned OAuth.** Use Composio-managed OAuth for the standard connection flow. Use a custom Google OAuth app when you need control over scopes, consent-screen branding, or Google Cloud project policy. For custom OAuth, configure the app name and branding in that project and use the redirect URL shown by Composio's current auth-config flow.

## Troubleshoot Google Tasks OAuth and tool calls [#troubleshoot-google-tasks-oauth-and-tool-calls]

**Remove unverified scopes when Google reports “App is blocked.”** This error usually means the OAuth client is requesting scopes that Google has not verified for that client. Remove additional scopes beyond the defaults, or use a custom OAuth app and submit the scopes for verification.

**Validate scopes when OAuth returns `Error 400: invalid_scope`.** Verify the requested scopes and their formatting against the [Google OAuth scopes documentation](https://developers.google.com/identity/protocols/oauth2).

**Reconnect when tool calls return 401.** A 401 usually means the access token is no longer valid. Re-authenticate the connected account and retry.

---

# Granola MCP (/kb/guide/toolkits-granola-mcp)

## Composio mirrors Granola's official MCP server [#composio-mirrors-granolas-official-mcp-server]

The Granola MCP toolkit uses Granola's official MCP server. Tool names, descriptions, input definitions, and response metadata are limited to what that upstream server exposes.

* If Granola supplies only a tool name and description, that is the metadata Composio can expose.
* If Granola does not declare a response/output schema, Composio cannot invent one, so an empty output schema is not by itself evidence of a stale Composio catalog.
* If you find a mismatch, note the exact tool name and missing field. Compare it with the current official Granola MCP server behavior before attributing it to the Composio catalog.
* If the official server currently exposes a tool or schema field but the same item is absent from Composio, contact Composio support and include those comparison details.

---

# HubSpot (/kb/guide/toolkits-hubspot)

Use this guide to configure HubSpot authentication, troubleshoot OAuth connections, call HubSpot APIs, and set up triggers.

## Configure HubSpot OAuth scopes and branding [#configure-hubspot-oauth-scopes-and-branding]

**Choose the required contact scopes.** For HubSpot CRM contacts, the minimum scopes are `crm.objects.contacts.read` and `crm.objects.contacts.write`. Sensitive contact fields require the corresponding sensitive scopes such as `crm.objects.contacts.sensitive.read` and `.write`.

**Map tools to scopes before configuring the app.** Use HubSpot's own scopes documentation and Composio's scopes/tools API to map actions to required scopes. This is better than guessing scopes manually.

**Keep the HubSpot app and Composio auth config aligned.** HubSpot requires scopes to be declared in the app configuration before OAuth. The scope set on the Composio auth config should match the HubSpot app settings; HubSpot will not dynamically adjust scopes at connection time.

**Use customer-owned credentials for white-label OAuth.** Use your own HubSpot OAuth app credentials/custom auth config. That gives control over branding/consent and avoids relying on the Composio managed app for the customer-facing OAuth screen.

## Troubleshoot HubSpot OAuth connections [#troubleshoot-hubspot-oauth-connections]

**For a 400 during token exchange, check the client secret first.** Several reported customer-owned HubSpot OAuth failures were resolved by copying the correct current client secret from the HubSpot app and updating the Composio custom auth config to match. If the secret was rotated or copied from the wrong HubSpot app, HubSpot can fail token exchange with a 400.

Then check scope alignment. HubSpot is strict about required scopes:

* Required scopes configured on the HubSpot app must be present in the OAuth request/install URL `scope` parameter for successful installation.
* If the Composio auth config requests required scopes that do not match the customer-owned HubSpot app's configured required scopes, authorization/token exchange can fail.
* Optional scopes should be requested through HubSpot's `optional_scope` parameter. If the selected HubSpot account/user cannot grant an optional scope, HubSpot can omit it and the resulting token will not include that scope. Do not assume optional scopes were granted; inspect token/granted scopes before relying on optional capabilities.

For Composio-managed HubSpot auth configs, do not change the default scope set. If you need a different required/optional scope configuration, use your own HubSpot OAuth app through a custom Composio auth config.

**For an authorization loop, verify HubSpot's workspace and login state.** If the HubSpot flow loops while Composio works on its side, retry while logged into the correct HubSpot workspace and confirm the OAuth app is public/configured correctly.

**To disconnect HubSpot, delete the connected account.** Deleting the connected account disconnects the HubSpot account from Composio and stops refreshing that access token.

## Use HubSpot APIs and current toolkit versions [#use-hubspot-apis-and-current-toolkit-versions]

**Create custom HubSpot tools through authenticated API requests.** You can create a custom tool that sends authenticated requests to HubSpot API endpoints; Composio handles authentication for the connected account. Alternatively, call the provider directly with connection config/custom headers if needed.

**Handle marketing objects separately from CRM properties.** For HubSpot marketing objects such as campaigns, HubSpot does not expose a properties API in the same way it does for CRM objects. You may need to inspect or configure these from the HubSpot portal.

**Upgrade old HubSpot SDK and toolkit versions.** Older versions used slugs like `HUBSPOT_HUBSPOT_LIST_CONTACTS`; newer versions use slugs like `HUBSPOT_LIST_CONTACTS`. Update the SDK and explicitly use the latest HubSpot toolkit version.

## Configure HubSpot triggers for each customer app [#configure-hubspot-triggers-for-each-customer-app]

HubSpot webhook APIs need the specific HubSpot app that should receive webhook notifications. Get the app ID from HubSpot's webhook app documentation or developer app settings and use it when configuring triggers.

For triggers that use a customer-owned HubSpot app, `app_id` and developer API key are required because each app receives its own webhook delivery.

---

# Instagram (/kb/guide/toolkits-instagram)

## Instagram OAuth tokens are bound to the account selected in Facebook Login [#instagram-oauth-tokens-are-bound-to-the-account-selected-in-facebook-login]

Instagram connection goes through Facebook Login, where the user selects which Instagram accounts and Facebook Pages to grant access to. Once Instagram issues the token, it is bound to the specific account selected in that OAuth flow. Composio cannot repoint that token server-side to another Instagram account. To switch accounts, reconnect and select the intended Instagram account/page in the Facebook picker.

## Instagram uses Business Login and only supported/verified scopes should be configured [#instagram-uses-business-login-and-only-supportedverified-scopes-should-be-configured]

The Instagram toolkit uses Instagram API with Business Login for Instagram. OAuth errors commonly happen when unsupported or unverified scopes are configured. Prefer the default scopes where possible, because they are intended to cover the toolkit's supported actions. If configuring custom scopes, use only Meta-supported Instagram Business Login permissions and remove unsupported scopes such as `user_profile`.

## Instagram toolkit requires a Business/Creator account for supported business features [#instagram-toolkit-requires-a-businesscreator-account-for-supported-business-features]

Instagram toolkit support is for Instagram Business/Creator account flows. If you are using a personal Instagram account, convert or connect a Business/Creator account linked through Meta/Facebook as required by Instagram's API.

## Use `INSTAGRAM_LIST_ALL_MESSAGES` to fetch Instagram messages [#use-instagram_list_all_messages-to-fetch-instagram-messages]

Use `INSTAGRAM_LIST_ALL_MESSAGES` to list Instagram messages. In playground, select the correct auth config/connected account; if the desired connected account does not appear, initiate a new connection for the test account and use that auth config.

## Instagram DM send failures with code 10/subcode 2534022 are Meta's 24-hour messaging window [#instagram-dm-send-failures-with-code-10subcode-2534022-are-metas-24-hour-messaging-window]

That error is enforced by Instagram/Meta, not Composio. Instagram's messaging API only allows replies inside the 24-hour messaging window. Meta opens that window for specific interactions such as a direct DM from the user, story reply, story mention, or icebreaker/quick-reply button tap. Likes, comments, and follows do not open the window. If the qualifying interaction is older than 24 hours or never happened, the send will fail.

If you have a fresh qualifying inbound DM, an accepted message request, the correct Business/Creator account, and a successful `INSTAGRAM_LIST_ALL_MESSAGES` call, the generic 24-hour-window explanation is not sufficient. Contact Composio support with the redacted call details for further investigation.

* The current `INSTAGRAM_SEND_TEXT_MESSAGE` action sends `messaging_type: "RESPONSE"` for a normal in-window reply.

* `INSTAGRAM_MARK_SEEN` can also return the same Meta subcode. Because sender actions are more provider-limited, retest the action before assuming it is supported for every Instagram account. If it still fails, contact Composio support with the exact request or log ID.

## For custom Instagram/Meta OAuth, configure the redirect URI in the Meta app [#for-custom-instagrammeta-oauth-configure-the-redirect-uri-in-the-meta-app]

For custom Meta/Instagram OAuth apps, make sure the redirect URI is added in the correct Meta app configuration field and matches the Composio auth config redirect URI. Customers using their own auth app credentials can configure their own redirect URI.

## For Instagram DMs via n8n/Claude, Connect MCP can simplify setup [#for-instagram-dms-via-n8nclaude-connect-mcp-can-simplify-setup]

For Instagram DM workflows in MCP clients, use Connect MCP at `https://connect.composio.dev/mcp` with the `x-consumer-api-key` header copied from the current AI Clients setup in the Composio dashboard. The agent can then start the Instagram connection flow when authentication is needed.

## `INSTAGRAM_POST_IG_MEDIA_COMMENTS` failures can be caused by an incorrect `ig_media_id` [#instagram_post_ig_media_comments-failures-can-be-caused-by-an-incorrect-ig_media_id]

If `INSTAGRAM_POST_IG_MEDIA_COMMENTS` fails, verify the `ig_media_id` being passed. An incorrect media ID can cause the action to fail even when the action itself is available.

## Instagram is available as a toolkit and can be connected via a new authConfig [#instagram-is-available-as-a-toolkit-and-can-be-connected-via-a-new-authconfig]

Instagram is available in the Composio marketplace. Create a new Instagram authConfig, complete the OAuth connection for the Instagram account, and then use the Instagram toolkit tools. The authConfig ID / integration ID can be found from the dashboard.

## Publish local media with `image_file` or `video_file` [#publish-local-media-with-image_file-or-video_file]

For a locally generated JPEG, PNG, or video, use `INSTAGRAM_POST_IG_USER_MEDIA` and pass the staged file through `image_file` or `video_file`. Upload or stage the file first; a raw local path, workspace/session path, or stale storage key can fail before Meta receives the request. Follow with `INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH` when the create step succeeds.

Alternatively, use `image_url` or `video_url` only when it is a direct HTTP(S) media URL that Meta can fetch without authentication. The older `INSTAGRAM_CREATE_MEDIA_CONTAINER` path is URL-only and does not accept local files directly.

If the error says `Failed to download file with s3key ... storage returned HTTP 404`, re-stage the file and retry with the fresh `FileUploadable` object. Treat this as a Composio file-reference failure before provider execution, not an Instagram OAuth failure.

---

# Intercom (/kb/guide/toolkits-intercom)

## Use External Pages or a custom agent when connecting MCP knowledge to Intercom Fin [#use-external-pages-or-a-custom-agent-when-connecting-mcp-knowledge-to-intercom-fin]

Composio does not control how Intercom Fin retrieves knowledge inside Intercom. For this use case, either push MCP-derived content into Fin's Content Library by creating and managing Intercom External Pages, or build a custom AI agent with Composio SDKs that connects to both the MCP server and Intercom for support workflows such as replying to conversations, creating tickets, and managing contacts.

## INTERCOM\_LIST\_ALL\_COMPANIES per\_page limit is 60 [#intercom_list_all_companies-per_page-limit-is-60]

For Intercom company listing through Composio, keep `per_page` at 60 or lower. The generic Intercom pagination page can be misleading for this endpoint; Composio verified the list companies endpoint limit as 60 and updated the field description accordingly.

## Update Python SDK packages when Intercom tool schemas fail on reserved parameter names [#update-python-sdk-packages-when-intercom-tool-schemas-fail-on-reserved-parameter-names]

This reserved-keyword schema issue was fixed in the SDK. Ask the user to update both `composio` and `composio-langchain` to the latest available versions; the fix was available by SDK version `0.11.4`.

---

# Jira (/kb/guide/toolkits-jira)

## Keep Jira OAuth scopes within Atlassian's supported set [#keep-jira-oauth-scopes-within-atlassians-supported-set]

Jira/Atlassian limits an OAuth app to 50 scopes, and unsupported or mismatched scopes can make consent fail. For a customer-owned app, keep the auth config aligned with the scopes approved on that Atlassian app. Diagnose current managed-auth failures from the current consent error and auth config rather than from previously resolved scope behavior.

## Pin custom Jira authConfig when creating Tool Router sessions [#pin-custom-jira-authconfig-when-creating-tool-router-sessions]

When using a custom Jira OAuth app with Tool Router, pass the custom auth config while creating the session. If the session does not specify the Jira auth config, Tool Router can fall back to an auto-generated/default Jira config and fail to see the customer's active custom-auth connections. Pin the active BYOA config, for example `auth_configs: { jira: "<auth_config_id>" }`, so Tool Router resolves the intended Jira connected accounts.

## Jira custom token execution needs the Atlassian base URL/subdomain [#jira-custom-token-execution-needs-the-atlassian-base-urlsubdomain]

Jira expects the tenant URL in the form `https://<subdomain>.atlassian.net`. Supply the `subdomain` when initiating the connected account for OAuth2, API-key, or S2S OAuth2 auth. `JIRA_GET_SERVER_INFO` can help confirm the base URL. Do not rely on the old SDK workaround that injected a raw access token through `customConnectionData`.

## Jira search pagination tokens returned by current tools preserve search context [#jira-search-pagination-tokens-returned-by-current-tools-preserve-search-context]

Current Jira search tools wrap provider pagination tokens with the original search context. Pass the `next_page_token` returned by the same Composio action directly to its next call. If a caller instead supplies a raw Jira `nextPageToken`, it must also supply the original JQL.

Workaround:

* Do not pass a token returned by one Jira action to a different action.

* Use the token immediately for the next page.

* Do not persist old tokens or retry rejected tokens. If Jira returns `invalid or expired` even with the same original context, discard the token and restart pagination from page 1.

## Jira OAuth redirect URI must match the authConfig and Atlassian app [#jira-oauth-redirect-uri-must-match-the-authconfig-and-atlassian-app]

For Jira/Atlassian OAuth, configure the same redirect URI in both the Composio auth config and the Atlassian OAuth app. Copy the callback shown by the current auth-config flow or documentation and match it exactly. Do not reuse legacy v1 or v3 callback paths from older examples.

## Missing `audience=api.atlassian.com` can prevent Jira refresh tokens [#missing-audienceapiatlassiancom-can-prevent-jira-refresh-tokens]

Atlassian OAuth 2.0 requires `audience=api.atlassian.com` in the authorization URL. Without this parameter, Atlassian may not honor `offline_access`, meaning no refresh token is returned and the access token expires without being refreshable. If Jira credentials expire immediately, check whether the connected account is missing `offline_access` and whether the Jira OAuth config includes the required `audience` parameter. As an urgent workaround, API key auth with Atlassian email + API token can provide stable non-expiring credentials.

## Use `JIRA_GET_CREATE_METADATA_ISSUE_TYPE_FIELDS` instead of deprecated create metadata behavior [#use-jira_get_create_metadata_issue_type_fields-instead-of-deprecated-create-metadata-behavior]

Use `JIRA_GET_CREATE_METADATA_ISSUE_TYPE_FIELDS` for the closest replacement behavior to the deprecated `JIRA_GET_ISSUE_CREATE_METADATA` flow. The replacement was added after Jira deprecated the older create-metadata API behavior.

## Download Jira attachments with `JIRA_GET_ATTACHMENT` [#download-jira-attachments-with-jira_get_attachment]

Use `JIRA_GET_ATTACHMENT` to retrieve the binary content of a Jira attachment by attachment ID. This tool is intended for downloading a specific file attached to a Jira issue.

## Jira tool-call payload retention follows the project log-storage setting [#jira-tool-call-payload-retention-follows-the-project-log-storage-setting]

Composio manages Jira OAuth tokens and returns Jira API responses to the customer's application. Whether request and response payloads are retained in Composio tool logs follows the project's log-storage setting; **Don't store data** omits payload content from new log rows but preserves audit metadata. The customer's own agent or application may retain tool outputs separately.

## Jira service account use requires customer-owned credentials and scopes [#jira-service-account-use-requires-customer-owned-credentials-and-scopes]

For Jira service-account-style usage, customers should use their own credentials with the required Jira and Jira service-account scopes when no dedicated managed auth app is available for that flow.

---

# Kickbox (/kb/guide/toolkits-kickbox)

## Single verification auth and EU endpoint checks [#single-verification-auth-and-eu-endpoint-checks]

For `KICKBOX_SINGLE_VERIFICATION_API`, the Composio credential field is `generic_api_key`. For direct/custom credential execution, customers should pass:

```json
{
  "val": {
    "generic_api_key": ""
  }
}
```

Do not assume `api_key` is the correct field name for Composio custom credential data. The Kickbox provider API itself documents an `apikey` query parameter, but Kickbox's official quickstart also says `Authorization: Bearer ` is accepted. Composio currently uses the Bearer header and `https://api.kickbox.com/v2/verify`, which is valid for standard Kickbox accounts.

If Kickbox returns 403 `Invalid API key`, verify:

* the redacted `custom_connection_data.val` shape

* key validity

* key permissions

* account/credit state

* whether the Kickbox account is EU-only

Kickbox docs say EU-only accounts that sign in from `app.eu.kickbox.com` must use `api.eu.kickbox.com`. If your account is EU-only, contact Composio support about a possible toolkit base-URL/region gap because the current toolkit uses the standard `api.kickbox.com` host.

Useful source docs:

* Single Verification API: [https://docs.kickbox.com/docs/single-verification-api](https://docs.kickbox.com/docs/single-verification-api)

* API Quickstart / authentication and EU endpoint note: [https://docs.kickbox.com/docs/using-the-api](https://docs.kickbox.com/docs/using-the-api)

---

# Klaviyo (/kb/guide/toolkits-klaviyo)

## Klaviyo schema keys that exceeded Claude's 64-character limit were fixed [#klaviyo-schema-keys-that-exceeded-claudes-64-character-limit-were-fixed]

For Klaviyo tool schemas that failed Claude validation because flattened nested property keys exceeded 64 characters, the backend schema-generation issue was fixed in the latest version. Update or re-fetch the latest tools/schema before retrying. The same fix also addressed top-level parameter naming issues such as `$` prefixes; nested `$` parameters were verified as accepted across major model providers and SDKs.

---

# Kommo (/kb/guide/toolkits-kommo)

## Enter only the Kommo account subdomain [#enter-only-the-kommo-account-subdomain]

The **Subdomain** field should contain only the part before `.kommo.com` in the account URL. For `https://yourcompany.kommo.com`, enter `yourcompany`, not an email domain or a value containing `.com` or dots.

If a failed connection already exists, delete it, reconnect, and enter the corrected subdomain.

---

# LaunchDarkly (/kb/guide/toolkits-launch-darkly)

## LaunchDarkly currently uses a REST API access token [#launchdarkly-currently-uses-a-rest-api-access-token]

LaunchDarkly in Composio currently uses a LaunchDarkly REST API access token.

## OAuth client actions operate after toolkit authentication [#oauth-client-actions-operate-after-toolkit-authentication]

The LaunchDarkly toolkit includes actions such as `Create OAuth 2.0 Client`. These call LaunchDarkly endpoints like `POST /oauth/clients` after the toolkit is already authenticated with an API access token.

Use this distinction when replying to customers:

* The action can create or manage a LaunchDarkly OAuth client inside LaunchDarkly.

* The current toolkit connection still uses the LaunchDarkly REST API access
token described above.

---

# Linear (/kb/guide/toolkits-linear)

## Linear triggers require a valid `team_id` [#linear-triggers-require-a-valid-team_id]

`team_id` is required for Linear triggers. An invalid-input error during trigger or webhook creation usually means the supplied team ID is missing or invalid.

Use `LINEAR_LIST_LINEAR_TEAMS` to retrieve valid team IDs, then pass the selected team ID into the trigger configuration.

---

# LinkedIn (/kb/guide/toolkits-linkedin)

## Fix LinkedIn 426 NONEXISTENT\_VERSION by using the latest toolkit version [#fix-linkedin-426-nonexistent_version-by-using-the-latest-toolkit-version]

LinkedIn 426 `NONEXISTENT_VERSION` errors usually mean the request is using an older LinkedIn API version header. In Composio, this often happens when calls run on the base toolkit version `00000000_00` or another older pinned version. Specify the latest LinkedIn toolkit version on tool calls, or pin to the current fixed version if needed. If the error persists after switching to the latest version, contact Composio support with a failed call `logId` or request ID so the actual `LinkedIn-Version` header can be verified.

## Fetch modern LinkedIn tools with `toolkit_slug=linkedin` and `toolkit_versions=latest` [#fetch-modern-linkedin-tools-with-toolkit_sluglinkedin-and-toolkit_versionslatest]

The v3 tools-list endpoint defaults to the base toolkit version when no toolkit version is specified, which can return only legacy LinkedIn slugs. Use the singular filter `toolkit_slug=linkedin`; plural or alternate filters such as `toolkit_slugs`, `toolkits`, `app`, or `app_names` may be ignored. Add `toolkit_versions=latest`. Example: `GET /api/v3/tools?toolkit_slug=linkedin&toolkit_versions=latest&limit=100`.

## LinkedIn organization scopes depend on the toolkit and auth config [#linkedin-organization-scopes-depend-on-the-toolkit-and-auth-config]

An active LinkedIn connection can run personal/profile actions while organization actions return 403. Check the actual toolkit and scopes stored on the auth config: the standard LinkedIn flow commonly uses personal scopes, while LinkedIn Ads can request organization and advertising scopes.

For organization ACLs, page statistics, or company-page posting, use an auth config that explicitly requests the required organization scopes and reconnect so LinkedIn issues a new grant. Reconnecting an unchanged config does not add scopes. Do not assume provider approval alone means those scopes were requested by the concrete connection.

## LinkedIn post creation supports image arrays through SDK/API [#linkedin-post-creation-supports-image-arrays-through-sdkapi]

`LINKEDIN_CREATE_LINKED_IN_POST` supports image + text posting, including multiple images when using SDKs or APIs directly. Pass an array of values to the `images` field. If image posting fails, first confirm you are using a recent toolkit version, then contact Composio support with log IDs from failed tool calls if needed.

## Use Connect MCP instead of legacy Platform MCP for consumer LinkedIn connector flows [#use-connect-mcp-instead-of-legacy-platform-mcp-for-consumer-linkedin-connector-flows]

For consumer/client connector flows, use `connect.composio.dev` / Connect MCP rather than the legacy Platform MCP endpoint. The API key does not belong in the URL; configure the `x-consumer-api-key` header shown by the current AI Clients setup. If LinkedIn MCP calls fail with 401 despite an active connection, confirm the endpoint and header type. If the error persists, contact Composio support with the exact error and log ID.

## Fix LinkedIn Ads `redirect_uri` mismatch before debugging scopes [#fix-linkedin-ads-redirect_uri-mismatch-before-debugging-scopes]

If LinkedIn rejects authorization with `The redirect_uri does not match the registered value`, register the exact callback shown by the current Composio auth-config flow in the customer's LinkedIn developer app. Do not guess between legacy v1, v3, and v3.1 callback paths; copy the callback from the current setup UI or auth-config documentation and match it exactly, without adding a trailing slash.

This error occurs before a successful callback and is separate from LinkedIn product or scope approval.

## LinkedIn Ads `unauthorized_scope_error` means a requested scope is unavailable [#linkedin-ads-unauthorized_scope_error-means-a-requested-scope-is-unavailable]

LinkedIn rejects the complete OAuth request when any requested scope is unavailable to the developer app. Compare the exact auth-config scope set with the products and scopes enabled on that same LinkedIn app.

The default LinkedIn Ads flow includes OpenID Connect scopes (`openid`, `profile`, `email`) as well as advertising and organization scopes. Legacy `r_basicprofile` is not a substitute for the OpenID Connect scopes. Enable the relevant LinkedIn products or narrow a custom auth config to scopes the app actually has, then reconnect.

---

# Mailchimp (/kb/guide/toolkits-mailchimp)

## Mailchimp server prefix is the URL prefix before .admin.mailchimp.com [#mailchimp-server-prefix-is-the-url-prefix-before-adminmailchimpcom]

When connecting Mailchimp, pass the correct server prefix. It is the part of the Mailchimp URL before `.admin.mailchimp.com`. For example, if the Mailchimp URL is `https://us19.admin.mailchimp.com/`, the server prefix is `us19`. A wrong prefix can cause Mailchimp API calls to fail even if the API key/token itself looks correct.

## Use subdomain or dc, not server\_prefix, for Mailchimp connectionConfig [#use-subdomain-or-dc-not-server_prefix-for-mailchimp-connectionconfig]

For Mailchimp API connection configuration, send `connectionConfig.subdomain` with the server prefix value, or use the legacy alias `dc`. Do not send `server_prefix`; that key is ignored by the validator and may fall back to a default such as `us21`. The UI label may say Server Prefix, but the API field name is `subdomain`.

## Some Mailchimp tools require at least the Mailchimp Essentials plan [#some-mailchimp-tools-require-at-least-the-mailchimp-essentials-plan]

If Mailchimp tools fail despite the connection looking correct, check the customer's Mailchimp plan. Some Mailchimp API/tool capabilities require at least the Mailchimp Essentials plan. A free Mailchimp account may not be enough for the requested tool flow.

## Mailchimp Proxy Execute with raw access token also needs subdomain [#mailchimp-proxy-execute-with-raw-access-token-also-needs-subdomain]

When using Proxy Execute with Mailchimp custom connection data, include both the OAuth access token and Mailchimp `subdomain`/server prefix. The endpoint can then be called through `/api/v3/tools/execute/proxy` with `toolkitSlug: "mailchimp"`, `authScheme: "OAUTH2"`, and `val` containing `access_token` plus `subdomain` such as `us20`.

## Mailchimp has trigger support in the supported-trigger toolkit list [#mailchimp-has-trigger-support-in-the-supported-trigger-toolkit-list]

Mailchimp appears in the supported-trigger toolkit list. Before using a specific Mailchimp trigger, verify that the exact trigger or event exists in the current toolkit. If it does not, submit the use case through the Composio request portal.

---

# Marketstack (/kb/guide/toolkits-marketstack)

## API Coverage [#api-coverage]

Marketstack's official APILayer v2 OpenAPI spec includes live and intraday market data endpoints that are not yet exposed by the current Composio Marketstack toolkit actions:

* `/stockprice`

* `/intraday`

* `/intraday/latest`

* `/intraday/{date}`

* `/tickers/{symbol}/intraday`

* `/tickers/{symbol}/intraday/latest`

* `/exchanges/{mic}/intraday`

* `/exchanges/{mic}/intraday/latest`

* `/exchanges/{mic}/intraday/{date}`

Supported intraday intervals in the OpenAPI spec are `1min`, `5min`, `10min`, `15min`, `30min`, and `1hour`. Intraday docs note that some TOPS feed fields can be null without IEX entitlement, while derived intraday data is available without an additional IEX market data agreement.

Current Composio toolkit coverage includes EOD, ticker EOD, ticker EOD latest, ticker info/listing, exchange info/listing, splits, dividends, and currencies. Live quotes and 1D charts are not currently exposed as Marketstack toolkit actions; submit those capabilities through the Composio request portal rather than treating them as provider limitations.

Do not promise Marketstack support for gainers, losers, most-active, movers, or sector-performance endpoints based on current v2 docs. Those paths are not present in the official OpenAPI spec as of 2026-06-21.

---

# Microsoft Teams (/kb/guide/toolkits-microsoft-teams)

Use this guide to configure Microsoft Teams scopes, fix stale OAuth metadata, connect through MCP, and troubleshoot chat or tool execution.

## Configure Microsoft Teams scopes and Azure consent [#configure-microsoft-teams-scopes-and-azure-consent]

**Check delegated permissions against the latest tool version.** For Microsoft Teams scope checks, call `/api/v3/tools/get_scopes_required` with the exact tool slug and include `toolkit_versions[microsoft_teams]=latest` when needed. Without the explicit toolkit version, the API may return data from the old `00000000_00` version.

**Use the delegated scopes required by each action.** `MICROSOFT_TEAMS_CHATS_GET_ALL_CHATS` can use `Chat.ReadBasic`, `Chat.Read`, or `Chat.ReadWrite`. `MICROSOFT_TEAMS_CREATE_MEETING` requires `OnlineMeetings.ReadWrite`. Confirm exact required scopes with the latest versioned scope endpoint before changing auth config scopes.

**Use customer-owned Azure credentials when custom scopes are needed.** For Microsoft Teams, recommend using the customer's own Azure/Microsoft developer app credentials when custom scopes are needed. Additional scopes should be added in the Microsoft app, and admin consent may need to be granted in Azure before the connection has usable permissions.

## Fix the invalid OAuth scope `ChannelMessage.Read.Group` [#fix-the-invalid-oauth-scope-channelmessagereadgroup]

If Microsoft Teams OAuth fails before consent with:

```text
AADSTS650053: The application asked for scope 'ChannelMessage.Read.Group' that doesn't exist on the resource Microsoft Graph.
```

treat `ChannelMessage.Read.Group` as the wrong auth layer for the Composio delegated OAuth flow. It is a Microsoft Teams resource-specific consent (RSC) permission, not a normal Microsoft Graph OAuth scope to include in an OAuth `/authorize` URL.

Debug steps:

* Check whether the customer is using v3 base/default tool metadata or old Teams slugs.

* `MICROSOFT_TEAMS_TEAMS_GET_MESSAGE` on v3 base can return `ChannelMessage.Read.Group`; the latest/v3.1 replacement is `MICROSOFT_TEAMS_GET_CHANNEL_MESSAGE`.

* Use v3.1 or pass `toolkit_versions[microsoft_teams]=latest` when fetching tools/scopes.

* Remove `ChannelMessage.Read.Group` from the OAuth auth config scopes and use `ChannelMessage.Read.All`, `Group.Read.All`, or `Group.ReadWrite.All` according to the latest tool scope response.

* If an existing auth config already includes the invalid scope, update or recreate it and reconnect. Existing connected accounts may need refresh/reconnect depending on how the customer propagates scope changes.

Minimal stale-path repro:

```bash
curl --globoff 'https://backend.composio.dev/api/v3/tools/MICROSOFT_TEAMS_TEAMS_GET_MESSAGE' \
  -H 'x-api-key: <key>'
```

Expected stale response includes `version: "00000000_00"` and `scopes: ["ChannelMessage.Read.Group"]`.

Clean path:

```bash
curl --globoff 'https://backend.composio.dev/api/v3.1/tools/MICROSOFT_TEAMS_GET_CHANNEL_MESSAGE' \
  -H 'x-api-key: <key>'
```

Expected clean response includes `ChannelMessage.Read.All`, not `ChannelMessage.Read.Group`.

## Connect Teams through MCP and Tool Router [#connect-teams-through-mcp-and-tool-router]

**Match the MCP URL user ID to the connected account.** For Microsoft Teams MCP, the user ID in the MCP server URL/query params must match the user ID attached to the connected account. If the connection is bound to an email/GUID, use that value in the MCP URL or create a new server/connection with the desired user ID.

**Pass Tool Router memory as a list under the toolkit key.** When passing Tool Router memory for Microsoft Teams, use a real list under the `microsoft_teams` key, for example `"memory": { "microsoft_teams": ["Session id..."] }`. Do not pass escaped square brackets as a string.

## Create chats and troubleshoot tool execution [#create-chats-and-troubleshoot-tool-execution]

**Pass two users with the correct OData bind format for one-on-one chats.** For Microsoft Teams one-on-one chat creation, pass two users, not one. Also make sure the OData bind payload uses the correct role and bind-data format expected by Microsoft Graph.

**Validate user IDs and chat membership for 400/403/404 errors.** For `MICROSOFT_TEAMS_LIST_USER_CHAT_MESSAGES`, a 400 commonly means `user_id` was not passed as a GUID or UPN. For chat members tools, 403/404 often means the connected user is not part of the meeting chat or the chat ID is not in that user's scope. Use `MICROSOFT_TEAMS_LIST_USERS` to find valid user IDs and verify the connected user is a participant in the target chat.

**Increase `limit` when the tool list stops at 20.** When fetching Microsoft Teams tools by toolkit, the default list may return only 20 tools. Increase the `limit` parameter or search for exact tool slugs to retrieve the full set.

**Prefer replacement slugs over restored deprecated aliases.** Some old Microsoft Teams slugs were deleted during cleanup and then restored with a deprecated flag and descriptions pointing to the correct replacement slugs. If a Teams slug suddenly disappears or changes, check the latest toolkit version/changelog and prefer the replacement slug.

---

# Monday (/kb/guide/toolkits-monday)

## Monday requires the OAuth app to be installed in the workspace before user connections [#monday-requires-the-oauth-app-to-be-installed-in-the-workspace-before-user-connections]

Monday is unusual among popular toolkits because the OAuth app must be installed in the Monday workspace before users initiate individual OAuth connections. An admin can install the app once for the workspace, then users can connect normally. For Composio's managed Monday app, use the official installation control or link exposed by the current connection flow. Do not construct or share a raw OAuth URL with a hard-coded client ID.

## Add the Composio redirect URL to the Monday OAuth app [#add-the-composio-redirect-url-to-the-monday-oauth-app]

For a custom Monday OAuth app, add the Composio redirect URL/callback URL to the Monday app settings. After the OAuth flow completes, the access token is populated by Composio automatically.

## `MONDAY_UPDATE_ITEM` body must be passed as a properly escaped string [#monday_update_item-body-must-be-passed-as-a-properly-escaped-string]

`MONDAY_UPDATE_ITEM` expects the body in a format Monday's API accepts. If you pass JSON-like text or strings containing quotes/special characters, escape those characters and send a suitable string rather than unsupported raw structured content.

## Tool Router may prefer `MONDAY_MCP` over `MONDAY` when both are available [#tool-router-may-prefer-monday_mcp-over-monday-when-both-are-available]

If both `MONDAY` and `MONDAY_MCP` are enabled, Tool Router may choose `MONDAY_MCP` for search/execution. If you specifically need the regular Monday toolkit, disable `monday_mcp` in the session or narrow toolkit availability so `COMPOSIO_SEARCH_TOOLS` returns the intended tools.

## Monday scopes come from the OAuth app and do not need separate Composio-side setup in the common flow [#monday-scopes-come-from-the-oauth-app-and-do-not-need-separate-composio-side-setup-in-the-common-flow]

For Monday, the scopes configured on the Monday OAuth app are picked up during authorization. In the common flow, there is no separate Composio-side scope configuration required unless you intentionally request a subset.

## Monday trigger management is not handled by the agent at runtime [#monday-trigger-management-is-not-handled-by-the-agent-at-runtime]

Trigger setup and management should be handled outside the agent runtime, for example through the CLI/API/dashboard flow. The agent should consume trigger payloads, not create or manage trigger instances as part of normal tool execution.

---

# NetSuite (/kb/guide/toolkits-netsuite)

## NetSuite OAuth token exchange failures can be caused by generic OAuth endpoints [#netsuite-oauth-token-exchange-failures-can-be-caused-by-generic-oauth-endpoints]

For NetSuite OAuth2 callback/token-exchange failures, verify whether the OAuth flow is using the customer's account-specific NetSuite authorize/token endpoint. NetSuite expects OAuth endpoints to be keyed to the NetSuite account subdomain; using a generic endpoint can produce a token-exchange failure that looks like a permissions or role problem. Check the decoded token-exchange response before advising the customer to change NetSuite roles.

---

# Notion (/kb/guide/toolkits-notion)

Use this guide to choose current Notion tools and triggers, understand integration access, and troubleshoot connection or response-size issues.

## Use current Notion tools and triggers [#use-current-notion-tools-and-triggers]

**Retrieve pages with the current tool slug.** `NOTION_GET_PAGE` is not the current valid slug. Use `NOTION_RETRIEVE_PAGE`, and verify available Notion tools from the marketplace/tool listing.

**Fetch Notion data with the current tool slug.** `NOTION_FETCH_NOTION_DATA` is not valid. Use `NOTION_FETCH_DATA` instead.

**Choose the trigger that matches the Notion event.** The current Notion catalog includes separate triggers for page creation, page content updates, page property updates, and data-source schema updates. Choose the trigger that matches the event rather than expecting a page-created trigger to fire for edits. Fetch the current trigger catalog before implementation and use the exact returned slug.

## Configure Notion access and connected accounts [#configure-notion-access-and-connected-accounts]

**Grant page and database access through the Notion integration.** Notion does not model access as normal OAuth scopes. Page/database access is granted per Notion integration/OAuth client ID through Notion “Capabilities” and workspace grants. If multiple Composio auth configs use the same underlying Notion integration, page authorization can overlap.

**Treat auth config selection as connection lookup behavior.** Existing connected accounts under a different auth config continue to refresh and work. Specifying an auth config affects which connection get/use functions look for; it does not rewrite refresh behavior for already-valid connected accounts.

## Troubleshoot Notion connections and large responses [#troubleshoot-notion-connections-and-large-responses]

**Check for a revoked integration when Notion returns 401 or refresh fails.** A Notion refresh failure with “Invalid refresh token” is usually a token revocation issue. Common causes are the user disconnecting the integration in Notion settings or a workspace admin removing/blocking the integration.

**Keep Notion responses focused.** Large response payloads and overly complex structures can degrade agent behavior. Prefer narrower fetches/filters where available and track product improvements for simpler response structures.

---

# Odoo (/kb/guide/toolkits-odoo)

## JSON-RPC access errors can arrive inside HTTP 200 responses [#json-rpc-access-errors-can-arrive-inside-http-200-responses]

`ODOO_CALL_ODOO_JSONRPC` can receive HTTP 200 while the JSON-RPC body contains an `error` such as `access denied`. HTTP success only confirms transport; inspect the returned JSON-RPC envelope.

Verify the instance URL, database name, API key, and the Odoo user's permission for the requested model and method. Prefer current JSON-2 tools where they cover the use case. If the body still contains an application error, share the Composio log ID and timestamp without sharing the API key.

---

# OneDrive (/kb/guide/toolkits-one-drive)

Use this guide to configure OneDrive OAuth, execute current file tools, and control Tool Router sessions safely.

## Configure OneDrive OAuth and scopes [#configure-onedrive-oauth-and-scopes]

**Verify Azure app setup and recreate the auth config after changes.** For OneDrive custom OAuth failures, first verify the Azure OAuth app setup, especially credentials and redirect URLs. If the Azure app settings were changed, create a new Composio integration/auth config with the updated configuration and retry the connection.

**Derive Microsoft Graph permissions from the tools.** For OneDrive and other Microsoft Graph-backed toolkits, use `/api/v3/tools/get_scopes_required` with the relevant tool slugs to determine the scopes needed by those tools. This is more reliable than manually guessing Microsoft Graph delegated permissions.

## Use current OneDrive tools and file inputs [#use-current-onedrive-tools-and-file-inputs]

**Pass `version=latest` when folder behavior looks stale.** If OneDrive folder listing or related tool behavior appears stale, pass `version: "latest"` in the tool execution request so the call uses the latest toolkit version instead of the default pinned version.

**Use supported upload inputs for file actions.** OneDrive has upload/update tools such as `ONE_DRIVE_ONEDRIVE_UPLOAD_FILE` and `ONE_DRIVE_UPDATE_FILE_CONTENT`. Where the selected action supports it, pass file content through `FileUploadable` or the shared storage/data-URI path, including base64-backed uploads.

## Configure Tool Router sessions and safety [#configure-tool-router-sessions-and-safety]

**Keep connected accounts under the same `user_id`.** In Tool Router v2, connected accounts used in one session should belong to the same `user_id`. When creating the session, pass the intended auth config IDs and make sure the connected accounts for OneDrive and the other toolkits are associated with that same user.

**Disable destructive actions with tags or exact tool slugs.** Use session-level tag controls to disable destructive tools globally or per toolkit. For OneDrive, disable the `destructiveHint` tag at the toolkit/session level, or disable exact tool slugs for finer-grained control.

---

# Microsoft OneNote (/kb/guide/toolkits-onenote)

## OneNote uses a customer-owned Microsoft OAuth app [#onenote-uses-a-customer-owned-microsoft-oauth-app]

The current `onenote` toolkit supports OAuth2 and requires a client ID and
client secret from a Microsoft Entra app registration. Enter the app's
Application (client) ID and the secret **value**, not the secret's identifier.
Register the exact redirect URI shown by the current Composio auth-config flow.

Choose the least-privileged delegated Microsoft Graph permissions that cover
the intended OneNote actions. Common permissions include `Notes.Read`,
`Notes.Create`, `Notes.ReadWrite`, and the corresponding `*.All` permissions
for notebooks available through groups or sites. Include `offline_access` when
the connection needs a refresh token. Microsoft documents the permission set in
its [Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference#notesreadwrite).

Tenant policy or higher-privilege permissions can require administrator
consent. Follow the shared Microsoft OAuth guidance and create a fresh
connection after changing the app's permissions.

---

# OpenAI (/kb/guide/toolkits-openai)

## `OPENAI_CREATE_IMAGE` supports `gpt-image-2` in the latest toolkit version [#openai_create_image-supports-gpt-image-2-in-the-latest-toolkit-version]

`gpt-image-2` has been shipped and can be used through `OPENAI_CREATE_IMAGE` on the latest toolkit version. If the model is missing, have the customer update the toolkit/tool version before retrying.

## Use `OpenAIAgentsProvider` when wiring Composio tools into OpenAI Agents [#use-openaiagentsprovider-when-wiring-composio-tools-into-openai-agents]

For OpenAI Agents, initialize Composio with `OpenAIAgentsProvider`, create a session for the user, fetch tools from the session, and pass those tools into the OpenAI Agent. This is the expected provider path when using the OpenAI Agents SDK with Composio.

## Pin auth config and connected account IDs in Tool Router sessions when a specific connection must be used [#pin-auth-config-and-connected-account-ids-in-tool-router-sessions-when-a-specific-connection-must-be-used]

When creating a Tool Router session, pass the desired `authConfigId` and `connectedAccountId` in the session creation options. Use `authConfigs: { [toolkitSlug]: authConfigId }` and `connectedAccounts: { [toolkitSlug]: connectedAccountId }` so the session uses that specific connection instead of relying on discovery/default selection.

## Use `beforeExecute` modifiers to add a human approval layer before tool execution [#use-beforeexecute-modifiers-to-add-a-human-approval-layer-before-tool-execution]

Composio SDK modifiers can be used to add a gating layer before tool execution. Implement a `beforeExecute` modifier to inspect the tool call, request approval, and only allow the execution to continue when the customer's approval logic passes.

## Provider/schema compatibility errors often require upgrading Composio SDK packages together [#providerschema-compatibility-errors-often-require-upgrading-composio-sdk-packages-together]

When debugging provider/schema errors with OpenAI or LangChain-style integrations, upgrade both the core Composio package and the relevant provider package to their latest compatible versions before retesting.

---

# Outlook (/kb/guide/toolkits-outlook)

Use this guide to authorize Outlook, resolve Microsoft tenant consent, and target the correct mailbox or account through MCP and direct execution.

## Connect and authorize Outlook [#connect-and-authorize-outlook]

**Authenticate the cloud Microsoft account in a browser.** Outlook tools authenticate through the Microsoft account/OAuth flow in a browser. Even if you only use Outlook desktop, log into the underlying Microsoft/Outlook account in the browser to complete OAuth. Desktop and cloud use the same account, so once the account is authenticated, the tools can operate against that mailbox.

**Check exact tool scopes, then reconnect after changes.** For Outlook 403s, look up required scopes with `/api/v3/tools/get_scopes_required` using the exact Outlook tool slug, not the toolkit name. For example `OUTLOOK_GET_MAILBOX_SETTINGS` requires `MailboxSettings.ReadWrite`. After adding scopes to the auth config, create a new auth link session and have the user reconnect so the new scopes are granted.

**Complete auth links within about 10 minutes.** If a connected account expires because the initiation flow was not completed, the likely reason is that the authorization link timed out. Users have roughly a 10-minute window to complete the auth flow; otherwise Composio invalidates the link and marks the connected account `EXPIRED`.

## Grant Microsoft tenant admin consent [#grant-microsoft-tenant-admin-consent]

Microsoft/Outlook admin-consent issues are Microsoft 365 tenant-level approval problems, not a Composio-side connection configuration issue. Adding delegated permissions to an Azure app registration is not the same as granting tenant admin consent. Once a tenant admin grants consent for the requested permissions, affected users should start a fresh normal Outlook connection flow with their own accounts; the admin does not need to connect every user individually.

Two concrete ways an admin can approve:

1. **App Registration / OAuth app level:** in Microsoft Entra / Azure Portal, go to **App registrations**, open the OAuth app, go to **API permissions**, click &#x2A;*Grant admin consent for \[Tenant Name]**, then confirm/save.

2. **Enterprise Applications / org level:** in Microsoft Entra / Azure Portal, go to **Enterprise applications**, find the Composio/Outlook app or the customer's own service principal, open **Permissions** / admin-consent controls, then grant admin consent for the organization.

For the Composio-managed Outlook app, Microsoft's in-flow `sign in as an admin` / `Connectez-vous avec ce compte` link is also a real tenant-admin consent path. If the admin signs in through that same OAuth attempt, that attempt may connect the admin's mailbox, not the original user's mailbox; treat that connected account as the admin's and have the original user start a fresh Connect flow afterward. Incomplete/pending Outlook connection attempts expire after about 10 minutes, so an expired non-admin attempt cannot be resumed. Nothing needs to happen on Composio's side between the admin grant and the user's retry: no cache clear, webhook, or manual status change.

Composio does not publish a `client_id` for its managed Outlook app for use in direct Microsoft `adminconsent` URLs. Do not guess this value. For a customer-owned/BYOA Azure app, use your own app's `client_id` and tenant ID in Microsoft's admin-consent URL.

A customer-owned verified-publisher Azure app can improve branding/control and may reduce consent friction in tenants that allow user consent for verified publishers and the requested delegated permissions. It does not guarantee that no admin approval is needed: each Microsoft tenant's user-consent policy and the exact scopes requested still decide whether admin consent is required.

## Use Outlook through MCP and direct execution [#use-outlook-through-mcp-and-direct-execution]

**Expect Tool Router meta-tools on Connect MCP.** `connect.composio.dev/mcp` uses Tool Router architecture, so it intentionally exposes meta-tools such as `COMPOSIO_SEARCH_TOOLS` and `COMPOSIO_MULTI_EXECUTE_TOOL`. The agent discovers and executes Outlook tools at runtime through those meta-tools. If you need specific Outlook tools without meta-tool round trips, use SDK direct execution or create a focused MCP config with selected Outlook tools.

**Remove obsolete slugs from MCP configs.** If an Outlook MCP config fails due to obsolete or invalid tool slugs, update the MCP config to remove them and include only current supported tools in `allowed_tools`. This can be done through the dashboard or the MCP patch endpoint.

**Pass attachment file paths through the SDK.** When using SDK automatic file handling for email attachments, pass the local file path directly in the `attachment`/`attachments` argument. Do not pass only a filename or raw content fields unless the tool schema explicitly asks for them.

## Target shared mailboxes and multiple accounts [#target-shared-mailboxes-and-multiple-accounts]

**Pass the shared mailbox address as `user_id` or the mailbox target.** Delegated access must already be granted in the Microsoft tenant. This applies to delegated and S2S/application auth patterns where the tenant permissions allow shared mailbox access.

**Select an aliased account on every multi-account call.** For multi-account Outlook sessions, every connected account needs a unique non-null alias, the session should set `multi_account.enable=true` and `require_explicit_selection=true`, and the LLM must set the `account` field on each item in `COMPOSIO_MULTI_EXECUTE_TOOL.tools[]`. Without explicit selection, Tool Router cannot disambiguate and may default to one account.

---

# Perplexity AI authentication (/kb/guide/toolkits-perplexityai)

## Perplexity AI uses the `generic_api_key` connection field [#perplexity-ai-uses-the-generic_api_key-connection-field]

The current `perplexityai` toolkit uses API-key authentication. Create the key
in Perplexity's console and provide it as `generic_api_key` during connection
initiation. The key is shown once by the provider, so store it in the
customer's secret manager and never send it to support.

If a first-party Perplexity tool succeeds but an equivalent Proxy Execute call
returns 401 with the same connection, collect both Log IDs and the redacted
request path. That comparison distinguishes a proxy auth-injection problem from
an invalid provider key without asking the customer to rotate a working key.

---

# Pipedrive (/kb/guide/toolkits-pipedrive)

Use this guide to configure Pipedrive authentication, initiate connections, and use Pipedrive triggers.

## Configure Pipedrive authentication [#configure-pipedrive-authentication]

**Use custom OAuth or API-key credentials.** Composio-managed OAuth is not currently available for Pipedrive. Create a custom auth config with your Pipedrive OAuth app, or use API-key authentication when that better fits your security requirements.

**Pass the workspace subdomain during OAuth initiation.** When initiating a Pipedrive OAuth connection, pass the Pipedrive workspace subdomain or domain expected by the auth config. For example, if the workspace is `your-workspace.pipedrive.com`, pass `your-workspace` rather than the full hostname.

**Complete custom OAuth setup through Composio.** Enable the app in Composio and complete setup there with your developer app credentials. Do not try to install the custom app directly from Pipedrive's OAuth app settings. During the Composio connection flow, provide the Pipedrive subdomain when requested.

**Let hosted auth links collect required fields.** Use hosted auth links when you want Composio to collect required provider-specific fields during connection initiation. You can also inspect the auth config or toolkit metadata to see the expected input fields before starting the connection.

## Initiate Pipedrive connections and use triggers [#initiate-pipedrive-connections-and-use-triggers]

**Pass a callback URL when initiating auth.** When initiating a Pipedrive connection through SDK or API, pass `callback_url` or `callbackUrl` in the connection initiation call. Composio redirects the user to that URL after the provider authentication flow completes.

**Check the current trigger catalog before relying on a count.** Pipedrive has trigger support. Verify the current trigger list in the toolkit catalog before naming an exact count.

---

# PostHog (/kb/guide/toolkits-posthog)

## PostHog is API-key based; use the PostHog API key when creating the connection [#posthog-is-api-key-based-use-the-posthog-api-key-when-creating-the-connection]

PostHog is API-key based in Composio. Use the customer's PostHog API key when creating the connection. For connected-account creation, pass the key in the API-key auth state, for example with `generic_api_key` or the required field name returned by toolkit metadata.

## Configure PostHog subdomain for EU or self-hosted instances [#configure-posthog-subdomain-for-eu-or-self-hosted-instances]

For EU or self-hosted PostHog instances, configure the PostHog `subdomain` or instance value instead of assuming the default cloud host. Inspect the current auth-config and connection-initiation fields to confirm where the active toolkit accepts that value.

## Pass auth config into Tool Router sessions; platform-created auth configs are not automatically usable [#pass-auth-config-into-tool-router-sessions-platform-created-auth-configs-are-not-automatically-usable]

When using PostHog through Tool Router MCP, include the auth config in the Tool Router session so the generated MCP URL has the correct auth config details. Auth configs or connected accounts created on the platform side are not automatically available inside every Tool Router session unless they are passed/associated correctly.

## Create a PostHog integration/auth config before expecting it in auth\_configs API results [#create-a-posthog-integrationauth-config-before-expecting-it-in-auth_configs-api-results]

`/api/v3/auth_configs` lists the active auth configs/integrations already created in the project. If PostHog is missing or the response is empty, create a PostHog auth config/integration first, then connect the account to it.

## Fetch PostHog tool schema to see required fields for a tool call [#fetch-posthog-tool-schema-to-see-required-fields-for-a-tool-call]

If a PostHog tool call fails because of missing or mixed-up parameters, fetch the tool schema by slug, for example `/api/v3/tools/POSTHOG_CREATE_PROJECT_INSIGHTS_WITH_FORMAT_OPTION`, using the project API key. The schema response shows the required fields and expected shapes for that tool call.

---

# QuickBooks (/kb/guide/toolkits-quickbooks)

Use this guide to configure QuickBooks OAuth for the correct environment, maintain connections, and target the intended company account.

## Configure QuickBooks OAuth for the environment [#configure-quickbooks-oauth-for-the-environment]

**Use the sandbox API base URL for sandbox accounts.** For QuickBooks sandbox accounts, pass `https://sandbox-quickbooks.api.intuit.com` as the URL/base URL when initiating the connection. Production connections should use the production Intuit API base URL.

**Match Intuit credentials and the Composio redirect URL.** When creating a QuickBooks auth config, enter the QuickBooks OAuth credentials from the Intuit developer app and configure the Composio redirect URL in the QuickBooks auth app. A mismatch or missing redirect URL can break the OAuth flow.

**Use current toolkit support for custom auth and token URLs.** QuickBooks toolkit support accepts auth and token URLs during connection initiation. If you need sandbox or custom Intuit OAuth endpoints, use a toolkit version that supports passing those URLs.

**Request the payment scope only when payment access is enabled.** If the QuickBooks OAuth flow includes the payments scope `com.intuit.quickbooks.payment`, the QuickBooks payment module must be enabled for that account/app. If the customer does not need payment tools, remove that scope and retry the connection.

## Maintain the QuickBooks connection and auth experience [#maintain-the-quickbooks-connection-and-auth-experience]

**Let Composio refresh tokens and retry transient failures.** QuickBooks OAuth refresh is handled by Composio through the provider's token endpoint. The current refresh path retries transient failures and uses credential-expiry timing rather than promising a fixed 15-minute schedule. If the provider conclusively rejects the grant or failures persist past the platform's retry budget, the connected account expires and the user must reauthenticate through a new auth link.

**Send users directly to Intuit when the hosted auth screen should be skipped.** The Composio auth screen can be skipped for QuickBooks by sending users directly to the OAuth provider, following Composio's white-labeling/direct-provider auth flow. Use this when the customer wants the user to see the provider consent screen without the intermediate Composio auth screen.

## Target the correct QuickBooks account and toolkit version [#target-the-correct-quickbooks-account-and-toolkit-version]

**Retry realm or company mapping issues on the latest toolkit version.** For QuickBooks realm/company mapping issues, retry on the latest toolkit version rather than a historical pinned version.

**Use distinct account identifiers for multiple QuickBooks accounts.** Create separate connected accounts for each QuickBooks account, preferably with distinct `user_id` values. In Claude/MCP setup, append the desired `connected_account_id` or `user_id` to the MCP URL/configuration so the session targets the intended QuickBooks connection.

---

# Reddit (/kb/guide/toolkits-reddit)

## Use Connect MCP for Reddit OAuth callback failures in Claude Code [#use-connect-mcp-for-reddit-oauth-callback-failures-in-claude-code]

For Claude Code Reddit MCP OAuth callback failures on the legacy MCP path, switch the MCP server URL to `https://connect.composio.dev/mcp`. Remove the old `x-api-key` header and configure the current `x-consumer-api-key` header from the AI Clients setup. Connect MCP can then start the Reddit authorization flow from the client.

## Reddit supports managed and customer-owned OAuth 2.0 [#reddit-supports-managed-and-customer-owned-oauth-20]

Use Composio-managed OAuth for the standard connection flow. Create a custom
auth config with the customer's Reddit client ID and client secret when they
need control over provider app settings and credentials. Make sure Reddit has
approved a custom app for its intended access before using it in production.

## Reddit toolkit behavior can change when Reddit changes its API or enforcement policies [#reddit-toolkit-behavior-can-change-when-reddit-changes-its-api-or-enforcement-policies]

The Reddit toolkit depends on Reddit's underlying APIs and policy enforcement. Changes or restrictions from Reddit can affect toolkit behavior, and Reddit does not guarantee stable API behavior for all use cases. For production usage, use your own Reddit credentials to maximize control, and account for Reddit's spam and responsible builder policies when designing automations.

## Older Reddit Create Post tool versions may require `flair_id` [#older-reddit-create-post-tool-versions-may-require-flair_id]

If Reddit Create Post fails on version `00000000_00`, check whether the request is missing `flair_id`; that old version requires it. Prefer pinning a specific current toolkit/tool version to avoid breaking changes. In recent Reddit tool versions, `flair_id` is no longer required for the Create Post call.

---

# Salesforce (/kb/guide/toolkits-salesforce)

Use this guide to configure Salesforce OAuth and domains, troubleshoot connected-app access, choose current tools, and build UI bridge flows safely.

## Configure Salesforce OAuth and connection flows [#configure-salesforce-oauth-and-connection-flows]

**Use customer-owned credentials for app-level control.** The current Salesforce toolkit supports OAuth2 and server-to-server OAuth2 with
customer-owned credentials. Configure the Salesforce connected app according to
Salesforce's OAuth guidance and use its credentials in a custom Composio auth
config. This gives the customer control over scopes, branding, and provider-side
policy.

**Choose hosted auth or direct initiation based on who supplies required fields.** The Salesforce field collection interface is part of Hosted Authentication / the connection link flow. If you want Composio to collect required fields, use hosted auth. If your app already knows the Salesforce instance/subdomain values, skip that interface and call `.initiate()` directly with the required fields. Use `.refresh()` to regenerate the auth URL for an already initiated connection; `.link()` starts a new connection. If you truly need multiple connections for the same `user_id`, pass `allow_multiple=True` to `.initiate()`.

**Match the redirect URI to the current Composio callback.** Use the callback URL shown by the current Composio auth-config flow as the authorized redirect URI for custom Salesforce OAuth. This provider callback is separate from the post-auth customer redirect passed as `callback_url` / `callbackUrl` during connection initiation.

## Set the Salesforce domain and connection fields [#set-the-salesforce-domain-and-connection-fields]

**Provide the instance endpoint and My Domain subdomain.** Salesforce accepts additional connection initiation fields. Fetch the toolkit by slug (`/api/v3.1/toolkits/salesforce`) to inspect the expected fields, and fetch the connected account to see the same fields after connection. The important Salesforce fields are `My Domain Subdomain` and `Instance endpoint`. If you are initiating directly through the SDK/API, pass these fields through `.initiate()` rather than waiting for the hosted connection UI.

**Use the My Domain or API prefix when `login` is not enough.** For Salesforce, the default subdomain value is `login`, and that works in most cases. If the default or a simple org label fails, Composio needs the Salesforce login/API domain prefix rather than the full browser URL.

Use these formats:

* Default case: keep `login`.

* Standard My Domain URL: for `https://your-company.my.salesforce.com/...`, pass `your-company.my`.

* Developer Edition / Lightning URL: for `https://<org>.develop.lightning.force.com/...`, the matching OAuth/My Domain host is usually `https://<org>.develop.my.salesforce.com/...`, so pass `<org>.develop.my`.

If the customer enters only `<org>`, Composio may generate `<org>.salesforce.com`, which can fail before OAuth with a browser DNS error such as `DNS_PROBE_FINISHED_NXDOMAIN`.

**Recheck the domain when Salesforce returns `URL_NOT_RESET`.** `URL_NOT_RESET` can happen when the Salesforce org requires a specific My Domain value but the connection is using the generic `login` default or an incomplete subdomain. The default `login` value is fine for most Salesforce flows, but for org-specific failures recheck the Salesforce domain/subdomain values on the connection, pass the correct My Domain subdomain, and retry on the latest toolkit version if the issue was seen on an older pinned version.

## Troubleshoot connected-app access and token policies [#troubleshoot-connected-app-access-and-token-policies]

**Ask an org admin to install or approve restricted connected apps.** Salesforce connected app usage restrictions can require an org admin to install or approve the connected app before org users can authenticate. Check whether the error URL includes `error=invalid_client&error_description=app+must+be+installed+into+org`. In Salesforce Setup, go to OAuth Connected App Usage and look for the app with an Install button in the Actions column. After the admin installs/enables the app, users should retry authentication.

**Account for Salesforce's five active refresh-token limit.** Salesforce allows only five active refresh tokens per user per connected app. When the same Salesforce user connects a sixth time, Salesforce can revoke the oldest refresh token, which makes older Composio connected accounts fail with token errors. Also check whether the user changed their password, revoked the app, changed connected app refresh-token policy away from `valid until revoked`, or has org-level session policies that invalidate tokens.

## Discover and use current Salesforce tools [#discover-and-use-current-salesforce-tools]

**Inspect object schemas before querying or updating them.** Use `SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT` when you need to inspect the fields available on a Salesforce object. This is the right tool for schema discovery before building object-specific queries or update flows.

**Replace deprecated retrieve actions with current get and list tools.** Use the current Salesforce tool slugs instead of the deprecated retrieve variants: `SALESFORCE_RETRIEVE_LEAD_BY_ID` -> `SALESFORCE_GET_LEAD`, `SALESFORCE_RETRIEVE_SPECIFIC_CONTACT_BY_ID` -> `SALESFORCE_GET_CONTACT_BY_ID`, and `SALESFORCE_RETRIEVE_OPPORTUNITIES_DATA` -> `SALESFORCE_LIST_OPPORTUNITIES`.

**List contacts before fetching a specific contact by ID.** Use `SALESFORCE_LIST_CONTACTS` to list contacts and capture the IDs with their names. Then call `SALESFORCE_GET_CONTACT_BY_ID` with the desired contact ID to fetch the specific contact details.

## Use Proxy Execute for Salesforce UI bridge flows [#use-proxy-execute-for-salesforce-ui-bridge-flows]

Do not build Salesforce Frontdoor/UI bridge flows by reading access tokens from the connected account API. Use Proxy Execute with the Salesforce connected account instead. Composio injects the OAuth access token server-side into the proxied Salesforce request, such as a call to `/services/oauth2/singleaccess`, and Salesforce returns the frontdoor URI that the application can redirect the user's browser to.

---

# SerpApi (/kb/guide/toolkits-serpapi)

## Disable SerpAPI by listing premium toolkit slugs in session config [#disable-serpapi-by-listing-premium-toolkit-slugs-in-session-config]

There is no single global toggle for premium tools. To prevent SerpAPI from being available in a session, list `serpapi` in the disabled toolkit slugs for the session config. Other premium slugs commonly disabled together include `composio_search`, `perplexityai`, `exa`, and `codeinterpreter`.

## Use toolkit details to inspect SerpAPI required auth fields [#use-toolkit-details-to-inspect-serpapi-required-auth-fields]

Use `.toolkits.get("serpapi")` to fetch the toolkit details, including required and optional auth fields. For SerpAPI, the connection initiation payload should include a required `generic_api_key` field displayed as `API Key`.

## Search and scraping use cases can use SerpAPI alongside Firecrawl, Exa, Tavily, or Composio Search [#search-and-scraping-use-cases-can-use-serpapi-alongside-firecrawl-exa-tavily-or-composio-search]

For search and scraping use cases, Composio has multiple relevant toolkits: SerpAPI, Firecrawl, Exa, Tavily, and Composio Search. Composio Search provides search providers such as Exa and Tavily without separate auth.

---

# ServiceNow authentication (/kb/guide/toolkits-servicenow)

## ServiceNow credentials and instance subdomain are collected at different stages [#servicenow-credentials-and-instance-subdomain-are-collected-at-different-stages]

The current `servicenow` toolkit supports Basic, OAuth2, and S2S OAuth2. OAuth
auth-config creation accepts the ServiceNow application's client ID and client
secret. Connection initiation then requires the instance subdomain, such as
`mycompany` for `mycompany.service-now.com`.

ServiceNow registers an inbound OAuth client inside a ServiceNow instance. A
client registered in one customer instance does not automatically authorize an
unrelated instance. Use a separate customer-owned auth config when different
customers supply different ServiceNow application registrations.

Use delegated OAuth2 when a user should sign in and consent. Use S2S OAuth2 for
a backend integration whose identity and permissions are configured by the
ServiceNow administrator. Fetch the current toolkit metadata before building a
form because the required fields are separated into
`auth_config_creation` and `connected_account_initiation`.

---

# SharePoint (/kb/guide/toolkits-sharepoint)

## SharePoint REST APIs and SharePoint Graph are separate API families [#sharepoint-rest-apis-and-sharepoint-graph-are-separate-api-families]

Treat the current SharePoint toolkit and the SharePoint Graph toolkit as separate API families, not as interchangeable variants of the same connection.

* The current SharePoint toolkit uses SharePoint REST/OData endpoints on the tenant SharePoint host, usually shaped like `https://<tenant>.sharepoint.com/_api/...`.

* The SharePoint Graph toolkit uses Microsoft Graph endpoints, usually shaped like `https://graph.microsoft.com/v1.0/sites/...`.

* The scopes and token audience must match the endpoint family. SharePoint REST expects a SharePoint resource token such as `https://<tenant>.sharepoint.com/.default`; SharePoint Graph expects Microsoft Graph permissions/scopes such as `Sites.*`, `Files.*`, `User.Read`, or `https://graph.microsoft.com/.default` for S2S.

* Do not add Microsoft Graph scopes such as `Sites.Read.All` or `User.Read.All` to the current SharePoint REST auth config as a workaround. Those scopes produce a Graph-audience token and can cause 401 responses when the toolkit calls SharePoint REST.

* Do not reuse an existing SharePoint REST connected account/token for SharePoint Graph. A Graph-scoped token is not valid for SharePoint REST, and a SharePoint-audience token is not valid for Graph.

* The same Microsoft Entra app registration may be reused only if it has the right API permissions and redirect/client-credential setup for the target toolkit, but create or use a separate Composio auth config and reconnect.

SharePoint REST is not deprecated just because SharePoint Add-Ins / Azure ACS are retiring. Microsoft still documents SharePoint REST/CSOM as valid when Graph does not cover the needed functionality. Graph is the unified Microsoft 365 API and is usually better for cross-service or client-secret S2S flows, but it does not have perfect parity with SharePoint REST.

Example response:

```text
The SharePoint and SharePoint Graph toolkits use different Microsoft API surfaces.

The existing SharePoint toolkit uses SharePoint REST/OData endpoints such as `https://<tenant>.sharepoint.com/_api/...` and needs a SharePoint-resource scope like `https://<tenant>.sharepoint.com/.default`.

The SharePoint Graph toolkit uses Microsoft Graph endpoints such as `https://graph.microsoft.com/v1.0/sites/...` and needs Graph permissions such as `Sites.*`, `Files.*`, `User.Read`, or for S2S `https://graph.microsoft.com/.default`.

Because the tokens are issued for different resources, please create/use a separate Composio auth config for SharePoint Graph and reconnect. You may be able to reuse the same Microsoft Entra app registration if it has the required Graph permissions configured, but the existing SharePoint connected account token should not be used for SharePoint Graph.
```

## `/teams/` SharePoint sites require the server-relative Subsite path [#teams-sharepoint-sites-require-the-server-relative-subsite-path]

If your SharePoint site URL is under `/teams/<site>` instead of `/sites/<site>`, do not pass only `<site>` in the SharePoint Subsite field. A bare subsite value is interpreted as `/sites/<site>` by the toolkit.

Reconnect the SharePoint account and set SharePoint Subsite to the full server-relative path, for example `/teams/<site>`. For per-call overrides, pass `site_name: "/teams/<site>"`.

Debugging signal: tool logs show SharePoint calls like `https://tenant.sharepoint.com/sites/<site>/_api/...` returning `404 FILE NOT FOUND`, while the customer's actual SharePoint URL is `https://tenant.sharepoint.com/teams/<site>`. If the connected account is `ACTIVE` and the auth config is enabled, treat this as a path-prefix mismatch first, not an OAuth issue.

Example response:

```text
This looks like a SharePoint site-path mismatch. Your site is under `/teams/...`, but the current connection/tool call is hitting `/sites/...`, which SharePoint returns as 404.

Please reconnect the SharePoint account and set the Subsite value to the full server-relative path: `/teams/<site-name>`. If you're passing it per tool call, use `site_name: "/teams/<site-name>"`. A bare value like `<site-name>` gets treated as `/sites/<site-name>`.
```

## SharePoint REST app-only client credentials use certificate auth [#sharepoint-rest-app-only-client-credentials-use-certificate-auth]

For the current Composio `share_point` toolkit, client credentials and certificate-based authentication are the same app-only path: client credentials is implemented with certificate-based authentication.

The required setup is:

* SharePoint tenant name, used for `https://<tenant>.sharepoint.com/_api` and the resource scope `https://<tenant>.sharepoint.com/.default`

* Microsoft Entra tenant ID

* Application/client ID

* RSA private key in PEM format for the certificate uploaded to the Entra app registration

* Certificate thumbprint (`x5t#S256`)

* Admin-consented SharePoint application permissions appropriate for the use case

Composio signs a JWT client assertion with the certificate/private key and requests a token from `https://login.microsoftonline.com/<tenantId>/oauth2/v2.0/token` using `grant_type=client_credentials` and the SharePoint `.default` scope. Customers should provide the fields above; they do not need to manually construct or pass a JWT assertion.

Scope wording: the token request uses `https://<tenant>.sharepoint.com/.default`. In Microsoft client credentials, `.default` means the token is issued for the application permissions/app roles already configured and admin-consented for that SharePoint resource. Composio's action-to-scope mapping API should not be recommended for this SharePoint S2S/certificate path today; it is useful for OAuth2 scope discovery, not as the S2S permission source of truth.

Do not offer a client-secret-only client-credentials setup for the SharePoint REST toolkit. That belongs to Microsoft Graph app-only flows and Composio's `sharepoint_graph` toolkit, which uses `https://graph.microsoft.com/.default` and accepts client ID + client secret. The legacy SharePoint Azure ACS app-only client ID/secret model existed but is retired and should not be recommended for new/current SharePoint REST integrations.

Example setup outline:

1. Generate a private key and self-signed/public certificate, for example with OpenSSL.

2. Upload the public certificate to the Microsoft Entra app registration under Certificates & secrets > Certificates.

3. Add/admin-consent SharePoint application permissions, such as the least-privileged site/list/file permission set appropriate for the customer.

4. Create/connect the Composio SharePoint S2S auth config with the SharePoint tenant name, Entra tenant ID, client ID, private key PEM, and certificate thumbprint. Composio handles the JWT client assertion and token exchange.

5. Ensure the Entra app has/admin-consented the SharePoint application permissions needed for the intended SharePoint REST operations. The requested token scope is `https://<tenant>.sharepoint.com/.default`; if using Selected permissions such as `Sites.Selected`, also grant explicit access to the target site/list/file.

6. Test with a simple SharePoint REST call such as `GET https://<tenant>.sharepoint.com/_api/web?$select=Title` using the connected account.

## SharePoint `.default` scope uses the tenant domain placeholder [#sharepoint-default-scope-uses-the-tenant-domain-placeholder]

For a custom Microsoft Entra app, replace `{{site_name}}` in `https://{{site_name}}.sharepoint.com/.default` with the customer's SharePoint tenant/domain name. The resulting `.default` scope requests the application permissions already configured and admin-consented for that SharePoint resource.

## Pass the SharePoint tenant/subdomain during connection initiation [#pass-the-sharepoint-tenantsubdomain-during-connection-initiation]

The SharePoint tenant/subdomain is an explicit connection field; Composio does not derive it automatically from the OAuth token. If a connection points at `default.sharepoint.com` or the wrong tenant, reinitiate the connection and provide the correct tenant name.

## The SharePoint subsite field is not a permission boundary [#the-sharepoint-subsite-field-is-not-a-permission-boundary]

The SharePoint Subsite field supplies a default target when a tool call omits `site_name`. It does not restrict the Microsoft token, which retains the access granted to the consenting user or application.

## Retrieve SharePoint site name from connected account state [#retrieve-sharepoint-site-name-from-connected-account-state]

Fetch the connected account and inspect its stored state to confirm the SharePoint site name. Newer SDK responses expose it under a shape such as `state.val.site_name`; older toolset responses may expose `data.site_name`.

## Use `SHARE_POINT_SEARCH_QUERY` for KQL/FQL SharePoint search [#use-share_point_search_query-for-kqlfql-sharepoint-search]

Use `SHARE_POINT_SEARCH_QUERY` when a workflow needs flexible SharePoint search with KQL or FQL. For broader agentic discovery across SharePoint actions, Tool Router can discover and execute the relevant tools dynamically.

## SharePoint toolkit slug is `share_point` [#sharepoint-toolkit-slug-is-share_point]

The SharePoint toolkit slug is `share_point`, while its tool slugs use the `SHARE_POINT_...` prefix. Related Microsoft toolkit slugs include `outlook`, `one_drive`, and `sharepoint_graph`.

## Disable destructive SharePoint tools with `destructiveHint` or explicit tool filters [#disable-destructive-sharepoint-tools-with-destructivehint-or-explicit-tool-filters]

At session creation, disable tools carrying `destructiveHint` globally or for selected toolkits such as SharePoint and OneDrive. For finer control, explicitly allow or deny destructive tools by name.

## `SHARE_POINT_UPLOAD_FROM_URL` needs a server-fetchable URL [#share_point_upload_from_url-needs-a-server-fetchable-url]

This action first downloads `file_url` from Composio's backend and then uploads the bytes to SharePoint. The source must be a reachable HTTP(S) download URL; raw base64 content is not a URL.

For base64 or in-memory bytes, use `SHARE_POINT_UPLOAD_FILE` with the file content and name, or first create a temporary URL that the backend can reach. A 401/403 while downloading the source should be debugged as source-URL access, not as a destination folder problem. `conflict_behavior="rename"` only affects the target name after download succeeds.

---

# Shopify (/kb/guide/toolkits-shopify)

Use this guide to configure Shopify authentication, discover the complete tool set, and work with Shopify orders and GraphQL.

## Configure Shopify authentication [#configure-shopify-authentication]

**Use OAuth2 or S2S auth instead of API-key/admin-token auth.** Shopify deprecated the old admin-created custom-app token copy/paste path for new apps. New Dev Dashboard apps expose a Client ID and Client Secret, and the access token is generated programmatically with Shopify's client-credentials flow. In Composio, do not direct new Shopify users to API-key/Admin API Access Token auth. Use OAuth2 for user-facing Shopify integrations, or S2S auth when that matches the app's server-to-server/client-credentials use case.

* Shopify docs: [client credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant), [admin-created custom app tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin)

If an auth screen still asks for an Admin API key, verify the authConfig is not using the deprecated API-key mode.

**Use Composio's toolkit auth callback as the OAuth redirect URL.** Set the Shopify OAuth app redirect URL to the exact callback shown by the current Composio custom-auth-config flow. Older or mistyped v1/v3 callback paths can cause OAuth redirect failures, so copy the current value rather than relying on a hard-coded URL in this article.

**Keep the hosted auth experience when using custom credentials.** Using custom Shopify OAuth credentials does not change the end-user hosted auth and redirect experience. Users still go through the same Composio connect flow, and Composio continues to handle token refresh and credential management automatically. Masking changes for managed credentials do not affect custom-credential toolkits in the same way.

**Check credentials and gated scopes when OAuth returns 400.** A Shopify OAuth 400 during token exchange or connection initiation is commonly caused by incorrect credentials, especially a wrong client secret, or by gated scopes that have not been verified/approved. Re-enter the authConfig client secret carefully and initiate a fresh connection. Also verify the requested Shopify scopes are available to the app.

**Pass only the store name as the Shopify subdomain.** When Composio asks for the Shopify subdomain, pass only the store name, such as `your-store-name`. Do not pass the full host like `your-store-name.myshopify.com`; Composio constructs the Shopify domain from the subdomain.

## Discover and run Shopify tools [#discover-and-run-shopify-tools]

**Use the current GraphQL tool slug.** Use the updated Shopify GraphQL tool slug `SHOPIFY_GRAPH_QL_QUERY` for Shopify GraphQL queries. If the tool is not visible in tool discovery, make sure enough tools are being fetched and that the tool is enabled in the MCP/config being used.

**Fetch more than the default 20 tools when needed.** Tool fetching can default to a limited number of tools. Pass a higher `limit`, for example `tools.get(user_id="<userId>", toolkits=["shopify"], limit=1000)`, to fetch the full Shopify tool set. For MCP, also confirm the target Shopify tool is enabled when creating the MCP config or by modifying the existing config.

**Create custom Shopify tools with Composio-injected auth.** Create a custom tool/action under the Shopify toolkit and call Shopify's GraphQL endpoint from inside it. Composio injects the Shopify auth automatically through the custom tool execution path. For newer examples, the endpoint can be `/graphql.json`; older snippets used the full `https://<shopify-sub-domain>.myshopify.com/admin/api/<version>/graphql.json` endpoint. Include the JSON content type header and pass the GraphQL query in the body.

## Work with Shopify orders [#work-with-shopify-orders]

**List orders before running follow-up actions.** Call `SHOPIFY_GET_ORDERS_WITH_FILTERS` first to confirm the store has orders and retrieve order IDs from the response payload. Follow its `page_info` cursor when more than one page may match. Then pass a returned order ID into follow-up actions such as `SHOPIFY_GET_ORDER` or `SHOPIFY_UPDATE_ORDER`. The older `SHOPIFY_GET_ORDER_LIST` action is deprecated.

**Check `read_all_orders` when order calls return 403.** Check the scopes on the Shopify connection. If the connection lacks `read_all_orders`, reconnect with the needed order scopes before retrying order update/read calls that require access beyond the default order scope set.

---

# Slack (/kb/guide/toolkits-slack)

## Use `user_scopes` for Slack user-token permissions [#use-user_scopes-for-slack-user-token-permissions]

For the Slack toolkit, `scopes` refers to bot-user scopes. If the use case is to operate as the actual Slack user, pass the permissions in `user_scopes` on the auth config credentials. Slack is special because it separates bot scopes from user scopes. For user-token tools, set `credentials.user_scopes`; the bot `scopes` field may not matter if the Slack application has no bot-user tools for that use case.

## Download Slack file content using file ID [#download-slack-file-content-using-file-id]

Slack file download is supported through `SLACK_DOWNLOAD_SLACK_FILE`. Pass the Slack file ID, which starts with `F` such as `F123ABCDEF0`. The tool returns downloadable file content plus metadata such as name, mimetype, and size. If the file ID is unknown, first call `SLACK_LIST_FILES_WITH_FILTERS_IN_SLACK` to find file IDs, then pass the selected ID to the download tool.

## Slack `assistant.search.context` requires Agents & AI Apps and Business+ [#slack-assistantsearchcontext-requires-agents--ai-apps-and-business]

Slack's `assistant.search.context` requires the Slack OAuth app to have the Agents & AI Apps feature enabled, and the Slack workspace must be on Business+ or higher. Verify workspace support by calling `assistant.search.info`; if `is_ai_search_enabled` is `false`, the workspace plan or feature enablement is the blocker. A customer can unblock with their own Slack OAuth app that has Agents & AI Apps enabled, but they still need Business+ on the workspace.

## Use Slack V2 trigger slugs for channel and direct messages [#use-slack-v2-trigger-slugs-for-channel-and-direct-messages]

Use the Slack V2 triggers for message events. `SLACK_CHANNEL_MESSAGE_RECEIVED` is intended for channel messages, and `SLACK_DIRECT_MESSAGE_RECEIVED` is intended for DMs. Slack V2 triggers include dedicated endpoints, signature verification, better DM handling, and richer filtering. Older V1 Slack trigger slugs may still work, but V2 is the recommended path for new setups.

## Slack trigger delivery depends on the Slack app event subscription webhook URL [#slack-trigger-delivery-depends-on-the-slack-app-event-subscription-webhook-url]

When Slack trigger events stop unexpectedly, check whether the Slack OAuth app's Event Subscriptions `webhook_url` was changed. If the webhook URL or other Slack app event-subscription settings changed, Slack may stop delivering events to Composio even though the trigger instance was previously working.

## Slack short connect links are not the OAuth redirect URI [#slack-short-connect-links-are-not-the-oauth-redirect-uri]

The short `/api/v3/s/...` URL is not the `redirect_uri` sent to Slack. It is only a shortened link that redirects the browser to Slack's authorization page. The actual Redirect URI is available in the authConfig and must match what is configured in the Slack OAuth app. The static `callbackUrl` / `redirectUri` must be configured consistently on both Composio and the Slack OAuth app, while `redirectUrl` is the per-connection authentication URL used to send the user through the auth flow.

## Slack scheduled-message attachments are not file uploads [#slack-scheduled-message-attachments-are-not-file-uploads]

The `attachments` field on Slack scheduled messages refers to Slack's legacy secondary/rich-formatting attachments, not uploaded files. Slack's `chat.scheduleMessage` API does not natively upload files. Files must be uploaded separately, for example with `files.upload` / `files.upload.v2`, and then linked or embedded into the scheduled message body so they unfurl when the scheduled message is posted.

## `admin.conversations:write` requires Slack Enterprise [#adminconversationswrite-requires-slack-enterprise]

`admin.conversations:write` is an enterprise/admin-level Slack scope. For APIs such as `admin.conversations.delete`, the Slack workspace must be on an Enterprise plan. If you cannot use channel deletion/admin conversation tools, first confirm the Slack workspace plan and whether the app has the required admin scope.

---

# Slackbot (/kb/guide/toolkits-slackbot)

Use this guide to choose the correct Slack token model, configure Slackbot scopes and triggers, and send or download Slack content.

## Choose Slack or Slackbot and configure authentication [#choose-slack-or-slackbot-and-configure-authentication]

**Match the toolkit to the token model.** Slack and Slackbot serve different token models. The Slack toolkit performs actions on behalf of an actual Slack user. The Slackbot toolkit performs actions as a bot and should be used for bot scopes such as `channels:join` or bot-token workflows. For mixed use cases, create separate Slack and Slackbot auth configs rather than combining user and bot scopes in one connection.

**Include the verification token for custom Slackbot triggers.** For Slackbot triggers with custom auth, configure the Slack app verification token in the auth config, then create a fresh connection after updating the auth config. The current auth schema does not expose a separate subscription-ID field, so do not substitute one for the verification token.

**Add history scopes for private channels and DMs.** Slack private-channel and DM access requires additional scopes. Use `groups:history` for private channels, `im:history` for direct messages, and `mpim:history` for multi-person DMs. These scopes are not always included by default and may be limited by Slack plan/provider constraints, so the customer may need a custom Slack app with the relevant scopes.

**Do not use a short auth link as the OAuth redirect URI.** The short `/api/v3/s/...` auth link is only a shortened connection initiation URL that redirects the browser to Slack. It is not the `redirect_uri` sent to Slack. Configure the static redirect/callback URI shown in the Composio auth config in the Slack OAuth app; either supported v1 or v3 callback URI can be used depending on the auth config.

## Run Slackbot actions and handle trigger events [#run-slackbot-actions-and-handle-trigger-events]

**Resolve the Slack file ID before downloading content.** Slack file content can be downloaded with `SLACK_DOWNLOAD_SLACK_FILE`. The tool needs the Slack file ID, usually starting with `F`. If the customer does not have the file ID yet, use `SLACK_LIST_FILES_WITH_FILTERS_IN_SLACK` first and pass the returned file ID to the download tool.

**Choose one visible content mode when sending a bot message.** Use `SLACKBOT_SEND_MESSAGE` to post to a channel, direct message, or private group. Provide exactly one visible content mode: `markdown_text` for normal Markdown content, or `blocks` for a raw Block Kit layout. Use `fallback_text` only with `blocks`.

**Use trigger identifiers to map events back to connections.** Slackbot trigger payloads include identifiers such as `connection_id` and `trigger_id` inside the payload data. Use `connection_id` to map the event back to the connected account involved in the trigger.

---

# Snapchat authentication (/kb/guide/toolkits-snapchat)

## Snapchat uses customer-owned OAuth credentials [#snapchat-uses-customer-owned-oauth-credentials]

The current `snapchat` toolkit supports OAuth2 and requires a Snapchat app's
client ID and client secret. Register the exact redirect URI shown by the
current Composio auth-config flow and request only the Snapchat permissions
approved for that app.

If Snapchat rejects the authorization request before the user signs in, verify
the client ID, redirect URI, and approved scopes on the Snapchat app. A
pre-login authorization error is not evidence that the user's Snapchat
password is wrong.

---

# Snowflake (/kb/guide/toolkits-snowflake)

## Use one Snowflake auth config per customer account for multi-tenant SaaS OAuth [#use-one-snowflake-auth-config-per-customer-account-for-multi-tenant-saas-oauth]

For Snowflake multi-tenant OAuth, create one Composio auth config per customer Snowflake account using that customer's Snowflake OAuth credentials from `CREATE SECURITY INTEGRATION`. Store the returned `auth_config_id` against the customer on your side. When connecting a user, pass the correct `auth_config_id`; Composio will collect the per-connection Account ID, such as `myorg-myaccount`, and use it to construct the Snowflake authorization/token URLs.

## Snowflake Basic auth was deprecated in favor of OAuth2 [#snowflake-basic-auth-was-deprecated-in-favor-of-oauth2]

Snowflake Basic authentication was deprecated and replaced by OAuth2. Customers using old Basic-auth Snowflake auth configs or connected accounts should migrate to OAuth2 by creating the Snowflake OAuth security integration, creating a Composio auth config with those credentials, and reconnecting users. Basic-auth actions may differ from OAuth2 actions and should not be treated as the long-term path.

## Configure Snowflake OAuth refresh tokens and expect periodic reconnects [#configure-snowflake-oauth-refresh-tokens-and-expect-periodic-reconnects]

For longer-lived Snowflake OAuth connections, configure the Snowflake security integration with `OAUTH_ISSUE_REFRESH_TOKENS = TRUE` so refresh tokens are issued, and set `OAUTH_REFRESH_TOKEN_VALIDITY` as high as Snowflake allows, such as 7776000 seconds (about 90 days). Even with the max window, Snowflake can require users to reconnect after the refresh-token validity period, so design the product flow to handle periodic reconnects.

## Fetch connected-account fields or toolkit metadata to discover Snowflake account details [#fetch-connected-account-fields-or-toolkit-metadata-to-discover-snowflake-account-details]

To discover fields collected during connection initiation, call the toolkit-by-slug endpoint and inspect the accepted initiation fields. After a connection exists, fetch the connected account by ID to retrieve the stored connection fields. Provider schemas are mostly static, but providers can change them, so the toolkit metadata endpoint is the safer source for current required/accepted fields.

## Snowflake statement results may require checking each partition [#snowflake-statement-results-may-require-checking-each-partition]

If a Snowflake query returns partial results, check whether the result set is split into partitions. Snowflake may not return all partitions in a single tool call. Use `SNOWFLAKE_CHECK_STATEMENT_STATUS` with the statement handle to poll an asynchronous query until it finishes and retrieve its result.

## Use processors or tool description overrides to reduce Snowflake tool output/token load [#use-processors-or-tool-description-overrides-to-reduce-snowflake-tool-outputtoken-load]

For Snowflake tools that return too much data or need LLM-facing schema or description changes, use processors to post-process tool output before returning it to the model. For a local agent setup, you can also modify a returned tool object's description before passing it to the model.

---

# Spotify (/kb/guide/toolkits-spotify)

Use this guide to configure Spotify OAuth and scopes, then use Spotify through MCP, custom toolkits, and triggers.

## Configure Spotify OAuth and scopes [#configure-spotify-oauth-and-scopes]

**Use a customer-owned OAuth app.** Composio-managed OAuth is not currently available for Spotify. Create a custom auth config with your Spotify client ID and client secret, then have each user complete the Spotify authorization flow.

**Add library scopes before reconnecting.** If Spotify tools need library access, ensure scopes such as `user-library-read` and `user-library-modify` are present in the auth config. After adding scopes, reconnect so the connected account receives the new grants.

**Add playlist-write scopes before reconnecting.** If playlist write actions return Spotify `403 Insufficient client scope`, make sure the auth config requests `playlist-modify-public`, `playlist-modify-private`, or both as appropriate. Add the scopes before reconnecting; reconnecting an unchanged auth config preserves the same missing-scope problem.

This is separate from older playlist endpoint issues. A call can reach the current `/items` endpoint and still fail because its token lacks playlist write permission.

## Use Spotify through MCP, custom toolkits, and triggers [#use-spotify-through-mcp-custom-toolkits-and-triggers]

**Avoid names that collide with the built-in toolkit.** If creating a custom Spotify-related toolkit, avoid naming it exactly `Spotify` because a built-in Spotify toolkit already exists. Use a distinct name such as `spotify-custom` to avoid slug or name collision errors.

**Add Spotify from the MCP configs page.** To use Spotify through MCP, create or edit an MCP config from the platform MCP configs page and add Spotify to that server. Then use the generated MCP URL in the MCP client.

**Check the current trigger catalog when an event is missing.** Spotify is listed among trigger-capable toolkits, with three Spotify triggers. If the event you need is missing, submit it through the standard trigger-request flow.

---

# Strava (/kb/guide/toolkits-strava)

## Athlete-limit errors belong to the OAuth application [#athlete-limit-errors-belong-to-the-oauth-application]

Strava applies connected-athlete capacity per developer application. If OAuth shows `Athlete limit exceeded`, first determine whether the auth config uses Composio-managed Strava credentials or a customer-owned app; do not assume the customer owns a managed app.

For dedicated production capacity, create a customer-owned Strava developer app, configure it as a custom Composio auth config, and request any capacity increase from Strava for that app. The exact current capacity is visible to the app owner in Strava's API settings and can change, so do not quote a customer-specific number without checking it.

See the [Strava custom OAuth setup guide](https://composio.dev/auth/strava) for credential setup.

---

# Stripe (/kb/guide/toolkits-stripe)

## Stripe is supported and offers OAuth2 and API-key auth modes [#stripe-is-supported-and-offers-oauth2-and-api-key-auth-modes]

Composio supports the Stripe toolkit with OAuth2 and API-key auth modes; the marketplace entry is available on the Stripe toolkit page.

## For Stripe API-key auth, use the Stripe secret key from Developers -> API Keys -> Standard keys [#for-stripe-api-key-auth-use-the-stripe-secret-key-from-developers---api-keys---standard-keys]

For Stripe API-key auth, use the Stripe secret key from Stripe Dashboard -> Developers -> API Keys -> Standard keys -> Secret key. In API/SDK connection payloads, the auth config field may need to be passed as `api_key`.

## One Stripe MCP/API-key connection maps to one Stripe account unless the customer uses Stripe Connect [#one-stripe-mcpapi-key-connection-maps-to-one-stripe-account-unless-the-customer-uses-stripe-connect]

Stripe usually uses different API keys for separate accounts, so one connected account/MCP server has access to one Stripe account. If the customer uses Stripe Connect, the platform can consolidate connected accounts under one platform API key and may better fit multi-account workflows.

## MRR can be calculated from `STRIPE_LIST_SUBSCRIPTIONS` [#mrr-can-be-calculated-from-stripe_list_subscriptions]

Use `STRIPE_LIST_SUBSCRIPTIONS` to retrieve subscription data, then calculate MRR from the returned subscriptions in the agent/application layer.

## Stripe payment-success triggers are available [#stripe-payment-success-triggers-are-available]

Use `STRIPE_INVOICE_PAYMENT_SUCCEEDED_TRIGGER` for successful invoice payments and `STRIPE_CHECKOUT_SESSION_COMPLETED_TRIGGER` for completed Checkout sessions. Fetch the current trigger catalog before implementation rather than assuming every Stripe event has a corresponding trigger.

---

# Supabase (/kb/guide/toolkits-supabase)

Use this guide to connect Supabase, configure its tools and endpoints, and troubleshoot permissions or rate limits.

## Connect Supabase with OAuth or an API key [#connect-supabase-with-oauth-or-an-api-key]

**Confirm the authorized Supabase organization.** Supabase authorization is usually scoped at the organization level. If you have project or account access issues, confirm which Supabase organization/account the connected credentials belong to before treating it as a tool-specific issue.

**Pass the personal token with the required API-key field.** For Supabase API-key auth, create or use an API-key auth config and pass the personal token as `supabase_personal_token` when creating the connected account. The `/api/v3/toolkits/supabase` endpoint can be used to inspect the required connected-account initiation field name.

**Choose either OAuth2 or API\_KEY auth.** Supabase supports OAuth2 and API\_KEY auth, and both can be initiated through Composio APIs. SDKs are wrappers over the same APIs, so anything possible through the SDK should be possible through the API.

**Initiate the connection explicitly in Cursor.** Ask Cursor/the MCP client to initiate a Supabase connection first. The MCP server should provide an OAuth link, the user completes authentication, and then Supabase tools can execute against the connected account.

## Configure Supabase tools and endpoints [#configure-supabase-tools-and-endpoints]

**Add the SQL tool to the MCP server when needed.** `SUPABASE_BETA_RUN_SQL_QUERY` is still supported. Create a Supabase integration/MCP server and explicitly configure the Supabase SQL tool in that MCP server if it is not shown on the simplified Supabase MCP page.

**Use the hosted API base URL for hosted Supabase.** For hosted Supabase, the base URL should be `https://api.supabase.com`. Do not use the project's own Supabase URL unless the customer is self-hosting Supabase. If the wrong base URL was used, delete/recreate the MCP config or connection with the correct base URL.

**Pass a supported custom base URL for self-hosted Supabase.** Supabase tools default to hosted Supabase at `https://api.supabase.com`, while current toolkit versions can accept a base URL for self-hosted instances. If a self-hosted setup fails, verify the toolkit version and that the custom base URL is passed in the supported field.

**Configure Management API scopes on the OAuth app.** Supabase configures Management API OAuth scopes on the OAuth app rather than in
the authorization URL. Set the desired scopes in the customer's Supabase OAuth
app, create the corresponding Composio auth config, and reconnect so the new
grant applies. See Supabase's current [OAuth scope documentation](https://supabase.com/docs/guides/integrations/build-a-supabase-oauth-integration/oauth-scopes).

## Troubleshoot Supabase permissions and rate limits [#troubleshoot-supabase-permissions-and-rate-limits]

**Verify provider-side access for permission errors.** If Supabase returns a permissions/access-control error, verify the connected Supabase account has the required permissions in Supabase. These can be provider-side server permission errors rather than Composio issues.

**Inspect the underlying error for rate limits.** If the customer sees a rate-limit message, capture the underlying Composio/tool/provider error rather than the wrapper agent's message, because the limit may come from the external provider or agent layer rather than a Composio service limit.

---

# Tavily (/kb/guide/toolkits-tavily)

## Use COMPOSIO\_SEARCH\_TAVILY for Tavily search [#use-composio_search_tavily-for-tavily-search]

Use the updated Tavily search tool slug `COMPOSIO_SEARCH_TAVILY` when invoking Tavily search through Composio. If an older Tavily search slug returns schema-related gateway errors, switch to this slug before deeper debugging.

## Initiate Tavily API-key connections in the legacy JS SDK with generic\_api\_key [#initiate-tavily-api-key-connections-in-the-legacy-js-sdk-with-generic_api_key]

For Tavily API-key auth in the legacy JS SDK, list the Tavily integration with `toolset.integrations.list({ appName: "tavily" })`, then initiate the connected account with `appName: "tavily"`, `authMode: "API_KEY"`, the integration ID, and `authConfig: { generic_api_key: "<tavily-api-key>" }`. This was provided as a workaround for a JS SDK issue, so prefer the current SDK flow when available.

## Use composio\_search for auth-free Exa/Tavily-style search [#use-composio_search-for-auth-free-exatavily-style-search]

For auth-free web search through Composio, use the `composio_search` toolkit, which provides Exa/Tavily and other search capabilities without separate authentication. Use the standalone Tavily toolkit when a workflow specifically needs Tavily as its own provider-backed integration.

---

# TikTok (/kb/guide/toolkits-tiktok)

## TikTok is supported, but customers generally need their own TikTok developer app [#tiktok-is-supported-but-customers-generally-need-their-own-tiktok-developer-app]

TikTok is available as a toolkit and currently uses customer-owned TikTok
developer app credentials.

## TikTok URL-prefix verification must be done on a customer-owned redirect domain, not Composio's shared callback domain [#tiktok-url-prefix-verification-must-be-done-on-a-customer-owned-redirect-domain-not-composios-shared-callback-domain]

Do not host TikTok verification files on Composio's shared callback domain. TikTok URL-prefix verification is meant to prove ownership of the redirect domain. Use a redirect URI on a domain you control, host TikTok's verification file there, register that static parameter-free URI in TikTok, and then forward or proxy the callback to Composio if needed.

## TikTok OAuth uses `client_key`; credential mismatch or old `client_id` handling causes `client_key` errors [#tiktok-oauth-uses-client_key-credential-mismatch-or-old-client_id-handling-causes-client_key-errors]

A TikTok `client_key` error is returned by TikTok, not Composio. First re-copy the Client Key and Client Secret from the TikTok developer app, checking for swapped values or trailing spaces. Also confirm the registered redirect URI exactly matches TikTok requirements. Historically, TikTok required `client_key` in the authorize URL while older Composio handling used `client_id`; if an older flow is involved, unshorten the redirect URL and verify the parameter shape.

## TikTok app status, scopes, and sandbox/production mode determine who can complete OAuth [#tiktok-app-status-scopes-and-sandboxproduction-mode-determine-who-can-complete-oauth]

For TikTok OAuth failures, ask for the app type/status, sandbox vs production mode, enabled APIs/scopes, redirect URI, and screenshots of the OAuth screen. If the TikTok app is sandbox or under review, only authorized testers/users may be able to complete OAuth.

## Old TikTok-specific MCP URL patterns are deprecated; use Connect MCP [#old-tiktok-specific-mcp-url-patterns-are-deprecated-use-connect-mcp]

Do not use old toolkit-specific MCP URL patterns for TikTok. Use Connect MCP at `connect.composio.dev/mcp` or create the appropriate MCP/server through the current dashboard/API flow.

## Public TikTok posting requires the customer's own app to pass TikTok's content posting audit [#public-tiktok-posting-requires-the-customers-own-app-to-pass-tiktoks-content-posting-audit]

For TikTok public content posting, you must go through TikTok's content posting audit with your own OAuth app. Without an audited/approved app, posting may be restricted, for example to private-only visibility or limited testing behavior.

## TikTok Ads/Marketing may require a separate approved app and test credentials [#tiktok-adsmarketing-may-require-a-separate-approved-app-and-test-credentials]

TikTok Ads/Marketing may require a separate approved TikTok app and active account credentials. Determine whether you need authentication only or specific tools, and allow time for TikTok app approval.

## TikTok custom auth must request only approved scopes [#tiktok-custom-auth-must-request-only-approved-scopes]

The TikTok toolkit's default set can include `user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list`, `video.upload`, and `video.publish`. A customer-owned app approved for only a subset can fail OAuth when the auth config falls back to the full default.

Set an explicit scope list on the custom auth config containing only permissions TikTok approved for that app, then reconnect. Existing tokens retain their original grants. Tools for profile details, statistics, or video lists remain unavailable unless the corresponding scopes are approved and requested.

---

# Trello (/kb/guide/toolkits-trello)

Use this guide to connect Trello with OAuth1, route users through current MCP flows, and resolve Trello identities for tools and triggers.

## Connect Trello with OAuth1 [#connect-trello-with-oauth1]

Use Composio-managed OAuth1 for the standard connection flow. Create a custom OAuth1 auth config when you need control over the Trello provider app, and have each user complete the authorization flow.

## Route Trello through current MCP and Connect flows [#route-trello-through-current-mcp-and-connect-flows]

**Route each call to the correct user or account.** For multi-user Trello MCP usage, create the Trello auth config and have users complete the auth flow. Then route MCP calls to the right user or connection by appending `user_id=<external-user-id>` or `connected_account_id=<ca_...>` to the MCP server URL, for example `/mcp?user_id=abcd`.

**Use the generated MCP configuration in Cursor.** To use Trello in Cursor, create a Trello MCP instance or server in Composio, select the Trello tools, then run or add the generated MCP command or config in Cursor. Complete the Trello account connection when prompted by the MCP flow.

**Migrate legacy MCP endpoints.** If you are using `https://mcp.composio.dev/trello` or another legacy Trello MCP endpoint, migrate to Tool Router or Composio Connect. Tool Router and Connect are the supported path for current integrations.

## Resolve Trello users and trigger board IDs [#resolve-trello-users-and-trigger-board-ids]

**Get the authenticated Trello user.** Use `TRELLO_GET_MEMBERS_BY_ID_MEMBER` with `idMember` set to `me` to retrieve the authenticated Trello user or member for the current connection.

**Validate board IDs before creating triggers.** If Trello triggers fail, verify the board ID first. Use tools such as `TRELLO_GET_ORGANIZATIONS_BOARDS_BY_ID_ORG` or `TRELLO_GET_BOARDS_BY_ID_BOARD` to retrieve or confirm the board ID, then recreate or retry the trigger with the valid board ID.

---

# Twitter (/kb/guide/toolkits-twitter)

Use this guide to configure Twitter/X authentication, choose the credentials each action needs, and troubleshoot developer-app or toolkit-version errors.

## Configure Twitter/X authentication [#configure-twitterx-authentication]

**Use a customer-owned OAuth app.** Composio-managed credentials are not available for the Twitter toolkit. Create an app in the X Developer Portal, then create a custom Composio auth config with that app's credentials before connecting an account. This has been required since managed Twitter credentials were removed in February 2026.

* [Twitter toolkit authentication details](https://docs.composio.dev/toolkits/twitter)
* [Managed Twitter credentials removal](https://docs.composio.dev/docs/changelog/2026/02/12)

**Match the current Composio callback exactly.** For Twitter OAuth callback mismatch errors, configure the Twitter/X developer app with the exact callback shown by the current Composio auth-config flow. Do not use a legacy v1 callback from older examples.

## Publish and search with the correct credentials [#publish-and-search-with-the-correct-credentials]

**Follow X's post-length rules.** Twitter/X enforces strict post length limits. For normal posts, keep the content under 280 characters and follow X's official character-counting behavior, since URLs, Unicode, and special characters may be counted by provider-specific rules.

**Use the Application Bearer Token for app-only actions.** Several X actions—including recent or full-archive search and counts, post lookup by IDs, post usage, label-stream, and compliance-job actions—use app-only authentication. They read the `Application Bearer Token` from the Twitter auth config, not the connected user's OAuth access token.

If user-token actions succeed but these actions return 401, verify that the bearer token comes from the same X Developer App as the OAuth client credentials and that the app's X API plan allows the endpoint. Adding user OAuth scopes does not repair an invalid app bearer token. Reconnect only when the user grant also needs to change.

## Troubleshoot developer-app and toolkit-version errors [#troubleshoot-developer-app-and-toolkit-version-errors]

**Fix `client-not-enrolled` and `App not linked to project` in the X developer app.** These errors usually mean the Twitter/X developer app is not correctly connected to a Twitter developer project, or the OAuth app configuration is stale after X's API model changes. Verify the app is linked to a project, configured according to the Twitter setup guide, and aligned with current X API requirements. If the connected account is already `EXPIRED`, recreate the connection after fixing the app configuration.

**Update older toolkit versions for X v2 support.** The current Twitter/X toolkit uses v2 endpoints. If behavior looks like an older endpoint, check the toolkit version and retry on the latest available version.

---

# Webflow (/kb/guide/toolkits-webflow)

## Create or update Webflow collection items with the draft/live flag [#create-or-update-webflow-collection-items-with-the-draftlive-flag]

Use `WEBFLOW_CREATE_COLLECTION_ITEM` to create a collection item and set whether it is draft or live with the `is_draft` parameter. Use `WEBFLOW_UPDATE_COLLECTION_ITEM_V2` to update an existing item. If the customer specifically needs Webflow v2's dedicated individual collection-item publish/live endpoints, treat that as separate publish-collection-item support rather than the basic create/update flow. The older `WEBFLOW_UPDATE_COLLECTION_ITEM` action is deprecated.

## Use the current Webflow toolkit version for recently added page tools [#use-the-current-webflow-toolkit-version-for-recently-added-page-tools]

When a recently added Webflow tool such as `WEBFLOW_GET_PAGE` is not found through the API, pass the toolkit/tool version explicitly. The base version `00000000_00` can be older than a dated release. Use the latest Webflow toolkit version shown by Composio for API calls that need newly added tools.

## Deprecated Webflow v1 endpoints caused publish-site integration failures [#deprecated-webflow-v1-endpoints-caused-publish-site-integration-failures]

If Webflow calls fail because the integration is using unsupported or deprecated endpoints, check whether the failing action is an older v1 Webflow tool. Use the current `WEBFLOW_PUBLISH_SITE` action and current toolkit version; if the failure persists, share the failed tool-call log ID with Composio support.

---

# WhatsApp (/kb/guide/toolkits-whatsapp)

Use this guide to connect a WhatsApp Business account, configure Meta authentication, send messages, receive events, and handle coexistence onboarding.

## Connect a WhatsApp Business account [#connect-a-whatsapp-business-account]

**Use a WABA-backed business account instead of a personal account.** WhatsApp API usage requires a WhatsApp Business Account. Personal WhatsApp accounts are for personal communication and are not supported by the WhatsApp Business API flows used by the toolkit. To send WhatsApp messages through Composio, use a WABA-backed business account.

**Provide the WhatsApp Business Account ID.** The WABA ID, or WhatsApp Business Account ID, is required because the WhatsApp Business API needs it to identify the business account. Customers can find it in Meta Developers under the app's WhatsApp API Setup section, or fetch it programmatically by calling `GET /me/businesses` and then `GET /{business_id}/owned_whatsapp_business_accounts` with an access token.

**Pass the system user token and WABA ID for API-key auth.** For WhatsApp API key auth, pass the system user token as the bearer token and pass the WABA ID as `generic_id`. The required connection fields depend on the auth scheme, so fetch the toolkit/auth-config initiation fields if unsure. Hosted auth links can also collect these values from the user instead of hardcoding them.

**Pass the WABA ID as `generic_id` for OAuth2.** WhatsApp OAuth2 auth still requires `generic_id`, and that value is the WhatsApp Business Account ID. API key auth requires both `bearer_token` and `generic_id`, while OAuth2 only requires `generic_id` for initiation. Differences in required initiation fields usually come from the selected auth scheme.

## Configure Meta OAuth and app access [#configure-meta-oauth-and-app-access]

**Publish a Meta developer app with the Business use case.** For WhatsApp OAuth with a customer-owned Meta app, create a Meta developer app, enable the Business use case, configure the WhatsApp product, and publish the app so users can connect to it. The Meta app/account used during connection should match the account that owns or can access the WhatsApp Business setup.

**Add the Composio redirect URI to the Meta app.** For Meta OAuth apps, add the Composio redirect URI to the correct redirect/callback URI field in the Meta developer app. OAuth failures during callback can happen when the app does not allow the redirect URI used by the Composio auth config.

## Send WhatsApp messages and templates [#send-whatsapp-messages-and-templates]

**Create and approve a template before sending it.** Sending a WhatsApp template message requires a template to already exist in WhatsApp/Meta. The send-template tool sends an existing template by name/language and parameters; it does not remove the need to create and approve the template first.

**Use a current toolkit version for template `components`.** Support for `components` was added to the WhatsApp send-template flow in a newer toolkit version. If you cannot pass template variables/components to `WHATSAPP_SEND_TEMPLATE_MESSAGE`, upgrade to the latest WhatsApp toolkit version and verify the `components` field is available in the tool schema.

**Pass real sender and recipient identifiers.** For WhatsApp send-message actions, make sure the action arguments contain the actual `phone_number_id` and recipient `to_number`. Placeholder values in the tool arguments will fail even if the connected account itself is active.

## Receive events and extend WhatsApp workflows [#receive-events-and-extend-whatsapp-workflows]

**Use triggers or webhooks for replies.** WhatsApp does not expose every reply-reading flow as a normal API action in the toolkit. The better product shape is a trigger/webhook for events such as message or reply received. Where a first-party WhatsApp trigger is not available for the exact use case, TimelinesAI may be an alternative because it includes WhatsApp-related trigger support.

**Use Proxy Execute for direct provider operations.** For provider API operations that are not exposed as first-class WhatsApp tools, Proxy Execute can be used with a scoped Composio API key that allows proxy execution. Use this when you need to call a Meta/WhatsApp endpoint directly while still going through Composio-managed connection context.

## Set up WhatsApp Business app coexistence [#set-up-whatsapp-business-app-coexistence]

Keeping an existing WhatsApp Business app number active while also using the Cloud API is a Meta-side coexistence onboarding flow, not a Composio activation toggle. Follow Meta's [Onboard WhatsApp Business app users](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users) flow through a Solution Partner or Tech Provider that supports it.

After the number is active on Cloud API, connect its WABA in Composio through the normal WhatsApp setup. For API-key auth, use the system user token as `bearer_token` and the WABA ID as `generic_id`.

If the number is shown as `ON_PREMISE`, it may need Meta's On-Premises API to Cloud API migration steps before normal registration or coexistence. Route that onboarding/migration step to Meta or the customer's BSP, then help with the Composio connection once Cloud API is active.

---

# Wrike (/kb/guide/toolkits-wrike)

Use this guide to map Wrike users correctly, call Wrike APIs through Composio, and use current nested-folder behavior.

## Map Wrike users and assignees [#map-wrike-users-and-assignees]

**Use the Wrike user ID, not the account ID.** For Wrike task update or assignment fields, pass the Wrike user `id` value rather than the `accountId`. Wrike validates the user identifier shown in the user object, not the account identifier.

**Read user relationships from Wrike's ID arrays.** Wrike task data can contain several user-id fields, including `authorIds`, `responsibleIds`, `sharedIds`, and `followerIds`. For fetch-task results, use the `resolve_user_names` parameter, which is enabled by default, to return those ids along with their names. If identifying the creator specifically, check `authorIds`.

**Do not expect a native `assignee` field.** Do not expect a separate `assignee` field from the Wrike tasks API or the corresponding fetch-tasks tool. Wrike represents user relationships through id arrays such as responsible/user fields instead of a top-level `assignee` field.

## Call Wrike APIs through Composio [#call-wrike-apis-through-composio]

**Use the proxy endpoint or SDK `executeRequest`.** For direct Wrike API calls through an existing Composio connected account, call the Composio proxy endpoint with the Wrike path and method, for example `endpoint: "/tasks"`, `method: "GET"`, and the `connected_account_id`. In SDK code, the same pattern can be done with `toolset.client.actions.executeRequest({ connectedAccountId, endpoint: "/tasks", method: "GET", parameters: [] })`. Ensure endpoint values are quoted strings.

**Pass `entityId` as a string when `getConnections` returns 404 in v3 SDK flows.** When using v3 SDK connection APIs, pass the `entityId` as a string. If the code stores the value as `enterpriseId`, pass it through the SDK entity helper, for example `.getEntity("enterpriseId")`. Also use a current v3 SDK package rather than an older release candidate.

## Use the latest Wrike toolkit version for nested folders [#use-the-latest-wrike-toolkit-version-for-nested-folders]

For Wrike folder APIs, avoid the base `00000000_00` toolkit version when dealing with nested folders. Retry with `latest` so the request uses the current nested-folder pagination behavior.

---

# Xero (/kb/guide/toolkits-xero)

## Xero redirect URI must match the current auth-config flow exactly [#xero-redirect-uri-must-match-the-current-auth-config-flow-exactly]

Make sure the redirect URI configured in the Xero OAuth app exactly matches the URI shown by the current Composio auth-config flow. Do not fall back to a legacy v1 callback from an older example; copy the current callback from the setup UI or auth-config documentation and match it exactly, without adding a trailing slash.

## Xero OAuth app should be a Web app and the client secret must match the auth config [#xero-oauth-app-should-be-a-web-app-and-the-client-secret-must-match-the-auth-config]

For Xero BYOA/custom OAuth, verify the Xero developer app is configured as a `Web app`, not `Mobile or Desktop`. The redirect URI must match exactly, and the client secret in Composio must match the current secret in the Xero developer portal. If a connection remains in `EXPIRED` with `Connection initiation did not complete within 10 minutes`, restart the auth flow and complete the Xero consent step within the 10-minute window.

## Remove deprecated Xero scopes that cause invalid-scope/CSP/login errors [#remove-deprecated-xero-scopes-that-cause-invalid-scopecsplogin-errors]

Remove the deprecated/invalid Xero scopes `accounting.journals.read`, `accounting.reports.read`, `accounting.transactions`, and `accounting.transactions.read` from the auth config. Reconnect after removing them. Use Xero's current OAuth scope documentation and keep required scopes such as `offline_access`, `email`, `profile`, `openid`, and the supported `accounting.*` scopes needed for the tools.

## Connect MCP discovers Xero tools through meta-tools instead of preloading every tool [#connect-mcp-discovers-xero-tools-through-meta-tools-instead-of-preloading-every-tool]

Connect MCP uses meta-tools such as `COMPOSIO_SEARCH_TOOLS` and `COMPOSIO_MULTI_EXECUTE_TOOL` to discover and execute toolkit-specific tools dynamically. For Xero, the expected flow is: ask/search for the task such as `get Xero contacts`, let the agent discover the relevant Xero tool, then execute it through the multi-execute tool. This avoids loading 1000+ tools into context up front.

## Connect MCP and Platform MCP Xero connections are independent [#connect-mcp-and-platform-mcp-xero-connections-are-independent]

Connect MCP servers and Platform MCP servers are independent. A connection visible in Platform is not automatically available through Connect MCP, so confirm which surface created the Xero connection before debugging account selection.

---

# YNAB authentication (/kb/guide/toolkits-ynab)

## YNAB supports managed and customer-owned OAuth [#ynab-supports-managed-and-customer-owned-oauth]

Use Composio-managed OAuth for the standard connection flow. Create a custom
auth config with the customer's YNAB client ID and client secret when they need
control over the provider app. For custom OAuth, register the exact redirect URI
shown by the current Composio auth-config flow.

If YNAB reports that an application is restricted, review the YNAB app's
current review and access-token restrictions. An app intended only for its
owner and an app distributed to unrelated users can have different provider
review requirements. Do not promise a provider approval date.

---

# YouTube (/kb/guide/toolkits-youtube)

Use this guide to upload YouTube videos, configure scopes and triggers, and distinguish upload failures from provider limits.

## Upload videos through current YouTube actions [#upload-videos-through-current-youtube-actions]

**Use a full file path with `YOUTUBE_UPLOAD_VIDEO`.** `YOUTUBE_UPLOAD_VIDEO` is intended to be used through the SDK because it accepts `videoFilePath`. Pass a full local file path string such as `/path/to/video.mp4`, and use the latest toolkit version when debugging older upload failures.

**Choose the current upload path for the file.** For YouTube video uploads, pass a local file path through SDK automatic file handling or use `YOUTUBE_MULTIPART_UPLOAD_VIDEO` when its single-request upload shape fits the file. Do not quote the old 50 MB staged-file limit without checking the current upload path and platform limit.

## Troubleshoot YouTube processing and provider limits [#troubleshoot-youtube-processing-and-provider-limits]

**Inspect current execution and provider state for `processing abandoned`.** If YouTube returns `processing abandoned`, first check YouTube Studio/provider status, the video format, and the current toolkit version. Use a fresh execution log to distinguish provider processing failure from an upload-transfer failure.

**Treat `uploadLimitExceeded` as a channel limit.** YouTube limits how many videos a channel can upload in a 24-hour period across the website, mobile apps, and the YouTube API. If an upload returns `uploadLimitExceeded` or YouTube shows **Daily upload limit reached**, wait 24 hours before retrying. Switching to a different OAuth app does not bypass the channel limit. See YouTube's [common uploading errors](https://support.google.com/youtube/answer/10383400).

## Configure YouTube scopes and triggers [#configure-youtube-scopes-and-triggers]

**Include the caption-download scope.** For YouTube caption download, verify the connected account includes `https://www.googleapis.com/auth/youtube.force-ssl`. The scope was described as part of the default YouTube scope set, but the actual connection should still be checked from connection details when a tool call fails.

**Validate the channel ID when creating a trigger.** YouTube supports triggers. For `YOUTUBE_NEW_ACTIVITY_TRIGGER`, use the field descriptions to provide the correct channel ID; trigger creation may otherwise fail without a separate preflight warning.

---

# Zendesk (/kb/guide/toolkits-zendesk)

Use this guide to connect a Zendesk account and discover the current tools and triggers for tickets and search.

## Connect Zendesk with the correct subdomain and auth scheme [#connect-zendesk-with-the-correct-subdomain-and-auth-scheme]

**Let OAuth inject the access token automatically.** For Zendesk OAuth, the access token is injected automatically after the OAuth flow completes; customers do not need to manually enter it. Redirect URI can be optional depending on the auth-config setup, but if Zendesk requires one, configure the Composio auth redirect URL in the Zendesk OAuth app.

**Pass the account subdomain, not the full URL.** Zendesk requires the account subdomain during connection initiation. Pass the Zendesk site prefix, not the full URL, as `subdomain`. Composio uses that field to construct Zendesk URLs.

**Include the subdomain in OAuth config values.** When initiating a Zendesk OAuth connected account, pass `subdomain` in the connection config values. For the current SDK shape, use `config={"auth_scheme":"OAUTH2","val":{"subdomain":"<site-name>"}}`; older examples used `connected_account_params={"subdomain":"<site-name>"}`.

**Pass the subdomain and encoded credential for API-key/basic auth.** For Zendesk API-key/basic auth connection initiation, pass the Zendesk `subdomain` and `basic_encoded` credential value in the connection data. The `basic_encoded` value should be the base64 encoding of the Zendesk email/token credential form requested by the auth config.

## Use current Zendesk tools and triggers [#use-current-zendesk-tools-and-triggers]

**Request the latest toolkit version when listing tools.** When listing Zendesk tools through the API, include the toolkit version query parameter. For example, use `toolkit_versions=latest&toolkit_slug=zendesk&limit=1000`. Without the toolkit version query, the API response may not show the expected tool set.

**Search Zendesk with the dedicated search action.** Use `ZENDESK_SEARCH_ZENDESK` for Zendesk search use cases.

**Update tickets with the current ticket action.** Use `ZENDESK_UPDATE_ZENDESK_TICKET` for Zendesk ticket updates. For endpoint-level context, the corresponding Zendesk API is the Update Ticket endpoint in Zendesk's ticketing API.

**Fetch known ticket details directly.** The Zendesk get-ticket-by-id action is available and returns the ticket details in a single tool call. Use it when the customer has a Zendesk ticket ID and needs the ticket's metadata/details rather than searching first.

**Verify the current trigger catalog before quoting availability.** Zendesk has trigger support in Composio. Verify the current trigger catalog before naming an exact count.

---

# Zoho Books (/kb/guide/toolkits-zoho-books)

## Use Zoho Invoice for create estimate [#use-zoho-invoice-for-create-estimate]

`ZOHO_BOOKS_CREATE_ESTIMATE` is no longer the Zoho Books tool to use for estimates. Use the Zoho Invoice toolkit and `ZOHO_INVOICE_CREATE_ESTIMATE` instead.

## Optional Zoho Books item rate filters do not have default values [#optional-zoho-books-item-rate-filters-do-not-have-default-values]

The Zoho Books item `rate` field and related rate filters are optional. Composio does not set default values for those fields; if omitted, they default to null behavior. If an agent includes `0` or another value, treat that as model/tool-call behavior and inspect the tool schema with the get-tools-by-slug API reference or adjust the agent/tool-call layer so optional rate filters are not sent unless explicitly requested.

## Pin Zoho Books toolkit version when reproducing list-items behavior [#pin-zoho-books-toolkit-version-when-reproducing-list-items-behavior]

When reproducing or sharing a controlled snippet for Zoho Books list-items behavior, use `toolkit_versions={"zoho_books": "latest"}`, then request `ZOHO_BOOKS_LIST_ITEMS` explicitly for the user's connected account context.

## Zoho domain suffix parameter expects the extension value [#zoho-domain-suffix-parameter-expects-the-extension-value]

For Zoho Books auth, the Zoho domain parameter expects the extension value such as `com`, `eu`, or `in`; Composio appends it into the URL as the corresponding domain suffix like `.com`. Do not include the leading dot in the parameter value.

---

# Zoho Mail (/kb/guide/toolkits-zoho-mail)

## ZOHO\_MAIL\_MESSAGES\_SEND\_EMAIL supports sending attachments [#zoho_mail_messages_send_email-supports-sending-attachments]

`ZOHO_MAIL_MESSAGES_SEND_EMAIL` supports sending attachments. If attachment support was previously missing, retry with the latest toolkit version. If attachment sending still fails, contact Composio support with the redacted tool-call details.

## Pass the correct Zoho region when connecting Zoho Mail [#pass-the-correct-zoho-region-when-connecting-zoho-mail]

For Zoho Mail connection issues, verify the region passed during connection initiation. Zoho accounts can be region-specific, so an EU or other regional account may fail if the default/wrong region is used. Retry the connection with the correct Zoho region.

## Zoho Mail account\_id must be handled as a string to avoid JavaScript precision loss [#zoho-mail-account_id-must-be-handled-as-a-string-to-avoid-javascript-precision-loss]

Treat Zoho Mail `account_id` values as strings, not integers. Zoho account IDs can exceed JavaScript's safe integer limit, and numeric coercion can silently truncate them before the tool call reaches Zoho. If you see unexpected account IDs or tool failures with long IDs, verify the schema and payload preserve `account_id` as a string.

## Connect MCP is agent-oriented; authenticate Zoho Mail in Connect dashboard before tool use [#connect-mcp-is-agent-oriented-authenticate-zoho-mail-in-connect-dashboard-before-tool-use]

Connect MCP is intended for agent/client workflows through Tool Router, not as a raw direct API endpoint. For Zoho Mail, make sure the user has connected a Zoho Mail account in the Connect dashboard first, then use the supported MCP client flow. If the user wants direct API execution, route them to Tool Router/API or Proxy Execute patterns instead of treating Connect MCP as a raw REST proxy.

---

# Zoho (/kb/guide/toolkits-zoho)

Use this guide to connect Zoho in the correct region, choose current Zoho tools and fields, and handle pagination or large identifiers safely.

## Connect Zoho in the correct region [#connect-zoho-in-the-correct-region]

**Pass the account's region as the domain extension.** Zoho requires the correct region/domain extension during connection initiation. Accepted values include `com`, `eu`, `in`, `cn`, and `au`. Pass the customer's Zoho account region, not a full URL, so Composio can build the correct `accounts.zoho.<region>` URL.

**Use `suffix.one` for the Zoho Mail domain extension.** For Zoho Mail, the expected connection initiation field can appear as `suffix.one`, displayed as Domain Extension. Pass values such as `com`, `eu`, or `in` in `config.val["suffix.one"]` when initiating the connection.

**Inspect the toolkit schema for required auth and connection fields.** Use `toolkits.get("<toolkit-slug>")` or the toolkit-by-slug API to inspect the full Zoho toolkit schema, including auth config creation fields and connected account initiation fields. This is the reliable way to discover region/domain fields and other required inputs.

**Initiate a new OAuth2 connection for MCP setups.** Zoho uses OAuth2. For MCP setups, create an MCP config for Zoho, then initiate/connect the Zoho account through the MCP client or dashboard. If the client does not automatically start the OAuth flow, prompting it to initiate a new Zoho connection can help.

## Choose current Zoho tools and fields [#choose-current-zoho-tools-and-fields]

**Use a current Zoho Mail tool version for attachments.** Attachment support was added to `ZOHO_MAIL_MESSAGES_SEND_EMAIL`. If you cannot send attachments with Zoho Mail, use a current toolkit version and verify the send-email tool schema includes attachment fields.

**Create estimates through Zoho Invoice.** For creating estimates, use the `zoho_invoice` toolkit action `ZOHO_INVOICE_CREATE_ESTIMATE`; the estimate action is not exposed through the Zoho Books toolkit.

**Omit optional Zoho Books fields unless they are needed.** `rate` on `ZOHO_BOOKS_LIST_ITEMS` is optional and has no default value in the schema. If an agent sends `rate: 25.5` or another value, that is coming from the model/tool-call generation, not from a Composio schema default. Prompt the model not to pass optional fields unless needed, or call the tool directly with only required arguments.

**Find the lead before converting it.** For Zoho lead conversion, verify the `lead_id` first. Use `ZOHO_GET_ZOHO_RECORDS` to retrieve the lead record and obtain the correct `lead_id`, then pass that value into the conversion tool.

## Handle Zoho pagination and identifiers [#handle-zoho-pagination-and-identifiers]

**Follow page tokens and provider rate limits.** Zoho list endpoints may return around 200 records per request and require pagination with `page_token` for larger result sets. Multiple tool calls may be needed, and Zoho's own API rate limits can still apply.

**Treat Zoho Mail account IDs as strings.** Zoho Mail account IDs can exceed JavaScript's safe integer range, so they should be modeled and passed as strings. If a Zoho Mail tool truncates or changes a large account ID, contact Composio support with the redacted payload and log ID so `account_id` can be verified as a string throughout serialization.

---

# Zoom (/kb/guide/toolkits-zoom)

## Zoom custom OAuth apps may only connect users in the app owner's Zoom organization unless configured/approved otherwise [#zoom-custom-oauth-apps-may-only-connect-users-in-the-app-owners-zoom-organization-unless-configuredapproved-otherwise]

If you are using your own Zoom OAuth app, verify whether the users you are connecting belong to the same Zoom organization or whether the app is published/approved for external users. An unpublished internal app may only connect users from its own Zoom organization.

## Zoom should use the default Composio redirect URL unless the auth guide says otherwise [#zoom-should-use-the-default-composio-redirect-url-unless-the-auth-guide-says-otherwise]

For Zoom OAuth setup, do not arbitrarily change the redirect URL. Use the default redirect URL/callback shown by Composio or the Zoom auth guide. If auth fails after redirect changes, recreate or update the auth config with the default redirect URL.

## `ZOOM_GET_A_MEETING_SUMMARY` needs the correct past-meeting UUID and auto summary enabled [#zoom_get_a_meeting_summary-needs-the-correct-past-meeting-uuid-and-auto-summary-enabled]

For Zoom meeting summaries, verify that the meeting was created with `settings__auto_start_meeting_summary=true`. Then fetch the correct past-meeting UUID from Zoom's `/v2/past_meetings/{meetingId}/instances` endpoint and use that UUID with `ZOOM_GET_A_MEETING_SUMMARY`; the numeric meeting ID alone may not be sufficient.

## Zoom delete/summary tools may require extra scopes in a custom OAuth app [#zoom-deletesummary-tools-may-require-extra-scopes-in-a-custom-oauth-app]

If a Zoom tool fails with a scope or permission issue, check whether the required scope is configured on the customer's Zoom OAuth app. `ZOOM_DELETE_A_MEETING` needs `meeting:write` or `meeting:write:admin`, while fetching past meeting instances or summary UUIDs needs `meeting:read:list_past_instances`.

## Zoom OAuth consent branding comes from the customer's OAuth app [#zoom-oauth-consent-branding-comes-from-the-customers-oauth-app]

For Zoom OAuth branding, use the customer's own Zoom OAuth app. The OAuth consent screen logo/name is picked up from the OAuth app settings rather than from Composio alone.

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

## Setup [#setup]

You need a [Composio API key](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=examples-general-agent-with-pi), a publicly reachable URL for your server, and [Bun](https://bun.sh).

**No public URL? Use a Cloudflare tunnel**

Composio posts webhooks to your server, so it needs a public URL. In local development, run a [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) to expose your local port:

```bash
cloudflared tunnel --url http://localhost:3000
```

Use the `https://…trycloudflare.com` URL it prints as your `APP_URL`.

```bash
bun add @composio/core @composio/experimental @earendil-works/pi-coding-agent
```

## Install the bot [#install-the-bot]

A Slack bot needs a Slack app to authenticate as and a stream of events. Composio gives you both, so you never register a webhook with Slack or hold a bot token. The `slackbot&#x60; toolkit ships with Composio-managed OAuth, and you install it as one &#x2A;*[shared connection](/docs/extending-sessions/shared-connections)** for the whole workspace.

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

## Build the bot [#build-the-bot]

`bot.ts` starts as a bare three-line agent and grows into the server, one Composio concept at a time. Each diff below is exactly what that concept adds.

### Start with a basic agent [#start-with-a-basic-agent]

The whole idea, before any Slack: create a session for a user, hand the Pi provider the session so it can search and execute, and run a prompt. This already acts across every app that user has connected.

### Put it in a Slack thread [#put-it-in-a-slack-thread]

Turn the one-shot agent into a handler. Each Slack thread gets its own [session](/docs/configuring-sessions), reused so the agent keeps context, and the reply goes back with the `SLACKBOT_SEND_MESSAGE` tool. The session is keyed to the Slack user, so when Alice asks for a GitHub issue it opens as *Alice*, against her GitHub connection.

### Share one workspace connection [#share-one-workspace-connection]

By default a connected account is **PRIVATE**: only its creator can use it. The install authorized the Slack connection as **SHARED**, so you pin it into every session. Now Alice's session has *her* GitHub connection but *the workspace's* Slack connection. It posts as the bot, and acts everywhere else as Alice.

### Reach the gaps with the proxy [#reach-the-gaps-with-the-proxy]

Most Slack actions are `SLACKBOT_*` tools. The few that aren't, like the typing indicator and opening a DM channel, drop down to `session.proxyExecute`, which calls the Slack Web API with the pinned connection's auth so you never touch a token.

### Redirect auth links [#redirect-auth-links]

The payoff. When the agent reaches for an app the user hasn't connected, the tool result carries a one-time Composio connect URL. You never want it in the channel or in the model's context. The bot extracts it, **redacts** it from the tool output, DMs it to the user privately, and the run resumes the moment they approve, because the session was created with `waitForConnections`.

### Serve the webhook [#serve-the-webhook]

Verify each trigger's signature with `composio.triggers.verifyWebhook`, then hand the payload to `handleSlackMessage` off the response path so a slow handler doesn't get retried. That's the whole server.

## The whole project [#the-whole-project]

The two files above are the spine. The real project rounds them out with grouped auth-link DMs, per-user routing, message chunking, reaction acks, and durable storage. Here's a slice of the actual source, with the Composio touch-points highlighted. Browse the tree, read the files:

> The Slack bot browser is a documentation snapshot; a public repository is not available.

## Run it [#run-it]

Run `bun install.ts` once to set up the bot, start the server with `bun bot.ts`, then `@mention` the bot in any channel. It opens a session as you, finds the tool it needs, runs it against your connections, and replies in thread as the workspace bot, usually within a few seconds. Ask it to do something in an app you haven't connected yet and it DMs you a link first, then continues once you approve.

- [Configuring sessions](/docs/configuring-sessions): Everything a session can scope: toolkits, tools, connections, and limits

- [Shared connections](/docs/extending-sessions/shared-connections): SHARED vs PRIVATE accounts and the per-user ACL

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

## Setup [#setup]

You need a [Composio API key](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=examples-imessage-agent) and macOS (the iMessage tools drive Messages.app, Contacts.app, and the local `chat.db`).

**Install**

```bash
npm install @composio/core @composio/experimental eve
```

**Configure**

```txt title=".env.local"
COMPOSIO_API_KEY=xxxxxxxxx
```
**Grant macOS permissions** (prompted on first use): Automation for Messages, Contacts access, and Full Disk Access to read `chat.db`.

## The custom toolkit [#the-custom-toolkit]

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

## Wire it up [#wire-it-up]

Set the [eve provider](/docs/providers/eve) on the client and register the toolkit on the session. `composio.ts` grows in three steps, one Composio concept each:

### Create the client with the eve provider [#create-the-client-with-the-eve-provider]

The provider is what makes `session.tools()` return eve-native tools instead of raw Composio tools. Its approval policy pauses every iMessage send before the local AppleScript runs.

### Scope a session to the user [#scope-a-session-to-the-user]

`sessions.create` gives this user their own toolset, already wired to the full Composio catalog.

### Register the local toolkit [#register-the-local-toolkit]

Pass the custom toolkit through `experimental.customToolkits`, and the local iMessage tools join the catalog on the same session.

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

## Extend it: triggers [#extend-it-triggers]

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

## More reflexes [#more-reflexes]

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

## Browse the project [#browse-the-project]

The key files, in one place. The custom toolkit and the session wiring carry the integration, the eve provider is imported from `@composio/experimental/eve`, and the rest is local macOS glue.

> The iMessage implementation is maintained in [platform-imessage](https://github.com/ComposioHQ/platform-imessage).

The complete, runnable project will be published in the Composio examples repo.

## Run it [#run-it]

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

## Setup [#setup]

You need a [Composio API key](https://dashboard.composio.dev?utm_source=docs\&utm_medium=content\&utm_campaign=examples-local-sandbox-pr-reviewer), an OpenAI API key for the reviewer agent, a GitHub connection for your `COMPOSIO_USER_ID`, and [Bun](https://bun.sh).

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

## Build the host [#build-the-host]

`src/runner.ts` is the host: it owns orchestration, never tool execution. It starts as a bare Composio client and grows into the full run loop, one concept at a time. Each diff below is exactly what that concept adds.

### Create the Composio client [#create-the-composio-client]

The whole thing acts as one stable user, against the connections they own. Start there.

### Check the GitHub connection [#check-the-github-connection]

A local sandbox still leans on Composio for auth and [tool discovery](/docs/how-composio-works#meta-tools); only code execution moves to your side. So before booting any infrastructure, confirm this user actually has [GitHub connected](/docs/authentication), and hand them a connect link if not.

### Create the local sandbox session [#create-the-local-sandbox-session]

The core of the integration. You create a [Composio session](/docs/configuring-sessions#creating-a-session) yourself with code execution off (`workbench.enable: false`, so Composio will not run code for you), then hand that session to `experimental_createLocalWorkbenchSession`. The helper validates the session is local (it errors if the session has the remote workbench enabled, because the managed workbench and a local sandbox can't both run for one session) and returns the pieces you run yourself: a `helperSource` (a Python helper with `run_composio_tool`, `invoke_llm`, and `web_search`) and the `env` that helper needs to reach Composio from inside your box.

### Start your sandbox, inject the helper [#start-your-sandbox-inject-the-helper]

Boot a box you control, write `helperSource` into it as `composio_helper.py`, and pass `env` to the process. That helper is the *only* Composio-specific thing your sandbox has to carry. E2B is the sample runner; swap it for anything that honors the same contract.

### Run the reviewer and stream output [#run-the-reviewer-and-stream-output]

Run the agent inside the sandbox and stream its output back. Whenever the agent calls `run_composio_tool`, the helper routes that GitHub action back through Composio under this user's connection. Tool *execution* happens in your box; discovery and auth stay managed.

## The whole project [#the-whole-project]

The file above is the spine. The real project rounds it out with a CLI, a smoke/dry-run path, the E2B runner behind the sandbox contract, the reviewer agent and its review policy, and the `composio_helper.py` the helper source compiles to. Here's a slice of the actual source, with the Composio touch-points highlighted. Browse the tree, read the files:

> The local PR reviewer browser is a documentation snapshot; a public repository is not available.

## Run it [#run-it]

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
  * **Manual, pre-connected auth**: members connect their tools ahead of time using [manual connections](/docs/authentication/manually-authenticating), and the agent just uses whatever is there.
  * **White-labelling** (advanced): your own Slack app and bot identity, via [white-labelling](/docs/authentication/white-labeling-authentication). This is *not* the easy path. We'd recommend Composio's managed apps, which require no additional configuration. Only do this if you specifically want your own branding.
  * **The proxy** (advanced): using [`proxyExecute`](/docs/extending-sessions/proxy-execute) to call Slack API endpoints Composio doesn't wrap as tools.

It is **not** an example of [in-chat or dynamic auth](/docs/authentication) (asking a user to connect a tool mid-run), and it's more setup than many bots need. If you'd rather have a Slack bot with zero setup (Composio's managed app) or in-chat auth, start with the [general Slack bot](/examples/general-agent-with-pi) instead.

The Slack bot itself follows a deterministic flow: the same menu every day. When a member taps a button, it launches a subagent with a Composio session to produce the draft. Here's the shape of it:

```mermaid
`flowchart TD
cron([Vercel cron]) --> thread[Find or create today's thread]
thread --> dm
dm@{ img: "/images/standup-slackbot/slack-reminder.png", label: "DM each due member: Draft or Connect", pos: "b", w: 300, h: 69, constraint: "on" }
dm -->|Draft| agent[Create a Composio session for the user and launch a sub-agent to generate summary]
agent --> review
review@{ img: "/images/standup-slackbot/slack-draft.png", label: "Member reviews: Confirm or Edit", pos: "b", w: 300, h: 143, constraint: "on" }
review -->|Confirm| post[Post into the thread as the member]
dm -->|Connect| oauth
oauth@{ img: "/images/standup-slackbot/slack-connect.png", label: "Creates buttons for the user to link their accounts to Composio via OAuth", pos: "b", w: 340, h: 58, constraint: "on" }
click agent "/docs/how-composio-works#meta-tools" "Composio metatools"
`
```

## Setup [#setup]

You need a [Composio API key](https://dashboard.composio.dev/~/project/settings/api-keys?utm_source=docs\&utm_medium=content\&utm_campaign=examples-standup-slackbot), a Slack workspace you can install an app into, and Node with [tsx](https://nodejs.org). The finished bot deploys to [Vercel](https://vercel.com) as two serverless functions, a cron and an interactivity handler, so there's no long-running server.

## Make your custom Slack bot [#make-your-custom-slack-bot]

This bot doesn't post as "Composio". It posts as *my* app, with its own name, icon, and (frankly ridiculous) face:

![The Daily Standup Bot avatar](/images/standup-slackbot/bot-avatar.png)
*Create the app from scratch and name it*

**Add the Bot Token Scopes.** Under **OAuth & Permissions**, add: `chat:write`, `im:write`, `channels:history`, `channels:read`, `users:read`, `users:read.email`, `team:read`. Then turn on **Interactivity** and point its Request URL at your deployment's `/api/interactivity`.

![Adding bot token scopes under OAuth & Permissions](/images/standup-slackbot/bot-scopes.png)
*Add the bot token scopes*

**Grab the app credentials.** On **Basic Information**, copy the **Client ID** and **Client Secret**. Composio drives the OAuth as your app with these.

![The app's Client ID and Secret under Basic Information](/images/standup-slackbot/app-credentials.png)
*Copy the Client ID and Secret*

## Auth the bot [#auth-the-bot]

The Slack app exists; now connect it through Composio so your code can act as it. You create one `slackbot` auth config from your credentials, then a setup script does the OAuth once with Composio's [manual authentication](/docs/authentication/manually-authenticating) flow.

> **`slackbot` vs `slack`**: Composio has two Slack toolkits, and this bot uses both:

  * **`slackbot`** authenticates a Slack *app* and acts as the **bot** (a bot token). It posts the reminders and drafts as "Daily Standup Bot," and it's the one you white-label here.
  * **`slack`** authenticates an individual **user** and acts as *them* (a user token). Each teammate connects this so the bot can post their standup under their own name and read their activity for context.

Rule of thumb: posting *as the bot* uses `slackbot`; doing something *as a person* uses `slack`.

**Create an auth config and pick the `Slackbot` toolkit.** In the [Composio dashboard](https://dashboard.composio.dev/~/project/auth-configs?utm_source=docs\&utm_medium=content\&utm_campaign=examples-standup-slackbot), click **Create Auth Config** and search `slackbot`. Choose **Slackbot**, *not* `Slack`: `Slackbot` posts as the bot identity, while `Slack` acts as an individual user.

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

## Talk to Slack [#talk-to-slack]

To send and update messages in our deterministic bot workflow, we use Composio's `SLACKBOT_SEND_MESSAGE` and `SLACKBOT_UPDATES_A_MESSAGE` tools via [manual tool execution](/docs/tools-direct/executing-tools). `SLACKBOT_SEND_MESSAGE` takes Block Kit `blocks`, so a message with interactive buttons can go through a tool too.

When a Slack action has no tool, like opening a modal (`views.open`), it drops to [`proxyExecute`](/docs/extending-sessions/proxy-execute): the escape hatch for anything the named tools don't cover, hitting any Slack Web API endpoint as a connected account with no token in your code.

## Make the buttons work [#make-the-buttons-work]

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

type SlackInteractionPayload = {
  actions?: Array<{
    action_id?: string;
    value?: string;
  }>;
};

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
async function handleClick(payload: SlackInteractionPayload) {
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

## Draft the standup [#draft-the-standup]

Now this is the cool and magical part, and the easy part: all the background agent needs is a tool-router session and a prompt. When a member taps **Draft**, you spin up a session scoped to the toolkit catalogue and let the agent research and write.

### A session writes the draft [#a-session-writes-the-draft]

A [tool-router session](/docs/configuring-sessions) gives the agent its tools. Pass the member's email and your full list of toolkits, hand the tools to the model, and let it investigate and write. You don't have to check which ones the member set up: the session only exposes tools for the accounts they've actually connected, and ignores the rest.

### Use what's connected, nothing more [#use-whats-connected-nothing-more]

The router can also *manage* connections, asking the user to authorize any toolkits they haven't connected yet. During a draft you don't want that: if the agent reaches for a tool the member hasn't connected, it should skip it, not prompt them to log in. `manageConnections: false` removes those meta-tools, so the agent drafts from exactly what's already connected.

The bot posts the result back as a draft the member can confirm or edit:

![A generated standup draft in Slack with Confirm and Edit buttons](/images/standup-slackbot/slack-draft.png)
*The draft the agent writes, delivered to a teammate in Slack*

## The whole project [#the-whole-project]

> The standup bot browser is a documentation snapshot; a public repository is not available.

## Run it [#run-it]

Edit `standup.config.ts` with your team (each member's Slack email and timezone, plus your channel and GitHub org), set your four environment variables, run `npx tsx scripts/setup.ts` once to connect your bot, then `vercel deploy`.

- [Configuring sessions](/docs/configuring-sessions): What a session can scope: toolkits, tools, connections, and connection management

- [White-labeling authentication](/docs/authentication/white-labeling-authentication): Ship a bot under your own app's name, icon, and credentials

- [Custom vs managed auth](/docs/authentication/custom-app-vs-managed-app): Bring-your-own Slack app versus a Composio-managed connection

- [Triggers](/docs/triggers): Run agents in response to events: schedules, webhooks, and app activity

---


# API Reference


---
