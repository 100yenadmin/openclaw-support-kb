---
type: composio_doc
title: "Auth Configs"
source: "https://docs.composio.dev/reference/api-reference/auth-configs.md"
source_hash: "c398e26dff827553eb703f4b71cc48e0f83d55f241267daba01351803c260050"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/auth-configs.md"
original_doc_path: "reference/api-reference/auth-configs.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Auth Configs (/reference/api-reference/auth-configs)
Source: https://docs.composio.dev/reference/api-reference/auth-configs.md


{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/auth-configs.mdx, not this file. */}

An auth config is a blueprint that defines how a toolkit authenticates across all your users. It specifies the authentication method, the scopes your tools can request, and which credentials Composio uses to run the OAuth or token flow.

A single auth config applies to every user who connects that toolkit. When a user authenticates against it, Composio creates a [connected account](/reference/api-reference/connected-accounts) that stores their tokens and links them to your user ID.

Each auth config defines:

* **Auth scheme**: OAuth2, API key, Bearer token, or Basic Auth
* **Scopes**: what your tools are allowed to do on the user's behalf
* **Credentials**: Composio's managed app, or your own OAuth client and secrets

Reach for a custom auth config when you need your own branding on consent screens, custom scopes, a dedicated rate-limit quota, or a custom toolkit instance. See [managed vs custom auth](/docs/custom-app-vs-managed-app) for the decision and [how Composio handles authentication](/docs/authentication) for the full picture.

# Auth schemes [#auth-schemes]

The `auth_scheme` on an auth config determines how users authenticate to the toolkit. Composio supports four. The schemes available for a given toolkit come from the toolkit itself.

| Scheme         | What it is                                                                                                                                                                            | When it's used                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OAUTH2`       | OAuth 2.0 authorization-code flow. The user authorizes through a hosted consent screen, and Composio stores and automatically refreshes the access and refresh tokens.                | Most apps with user accounts (Gmail, GitHub, Slack, Notion, and so on). Uses Composio's managed OAuth app by default; bring your own for custom branding or scopes. |
| `API_KEY`      | A static API key the user provides. There's no OAuth flow: the key is stored on the connected account and sent on each request.                                                       | Services that authenticate with a key, such as SendGrid, Tavily, or PostHog.                                                                                        |
| `BEARER_TOKEN` | A bearer access token you already hold (for example, from your own OAuth flow). Composio sends it as `Authorization: Bearer <token>` and does not refresh it, so you keep it current. | Bringing an existing OAuth or server-to-server token into Composio, or apps that issue long-lived tokens.                                                           |
| `BASIC`        | HTTP Basic authentication with a username and password.                                                                                                                               | Services that use Basic Auth.                                                                                                                                       |

Most OAuth toolkits work out of the box with Composio managed auth. For the others you supply the credential fields. To choose or customize the scheme, see [managed vs custom auth](/docs/custom-app-vs-managed-app).

These endpoints use your project API key in the `x-api-key` header. Each auth config is addressed by its `nanoid`, and you can enable or disable one without deleting it.

# Endpoints [#endpoints]

---
